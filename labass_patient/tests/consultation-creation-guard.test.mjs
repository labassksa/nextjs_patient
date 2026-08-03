import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  findMatchingRecentConsultation,
  getRecentConsultationDateRange,
  isAmbiguousConsultationError,
} from "../src/utils/consultationReconciliation.js";

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function createGuardedHandler({ guard, setDisabled, create, refresh, criteria, onMatch, onError }) {
  return async () => {
    if (guard.current) return;
    guard.current = true;
    setDisabled(true);
    try {
      return await create();
    } catch (error) {
      if (isAmbiguousConsultationError(error)) {
        const recent = await refresh();
        const match = findMatchingRecentConsultation(recent, criteria);
        if (match) return onMatch(match);
      }
      return onError(error);
    } finally {
      guard.current = false;
      setDisabled(false);
    }
  };
}

const now = Date.parse("2026-08-03T14:00:00.000Z");
const criteria = {
  startedAt: now - 1_000,
  patientScopedList: true,
  consultationType: "quick",
  subscriptionId: 7,
  bundleType: "gpConsultations",
};

test("rapid double click sends one POST and stays disabled while pending", async () => {
  const gate = deferred();
  const guard = { current: false };
  let posts = 0;
  let disabled = false;
  const handler = createGuardedHandler({
    guard,
    setDisabled: (value) => { disabled = value; },
    create: () => { posts += 1; return gate.promise; },
    refresh: async () => [],
    criteria,
    onMatch: () => {},
    onError: () => {},
  });

  const first = handler();
  const second = handler();
  assert.equal(posts, 1);
  assert.equal(disabled, true);
  assert.equal(guard.current, true);
  gate.resolve({ id: 1 });
  await Promise.all([first, second]);
  assert.equal(disabled, false);
});

test("two creation handlers sharing one screen ref cannot run concurrently", async () => {
  const gate = deferred();
  const guard = { current: false };
  let posts = 0;
  const options = {
    guard,
    setDisabled: () => {},
    create: () => { posts += 1; return gate.promise; },
    refresh: async () => [],
    criteria,
    onMatch: () => {},
    onError: () => {},
  };
  const sendHandler = createGuardedHandler(options);
  const openHandler = createGuardedHandler(options);
  const send = sendHandler();
  const open = openHandler();
  assert.equal(posts, 1);
  gate.resolve({ id: 1 });
  await Promise.all([send, open]);
});

test("a 504 refreshes consultations once and never resends the POST", async () => {
  const guard = { current: false };
  let posts = 0;
  let reads = 0;
  const handler = createGuardedHandler({
    guard,
    setDisabled: () => {},
    create: async () => {
      posts += 1;
      throw { response: { status: 504 } };
    },
    refresh: async () => { reads += 1; return []; },
    criteria,
    onMatch: () => "matched",
    onError: () => "network-error",
  });
  assert.equal(await handler(), "network-error");
  assert.equal(posts, 1);
  assert.equal(reads, 1);
});

test("a matching recent consultation is treated as success", async () => {
  const match = {
    id: 99,
    createdAt: new Date(now).toISOString(),
    type: "Quick",
    subscriptionId: 7,
    bundleType: "gpConsultations",
  };
  const found = findMatchingRecentConsultation([match], criteria, now);
  assert.equal(found?.id, 99);
});

test("the newest matching consultation is selected from an unordered response", () => {
  const orderingCriteria = { ...criteria, startedAt: now - 90_000 };
  const consultations = [
    {
      id: 10,
      createdAt: new Date(now - 60_000).toISOString(),
      type: "quick",
      subscriptionId: 7,
      bundleType: "gpConsultations",
    },
    {
      id: 12,
      createdAt: new Date(now - 10_000).toISOString(),
      type: "quick",
      subscriptionId: 7,
      bundleType: "gpConsultations",
    },
    {
      id: 11,
      createdAt: new Date(now - 30_000).toISOString(),
      type: "quick",
      subscriptionId: 7,
      bundleType: "gpConsultations",
    },
  ];

  assert.equal(
    findMatchingRecentConsultation(consultations, orderingCriteria, now)?.id,
    12
  );
});

test("missing consultation type never produces a match", () => {
  const consultation = {
    id: 99,
    createdAt: new Date(now).toISOString(),
    subscriptionId: 7,
    bundleType: "gpConsultations",
  };
  assert.equal(findMatchingRecentConsultation([consultation], criteria, now), undefined);
});

test("a requested matching scope is not treated as equal when the response omits it", () => {
  const consultation = {
    id: 99,
    createdAt: new Date(now).toISOString(),
    type: "quick",
  };
  assert.equal(findMatchingRecentConsultation([consultation], criteria, now), undefined);
});

test("missing or invalid createdAt never produces a match", () => {
  const base = {
    type: "quick",
    subscriptionId: 7,
    bundleType: "gpConsultations",
  };
  assert.equal(
    findMatchingRecentConsultation([{ ...base, id: 1 }], criteria, now),
    undefined
  );
  assert.equal(
    findMatchingRecentConsultation(
      [{ ...base, id: 2, createdAt: "not-a-date" }],
      criteria,
      now
    ),
    undefined
  );
});

test("timezone offsets are compared as absolute instants inside the five-minute window", () => {
  const timezoneNow = Date.parse("2026-08-03T14:00:00.000Z");
  const timezoneCriteria = { ...criteria, startedAt: timezoneNow - 120_000 };
  const consultation = {
    id: 77,
    createdAt: "2026-08-03T16:59:00.000+03:00",
    type: "quick",
    subscriptionId: 7,
    bundleType: "gpConsultations",
  };
  assert.equal(
    findMatchingRecentConsultation([consultation], timezoneCriteria, timezoneNow)?.id,
    77
  );
});

test("the reconciliation date range always contains the attempted creation time", () => {
  const startedAt = Date.parse("2026-08-03T23:59:30.000+03:00");
  const checkedAt = startedAt + 90_000;
  const { fromDate, toDate } = getRecentConsultationDateRange(startedAt, checkedAt);
  assert.ok(fromDate.getTime() <= startedAt);
  assert.ok(toDate.getTime() >= startedAt);
  assert.equal(toDate.getTime(), checkedAt);
});

test("no match unlocks the guard so a deliberate manual retry is possible", async () => {
  const guard = { current: false };
  let posts = 0;
  const handler = createGuardedHandler({
    guard,
    setDisabled: () => {},
    create: async () => {
      posts += 1;
      if (posts === 1) throw { request: {}, response: undefined };
      return { id: 2 };
    },
    refresh: async () => [],
    criteria,
    onMatch: () => "matched",
    onError: () => "network-error",
  });
  assert.equal(await handler(), "network-error");
  assert.equal(guard.current, false);
  assert.deepEqual(await handler(), { id: 2 });
  assert.equal(posts, 2);
});

test("a definite 422 validation error does not reconcile", async () => {
  let reads = 0;
  const handler = createGuardedHandler({
    guard: { current: false },
    setDisabled: () => {},
    create: async () => { throw { response: { status: 422 } }; },
    refresh: async () => { reads += 1; return []; },
    criteria,
    onMatch: () => "matched",
    onError: () => "validation-error",
  });
  assert.equal(await handler(), "validation-error");
  assert.equal(reads, 0);
});

test("production creation screens contain synchronous refs and disabled controls", async () => {
  const [org, school, patientCards, patientList, patientController, marketerController] = await Promise.all([
    readFile(new URL("../src/app/orgPortal/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/schoolPortal/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/mySubscriptions/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/subscription/my-subscriptions/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/myConsultations/_controllers/myConsultations.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/orgPortal/_controllers/getMarketerConsultaion.ts", import.meta.url), "utf8"),
  ]);
  assert.match(org, /consultationSubmittingRef = useRef\(false\)/);
  assert.equal((org.match(/if \(consultationSubmittingRef\.current\) return;/g) ?? []).length, 2);
  assert.match(org, /consultationSuccessLink, setConsultationSuccessLink/);
  assert.match(org, /setConsultationSuccessLink\(resultData\.magicLink\)/);
  assert.match(org, /setConsultationSuccessLink\(result\.link\)/);
  assert.match(org, /navigator\.clipboard\.writeText\(consultationSuccessLink\)/);
  assert.match(org, /onClick=\{handleConsultationSuccessClose\}/);
  assert.match(school, /submittingRef = useRef\(false\)/);
  assert.match(patientCards, /disabled=\{starting\}/);
  assert.match(patientList, /disabled=\{startingId !== null\}/);
  assert.match(patientCards, /fetchConsultations\(true\)/);
  assert.match(patientList, /fetchConsultations\(true\)/);
  assert.match(patientController, /_refresh: Date\.now\(\)/);
  assert.match(org, /getMarketerConsultaion\(fromDate, toDate, 1, 50, true\)/);
  assert.match(school, /getMarketerConsultaion\([\s\S]*?1,[\s\S]*?50,[\s\S]*?true[\s\S]*?\)/);
  assert.match(marketerController, /page,\s*limit,\s*_refresh:/);
});
