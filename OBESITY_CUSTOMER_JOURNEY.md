# Obesity Program — Customer Journey (A to Z)

## Three Customer Types

> **Priority note**: The post-test lab customer is the PRIMARY and highest-converting customer type, identical to the vitamins program. The lab customer arrives pre-qualified (has done obesity-related blood work, already in a consultation with a doctor), making them the most likely to subscribe. Pharmacy customers already intend to purchase Mounjaro or Ozempic — they simply need the prescription. Ads customers require the most education before converting.

| Priority | # | Type | Entry Point | Who Pays for Initial Consultation? |
|----------|---|------|-------------|-------------------------------------|
| 🔴 **PRIMARY** | 1 | **Post-Test Lab** | Lab org portal (post_test consultation — obesity panel) | Lab subscription bundle |
| 🟡 Secondary | 2 | **Pharmacy Referral** | Pharmacy org portal — customer asks for Mounjaro / Ozempic | Pharmacy bundle (standard consultation) |
| 🟢 Growth | 3 | **Ads Customer** | TikTok / Instagram / Snap → obesity program page | Self-pay (obesity subscription) |

---

## TYPE 1: Post-Test Lab Customer 🔴 PRIMARY

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل المختبر لإجراء تحاليل مرتبطة بالوزن والسمنة (سكر، هرمونات الغدة الدرقية، دهون الدم، HbA1c)</li>
<li>يحصل العميل على استشارة من لاباس بعد ظهور نتائج التحليل (المختبر يرسلها من بوابة المنشأة)</li>
<li>يدخل العميل الاستشارة عبر الرابط المرسل على واتساب</li>
<li>يراجع الدكتور نتائج التحاليل مع العميل ويناقش حالته الصحية — يشرح الدكتور برنامج السمنة ويرسل رابط الاشتراك للعميل داخل المحادثة</li>
<li>يدخل العميل إلى صفحة البرنامج، يكمل تقييم طبي مفصّل، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن رابطًا للدخول مباشرة إلى استشارة السمنة الجديدة — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة الجديدة مباشرة عبر الرابط (ليست الاستشارة الأصلية مع المختبر) — <em>(مشترك)</em></li>
<li><strong>(للدكتور)</strong> يقبل الدكتور الاستشارة ويرى: مصدر العميل، الباقة المفعّلة، إجابات التقييم الطبي، ونتائج التحاليل الأصلية من المختبر — <em>(مشترك)</em></li>
<li>يُصدر الدكتور وصفة طبية بدواء مونجارو أو اوزمبيك مع جرعة البداية الموصى بها وخطة الغذاء والرياضة — <em>(مشترك)</em></li>
<li><strong>(للأدمن)</strong> تظهر قائمة بجميع المشتركين مع الباقات والاستشارات المنفذة، ويظهر مصدر كل عميل (مختبر / صيدلية / إعلان) — <em>(مشترك)</em></li>
<li>يتحقق الأدمن من إرسال الوصفة، ويختار الصيدلية الشريكة ويرسل الوصفة إليها</li>
<li>تصل الوصفة مباشرة لمدير الصيدلية — تُصرف الأدوية وتُشحن للعميل — <em>(مشترك)</em></li>
</ol>
</div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Visits the lab for obesity-related blood tests (fasting glucose, HbA1c, TSH, lipid panel, CBC). | — |
| 2 | **Lab — org portal** | B2B | Opens the Labass org portal. Enters the patient's phone number. Selects *post-test* consultation type (obesity panel). Uploads the lab results PDF. Submits. | <small>• Remaining bundle count decreases by 1</small> |
| 3 | **System → Customer** | Tech | Sends the patient a WhatsApp + SMS with a one-time consultation link. | <small>• Patient receives: link to enter the consultation chat</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Sees the new consultation in their feed and accepts it. | <small>• Patient name, phone, consultation type (post-test), lab results PDF<br>• Source label: "من المختبر — [lab name]" *(to be built)*<br>• Whether patient already has an active obesity subscription *(to be built)*</small> |
| 6 | **Doctor ↔ Customer** | Medical | Reviews the lab results together. Assesses BMI, metabolic markers, and candidacy for GLP-1 therapy. Explains Mounjaro and Ozempic. Sends the obesity program subscription link inside the chat. | — |
| 7 | **Doctor** | Medical | Closes the consultation. | — |
| 8 | **System → Customer** *(to be built)* | Marketing | The moment the post-test consultation closes, automatically sends the patient the obesity program link via WhatsApp as a fallback (in case the doctor forgot). | <small>• Patient receives: "بناءً على نتائج تحاليلك، قد تكون مؤهلاً لبرنامج إنقاص الوزن الطبي" + obesity page link<br>• ⚠️ Requires Meta WhatsApp template approval</small> |
| 9 | **Customer** | Sales | Visits the obesity program page. Clicks "اشترك الآن". Fills in the medical assessment: name, phone, age, height, weight (BMI auto-calculated), city, health goals, current medications, medical history (diabetes, heart disease, thyroid, pancreatitis history). Selects a plan. Verifies phone via OTP. Pays via card or Apple Pay. | — |
| 10 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. Automatically creates a new obesity consultation and sends the customer a direct entry link. If WhatsApp delivery fails, falls back to SMS. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! ادخل استشارتك الآن" + direct consultation link<br>• Success page shows "ادخل استشارتك الآن" button</small> |
| 11 | **Customer** | Tech | Clicks the link and enters the new obesity consultation. | — |
| 12 | **Doctor** | Medical | Accepts the obesity consultation. | <small>• **Source** — lab name and panel type<br>• **Subscription** — plan name, activation date<br>• **Medical assessment** — BMI, current meds, full medical history, health goals<br>• **Lab results** — original obesity panel PDF from the post-test consultation *(to be built)*<br>• **Contraindication flags** — system highlights if patient reported thyroid cancer history, pancreatitis, or is on insulin *(to be built)*</small> |
| 13 | **Doctor → Patient** | Medical | Reviews all context. Selects Mounjaro or Ozempic based on patient profile. Issues a prescription with starting dose, titration schedule, meal plan, and exercise plan. | <small>• Patient receives: prescription PDF + meal plan via WhatsApp</small> |
| 14 | **Admin** *(to be built)* | Ops | Opens the obesity subscriber dashboard. Sees all active subscribers with plan, consultation status, and prescription status. Sees each patient's source to determine prescription routing. Selects a Labass partner pharmacy (registered for GLP-1 dispensing) and sends the prescription. | <small>• Subscriber name, plan, source, consultations completed, prescription status<br>• ✅ obesity link sent after lab consultation closed / ❌ not sent<br>• Pharmacy manager receives: prescription PDF + patient details via WhatsApp</small> |
| 15 | **Pharmacy Manager** | Ops | Receives the prescription. Verifies SFDA compliance. Dispenses Mounjaro or Ozempic. Ships with cold chain packaging to the patient. | — |
| 16 | **System / Doctor** *(to be built)* | Medical | Monthly follow-up consultation created automatically on subscription renewal. Patient notified to book a weight check-in. Doctor reviews weight loss progress, side effects, and adjusts dose if needed. | <small>• Doctor sees: weight at enrollment vs. current, medications dispensed, notes from previous consultations</small> |

---

## TYPE 2: Pharmacy Referral Customer 🟡

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل الصيدلية ويطلب صرف مونجارو أو اوزمبيك</li>
<li>يشرح له الصيدلاني أن هذه الأدوية تستلزم وصفة طبية من طبيب متخصص</li>
<li>الصيدلية ترسل استشارة من بوابة المنشأة (تُخصم من باقة الصيدلية)</li>
<li>يحصل العميل على رابط الاستشارة عبر واتساب</li>
<li>يدخل العميل الاستشارة — يقوم الدكتور بتقييم الحالة ويشرح برنامج السمنة، ثم يرسل رابط الاشتراك للعميل داخل المحادثة</li>
<li>يدخل العميل إلى صفحة البرنامج، يكمل التقييم الطبي، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن رابطًا لطلب استشارة سمنة جديدة — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة الجديدة — يقوم الدكتور بإصدار وصفة طبية لمونجارو أو اوزمبيك — <em>(مشترك)</em></li>
<li>يرسل الدكتور الوصفة مباشرة لتلك الصيدلية (مصدر الاستشارة) — <em>(مشترك)</em></li>
<li>تصل الوصفة لمدير الصيدلية — يصرف الدواء ويشحنه للعميل — <em>(مشترك)</em></li>
</ol>
</div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Walks into a pharmacy and asks for Mounjaro or Ozempic by name. Pharmacist explains a medical prescription is required and offers to connect them with a Labass doctor. | — |
| 2 | **Pharmacy — org portal** | B2B | Opens the Labass org portal. Enters the patient's phone number. Selects the appropriate consultation type. Submits. | <small>• Bundle count decreases by 1</small> |
| 3 | **System → Customer** | Tech | Sends the patient a WhatsApp with a consultation link. | <small>• Patient receives: "صيدلية [اسم الصيدلية] وصلتك باستشارة طبيب متخصص في برنامج إنقاص الوزن" + consultation link</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Accepts the consultation. | <small>• Source: "من الصيدلية — [pharmacy name]" *(to be built)*<br>• No lab results yet (patient may need blood work first)<br>• Not yet subscribed to obesity program *(to be built)*</small> |
| 6 | **Doctor ↔ Customer** | Medical | Assesses the patient's health status verbally. Discusses Mounjaro vs. Ozempic, program structure, pricing. If the doctor judges that blood tests are needed before prescribing, requests a lab panel. Sends the obesity program subscription link inside the chat. | — |
| 7 | **Doctor** | Medical | Closes the consultation. | — |
| 8 | **Customer** | Sales | Visits the obesity program page. Completes the medical assessment (height, weight, BMI, medical history, current medications). Selects a plan. Verifies phone via OTP. Pays. | — |
| 9 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. System sends the customer a direct consultation link. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! ادخل استشارتك الآن" + direct consultation link</small> |
| 10 | **Customer** | Tech | Enters the new obesity consultation linked to their subscription. | — |
| 11 | **Doctor** | Medical | Accepts the obesity consultation. | <small>• Source: "من الصيدلية — [pharmacy name]"<br>• Subscription plan + active status<br>• Medical assessment (BMI, history, current meds)<br>• Contraindication flags *(to be built)*</small> |
| 12 | **Doctor → Patient** | Medical | Issues a prescription for Mounjaro or Ozempic with starting dose and titration schedule. Issues meal plan and exercise guidance. | <small>• Patient receives: prescription PDF + meal plan via WhatsApp</small> |
| 13 | **Doctor → Pharmacy** *(to be built)* | Medical | Since the patient came from this pharmacy and it dispenses GLP-1 drugs, the doctor sends the prescription directly to the source pharmacy. No admin involvement. | <small>• Pharmacy manager receives: prescription PDF via WhatsApp</small> |
| 14 | **Pharmacy Manager** | Ops | Receives the prescription. Dispenses Mounjaro or Ozempic. Ships to the patient. | — |

---

## TYPE 3: Ads Customer 🟢

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يرى العميل إعلاناً عن برنامج إنقاص الوزن على تيك توك أو انستقرام أو سناب شات</li>
<li>يدخل العميل مباشرة إلى صفحة برنامج السمنة عبر رابط الإعلان</li>
<li>يقرأ عن البرنامج ويكمل التقييم الطبي، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن رابطًا لطلب استشارة جديدة — <em>(مشترك)</em></li>
<li>يطلب العميل استشارة سمنة جديدة مرتبطة بالباقة عبر الرابط المرسل — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة — يقوم الدكتور بالتقييم وإصدار الوصفة الطبية — <em>(مشترك)</em></li>
<li><strong>(للأدمن)</strong> تظهر قائمة بالعملاء المشتركين مع الباقات والاستشارات، ومصدر كل عميل — <em>(مشترك)</em></li>
<li>يقوم الأدمن باختيار صيدلية شريكة لصرف الأدوية وإرسال الوصفة إليها</li>
<li>ترسل الوصفة مباشرة لمدير الصيدلية — تُصرف الأدوية وتُشحن للعميل — <em>(مشترك)</em></li>
</ol>
</div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | Marketing | Sees an ad on TikTok, Instagram, or Snap. Clicks and lands on the obesity program page. | — |
| 2 | **Customer** | Sales | Reads about the program — how GLP-1 works, what's included, pricing, FAQ. Clicks "اشترك الآن". Completes the medical assessment: name, phone, age, height, weight, city, health goals, medical history, current medications. Selects a plan. Verifies phone via OTP. Pays via card or Apple Pay. | — |
| 3 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. System sends customer a direct consultation link. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! ادخل استشارتك الآن" + direct link<br>• Success page shows "ادخل استشارتك الآن" button</small> |
| 4 | **Customer** | Tech | Enters the obesity consultation linked to their subscription. | — |
| 5 | **Doctor** | Medical | Accepts the consultation. | <small>• Source: "اشتراك مباشر"<br>• Subscription plan + active status<br>• Full medical assessment (BMI, history, current meds, health goals)<br>• Contraindication flags *(to be built)*</small> |
| 6 | **Doctor ↔ Customer** | Medical | Reviews assessment. If blood tests are needed before prescribing, orders an obesity lab panel (may be included in the program, or the patient visits a partner lab). | — |
| 7 | **Doctor → Patient** | Medical | Issues the GLP-1 prescription (Mounjaro or Ozempic) with dose and titration plan, meal plan, and exercise guidance. | <small>• Patient receives: prescription PDF + meal plan via WhatsApp</small> |
| 8 | **Admin** *(to be built)* | Ops | Opens the obesity subscriber dashboard. Finds this patient (no linked pharmacy). Selects a Labass partner pharmacy registered for GLP-1 dispensing. Sends the prescription. | <small>• All active subscribers (name, plan, **source: lab / pharmacy / direct**)<br>• Patients with no assigned pharmacy highlighted for action<br>• Pharmacy manager receives: prescription PDF via WhatsApp</small> |
| 9 | **Pharmacy Manager** | Ops | Receives the prescription. Verifies SFDA compliance. Dispenses Mounjaro or Ozempic. Ships with cold chain packaging. | — |

---

## What EXISTS Today

| Feature | Status |
|---------|--------|
| Lab creates post_test consultation from org portal (bundle-based) | ✅ EXISTS |
| WhatsApp + SMS magic link sent to patient | ✅ EXISTS |
| Patient enters consultation via magic link | ✅ EXISTS |
| Doctor sees new consultation in feed and accepts | ✅ EXISTS |
| Doctor sends obesity program link manually in chat | ✅ EXISTS (manual) |
| Obesity program landing page with symptoms, plans, FAQ, and FDA badge | ✅ EXISTS |
| Subscribe wizard (plan → info → OTP → confirm) | ✅ EXISTS |
| Payment via MyFatoorah (card / Apple Pay) | ✅ EXISTS |
| Subscription activated on payment webhook | ✅ EXISTS |
| Doctor issues prescription (drugs + PDF) | ✅ EXISTS |
| Prescription PDF sent via WhatsApp to patient | ✅ EXISTS |

---

## What's MISSING

### GAP 1 — Obesity Consultation Linked to Subscription (Not Lab Bundle)

**Problem**: After paying for the obesity subscription, the success page says "سيتواصل معك فريقنا خلال ٢٤ ساعة". There is no consultation link. The patient — who has just committed to a medical treatment program — has no next step.

**What we need**:
1. When an obesity subscription is activated, a consultation is automatically created and linked to the **obesity subscription**, not the lab's bundle.
2. The patient receives a long-lived consultation link valid until the subscription period expires.
3. The success page shows a direct "ادخل للاستشارة الآن" button.
4. Additional monthly consultations within the subscription are counted against the obesity package.

**Backend**: On subscription activation: create an obesity consultation, generate a persistent link, send via WhatsApp. Monthly consultations deduct from the obesity subscription.

**Frontend**: Success page — replace "سيتواصل معك فريقنا خلال ٢٤ ساعة" with a direct consultation link and button.

---

### GAP 2 — Doctor Sees Full Context (Source, Subscription, Assessment, Lab Results, Contraindications)

**Problem**: When a doctor accepts a consultation, they see only the patient's basic profile. For GLP-1 prescriptions, context is medically critical — a doctor must not prescribe Mounjaro to a patient with a history of medullary thyroid cancer.

**What we need**: Every obesity-related consultation must show the doctor:

| What | Why |
|------|-----|
| Obesity consultation badge | Doctor knows this requires a GLP-1 assessment |
| Source (lab / pharmacy / direct) | Determines if lab results are already available |
| Active obesity subscription + plan | Doctor confirms patient is subscribed before prescribing |
| Medical assessment | BMI, current medications, full medical history, health goals |
| Lab results PDF (if applicable) | Doctor must review obesity panel before prescribing |
| ⚠️ Contraindication flags | System highlights if patient reported thyroid cancer (personal/family), pancreatitis, or is on insulin — doctor must review these before prescribing GLP-1 |

**Backend**: Obesity consultation must carry origin, subscription reference, full assessment data, and a flag system for contraindications.

**Frontend (doctor app)**: Consultation card must display source badge, subscription status, assessment summary, lab PDF link, and a red flag alert for any contraindications.

---

### GAP 3 — Admin Dashboard (Subscriber List, Prescription Status, Compliance)

**Problem**: There is no admin view for obesity subscribers, their drug prescriptions, or dispensing status.

**What we need**: Admin must see:
- All patients subscribed to an obesity package, with plan and subscription status.
- Per subscriber: consultations completed, prescription issued (Mounjaro or Ozempic, dose), dispensing status, source (lab / pharmacy / direct).
- Whether the obesity program link was sent after the lab consultation closed (✅/❌ with timestamp).
- Patients with prescriptions not yet routed to a pharmacy — highlighted for action.

**Backend**: Admin-accessible view of all obesity subscriptions with consultation and prescription history.

**Frontend (admin)**: Table with subscriber, plan, drug, dose, consultation count, pharmacy assignment status, and source.

---

### GAP 4 — Prescription Routing to GLP-1 Pharmacy

**Problem**: GLP-1 drugs (Mounjaro, Ozempic) require specific pharmacies with cold-chain storage. The prescription cannot go to any pharmacy — it must go to a registered GLP-1 partner.

**What we need**:

**Path A — Patient came from a pharmacy that dispenses GLP-1**: Doctor sends the prescription directly to that pharmacy. No admin involvement.

**Path B — Patient came from a lab or ads**: Admin selects from a list of Labass partner pharmacies registered for GLP-1 dispensing. Admin sees all prescriptions waiting for pharmacy assignment.

**Backend**: Flag specific pharmacies as "GLP-1 fulfillment partners". Allow admin to assign and send. Allow doctor to send directly to source pharmacy (Path A).

**Frontend — Doctor app (Path A)**: Show "أرسل الوصفة للصيدلية" action when consultation source is a GLP-1 pharmacy.

**Frontend — Admin (Path B)**: Show pending prescriptions with no pharmacy; allow admin to assign a partner and send.

---

### GAP 5 — Medical Assessment Stored and Visible to Doctor

**Problem**: The subscribe wizard collects height, weight, medical history, current medications, and health goals. This data is stored only in the browser and never reaches the backend or the doctor. For GLP-1 prescriptions, this data is clinically essential.

**What we need**: The doctor must see the full assessment when accepting the obesity consultation.

**Backend**: Store full assessment data from the obesity subscribe wizard against the patient's subscription record. Flag contraindications server-side.

**Frontend (subscribe)**: Submit full assessment to the backend at the confirmation step.

**Frontend (doctor app)**: Display all assessment fields in the consultation view, with red flags for contraindications.

---

### GAP 6 — Lab Test Before Prescription (Optional Flow)

**Problem**: Some ads or pharmacy customers may not have recent blood work. A doctor should not prescribe Mounjaro or Ozempic without knowing the patient's HbA1c, thyroid function, and metabolic markers.

**What we need**: When a doctor determines that blood tests are required before prescribing, they should be able to:
1. Refer the patient to a Labass partner lab for an obesity panel.
2. The lab uploads results, which auto-attach to the patient's obesity consultation.
3. The doctor is notified and completes the prescription in a follow-up.

**Backend**: Lab referral flow from within a consultation; auto-attach lab results to the linked subscription's consultation.

**Frontend (doctor app)**: "اطلب تحاليل" action in the consultation view that generates a lab referral.

---

### GAP 7 — Monthly Follow-Up Consultation on Renewal

**Problem**: When an obesity subscription renews, nothing happens. Ongoing GLP-1 therapy requires monthly medical monitoring — weight progress, side effects (nausea, vomiting, pancreatitis signs), dose titration.

**What we need**: On each monthly renewal:
1. A new follow-up consultation is automatically created.
2. The patient receives a WhatsApp prompt to enter the follow-up.
3. The doctor sees the weight at enrollment vs. today, drugs dispensed, and notes from previous consultations.

**Backend**: On renewal event: create a follow-up consultation. Attach historical context (initial weight, drug, dose history) to the consultation.

**Frontend (doctor app)**: Show weight trend and prescription history in follow-up consultations.

---

### GAP 8 — Auto-Send Obesity Link When Lab Consultation Closes

**Problem**: When a post-test lab consultation closes, the doctor is supposed to have sent the obesity program link. But there is no automated fallback if they forget.

**What we need**: Every time a post-test obesity consultation closes, the system automatically sends the patient the obesity program link via WhatsApp.

Message example: "بناءً على نتائج تحاليلك، طبيبك يرشّح لك برنامج إنقاص الوزن الطبي من لاباس — مونجارو و اوزمبيك بوصفة طبيب متخصص"

**Backend**: When an obesity post-test consultation closes, trigger auto-send of the obesity program link.

⚠️ Requires an approved WhatsApp message template with Meta before this can run.

---

### GAP 9 — SFDA / MOH Compliance for GLP-1 Dispensing

**Problem**: Mounjaro (tirzepatide) and Ozempic (semaglutide) are prescription-only medications in Saudi Arabia. Their dispensing via an e-prescription and delivery model must be explicitly reviewed for compliance.

**What we need**:
- Legal confirmation that e-prescriptions issued via a telemedicine platform are accepted for GLP-1 dispensing at partner pharmacies.
- Partner pharmacies must hold the required SFDA license and have cold-chain storage.
- The system must store prescription records in a format compliant with SFDA e-prescription standards.
- Confirm whether patient consent for GLP-1 self-injection must be documented digitally.

**This is a blocker for all prescription dispensing flows.**

---

## Business Deals Required

> These agreements must be in place before the technical flow can operate.

| # | Deal | Unlocks | Status Needed Before |
|---|------|---------|----------------------|
| 1 | **Lab subscription agreements — obesity panel** — Labs pay Labass for a consultation bundle specific to post-test obesity consultations (fasting glucose, HbA1c, TSH, lipid panel). Each obesity test result generates a consultation via the bundle. | 🔴 Lab customer flow | Sprint 1 |
| 2 | **GLP-1 pharmacy partner agreement** — Partner pharmacy must hold an SFDA license for Mounjaro and Ozempic, have cold-chain storage, and agree to same-city delivery. Labass admin sends prescriptions; pharmacy dispenses and ships. Must define: delivery SLA, revenue share or wholesale price, return policy for unused medication. **جدار (Jadar)** is the candidate first partner. | 🔴 All flows (Rx delivery) | Sprint 1 |
| 3 | **Mounjaro / Ozempic supplier agreement** — Direct agreement with the authorized distributor of tirzepatide (Eli Lilly / جدار) and semaglutide (Novo Nordisk) in Saudi Arabia. Ensures supply, pricing, and that the partner pharmacy can source the drugs reliably. | 🔴 All flows | Sprint 1 |
| 4 | **SFDA compliance review** — Legal and regulatory sign-off confirming that telemedicine-issued GLP-1 prescriptions are valid for dispensing by a pharmacy and home delivery under Saudi law. | 🔴 All flows — **hard blocker** | Before any prescription is dispensed |
| 5 | **Pharmacy referral agreement** — Pharmacies agree to use the Labass org portal to send consultations for customers asking for Mounjaro/Ozempic. Must clarify: bundle pricing, pharmacist training, whether the pharmacy also fulfills the prescription. | 🟡 Pharmacy flow | Sprint 2 |
| 6 | **WhatsApp Business template approvals** — Meta must approve two templates: `obesity_marketing_post_test` (sent when post-test closes) and `obesity_marketing_campaign` (bulk campaign to existing users). Approval takes 1–3 business days. | 🔴 GAP 8 (template 1) | Sprint 1 (template 1) |
