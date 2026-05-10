# Sexual Health Program — Customer Journey (A to Z)

## Customer Types

> **Phase 1** is exclusively for the **Lab Customer (Post-Test)** — the customer who already has existing hormone or testosterone results. The doctor reviews them and prescribes without ordering new lab work. **Phase 2** will bundle a lab test into the package for customers who arrive without results. Pharmacy referral and ads customers are currently served through consultation-only flows — these are **not Phase 1**; they are independent customer types in the current build.

> **Priority note**: Two customer types are equally **PRIMARY** for the sexual health program: (1) the **post-test lab customer** whose results reveal sexual health indicators — the doctor can identify this from any panel (hormones, testosterone, obesity, general checkup) and proactively offer the program; and (2) the **pharmacy referral customer** who visits asking about sexual health medications (sildenafil, tadalafil) — very high-intent. Ads customers require more trust-building and are a growth channel.

<div style="margin:1.5em 0; overflow-x:auto">
<table style="width:100%; border-collapse:collapse; font-size:0.8em; font-family:inherit">
<thead>
<tr style="background:#173404; color:#fff">
<th style="padding:8px 12px; text-align:left">Priority</th>
<th style="padding:8px 12px; text-align:left">#</th>
<th style="padding:8px 12px; text-align:left">Customer Type</th>
<th style="padding:8px 12px; text-align:left; white-space:nowrap">Phase</th>
<th style="padding:8px 12px; text-align:left">Entry Point</th>
<th style="padding:8px 12px; text-align:left">Who Pays (Initial Consult)</th>
</tr>
</thead>
<tbody>
<tr style="background:#eaf3de">
<td style="padding:7px 12px; font-weight:700; color:#173404">Primary</td>
<td style="padding:7px 12px">1</td>
<td style="padding:7px 12px"><strong>Lab Customer (Post-Test)</strong></td>
<td style="padding:7px 12px; white-space:nowrap">Phase 1 ✅</td>
<td style="padding:7px 12px">Lab org portal — patient brings existing hormone / testosterone results, no new test ordered</td>
<td style="padding:7px 12px">Lab subscription bundle</td>
</tr>
<tr style="background:#eaf3de">
<td style="padding:7px 12px; font-weight:700; color:#173404">Primary</td>
<td style="padding:7px 12px">2</td>
<td style="padding:7px 12px"><strong>Pharmacy Referral — No Lab Test</strong></td>
<td style="padding:7px 12px; white-space:nowrap">Current ✅</td>
<td style="padding:7px 12px">Pharmacy org portal — customer asks about sildenafil / tadalafil (consultation-only)</td>
<td style="padding:7px 12px">Pharmacy bundle (standard consultation)</td>
</tr>
<tr style="background:#fff8e8">
<td style="padding:7px 12px; font-weight:700; color:#7a5500">Secondary</td>
<td style="padding:7px 12px">3</td>
<td style="padding:7px 12px"><strong>Pharmacy Referral — With Lab Test</strong></td>
<td style="padding:7px 12px; white-space:nowrap">Phase 2 🚧</td>
<td style="padding:7px 12px">Pharmacy org portal → doctor orders hormone / testosterone panel within package</td>
<td style="padding:7px 12px">Package pricing (Phase 2)</td>
</tr>
<tr style="background:#f0faf5">
<td style="padding:7px 12px; font-weight:700; color:#1a6640">Growth</td>
<td style="padding:7px 12px">4</td>
<td style="padding:7px 12px"><strong>Ads Customer</strong></td>
<td style="padding:7px 12px; white-space:nowrap">Current ✅</td>
<td style="padding:7px 12px">TikTok / Instagram / Snap → sexual health page</td>
<td style="padding:7px 12px">Self-pay (sexual health subscription)</td>
</tr>
</tbody>
</table>
</div>

---

## TYPE 1 🔴 PRIMARY (Phase 1 ✅): Patient Visits Lab → Gets Post-Test Consultation → Doctor Identifies Sexual Health Indicators → Discreetly Offers Program

> **Note**: The primary flow is **post-test** — the doctor reviews hormone or testosterone panel results and identifies sexual health indicators. The doctor can also identify this from any lab panel (obesity, general checkup) and proactively offer the program discreetly.
>
> ⚠️ **Phase 1**: The package does **NOT** include ordering a new lab test. The customer visits the lab independently and arrives with their existing results. Steps 6a/6b/6c below (doctor ordering additional tests from within the app) are a **Phase 2** feature — not yet implemented.

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل المختبر لإجراء تحاليل (هرمونات، تستوستيرون، أو فحص عام)</li>
<li>يحصل العميل على استشارة من لاباس — سواء قبل ظهور النتائج (pre-test) أو بعدها (post-test) — المختبر يرسلها من بوابة المنشأة</li>
<li>يدخل العميل الاستشارة عبر الرابط المرسل على واتساب</li>
<li>يراجع الدكتور نتائج التحاليل — إذا كشفت النتائج عن مؤشرات لمشكلة صحة جنسية، يشرح الدكتور البرنامج بسرية تامة ويرسل رابط الاشتراك للعميل داخل المحادثة</li>
<li><strong>(شرطي — عند الحاجة لتحاليل إضافية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب مباشرةً من تطبيق الدكتور — يُسجّل النظام تلقائياً: اسم المختبر، رقم جوال المدير، وقت الإرسال، رقم الاستشارة، واسم الدكتور</li>
<li><strong>(شرطي — تابع)</strong> يستلم مدير المختبر رسالة الواتساب — يجري التحليل — ثم يدخل إلى تبويب "طلبات التحليل" في بوابة لاباس، يرفع ملف النتيجة PDF، ويضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من باقة المختبر ولا من باقة الصحة الجنسية</strong></li>
<li>يدخل العميل إلى صفحة البرنامج، يكمل استبيان سري، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن رابطًا للدخول مباشرة إلى استشارة جديدة — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة الجديدة مباشرة عبر الرابط (ليست الاستشارة الأصلية مع المختبر) — <em>(مشترك)</em></li>
<li><strong>(للدكتور)</strong> يقبل الدكتور الاستشارة ويرى: مصدر العميل، الباقة المفعّلة، إجابات الاستبيان السري، ونتائج التحاليل الأصلية — <em>(مشترك)</em></li>
<li>يُصدر الدكتور وصفة طبية مخصصة — <em>(مشترك)</em></li>
<li><strong>(للأدمن)</strong> يتحقق الأدمن من إرسال الرابط للعميل، ويختار الصيدلية الشريكة ويرسل الوصفة إليها بشكل سري</li>
<li>تصل الوصفة مباشرة لمدير الصيدلية، والتوصيل يتم بشكل سري — <em>(مشترك)</em></li>
</ol>
</div>

<div style="page-break-before: always;"></div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Visits the lab for blood work (hormones, testosterone, general panel). | — |
| 2 | **Lab — org portal** | B2B | Opens the Labass org portal. Enters the patient's phone number. Selects *pre-test* or *post-test* consultation type. Uploads results PDF if post-test. Submits. | <small>• Remaining bundle count decreases by 1</small> |
| 3 | **System → Customer** | Tech | Sends the patient a WhatsApp + SMS with a one-time consultation link. | <small>• Patient receives: link to enter the consultation chat</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Sees the new consultation in their feed and accepts it. | <small>• Patient name, phone, consultation type, results PDF (if post-test)<br>• Source label: "من المختبر — [lab name]"<br>• Whether patient already has an active sexual health subscription</small> |
| 6 | **Doctor ↔ Customer** | Medical | Reviews results privately. Identifies sexual health indicators. Recommends the sexual health program with discretion. | — |
| 6a *(🚧 Phase 2 — not in current build)* | **Doctor → Lab Manager** | Medical | If additional tests are needed: Doctor clicks "إرسال للمختبر" in the doctor app. Selects the lab and enters the lab manager's phone. Submits. | <small>• Lab manager receives WhatsApp: patient name, phone, doctor's note<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 6b *(🚧 Phase 2 — not in current build)* | **Lab Manager** | B2B | Receives referral. Runs the test. Opens "طلبات التحليل" tab → uploads PDF → clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created<br>• **NOT deducted** from any bundle — free post-test consultation</small> |
| 6c *(🚧 Phase 2 — not in current build)* | **Doctor** | Medical | Receives the post-test consultation. Reviews the additional lab results. | — |
| 7 | **Doctor** | Medical | Closes the consultation. System sends the patient the sexual health program link. | — |
| 8 | **System → Customer** | Marketing | Automatically sends the patient the program link via WhatsApp after consultation closes. | <small>• "بناءً على نتائجك، قد يساعدك برنامج الصحة الجنسية" + program link (discreet wording)</small> |
| 9 | **Customer** | Sales | Visits the sexual health page. Fills out the confidential intake form. Selects a plan. Pays. | — |
| 10 | **System** | Tech | Payment confirmed. Subscription activated. Creates new consultation and sends entry link. | <small>• Patient receives discreet WhatsApp: "تم الاشتراك — ادخل استشارتك" + link</small> |
| 11 | **Doctor** | Medical | Accepts the sexual health consultation. Reviews source, subscription plan, intake answers, and original lab results. Issues prescription. | — |
| 12 | **Admin** | Ops | Assigns to a partner pharmacy. Sends prescription discreetly. | — |
| 13 | **Pharmacy** | Ops | Dispenses and ships discreetly. | — |

---

## TYPE 2 🔴 PRIMARY (Current ✅): Customer Visits Pharmacy Asking for Sildenafil/Tadalafil → Pharmacy Refers to Labass → Doctor Prescribes Discreetly (No Lab Test)

> This flow is **consultation-only**. No lab test is ordered or included. The doctor assesses the patient through a confidential intake form and a discreet verbal consultation — then prescribes based on symptoms and health history only. Lab testing within the pharmacy referral flow is a **Phase 2** feature — see TYPE 3 below.

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل الصيدلية يسأل عن دواء للصحة الجنسية</li>
<li>الصيدلية ترسل استشارة صحة جنسية سرية من بوابة المنشأة (لا تُخصم من باقة الصيدلية)</li>
<li>يحصل العميل على رابط الاستشارة عبر واتساب</li>
<li>يدخل العميل الاستشارة بسرية، ويكمل الاستبيان السري</li>
<li>يقوم الدكتور بمراجعة الحالة وإصدار وصفة طبية، ويرسل رابط صفحة البرنامج للعميل — <strong>لا يوجد تحليل مخبري في هذه المرحلة</strong></li>
<li>يدخل العميل إلى الصفحة، يكمل التسجيل، ثم إتمام الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد الاشتراك مع رابط استشارة جديدة — <em>(مشترك)</em></li>
<li>يدخل العميل الاستشارة الجديدة المرتبطة بالباقة — <em>(مشترك)</em></li>
<li>يُصدر الدكتور الوصفة الطبية المخصصة بناءً على الأعراض والاستبيان السري — <em>(مشترك)</em></li>
<li>يرسل الدكتور الوصفة مباشرة لتلك الصيدلية المصدر</li>
<li>ترسل الوصفة لمدير الصيدلية — التوصيل يتم بشكل سري — <em>(مشترك)</em></li>
</ol>
</div>

<div style="page-break-before: always;"></div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Visits pharmacy asking about sexual health medication. | — |
| 2 | **Pharmacy — org portal** | B2B | Opens Labass portal. Enters patient phone number. Selects sexual health consultation type. Submits. | <small>• NOT deducted from bundle — free referral consultation</small> |
| 3 | **System → Customer** | Tech | Sends discreet WhatsApp + SMS with one-time consultation link. | — |
| 4–9 | **Doctor ↔ Customer** | Medical | Discreet consultation. Intake form review. Prescription issued based on symptoms only — **no lab test**. Program link sent to customer. | — |
| 10–13 | **Subscription flow** | Sales + Medical | Same as TYPE 1 steps 9–13. | — |

---

## TYPE 3 🔮 Phase 2: Pharmacy Refers Patient → Doctor Orders Hormone/Testosterone Panel Within Package → Prescribes Based on Results — Not Yet Built

> 🚧 **Phase 2 — Not yet implemented.** In this future flow, the doctor will be able to order a hormone or testosterone panel as part of the sexual health subscription. The lab collects the sample discreetly (home collection), runs the panel, and uploads results to Labass. The doctor reviews findings and prescribes with clinical confidence. **No implementation date set.**

| What changes in Phase 2 | Details |
|------------------------|---------|
| Package price increases to cover lab test | Hormone/testosterone panel cost bundled into subscription pricing |
| Doctor orders test from within the consultation | Requires "إرسال للمختبر" feature in doctor app — discreet patient communication |
| Lab uploads results to Labass org portal | Via "طلبات التحليل" tab (built, awaiting backend) |
| Doctor receives free post-test consultation | Not deducted from any package |
| Prescription refined based on actual hormone levels | Higher clinical accuracy, especially for testosterone-based treatments |

---

## TYPE 4 🟢 (Current ✅): Customer Finds Ad (TikTok/Instagram) → Subscribes Directly → Doctor Prescribes Based on Confidential Intake Form (No Lab Test)

> This flow is **consultation-only**. No blood test is ordered or included.

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يرى العميل إعلاناً (تيك توك / إنستغرام / سناب) ويضغط عليه</li>
<li>يصل إلى صفحة الصحة الجنسية ويكمل استبيان سري</li>
<li>يُكمل عملية الدفع والاشتراك</li>
<li>تصل إلى العميل رسالة تؤكد الاشتراك مع رابط استشارة جديدة — <em>(مشترك)</em></li>
<li>يدخل الاستشارة ويتواصل مع الدكتور — <strong>لا يوجد تحليل مخبري في هذه المرحلة</strong> — <em>(مشترك)</em></li>
<li>يُصدر الدكتور الوصفة الطبية بناءً على الأعراض والاستبيان — <em>(مشترك)</em></li>
<li>يتحقق الأدمن ويرسل الوصفة للصيدلية الشريكة — التوصيل سري — <em>(مشترك)</em></li>
</ol>
</div>

---

## GAPS — What Needs to Be Built

| # | Gap | Who is blocked | Severity | Notes |
|---|-----|----------------|----------|-------|
| 1 | Source label in doctor app ("من الصيدلية — [name]" or "من المختبر — [name]") | Doctor, Admin | 🔴 High | Affects prescription routing (pharmacy source → send Rx back to that pharmacy) |
| 2 | Active subscription check — if patient already subscribed, show badge in doctor consultation | Doctor | 🟡 Medium | Prevents duplicate subscriptions |
| 3 | Automatic program link sent after consultation closes | System → Customer | 🔴 High | Core conversion mechanism |
| 4 | Discreet consultation type in org portal — pharmacy selects "sexual health" | Pharmacy | 🔴 High | Needed for pharmacy referral flow |
| 5 | Lab referral feature — doctor sends to lab manager, lab uploads, free post-test consultation | Doctor, Lab Manager | 🟡 Medium | Backend: `POST /lab-referrals`, `POST /consultations/create-from-referral` |
| 6 | Discreet packaging and delivery confirmation | Admin, Pharmacy | 🟡 Medium | Labass sends prescription noting discreet delivery required |
| 7 | Admin dashboard: subscriber list with source, plan, consultation status, prescription status | Admin | 🟡 Medium | Same dashboard as vitamins/obesity — filter by program type |

---

## What Currently EXISTS for Sexual Health

| Component | Status | Notes |
|-----------|--------|-------|
| `/sexualHealth` landing page | ✅ BUILT | Full marketing page with packages and pricing |
| Patient consultation flow (WhatsApp link → chat) | ✅ BUILT | General consultation flow — works for sexual health |
| Org portal — pharmacy consultation send | ✅ BUILT | `createBundleConsultation` with free consultation override |
| Org portal — lab consultation send (pre/post-test) | ✅ BUILT | Same as vitamins/obesity |
| Source label in doctor app | ❌ NOT BUILT | |
| Automatic program link on consultation close | ❌ NOT BUILT | |
| Lab referral tab in org portal | ❌ NOT BUILT (awaiting backend) | |
| Admin subscriber dashboard | ❌ NOT BUILT | |
