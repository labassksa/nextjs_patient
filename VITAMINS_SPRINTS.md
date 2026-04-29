# Vitamins Package — Implementation Sprints

> Gap numbers refer to VITAMINS_CUSTOMER_JOURNEY.md.

---

## Priority Order

> The priority order is anchored to the lab customer flow. The entire P0 sprint must be completable end-to-end for a lab customer — from post-test consultation close → vitamins link → subscribe → pay → vitamins consultation → prescription → pharmacy. Pharmacy and ads features layer on top in P1/P2.

### P0 — Lab Customer Flow (must work end-to-end first)

| Order | Gap | Serves | Effort | Why it's P0 |
|-------|-----|--------|--------|-------------|
| 1 | **GAP 8** Auto-send vitamins link when post-test closes | 🔴 Lab | Low | The trigger for the entire lab journey — without this there's no automated handoff |
| 2 | **GAP 1** Auto-create vitamins consultation after payment + long-lived link | 🔴 Lab + all | Medium | Journey breaks after payment — patient has no way to enter consultation |
| 3 | **GAP 3** Doctor sees source, vitamins badge, subscription status, lab results | 🔴 Lab + all | Medium | Doctor must see lab results and subscription context to prescribe correctly |
| 4 | **GAP 7** Survey data (goals, height, weight) passed to doctor | 🔴 Lab + all | Medium | Essential for prescription quality — data already collected, just not sent to backend |
| 5 | **GAP 5 Path B** Admin selects partner pharmacy and sends Rx for lab/ads customers | 🔴 Lab | Medium | Final step of the lab journey — prescription has nowhere to go without this |

### P1 — Pharmacy Channel + Operations

| Order | Gap | Serves | Effort | Why it's P1 |
|-------|-----|--------|--------|-------------|
| 6 | **GAP 2** Pharmacy sends free vitamins consultation (not counted on bundle) | 🟡 Pharmacy | Medium | Enables the pharmacy referral channel |
| 7 | **GAP 5 Path A** Doctor sends Rx directly to source pharmacy | 🟡 Pharmacy | Low | Closes the pharmacy loop after GAP 2 is built |
| 8 | **GAP 4** Admin dashboard — subscriber list, prescription status, link verification | 🔴 🟡 All | Medium | Operations visibility |
| 9 | **GAP 6** Recurring consultation on monthly renewal | 🔴 🟡 All | Low | Retention — keeps subscribers engaged |

### P2 — Growth & Ads Channel

| Order | Gap | Serves | Effort | Why it's P2 |
|-------|-----|--------|--------|-------------|
| 10 | **GAP 9** Bulk WhatsApp campaign to all existing users | 🟢 Ads/Growth | Medium | Broadcast marketing — needs WhatsApp template approval first |

---

## Sprint 1 — Lab Customer End-to-End

**Milestone**: A lab customer can go from post-test consultation close → vitamins link → subscribe → pay → enter vitamins consultation → doctor prescribes → admin sends Rx to partner pharmacy. Fully testable in staging.

**Dependency order:**

```
TASK 1.1 (consultation type enum)
    └─► TASK 1.2 (source field on consultation)    TASK 1.3 (auto-send WA on close) ← no deps, run in parallel
             └─► TASK 1.4 (auto-create consult after payment)
                      └─► TASK 1.5 (success page link)
                               └─► TASK 1.6 (doctor sees context)
                                        └─► TASK 1.7 (survey data to doctor)
                                                 └─► TASK 1.8 (admin → partner pharmacy Rx)
                                                          ▼
                                               ✅ LAB FLOW COMPLETE
```

---

#### TASK 1.1 — Support "Vitamins" as a consultation type *(no deps — do first)*

A new consultation type `vitamins` must be recognized by the system across all flows.

**Unblocks**: 1.2, 1.4, Sprint 2 Task 2.1

---

#### TASK 1.2 — Record where each consultation came from (source) *(depends on 1.1)*

Every consultation must store its origin:
- `pharmacy_vitamins` — pharmacy vitamins referral
- `lab_post_test` — lab post-test consultation
- `vitamins_subscription` — direct vitamins subscription (lab or ads)
- `org_bundle` — regular org bundle consultation

The source is set automatically at creation time based on context.

**Unblocks**: 1.4, 1.6, 2.1, 2.2

---

#### TASK 1.3 — Auto-send vitamins link when post-test consultation closes *(no deps — run in parallel with 1.1)*

When a post-test consultation is closed, the patient automatically receives a WhatsApp message with the vitamins package link.

⚠️ Requires WhatsApp template approval from Meta — apply early, takes 1–3 days.

No frontend changes needed.

---

#### TASK 1.4 — After payment: create vitamins consultation and send direct entry link *(depends on 1.1, 1.2)*

When a vitamins subscription is activated after payment:
- A new vitamins consultation is automatically created (counted against the vitamins subscription, not the lab's bundle).
- The patient receives a **direct entry link** — not a request link. One click and they are in.
- Primary delivery: WhatsApp. **If WhatsApp fails, fall back to SMS.** The tech team must ensure this fallback is in place before go-live.
- The OTP code sent during the subscribe wizard must also have a fallback: if WhatsApp delivery fails, send via SMS.

**Unblocks**: 1.5

---

#### TASK 1.5 — Success page: show direct entry link *(depends on 1.4)*

Replace "سيتواصل معك فريقنا خلال ٢٤ ساعة" with a direct "ادخل استشارتك الآن" button that takes the patient straight into the consultation.

---

#### TASK 1.6 — Doctor sees full context when accepting a vitamins consultation *(depends on 1.2)*

When a doctor opens a vitamins consultation, they must see all four of the following clearly:

1. **Source** — whether the patient is a vitamins subscriber (paid subscription), came from a pharmacy referral, or a lab post-test.
2. **Survey** — every question asked during signup and the patient's answer: health goals, height, weight, city.
3. **Previous consultations** — the original post-test consultation: lab name, date, and a link to view it.
4. **Lab results** — the PDF uploaded by the lab during the post-test consultation.

**Backend**: Consultation record must carry the source, a link to the previous post-test consultation, and the lab results PDF reference.

**Frontend (doctor app)**: Display all four items in a dedicated context panel when the consultation type is vitamins.

**Unblocks**: 1.7

---

#### TASK 1.7 — Survey answers submitted to backend and stored *(depends on 1.6)*

Health goals, height, weight, and city collected during signup are currently stored only in the browser.

1. Submit the survey answers to the backend at the payment/confirmation step.
2. Store them against the patient's subscription record.
3. Expose them in the consultation context panel built in TASK 1.6.

**Unblocks**: 1.8

---

#### TASK 1.8 — Admin can assign and send Rx to a partner pharmacy *(depends on 1.7 — final task)*

- Partner pharmacies are flagged in the system. **Jadar (جدار) is the first partner pharmacy to be added** — they are registered in the system as a pharmacy so prescriptions and patient information can be sent directly to them.
- Admin sees a list of all vitamins subscribers, their consultation status, and prescription status.
- Admin selects a partner pharmacy (e.g. Jadar) and sends the prescription + patient info to them.
- Consultations waiting for pharmacy assignment are highlighted.

✅ Lab flow end-to-end complete after this task.

---

## Sprint 2 — Pharmacy Channel + Operations

*(Start only after Sprint 1 milestone is verified)*

---

#### TASK 2.1 — Pharmacy sends free vitamins consultation from org portal *(depends on 1.1 + 1.2)*

- "فيتامينات" appears as a selectable consultation type in the org portal.
- Selecting it creates a consultation that is free to the pharmacy — does not reduce their bundle count.
- A note is shown to the pharmacy: "مجانية ولا تُخصم من باقتك".

---

#### TASK 2.2 — Doctor sends Rx directly to source pharmacy *(depends on 2.1)*

When a patient came from a pharmacy referral, the doctor sees an action in the consultation view to send the Rx directly to that pharmacy. No admin step required.

---

#### TASK 2.3 — Admin subscriber dashboard with doctor link verification *(depends on 1.2 + 1.4)*

- Admin sees all vitamins subscribers: name, plan, consultation status, prescription status.
- Each row shows whether the doctor sent the vitamins link to the patient (✅ sent with timestamp / ❌ not sent).
- The system detects automatically when a doctor sends the vitamins link in a consultation chat.

---

#### TASK 2.4 — New consultation on monthly renewal *(depends on 1.4)*

When a vitamins subscription renews each month:
- A new consultation is created and linked to the renewed subscription.
- The patient receives a WhatsApp notification prompting them to book their monthly consultation.

---

## Sprint 3 — Ads / Growth

*(Start only after Sprint 2 milestone is verified)*

---

#### TASK 3.1 — Bulk WhatsApp campaign from admin *(no code deps, but needs Meta template approval)*

- Admin can send the vitamins package link to all patients who don't have an active vitamins subscription.
- System must: respect WhatsApp rate limits, log results (sent / failed / skipped), never send to existing subscribers.
- Trigger button in admin UI with confirmation showing the number of users to be contacted.
- Results summary shown after the send completes.

⚠️ Requires a separate WhatsApp marketing template approval from Meta — apply during Sprint 2.
