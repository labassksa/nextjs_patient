# General Consultation Package — Customer Journey (A to Z)

## Customer Type

> **Primary Customer**: Customer visits a pharmacy — or contacts the pharmacy remotely. The pharmacy sends a consultation from their subscription bundle via the Labass org portal, or sends the patient a direct online consultation link. The consultation is free to the patient; it is charged against the pharmacy's bundle.

<div style="margin:1.5em 0; overflow-x:auto">
<table style="width:100%; border-collapse:collapse; font-size:0.8em; font-family:inherit">
<thead>
<tr style="background:#0F766E; color:#fff">
<th style="padding:8px 12px; text-align:left">Priority</th>
<th style="padding:8px 12px; text-align:left">Customer Type</th>
<th style="padding:8px 12px; text-align:left; white-space:nowrap">Phase</th>
<th style="padding:8px 12px; text-align:left">Entry Point</th>
<th style="padding:8px 12px; text-align:left">Who Pays</th>
</tr>
</thead>
<tbody>
<tr style="background:#e6f7f6">
<td style="padding:7px 12px; font-weight:700; color:#0F766E">Primary</td>
<td style="padding:7px 12px"><strong>Pharmacy Customer</strong></td>
<td style="padding:7px 12px; white-space:nowrap">Current ✅</td>
<td style="padding:7px 12px">Customer visits pharmacy → pharmacy sends consultation from their bundle (org portal) OR sends patient a direct online consultation link</td>
<td style="padding:7px 12px">Pharmacy (from their bundle); patient self-pays only if they choose to subscribe</td>
</tr>
</tbody>
</table>
</div>

---

## Subscription Details — What Each Role Sees

### 🧑 Patient (User)

After subscribing, the patient sees in their Labass app:

| Field | Details |
|-------|---------|
| **Package Name** | الباقة العامة |
| **Plan** | شهري (٩٩ ريال) / كل ٣ أشهر (٢٤٩ ريال) |
| **Subscription Start** | Date of successful payment |
| **Subscription End / Renewal** | 1 month or 3 months from start date |
| **Consultations Used** | Running count within the active period |
| **Start a Consultation** | "ابدأ استشارة" button — available anytime |
| **Prescription History** | List of prescriptions issued under this subscription |
| **Re-prescription** | Doctor renews chronic medication on consultation close |
| **Cancel Anytime** | "إلغاء الاشتراك" — no fees, access continues until period ends |

---

### 👨‍⚕️ Doctor

When a patient enters a consultation (from pharmacy referral or as a subscriber), the doctor sees:

| Field | Details |
|-------|---------|
| **Source Badge** | 🔵 "من الصيدلية — [pharmacy name]" for pharmacy-referred consultations |
| **Subscription Badge** | 🟢 "مشترك — الباقة العامة" if patient has an active subscription |
| **Plan Type** | شهري / كل ٣ أشهر |
| **Status** | نشط (Active) / منتهي (Expired) |
| **Previous Consultations** | Full list of past consultations with this patient (date, chief complaint, prescription) |
| **Current Medications** | Medications declared by the patient |
| **Chronic Conditions** | Declared conditions from intake form |
| **City** | To route prescription to the source pharmacy |
| **Re-prescription Action** | Doctor issues prescription directly inside the chat — sent to patient and pharmacy via WhatsApp |

---

### 🖥️ Admin

The admin dashboard shows all consultations and subscribers:

| Field | Details |
|-------|---------|
| **Consultation Source** | Pharmacy name, pharmacist ID, timestamp |
| **Patient Name & Phone** | As entered by the pharmacist in the org portal |
| **Doctor** | Who conducted the consultation |
| **Prescription Issued** | Yes / No, with link to prescription PDF |
| **Converted to Subscriber** | Whether the patient subscribed after the consultation |
| **Subscriber Name** | Full name entered during signup |
| **Plan** | Monthly / Quarterly |
| **Subscription Start / End** | Dates |
| **Status** | Active / Expired / Cancelled |
| **Consultations Used** | Total in current period |
| **Payment Status** | Paid / Pending / Failed |
| **Revenue** | Total paid by this subscriber (lifetime) |
| **Actions** | Cancel subscription, issue refund, extend period, view consultation history |

---

## Customer Journey — Pharmacy Customer (Primary)

> The customer comes to the pharmacy physically or contacts them remotely (call, WhatsApp). The pharmacist opens the Labass org portal and sends a general consultation from the pharmacy's bundle. Two sub-flows:
>
> **Sub-flow A** — Customer is physically at the pharmacy. Pharmacist sends the consultation on the spot.
>
> **Sub-flow B** — Customer contacts pharmacy remotely. Pharmacy sends a direct online consultation link.

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل الصيدلية أو يتواصل معها عن بُعد (مكالمة، واتساب)</li>
<li>الصيدلاني يفتح بوابة لاباس للمنشأة — يُدخل رقم جوّال العميل — يختار "استشارة عامة" — يضغط إرسال</li>
<li>الاستشارة تُخصم من باقة الصيدلية تلقائياً — يظهر للصيدلاني عدد الاستشارات المتبقية</li>
<li>يصل إلى العميل رابط الاستشارة على واتساب: <em>"صيدلية [اسم الصيدلية] ترسل لك استشارة طبية مجانية من لاباس"</em></li>
<li>يضغط العميل على الرابط ويدخل محادثة الاستشارة</li>
<li>يقبل الدكتور الاستشارة — يرى اسم العميل، اسم الصيدلية، شارة المصدر، والاستشارات السابقة</li>
<li>يجري الدكتور الاستشارة — يناقش الحالة، يُقيّم الأعراض، يراجع الأدوية الحالية</li>
<li>يُصدر الدكتور وصفة طبية إلكترونية ويغلق الاستشارة</li>
<li>تُرسَل الوصفة للعميل عبر واتساب — وتُرسَل نسخة مباشرة لمدير الصيدلية المصدر</li>
<li>إذا رأى الدكتور أن العميل يحتاج متابعة مستمرة، يرسل له رابط الباقة العامة داخل المحادثة</li>
<li>يضغط العميل على الرابط ويشترك — تُفعَّل الباقة ويُربط المصدر بالصيدلية للوصفات المستقبلية</li>
</ol>
</div>

<div style="page-break-before: always;"></div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Visits pharmacy (in person or remotely). Presents medical need — medication renewal, chronic condition check, prescription request. | — |
| 2 | **Pharmacist — org portal** | B2B | Opens the Labass org portal. Enters patient's phone number. Selects "استشارة عامة". Clicks send. | <small>• Consultation deducted from pharmacy's bundle automatically<br>• Remaining bundle count shown<br>• Source auto-tagged: pharmacy name + pharmacist ID</small> |
| 3 | **System → Customer** | Tech | Sends patient a WhatsApp consultation link immediately. | <small>• Message: "صيدلية [اسم الصيدلية] ترسل لك استشارة طبية من لاباس — اضغط هنا للبدء" + link<br>• Link expires after 24 hours if unused</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Sees the consultation in their feed. Accepts it. | <small>• 🔵 Source badge: "من الصيدلية — [pharmacy name]"<br>• Consultation type: استشارة عامة<br>• Any previous consultations with this patient</small> |
| 6 | **Doctor ↔ Customer** | Medical | Conducts consultation. Discusses chief complaint, current medications, chronic conditions. Assesses clinical need. | — |
| 7 | **Doctor** | Medical | Issues electronic prescription. Closes consultation. | <small>• Patient receives: prescription PDF via WhatsApp<br>• **Pharmacy manager** receives: same prescription PDF via WhatsApp (routed to source pharmacy automatically)</small> |
| 8 | **Doctor** *(optional)* | Medical | If ongoing care is needed: sends the general package subscription link inside the chat. | <small>• Doctor shares `/generalPackage` link in chat<br>• "أنصحك بالاشتراك في الباقة العامة للمتابعة المستمرة"</small> |
| 9 | **Customer** *(optional)* | Sales | Clicks the general package link. Subscribes (plan → info → OTP → pay). | — |
| 10 | **System** *(optional)* | Tech | Subscription activated. Source linked to pharmacy. Future prescriptions continue routing to source pharmacy. | <small>• Subscription source = pharmacy [name]<br>• 🟢 "مشترك — الباقة العامة" badge on all future consultations</small> |
| 11 | **Admin** | Ops | Sees consultation in dashboard. If patient subscribed, sees new subscriber row. | <small>• Consultation: pharmacy name, patient phone, doctor, prescription issued, timestamp<br>• Subscriber (if converted): name, plan, source=pharmacy, start/end date, consultations used</small> |

---

## Subscription Lifecycle

```
Pharmacy Consultation → Doctor Recommends Package → Patient Subscribes
         ↓
  Active Subscription → Consultation anytime → Prescription → Source Pharmacy
         ↓
  Renewal Reminder (7 days before) → Renew or Cancel
```

| Stage | Patient | Doctor | Admin |
|-------|---------|--------|-------|
| **Pharmacy consultation** | WhatsApp link → chat → prescription | Source badge, prescription issued | Consultation logged, pharmacy attributed |
| **Just subscribed** | Confirmation WhatsApp + consultation link | — | New subscriber row |
| **Active** | "ابدأ استشارة" anytime | Subscription badge + full context | Consultations count increments |
| **7 days before expiry** | Renewal reminder WhatsApp | — | Upcoming expiry flagged |
| **Expired** | "جدّد اشتراكك" prompt | Expired badge | Status = Expired |
| **Cancelled** | Access until end of period | — | Cancellation date logged |
| **Renewed** | Seamless — new period starts | No change | Renewal recorded, new end date |
