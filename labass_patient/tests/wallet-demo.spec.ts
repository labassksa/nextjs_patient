import { expect, Locator, Page, Route, test } from "@playwright/test";
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import path from "node:path";

const PLAIN_MODE = process.env.DEMO_VIDEO_STYLE === "plain";
const OUTPUT_DIR = path.resolve("demo-output");
const OUTPUT_NAME = PLAIN_MODE ? "wallet-plain" : "wallet-onboarding";
const FINAL_VIDEO = path.join(OUTPUT_DIR, `${OUTPUT_NAME}.webm`);
const FINAL_MP4 = path.join(OUTPUT_DIR, `${OUTPUT_NAME}.mp4`);
const RAW_VIDEO_DIR = path.resolve("test-results/playwright/wallet-demo-video");
const RAW_VIDEO = path.join(RAW_VIDEO_DIR, `${OUTPUT_NAME}.mobile.webm`);
const MINIMUM_VIDEO_MS = PLAIN_MODE ? 13_000 : 26_000;
const runFile = promisify(execFile);
const DEMO_FONTS = {
  regular: readFileSync(
    path.resolve(
      "node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2"
    )
  ).toString("base64"),
  semibold: readFileSync(
    path.resolve(
      "node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2"
    )
  ).toString("base64"),
  bold: readFileSync(
    path.resolve(
      "node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-700-normal.woff2"
    )
  ).toString("base64"),
};

function requiredEnvironment(name: "DEMO_PHONE" | "DEMO_OTP"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `${name} is required. Copy .env.demo.example to .env.demo and provide the safe demo credential.`
    );
  }
  return value;
}

function splitPhoneNumber(phone: string) {
  const normalized = phone.replace(/[\s()-]/g, "");
  const match = normalized.match(/^(\+\d{1,3})(\d{7,14})$/);

  if (!match) {
    throw new Error(
      "DEMO_PHONE must include a country code, for example +9665XXXXXXXX."
    );
  }

  return { countryCode: match[1], localNumber: match[2] };
}

async function installDemoLayer(page: Page) {
  await page.addInitScript(({ fonts, plainMode }) => {
    localStorage.setItem("labass_token", "safe-demo-wallet-token");
    localStorage.setItem("labass_userId", "900001");

    const install = () => {
      if (!document.body) {
        requestAnimationFrame(install);
        return;
      }

      const style = document.createElement("style");
      style.id = "wallet-demo-style";
      style.textContent = `
        @font-face {
          font-family: "IBM Plex Sans Arabic Demo";
          src: url(data:font/woff2;base64,${fonts.regular}) format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "IBM Plex Sans Arabic Demo";
          src: url(data:font/woff2;base64,${fonts.semibold}) format("woff2");
          font-weight: 600;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: "IBM Plex Sans Arabic Demo";
          src: url(data:font/woff2;base64,${fonts.bold}) format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: block;
        }
        html { scroll-behavior: smooth !important; }
        body { cursor: none !important; }
        * { cursor: none !important; }
        ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
        input[type="tel"], input[autocomplete="one-time-code"],
        #wallet-marketing-phone, #wallet-marketing-code {
          -webkit-text-security: disc !important;
          color: transparent !important;
          text-shadow: 0 0 9px rgba(23, 52, 4, .85) !important;
        }
        #wallet-demo-cursor {
          position: fixed;
          left: 0;
          top: 0;
          width: ${plainMode ? "18px" : "22px"};
          height: ${plainMode ? "25px" : "22px"};
          z-index: 2147483647;
          pointer-events: none;
          transform: translate(-100px, -100px);
          transition: transform ${plainMode ? "45ms linear" : "90ms cubic-bezier(.2,.8,.2,1)"};
          filter: drop-shadow(0 4px 5px rgba(0,0,0,.42));
        }
        #wallet-demo-cursor::before {
          content: "";
          position: absolute;
          ${plainMode
            ? `inset: 0;
          background: #111;
          clip-path: polygon(0 0, 0 92%, 27% 67%, 44% 100%, 57% 93%, 40% 61%, 76% 61%);`
            : `inset: 2px;
          background: #b8ef35;
          border: 3px solid #173404;
          border-radius: 999px;
          box-shadow: 0 0 0 2px rgba(255,255,255,.95);`}
        }
        #wallet-demo-cursor::after {
          content: "";
          position: absolute;
          ${plainMode
            ? `inset: 2px 3px 4px 2px;
          background: #fff;
          clip-path: polygon(0 0, 0 88%, 28% 63%, 46% 96%, 53% 92%, 36% 58%, 72% 58%);`
            : `inset: 8px;
          background: #173404;
          border-radius: 999px;`}
        }
        .wallet-demo-click-ring {
          position: fixed;
          width: 24px;
          height: 24px;
          z-index: 2147483646;
          pointer-events: none;
          border: 4px solid #b8ef35;
          border-radius: 999px;
          transform: translate(-50%, -50%) scale(.35);
          animation: wallet-demo-ring 620ms ease-out forwards;
        }
        @keyframes wallet-demo-ring {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(.35); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(3.2); }
        }
      `;
      document.head.appendChild(style);

      const cursor = document.createElement("div");
      cursor.id = "wallet-demo-cursor";
      cursor.setAttribute("aria-hidden", "true");
      document.body.appendChild(cursor);

      document.addEventListener(
        "pointermove",
        (event) => {
          cursor.style.transform = `translate(${event.clientX - 11}px, ${event.clientY - 11}px)`;
        },
        { passive: true }
      );

      if (!plainMode) {
        document.addEventListener(
          "pointerdown",
          (event) => {
            const ring = document.createElement("div");
            ring.className = "wallet-demo-click-ring";
            ring.style.left = `${event.clientX}px`;
            ring.style.top = `${event.clientY}px`;
            document.body.appendChild(ring);
            window.setTimeout(() => ring.remove(), 700);
          },
          { passive: true, capture: true }
        );
      }

      const redact = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT
        );
        const nodes: Text[] = [];
        let current: Node | null;

        while ((current = walker.nextNode())) {
          const parent = current.parentElement;
          if (
            parent &&
            !["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)
          ) {
            nodes.push(current as Text);
          }
        }

        for (const node of nodes) {
          const original = node.data;
          const safe = original
            .replace(
              /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
              "••••@••••"
            )
            .replace(/(?:\+\d{1,3}[\s-]?)?\d(?:[\s-]?\d){8,13}/g, "••••••••")
            .replace(/\b(?:\d[ -]*?){13,19}\b/g, "•••• •••• ••••");
          if (safe !== original) node.data = safe;
        }
      };

      redact();
      new MutationObserver(redact).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    install();
  }, { fonts: DEMO_FONTS, plainMode: PLAIN_MODE });
}

async function moveCursorTo(
  page: Page,
  locator: Locator,
  verticalOffset = 0
) {
  await locator.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const cursor = document.getElementById("wallet-demo-cursor");
    if (!cursor) return;
    cursor.getAnimations().forEach((animation) => animation.cancel());
    cursor.style.opacity = "1";
  });
  const box = await locator.boundingBox();
  if (!box) throw new Error("The demo target is not visible.");

  await page.mouse.move(
    box.x + box.width / 2,
    box.y + box.height / 2 + verticalOffset,
    {
    steps: 18,
    }
  );
}

async function deliberateClick(
  page: Page,
  locator: Locator,
  verticalOffset = 0
) {
  await expect(locator).toBeVisible();
  await moveCursorTo(page, locator, verticalOffset);
  await page.waitForTimeout(180);
  await page.mouse.down();
  await page.waitForTimeout(70);
  await page.mouse.up();
}

async function cinematicFocus(
  locator: Locator,
  duration = 1_850,
  cursorVerticalOffset = 0
) {
  await expect(locator).toBeVisible();
  await locator.evaluate((element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  await locator.page().waitForTimeout(250);
  await moveCursorTo(locator.page(), locator, cursorVerticalOffset);
  await locator.page().waitForTimeout(60);

  await locator.evaluate(
    async (element, animationDuration) => {
      const target = element as HTMLElement;
      const rect = target.getBoundingClientRect();
      const isBottomTarget = rect.bottom > window.innerHeight - 100;
      const zoom = isBottomTarget ? 1.08 : rect.width < 200 ? 1.18 : 1.055;
      const clone = target.cloneNode(true) as HTMLElement;
      const previousVisibility = target.style.visibility;
      const backdrop = document.createElement("div");
      backdrop.setAttribute("aria-hidden", "true");
      Object.assign(backdrop.style, {
        position: "fixed",
        inset: "0",
        zIndex: "2147483600",
        pointerEvents: "none",
        background:
          "radial-gradient(circle at 50% 45%, rgba(12,34,8,.26), rgba(4,14,2,.68))",
        backdropFilter: "blur(2px) saturate(.82)",
        opacity: "0",
      });
      document.body.appendChild(backdrop);

      const computed = getComputedStyle(target);
      clone.setAttribute("aria-hidden", "true");
      Object.assign(clone.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${isBottomTarget ? rect.top - 18 : rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        zIndex: "2147483602",
        pointerEvents: "none",
        boxSizing: "border-box",
        direction: computed.direction,
        transformOrigin: isBottomTarget ? "center bottom" : "center",
        overflow: "visible",
        background: isBottomTarget ? "#ffffff" : computed.background,
        borderRadius: isBottomTarget ? "12px" : computed.borderRadius,
        fontFamily:
          '"IBM Plex Sans Arabic Demo", ' + computed.fontFamily,
        willChange: "transform, box-shadow, filter",
      });
      document.body.appendChild(clone);
      if (isBottomTarget) target.style.visibility = "hidden";

      const backdropAnimation = backdrop.animate(
        [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 0.1 },
          { opacity: 1, offset: 0.9 },
          { opacity: 0, offset: 1 },
        ],
        {
          duration: animationDuration,
          easing: "cubic-bezier(.22,.8,.24,1)",
          fill: "forwards",
        }
      );
      const focusAnimation = clone.animate(
        [
          {
            boxShadow: "0 0 0 0 rgba(184, 239, 53, 0)",
            filter: "brightness(1)",
            transform: "translateY(8px) scale(.975)",
            offset: 0,
          },
          {
            boxShadow:
              "0 0 0 2px rgba(198, 243, 90, .98), 0 0 0 8px rgba(184, 239, 53, .14), 0 24px 70px rgba(0, 0, 0, .42)",
            filter: "brightness(1.08) saturate(1.05)",
            transform: `translateY(-4px) scale(${zoom})`,
            offset: 0.16,
          },
          {
            boxShadow:
              "0 0 0 2px rgba(198, 243, 90, .98), 0 0 0 8px rgba(184, 239, 53, .14), 0 24px 70px rgba(0, 0, 0, .42)",
            filter: "brightness(1.08) saturate(1.05)",
            transform: `translateY(-4px) scale(${zoom})`,
            offset: 0.9,
          },
          {
            boxShadow: "0 0 0 0 rgba(184, 239, 53, 0)",
            filter: "brightness(1)",
            transform: "scale(1)",
            offset: 1,
          },
        ],
        {
          duration: animationDuration,
          easing: "cubic-bezier(.22,.8,.24,1)",
          fill: "forwards",
        }
      );

      const demoCursor = document.getElementById("wallet-demo-cursor");
      if (demoCursor) {
        demoCursor.animate(
          [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.35 },
            { opacity: 0, offset: 1 },
          ],
          {
            duration: Math.min(animationDuration, 1_000),
            easing: "ease-out",
            fill: "forwards",
          }
        );
      }

      await Promise.all([
        backdropAnimation.finished,
        focusAnimation.finished,
      ]);
      target.style.visibility = previousVisibility;
      backdrop.remove();
      clone.remove();
    },
    duration
  );
  await locator.page().waitForTimeout(80);
}

async function showCaption(page: Page, text: string) {
  await page.evaluate((captionText) => {
    let caption = document.querySelector<HTMLElement>("#wallet-demo-caption");
    if (!caption) {
      caption = document.createElement("div");
      caption.id = "wallet-demo-caption";
      caption.dir = "rtl";
      caption.setAttribute("aria-live", "polite");
      Object.assign(caption.style, {
        position: "fixed",
        left: "18px",
        right: "18px",
        bottom: "70px",
        zIndex: "2147483645",
        border: "1px solid rgba(184, 239, 53, .82)",
        borderRadius: "20px",
        padding: "14px 18px 15px",
        background:
          "linear-gradient(135deg, rgba(8, 25, 6, .98), rgba(23, 52, 4, .96))",
        boxShadow:
          "0 16px 42px rgba(0, 0, 0, .30), inset 0 1px 0 rgba(255,255,255,.08)",
        color: "#fff",
        fontFamily: '"IBM Plex Sans Arabic Demo", Cairo, sans-serif',
        fontSize: "18px",
        fontWeight: "600",
        lineHeight: "1.35",
        direction: "rtl",
        textAlign: "center",
        textWrap: "balance",
        pointerEvents: "none",
        opacity: "0",
        transform: "translateY(16px) scale(.97)",
      });
      document.body.appendChild(caption);
    } else if (caption.textContent) {
      const previous = caption.cloneNode(true) as HTMLElement;
      previous.removeAttribute("id");
      previous.setAttribute("aria-hidden", "true");
      previous.style.zIndex = "2147483644";
      document.body.appendChild(previous);
      const exit = previous.animate(
        [
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(-8px) scale(.985)" },
        ],
        {
          duration: 260,
          easing: "cubic-bezier(.4,0,1,1)",
          fill: "forwards",
        }
      );
      void exit.finished.then(() => previous.remove());
    }

    caption.replaceChildren();
    const accentPattern =
      /(«[^»]+»|[٠-٩][٠-٩٬٫]*(?:\s*ر\.س)?|[٠-٩]+٪)/g;
    let cursor = 0;
    for (const match of captionText.matchAll(accentPattern)) {
      const start = match.index ?? 0;
      if (start > cursor) {
        caption.append(document.createTextNode(captionText.slice(cursor, start)));
      }
      const accent = document.createElement("strong");
      accent.textContent = match[0];
      Object.assign(accent.style, {
        color: "#c6f35a",
        fontWeight: "700",
        whiteSpace: "nowrap",
      });
      caption.append(accent);
      cursor = start + match[0].length;
    }
    if (cursor < captionText.length) {
      caption.append(document.createTextNode(captionText.slice(cursor)));
    }
    caption.style.visibility = "visible";

    caption.animate(
      [
        { opacity: 0, transform: "translateY(16px) scale(.97)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 520,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "forwards",
      }
    );
  }, text);
}

async function beginFeatureSequence(page: Page) {
  await page.evaluate(() => {
    document.getElementById("wallet-demo-feature-stage")?.remove();
    const persistentCaption = document.getElementById("wallet-demo-caption");
    if (persistentCaption) persistentCaption.style.visibility = "hidden";

    if (document.getElementById("wallet-demo-sequence-backdrop")) return;
    const backdrop = document.createElement("div");
    backdrop.id = "wallet-demo-sequence-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    Object.assign(backdrop.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483600",
      background:
        "radial-gradient(circle at 50% 42%, rgba(23,52,4,.3), rgba(3,12,2,.76))",
      backdropFilter: "blur(3px) saturate(.72)",
      pointerEvents: "none",
      opacity: "0",
    });
    document.body.appendChild(backdrop);
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 240,
      easing: "cubic-bezier(.16,1,.3,1)",
      fill: "forwards",
    });
  });
  await page.waitForTimeout(120);
}

async function endFeatureSequence(page: Page) {
  await page.evaluate(async () => {
    const backdrop = document.getElementById("wallet-demo-sequence-backdrop");
    const stage = document.getElementById("wallet-demo-feature-stage");
    const animations: Animation[] = [];
    if (stage) {
      animations.push(
        stage.animate(
          [
            { opacity: 1, transform: "translateY(-50%) scale(1)" },
            { opacity: 0, transform: "translateY(-53%) scale(.97)" },
          ],
          {
            duration: 180,
            easing: "cubic-bezier(.4,0,1,1)",
            fill: "forwards",
          }
        )
      );
    }
    if (backdrop) {
      animations.push(
        backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 180,
          easing: "cubic-bezier(.4,0,1,1)",
          fill: "forwards",
        })
      );
    }
    await Promise.all(animations.map((animation) => animation.finished));
    stage?.remove();
    backdrop?.remove();
  });
}

async function showFeatureScene(
  locator: Locator,
  explanation: string,
  duration = 3_200
) {
  await expect(locator).toBeVisible();
  await locator.evaluate((element) =>
    element.scrollIntoView({ behavior: "smooth", block: "center" })
  );
  await locator.page().waitForTimeout(40);

  await locator.evaluate(
    async (element, options) => {
      const target = element as HTMLElement;
      const rect = target.getBoundingClientRect();
      const compact = rect.width < 210 || rect.height < 55;
      const previousStage = document.getElementById(
        "wallet-demo-feature-stage"
      );
      const stage = document.createElement("section");
      stage.id = "wallet-demo-feature-stage";
      stage.dir = "rtl";
      stage.setAttribute("aria-hidden", "true");
      Object.assign(stage.style, {
        position: "fixed",
        left: "18px",
        right: "18px",
        top: compact ? "42%" : "43%",
        zIndex: "2147483603",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        fontFamily: '"IBM Plex Sans Arabic Demo", Cairo, sans-serif',
        pointerEvents: "none",
        opacity: "0",
        transform: "translateY(-42%) scale(.9)",
        transformOrigin: "center",
      });

      const visual = document.createElement("div");
      Object.assign(visual.style, {
        width: "100%",
        minHeight: compact ? "128px" : `${Math.max(rect.height, 92)}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: compact ? "24px" : "0",
        borderRadius: "24px",
        background: compact
          ? "linear-gradient(145deg,#ffffff,#f5faef)"
          : "transparent",
        boxShadow: compact
          ? "0 24px 70px rgba(0,0,0,.35), 0 0 0 2px #c6f35a"
          : "none",
        overflow: "visible",
        boxSizing: "border-box",
      });

      const clone = target.cloneNode(true) as HTMLElement;
      Object.assign(clone.style, {
        position: "relative",
        inset: "auto",
        width: compact ? "auto" : "100%",
        height: compact ? "auto" : `${Math.max(rect.height, 92)}px`,
        maxWidth: "100%",
        margin: "0",
        boxSizing: "border-box",
        fontFamily: '"IBM Plex Sans Arabic Demo", Cairo, sans-serif',
        transform: compact ? "scale(1.5)" : "scale(1)",
        transformOrigin: "center",
        boxShadow: compact
          ? "none"
          : "0 28px 80px rgba(0,0,0,.38), 0 0 0 2px #c6f35a",
        borderRadius: compact ? getComputedStyle(target).borderRadius : "22px",
        overflow: "visible",
      });
      visual.appendChild(clone);

      const caption = document.createElement("div");
      Object.assign(caption.style, {
        padding: "17px 20px 18px",
        border: "1px solid rgba(198,243,90,.9)",
        borderRadius: "22px",
        background:
          "linear-gradient(135deg,rgba(8,25,6,.99),rgba(23,52,4,.98))",
        boxShadow: "0 18px 50px rgba(0,0,0,.36)",
        color: "#ffffff",
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "1.35",
        textAlign: "center",
        textWrap: "balance",
      });

      const accentPattern =
        /(«[^»]+»|[٠-٩][٠-٩٬٫]*(?:\s*ر\.س)?|[٠-٩]+٪)/g;
      let cursor = 0;
      for (const match of options.explanation.matchAll(accentPattern)) {
        const start = match.index ?? 0;
        if (start > cursor) {
          caption.append(
            document.createTextNode(
              options.explanation.slice(cursor, start)
            )
          );
        }
        const accent = document.createElement("strong");
        accent.textContent = match[0];
        Object.assign(accent.style, {
          color: "#c6f35a",
          fontWeight: "700",
          whiteSpace: "nowrap",
        });
        caption.appendChild(accent);
        cursor = start + match[0].length;
      }
      if (cursor < options.explanation.length) {
        caption.append(
          document.createTextNode(options.explanation.slice(cursor))
        );
      }

      stage.append(visual, caption);
      if (previousStage) previousStage.removeAttribute("id");
      document.body.appendChild(stage);
      const demoCursor = document.getElementById("wallet-demo-cursor");
      if (demoCursor) demoCursor.style.opacity = "0";

      const stageAnimation = stage.animate(
        [
          {
            opacity: 0,
            transform: "translateY(-38%) scale(.9)",
            offset: 0,
          },
          {
            opacity: 1,
            transform: "translateY(-50%) scale(1.025)",
            offset: 0.03,
          },
          {
            opacity: 1,
            transform: "translateY(-50%) scale(1)",
            offset: 0.08,
          },
          { opacity: 1, transform: "translateY(-50%) scale(1)", offset: 1 },
        ],
        {
          duration: options.duration,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "forwards",
        }
      );
      if (previousStage) {
        const previousAnimation = previousStage.animate(
          [
            { opacity: 1, transform: "translateY(-50%) scale(1)" },
            { opacity: 0, transform: "translateY(-54%) scale(.96)" },
          ],
          {
            duration: 260,
            easing: "cubic-bezier(.4,0,1,1)",
            fill: "forwards",
          }
        );
        previousAnimation.finished.then(() => previousStage.remove());
      }
      visual.animate(
        [
          { transform: "translateY(10px)" },
          { transform: "translateY(0)" },
        ],
        {
          duration: 450,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        }
      );
      caption.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 420,
          delay: 80,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        }
      );
      await stageAnimation.finished;
    },
    { explanation, duration }
  );
}

async function installTransitionCover(page: Page) {
  await page.evaluate(() => {
    for (const id of ["wallet-demo-caption", "wallet-demo-cursor"]) {
      const element = document.getElementById(id);
      if (element) element.style.visibility = "hidden";
    }
  });
  const screenshot = await page.screenshot({ type: "png" });
  await page.evaluate(() => {
    for (const id of ["wallet-demo-caption", "wallet-demo-cursor"]) {
      const element = document.getElementById(id);
      if (element) element.style.visibility = "visible";
    }
  });
  await page.evaluate((source) => {
    const cover = document.createElement("img");
    cover.id = "wallet-demo-transition-cover";
    cover.src = source;
    cover.setAttribute("aria-hidden", "true");
    Object.assign(cover.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      zIndex: "2147483599",
      objectFit: "cover",
      pointerEvents: "none",
      opacity: "1",
    });
    document.body.appendChild(cover);
  }, `data:image/png;base64,${screenshot.toString("base64")}`);
}

async function revealLoadedPage(page: Page) {
  await page.evaluate(async () => {
    const cover = document.getElementById("wallet-demo-transition-cover");
    if (!cover) return;
    const animation = cover.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)", offset: 0 },
        {
          opacity: 1,
          transform: "translateY(0) scale(1)",
          offset: 0.2,
        },
        {
          opacity: 0,
          transform: "translateY(14px) scale(1.025)",
          offset: 1,
        },
      ],
      {
        duration: 320,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "forwards",
      }
    );
    await animation.finished;
    cover.remove();
  });
}

async function showCommissionExample(page: Page) {
  await page.evaluate(async () => {
    const previousStage = document.getElementById(
      "wallet-demo-feature-stage"
    );
    const backdrop = document.createElement("div");
    backdrop.setAttribute("aria-hidden", "true");
    Object.assign(backdrop.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483600",
      background: "rgba(6, 20, 3, .58)",
      backdropFilter: "blur(2px)",
      pointerEvents: "none",
      opacity: "0",
    });

    const card = document.createElement("section");
    card.setAttribute("aria-label", "مثال على أرباح العمولة");
    card.dir = "rtl";
    Object.assign(card.style, {
      position: "fixed",
      left: "22px",
      right: "22px",
      top: "43%",
      zIndex: "2147483603",
      padding: "22px 20px",
      border: "3px solid #b8ef35",
      borderRadius: "24px",
      background: "#ffffff",
      boxShadow: "0 24px 70px rgba(0, 0, 0, .38)",
      color: "#173404",
      fontFamily: '"IBM Plex Sans Arabic Demo", Cairo, sans-serif',
      direction: "rtl",
      textAlign: "center",
      pointerEvents: "none",
      opacity: "0",
      transform: "translateY(-50%) scale(.82)",
    });
    card.innerHTML = `
      <p style="margin:0 0 14px;font-size:21px;font-weight:700">أرباحك المحتملة</p>
      <div data-step style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(23,52,4,.10);font-size:16px">
        <span>مبيعات عبر رابطك</span><strong data-sales dir="rtl" style="font-size:24px">٠ ر.س</strong>
      </div>
      <div data-step style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid rgba(23,52,4,.10);font-size:16px">
        <span>نسبة عمولتك</span><strong data-rate dir="rtl" style="font-size:24px">٠٪</strong>
      </div>
      <div data-equation-line style="height:3px;margin:14px auto 0;border-radius:999px;background:linear-gradient(90deg,#7ed957,#c6f35a);transform:scaleX(0);transform-origin:right"></div>
      <div data-step style="margin-top:12px;padding:17px 10px;border-radius:18px;background:linear-gradient(135deg,#effbdc,#e4f7c8);box-shadow:inset 0 1px 0 rgba(255,255,255,.9)">
        <p style="margin:0 0 3px;font-size:15px;font-weight:600">أرباحك</p>
        <p data-earned dir="rtl" style="margin:0;color:#2f7a19;font-size:42px;line-height:1.15;font-weight:700">+ ٠ ر.س</p>
      </div>
    `;

    document.body.append(backdrop, card);
    if (previousStage) {
      previousStage.removeAttribute("id");
      const previousAnimation = previousStage.animate(
        [
          { opacity: 1, transform: "translateY(-50%) scale(1)" },
          { opacity: 0, transform: "translateY(-54%) scale(.96)" },
        ],
        {
          duration: 260,
          easing: "cubic-bezier(.4,0,1,1)",
          fill: "forwards",
        }
      );
      previousAnimation.finished.then(() => previousStage.remove());
    }
    const formatter = new Intl.NumberFormat("ar-SA", {
      maximumFractionDigits: 0,
    });
    const animateNumber = (
      selector: string,
      target: number,
      prefix: string,
      suffix: string,
      delay: number,
      duration: number
    ) => {
      const element = card.querySelector<HTMLElement>(selector);
      if (!element) return;
      window.setTimeout(() => {
        const started = performance.now();
        const update = (now: number) => {
          const progress = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = `${prefix}${formatter.format(
            Math.round(target * eased)
          )}${suffix}`;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      }, delay);
    };
    animateNumber("[data-sales]", 7_000, "", " ر.س", 360, 900);
    animateNumber("[data-rate]", 20, "", "٪", 820, 620);
    animateNumber("[data-earned]", 1_400, "+ ", " ر.س", 1_220, 900);

    card
      .querySelector<HTMLElement>("[data-equation-line]")
      ?.animate(
        [
          { transform: "scaleX(0)", opacity: 0 },
          { transform: "scaleX(1)", opacity: 1 },
        ],
        {
          duration: 650,
          delay: 980,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        }
      );
    card.querySelector<HTMLElement>("[data-earned]")?.animate(
      [
        { transform: "scale(.86)", filter: "brightness(1)" },
        { transform: "scale(1.08)", filter: "brightness(1.12)", offset: 0.7 },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      {
        duration: 720,
        delay: 1_250,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both",
      }
    );
    const backdropAnimation = backdrop.animate(
      [
        { opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.08 },
        { opacity: 1, offset: 0.98 },
        { opacity: 0, offset: 1 },
      ],
      {
        duration: 4_600,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards",
      }
    );
    const cardAnimation = card.animate(
      [
        { opacity: 0, transform: "translateY(-45%) scale(.82)", offset: 0 },
        { opacity: 1, transform: "translateY(-50%) scale(1.04)", offset: 0.1 },
        { opacity: 1, transform: "translateY(-50%) scale(1)", offset: 0.2 },
        { opacity: 1, transform: "translateY(-50%) scale(1)", offset: 0.98 },
        { opacity: 0, transform: "translateY(-53%) scale(.96)", offset: 1 },
      ],
      {
        duration: 4_600,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards",
      }
    );

    for (const [index, step] of Array.from(
      card.querySelectorAll<HTMLElement>("[data-step]")
    ).entries()) {
      step.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 320,
          delay: 180 + index * 160,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "both",
        }
      );
    }

    await Promise.all([backdropAnimation.finished, cardAnimation.finished]);
    backdrop.remove();
    card.remove();
  });
  await page.waitForTimeout(20);
}

async function upscaleForShorts(
  input: string,
  output: string,
  trimStartMs = 0
) {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static did not provide an executable.");
  }

  const args = ["-y"];
  if (trimStartMs > 0) {
    args.push("-ss", (trimStartMs / 1_000).toFixed(3));
  }
  args.push(
    "-i",
    input,
    "-an",
    "-vf",
    "scale=1080:1920:flags=lanczos",
    "-c:v",
    "libvpx",
    "-deadline",
    "realtime",
    "-cpu-used",
    "4",
    "-b:v",
    "2200k",
    "-pix_fmt",
    "yuv420p",
    output
  );

  await runFile(
    ffmpegPath,
    args,
    { maxBuffer: 10 * 1024 * 1024 }
  );
}

async function createShareableMp4(input: string, output: string) {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static did not provide an executable.");
  }

  await runFile(
    ffmpegPath,
    [
      "-y",
      "-i",
      input,
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      output,
    ],
    { maxBuffer: 10 * 1024 * 1024 }
  );
}

async function scrubDashboardIdentity(page: Page) {
  await page.evaluate(() => {
    const replacements = new Map([
      ["الاسم", "حساب تجريبي"],
      ["رقم الجوال", "••••••••"],
      ["اسم المنشأة", "منشأة تجريبية"],
      ["اسم المدرسة", "منشأة تجريبية"],
    ]);

    for (const [label, replacement] of replacements) {
      for (const node of Array.from(document.querySelectorAll("p"))) {
        if (node.textContent?.trim() !== label) continue;
        const container = node.parentElement;
        const value = container?.querySelectorAll("p")[1];
        if (value) value.textContent = replacement;
      }
    }
  });
}

async function maskFreeFormWalletData(page: Page) {
  await page.evaluate(() => {
    for (const item of Array.from(document.querySelectorAll("li"))) {
      const note = item.querySelector(":scope > p");
      if (note) note.textContent = "تم تسجيلها بأمان";
    }
  });
}

async function installSafeDemoBackend(page: Page) {
  const commissionRate = PLAIN_MODE ? "0.10" : "0.20";
  const transactions = [
    {
      id: 101,
      amount: PLAIN_MODE ? "8.00" : "16.00",
      type: "consultation_commission",
      sourceType: "consultation",
      sourceId: 5001,
      baseAmount: "80.00",
      commissionRate,
      note: null,
      createdAt: "2026-07-22T12:00:00.000Z",
    },
    {
      id: 102,
      amount: PLAIN_MODE ? "700.00" : "1400.00",
      type: "subscription_commission",
      sourceType: "subscription",
      sourceId: 6001,
      baseAmount: "7000.00",
      commissionRate,
      note: null,
      createdAt: "2026-07-21T09:30:00.000Z",
    },
    {
      id: 103,
      amount: "-25.00",
      type: "payout",
      sourceType: "manual",
      sourceId: null,
      baseAmount: null,
      commissionRate: null,
      payoutReference: null,
      note: "تم تسجيلها بأمان",
      createdAt: "2026-07-20T14:15:00.000Z",
    },
  ];

  const respond = async (route: Route, body: unknown) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "access-control-allow-origin": "https://app.test.labass.sa",
        "access-control-allow-credentials": "true",
      },
      body: JSON.stringify(body),
    });
  };

  await page.route("https://api.test.labass.sa/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const apiPath = requestUrl.pathname.replace(/^\/api_labass/, "");

    if (apiPath === "/send-otp") {
      await respond(route, { message: "OTP accepted for demo account." });
    } else if (apiPath === "/verifyOTPandLogin") {
      await respond(route, {
        authResponse: {
          userId: 900001,
          token: "safe-demo-wallet-token",
          refreshToken: "safe-demo-refresh-token",
        },
      });
    } else if (apiPath === "/organization") {
      await respond(route, {
        dealType: [],
        type: "pharmacy",
        name: "منشأة تجريبية",
      });
    } else if (apiPath === "/user") {
      await respond(route, {
        id: 900001,
        firstName: "حساب",
        lastName: "تجريبي",
        phoneNumber: "••••••••",
      });
    } else if (apiPath === "/my-subscription") {
      await respond(route, { data: [] });
    } else if (apiPath.startsWith("/marketers/consultations/")) {
      await respond(route, { consultations: [] });
    } else if (apiPath === "/my-referral-codes") {
      await respond(route, { data: [] });
    } else if (apiPath === "/my-wallet/transactions") {
      await respond(route, {
        success: true,
        currency: "SAR",
        data: transactions,
        total: transactions.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
    } else if (apiPath === "/my-wallet") {
      await respond(route, {
        success: true,
        data: {
          balance: PLAIN_MODE ? "683.00" : "1391.00",
          currency: "SAR",
          commissionPercentage: PLAIN_MODE ? "10" : "20",
          recentTransactions: transactions,
        },
      });
    } else {
      await respond(route, { success: true, data: [] });
    }
  });
}

async function findTransaction(
  page: Page,
  label: RegExp,
  displayName: string
) {
  for (let pageNumber = 1; pageNumber <= 5; pageNumber += 1) {
    const row = page.locator("li").filter({ hasText: label }).first();
    if (await row.isVisible().catch(() => false)) return row;

    const nextPage = page.getByRole("button", {
      name: /Next page|الصفحة التالية/i,
    });
    if (
      (await nextPage.count()) === 0 ||
      (await nextPage.isDisabled().catch(() => true))
    ) {
      break;
    }

    await deliberateClick(page, nextPage);
    await page.waitForTimeout(550);
  }

  throw new Error(
    `The safe demo account does not have a visible ${displayName} transaction in the first five Wallet history pages.`
  );
}

test("record the Wallet onboarding demo", async ({ browser, baseURL }) => {
  test.setTimeout(120_000);

  splitPhoneNumber(requiredEnvironment("DEMO_PHONE"));
  const otp = requiredEnvironment("DEMO_OTP");
  if (!/^\d{4}$/.test(otp)) throw new Error("DEMO_OTP must contain four digits.");

  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(RAW_VIDEO_DIR, { recursive: true });
  await rm(FINAL_VIDEO, { force: true });
  await rm(FINAL_MP4, { force: true });
  await rm(RAW_VIDEO, { force: true });

  const context = await browser.newContext({
    baseURL,
    viewport: { width: 432, height: 768 },
    isMobile: true,
    locale: "ar-SA",
    timezoneId: "Asia/Riyadh",
    colorScheme: "light",
    recordVideo: {
      dir: RAW_VIDEO_DIR,
      size: { width: 432, height: 768 },
    },
  });
  await installDemoLayer(context.pages()[0] ?? (await context.newPage()));

  const page = context.pages()[0];
  const video = page.video();
  const startedAt = Date.now();
  let visibleStartedAt = startedAt;
  let trimStartMs = 0;
  let recordingError: unknown;

  try {
    await installSafeDemoBackend(page);
    await page.goto("/orgPortal?lang=ar", {
      waitUntil: "domcontentloaded",
    });
    const walletNav = page.getByRole("button", {
      name: /Wallet|المحفظة/i,
    });
    await expect(walletNav).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("حساب تجريبي")).toBeVisible({
      timeout: 15_000,
    });
    await page.waitForTimeout(250);
    await scrubDashboardIdentity(page);
    visibleStartedAt = Date.now();
    trimStartMs = Math.max(0, visibleStartedAt - startedAt - 120);

    if (PLAIN_MODE) {
      await page.waitForTimeout(900);
      await deliberateClick(page, walletNav, -18);

      await expect(
        page.getByRole("heading", { name: /My Wallet|محفظتي/i })
      ).toBeVisible({ timeout: 15_000 });
      await expect(
        page.getByText(/Current balance|الرصيد الحالي/i)
      ).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(500);

      const balanceCard = page
        .getByText(/Current balance|الرصيد الحالي/i)
        .locator("..");
      await moveCursorTo(page, balanceCard);
      await page.waitForTimeout(1_500);

      const commissionRate = page
        .getByText(/Your rate|نسبتك/i)
        .first();
      await moveCursorTo(page, commissionRate);
      await page.waitForTimeout(1_500);

      const viewAll = page.getByRole("button", {
        name: /View all|عرض الكل/i,
      });
      await deliberateClick(page, viewAll);
      await expect(
        page.getByRole("heading", { name: /Wallet history|سجل المحفظة/i })
      ).toBeVisible();
      await maskFreeFormWalletData(page);
      await page.waitForTimeout(500);

      for (const transaction of [
        await findTransaction(
          page,
          /Consultation commission|عمولة استشارة/i,
          "consultation commission"
        ),
        await findTransaction(
          page,
          /Subscription commission|عمولة اشتراك/i,
          "subscription referral"
        ),
        await findTransaction(
          page,
          /Payout|دفعة مالية/i,
          "recorded payout"
        ),
      ]) {
        await moveCursorTo(page, transaction);
        await page.waitForTimeout(1_500);
      }

      const remaining = MINIMUM_VIDEO_MS - (Date.now() - visibleStartedAt);
      if (remaining > 0) await page.waitForTimeout(remaining);
    } else {
      await showCaption(
      page,
      "من الصفحة الرئيسية، اضغط على «المحفظة» لمتابعة أرباحك."
    );
    await page.waitForTimeout(450);

    await moveCursorTo(page, walletNav, -28);
    await showCaption(
      page,
      "تعرّف على محفظتك الجديدة، طريقة بسيطة لمتابعة كل عمولة تكسبها."
    );
    await cinematicFocus(walletNav, 1_050, -28);
    await page.waitForTimeout(100);
    await installTransitionCover(page);
    await deliberateClick(page, walletNav, -18);

    await expect(
      page.getByRole("heading", { name: /My Wallet|محفظتي/i })
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText(/Current balance|الرصيد الحالي/i)
    ).toBeVisible({ timeout: 15_000 });
    await revealLoadedPage(page);
    await page.waitForTimeout(200);
    await beginFeatureSequence(page);

    const balanceCard = page
      .getByText(/Current balance|الرصيد الحالي/i)
      .locator("..");
    await showFeatureScene(
      balanceCard,
      "إجمالي رصيدك الحالي واضح ومحدّث بالريال.",
      3_200
    );

    const commissionRate = page
      .getByText(/Your rate|نسبتك/i)
      .first();
    await showFeatureScene(
      commissionRate,
      "تابع نسبة العمولة التي تحصل عليها من كل عملية.",
      3_200
    );
    await showCaption(
      page,
      "من مبيعات بقيمة ٧٬٠٠٠ ر.س، تربح ١٬٤٠٠ ر.س بنسبة ٢٠٪."
    );
    await showCommissionExample(page);
    await endFeatureSequence(page);

    const viewAll = page.getByRole("button", {
      name: /View all|عرض الكل/i,
    });
    await installTransitionCover(page);
    await deliberateClick(page, viewAll);
    await expect(
      page.getByRole("heading", { name: /Wallet history|سجل المحفظة/i })
    ).toBeVisible();
    await page.waitForTimeout(100);
    await maskFreeFormWalletData(page);
    await revealLoadedPage(page);
    await beginFeatureSequence(page);

    const consultation = await findTransaction(
      page,
      /Consultation commission|عمولة استشارة/i,
      "consultation commission"
    );
    await showFeatureScene(
      consultation,
      "عند دفع استشارة باستخدام رمزك التسويقي، تُضاف عمولتك تلقائياً.",
      3_200
    );

    const subscription = await findTransaction(
      page,
      /Subscription commission|عمولة اشتراك/i,
      "subscription referral"
    );
    await showFeatureScene(
      subscription,
      "وعند الاشتراك من خلال الرابط الخاص بك، تُضاف أرباح الاشتراك تلقائياً.",
      3_300
    );

    const payout = await findTransaction(
      page,
      /Payout|دفعة مالية/i,
      "recorded payout"
    );
    await showFeatureScene(
      payout,
      "كل دفعة مالية مسجّلة تبقى محفوظة بوضوح في سجل محفظتك.",
      3_200
    );
    await endFeatureSequence(page);

    await page.evaluate(() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    await showCaption(page, "كل تفاصيل محفظتك واضحة في مكان واحد.");
    await page.waitForTimeout(1_800);

    const remaining = MINIMUM_VIDEO_MS - (Date.now() - visibleStartedAt);
    if (remaining > 0) await page.waitForTimeout(remaining);
    }
  } catch (error) {
    recordingError = error;
  } finally {
    await context.close();
    if (video) await video.saveAs(RAW_VIDEO);
  }

  if (recordingError) throw recordingError;
  await upscaleForShorts(RAW_VIDEO, FINAL_VIDEO, trimStartMs);
  await createShareableMp4(FINAL_VIDEO, FINAL_MP4);
});
