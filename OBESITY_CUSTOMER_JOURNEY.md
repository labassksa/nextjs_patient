# Obesity Program — Customer Journey (A to Z)

## Three Customer Types

> **Priority note**: The lab customer is the PRIMARY and highest-converting customer type, identical to the vitamins program. The lab customer arrives pre-qualified (already in a consultation with a doctor), making them the most likely to subscribe — whether the consultation is pre-test (before the obesity panel) or post-test (after results arrive). In both cases the customer receives the obesity program link. Pharmacy customers already intend to purchase Mounjaro or Ozempic — they simply need the prescription. Ads customers require the most education before converting.

| Priority | # | Type | Entry Point | Who Pays for Initial Consultation? |
|----------|---|------|-------------|-------------------------------------|
| 🔴 **PRIMARY** | 1 | **Lab Customer (Pre or Post-Test)** | Lab org portal (pre_test or post_test consultation — obesity panel) | Lab subscription bundle |
| 🟡 Secondary | 2 | **Pharmacy Referral** | Pharmacy org portal — customer asks for Mounjaro / Ozempic | Pharmacy bundle (standard consultation) |
| 🟢 Growth | 3 | **Ads Customer** | TikTok / Instagram / Snap → obesity program page | Self-pay (obesity subscription) |

---

## TYPE 1: Lab Customer (Pre or Post-Test) 🔴 PRIMARY

> **Note**: The obesity program link is sent to the customer in both cases — pre-test (doctor evaluates the patient before blood work and recommends the program) and post-test (doctor reviews obesity panel results and recommends Mounjaro or Ozempic). The lab sends whichever consultation type applies from the org portal.

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل المختبر لإجراء تحاليل السمنة (سكر، هرمونات الغدة الدرقية، دهون الدم، HbA1c)، أو للاستفسار قبل إجرائها</li>
<li>يحصل العميل على استشارة من لاباس — سواء قبل ظهور النتائج (pre-test) أو بعدها (post-test) — المختبر يرسلها من بوابة المنشأة</li>
<li>يدخل العميل الاستشارة عبر الرابط المرسل على واتساب</li>
<li>يراجع الدكتور حالة العميل (ويناقش النتائج إن وُجدت) — يشرح الدكتور برنامج السمنة ويرسل رابط الاشتراك للعميل داخل المحادثة</li>
<li><strong>(شرطي — عند الحاجة لتحاليل إضافية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب مباشرةً من تطبيق الدكتور — يُسجّل النظام تلقائياً: اسم المختبر، رقم جوال المدير، وقت الإرسال، رقم الاستشارة، واسم الدكتور</li>
<li><strong>(شرطي — تابع)</strong> يستلم مدير المختبر رسالة الواتساب — يجري تحاليل السمنة — ثم يدخل إلى تبويب "طلبات التحليل" في بوابة لاباس، يرفع ملف النتيجة PDF، ويضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من باقة المختبر ولا من باقة السمنة</strong></li>
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
| 2 | **Lab — org portal** | B2B | Opens the Labass org portal. Enters the patient's phone number. Selects *pre-test* or *post-test* consultation type (obesity panel). Uploads the lab results PDF if post-test. Submits. | <small>• Remaining bundle count decreases by 1</small> |
| 3 | **System → Customer** | Tech | Sends the patient a WhatsApp + SMS with a one-time consultation link. | <small>• Patient receives: link to enter the consultation chat</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Sees the new consultation in their feed and accepts it. | <small>• Patient name, phone, consultation type (pre-test or post-test), lab results PDF (if post-test)<br>• Source label: "من المختبر — [lab name]" *(to be built)*<br>• Whether patient already has an active obesity subscription *(to be built)*</small> |
| 6 | **Doctor ↔ Customer** | Medical | Reviews the lab results together. Assesses BMI, metabolic markers, and candidacy for GLP-1 therapy. Explains Mounjaro and Ozempic. Sends the obesity program subscription link inside the chat. | — |
| 6a *(conditional)* | **Doctor → Lab Manager** | Medical | If additional tests are needed (e.g., pre-test consultation with no panel yet): Doctor clicks "إرسال للمختبر" in the doctor app. Selects lab name + manager phone number. Submits. | <small>• Lab manager receives WhatsApp: patient name, patient phone, doctor's note (e.g., "يحتاج HbA1c + TSH + lipid panel")<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 6b *(conditional)* | **Lab Manager** | B2B | Receives the WhatsApp referral. Contacts the patient. Collects sample. Runs the obesity panel. Opens Labass org portal → "طلبات التحليل" tab. Finds the pending referral. Uploads PDF. Clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created automatically<br>• **NOT deducted** from the lab's bundle or the patient's obesity package<br>• Patient receives WhatsApp link to enter the consultation<br>• Referral log: status → completed</small> |
| 6c *(conditional)* | **Doctor** | Medical | Receives the post-test consultation in their feed. Reviews the obesity panel PDF. Can now safely assess GLP-1 candidacy and check for contraindications. | <small>• HbA1c, TSH, lipid panel results<br>• Referral source: which lab manager sent it, timestamp<br>• Any contraindication flags triggered by the results *(to be built)*</small> |
| 7 | **Doctor** | Medical | Closes the consultation. | — |
| 8 | **System → Customer** *(to be built)* | Marketing | The moment the lab consultation closes (whether pre-test or post-test), automatically sends the patient the obesity program link via WhatsApp as a fallback (in case the doctor forgot). | <small>• Post-test message: "بناءً على نتائج تحاليلك، قد تكون مؤهلاً لبرنامج إنقاص الوزن الطبي" + obesity page link<br>• Pre-test message: "طبيبك يرشّح لك برنامج إنقاص الوزن الطبي من لاباس" + obesity page link<br>• ⚠️ Requires Meta WhatsApp template approval</small> |
| 9 | **Customer** | Sales | Visits the obesity program page. Clicks "اشترك الآن". Fills in the medical assessment: name, phone, age, height, weight (BMI auto-calculated), city, health goals, current medications, medical history (diabetes, heart disease, thyroid, pancreatitis history). Selects a plan. Verifies phone via OTP. Pays via card or Apple Pay. | — |
| 10 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. Automatically creates a new obesity consultation and sends the customer a direct entry link. If WhatsApp delivery fails, falls back to SMS. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! ادخل استشارتك الآن" + direct consultation link<br>• Success page shows "ادخل استشارتك الآن" button</small> |
| 11 | **Customer** | Tech | Clicks the link and enters the new obesity consultation. | — |
| 12 | **Doctor** | Medical | Accepts the obesity consultation. | <small>• **Source** — lab name and consultation type (pre or post-test)<br>• **Subscription** — plan name, activation date<br>• **Medical assessment** — BMI, current meds, full medical history, health goals<br>• **Lab results** — original obesity panel PDF if post-test; shown as "not yet available" if pre-test *(to be built)*<br>• **Contraindication flags** — system highlights if patient reported thyroid cancer history, pancreatitis, or is on insulin *(to be built)*</small> |
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
<li><strong>(شرطي — عند الحاجة لتحاليل مخبرية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب من تطبيق الدكتور — يُسجّل النظام: اسم المختبر، رقم الجوال، وقت الإرسال، رقم الاستشارة</li>
<li><strong>(شرطي — تابع)</strong> يُجري المختبر تحاليل السمنة — يدخل مدير المختبر إلى تبويب "طلبات التحليل" في بوابة لاباس — يرفع ملف النتيجة PDF — يضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من الباقة</strong></li>
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
| 11a *(conditional)* | **Doctor → Lab Manager** | Medical | If blood work is needed before prescribing GLP-1: Doctor clicks "إرسال للمختبر". Enters lab name + manager phone + note (e.g., "يحتاج HbA1c + TSH + lipid panel"). Submits. | <small>• Lab manager receives WhatsApp: patient name, patient phone, doctor's note<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 11b *(conditional)* | **Lab Manager** | B2B | Receives the referral. Contacts the patient. Collects sample. Runs obesity panel. Opens Labass org portal → "طلبات التحليل" tab. Uploads PDF. Clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created — **NOT deducted from any package**<br>• Patient receives WhatsApp link<br>• Referral log: status → completed</small> |
| 11c *(conditional)* | **Doctor** | Medical | Receives the post-test consultation. Reviews HbA1c, TSH, and lipid results. Checks for GLP-1 contraindications. Can now prescribe safely. | — |
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
<li><strong>(شرطي — عند الحاجة لتحاليل مخبرية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب من تطبيق الدكتور — يُسجّل النظام: اسم المختبر، رقم الجوال، وقت الإرسال، رقم الاستشارة</li>
<li><strong>(شرطي — تابع)</strong> يُجري المختبر تحاليل السمنة — يدخل مدير المختبر إلى تبويب "طلبات التحليل" في بوابة لاباس — يرفع ملف النتيجة PDF — يضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من الباقة</strong></li>
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
| 6 | **Doctor ↔ Customer** | Medical | Reviews assessment. Checks for GLP-1 contraindications. If blood tests are needed, triggers a lab referral (see 6a–6c). Otherwise proceeds directly to prescription. | — |
| 6a *(conditional)* | **Doctor → Lab Manager** | Medical | Doctor clicks "إرسال للمختبر". Enters lab name + manager phone + required tests (HbA1c, TSH, lipid panel, CBC). Submits. | <small>• Lab manager receives WhatsApp: patient name, patient phone, doctor's note with required tests<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 6b *(conditional)* | **Lab Manager** | B2B | Receives the referral. Contacts the patient. Collects sample. Runs obesity panel. Opens Labass org portal → "طلبات التحليل" tab. Finds the referral. Uploads PDF. Clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created — **NOT deducted from any package**<br>• Patient receives WhatsApp link to enter the consultation<br>• Referral log: status → completed</small> |
| 6c *(conditional)* | **Doctor** | Medical | Receives the post-test consultation in their feed. Reviews the obesity panel. Confirms GLP-1 candidacy. Proceeds to prescription in the follow-up. | <small>• HbA1c, TSH, lipid panel, CBC results<br>• Any contraindication flags auto-highlighted *(to be built)*</small> |
| 7 | **Doctor → Patient** | Medical | Issues the GLP-1 prescription (Mounjaro or Ozempic) with dose and titration plan, meal plan, and exercise guidance. | <small>• Patient receives: prescription PDF + meal plan via WhatsApp</small> |
| 8 | **Admin** *(to be built)* | Ops | Opens the obesity subscriber dashboard. Finds this patient (no linked pharmacy). Selects a Labass partner pharmacy registered for GLP-1 dispensing. Sends the prescription. | <small>• All active subscribers (name, plan, **source: lab / pharmacy / direct**)<br>• Patients with no assigned pharmacy highlighted for action<br>• Pharmacy manager receives: prescription PDF via WhatsApp</small> |
| 9 | **Pharmacy Manager** | Ops | Receives the prescription. Verifies SFDA compliance. Dispenses Mounjaro or Ozempic. Ships with cold chain packaging. | — |

---

## What EXISTS Today

| Feature | Status |
|---------|--------|
| Lab creates pre_test or post_test consultation from org portal (bundle-based) | ✅ EXISTS |
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
| Org portal "طلبات التحليل" tab — referrals inbox, PDF upload, post-test creation | ✅ BUILT (awaiting backend) |

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

### GAP 6 — Doctor-Initiated Lab Referral & Free Post-Test Consultation

**Problem**: Pharmacy and ads customers have no lab results. A doctor must not prescribe GLP-1 drugs (Mounjaro, Ozempic) without HbA1c, TSH, and lipid panel data — missing results is a patient safety issue. Currently there is no in-platform way for the doctor to request blood work. The doctor calls the lab manually, and when the lab uploads results the post-test consultation incorrectly deducts from the package.

**What we need**:
1. **Doctor app**: "إرسال للمختبر" button inside any obesity consultation. Doctor enters lab name + manager phone + required tests. System sends a WhatsApp to the lab manager with patient info and logs the referral.
2. **System log**: Every referral records: `lab_referral_id`, `lab_name`, `lab_manager_phone`, `sent_at`, `consultation_id`, `patient_id`, `doctor_name`, `required_tests`, `status`.
3. **Org portal — "طلبات التحليل" tab**: Lab manager sees incoming referrals. Uploads the obesity panel PDF. Clicks "إرسال الاستشارة للدكتور". System creates the post-test consultation.
4. **Free post-test consultation**: The consultation created from a referral (`/consultations/create-from-referral`, `freeConsultation = true`) is **not deducted** from the lab's bundle or the patient's obesity package.
5. **Doctor receives** the post-test consultation as a normal consultation in their feed — with the lab results PDF and any auto-triggered contraindication flags.

**Backend**:
- `POST /lab-referrals` — doctor creates a referral (sends WhatsApp to lab manager, logs entry).
- `GET /lab-referrals` — lab portal fetches its incoming referrals.
- `POST /consultations/create-from-referral` — creates a post_test consultation with `freeConsultation = true`, links it to the referral, marks referral as completed.

**Frontend (doctor app)**: Add "إرسال للمختبر" button in the obesity consultation view with a field for required tests.

**Frontend (org portal)**: "طلبات التحليل" tab — referrals inbox, PDF upload, post-test creation *(awaiting backend endpoints)*.

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

### GAP 8 — Auto-Send Obesity Link When Lab Consultation Closes (Pre or Post-Test)

**Problem**: When a lab consultation closes (whether pre-test or post-test), the doctor is supposed to have sent the obesity program link. But there is no automated fallback if they forget.

**What we need**: Every time a lab consultation closes — regardless of type — the system automatically sends the patient the obesity program link via WhatsApp.

- Post-test message: "بناءً على نتائج تحاليلك، طبيبك يرشّح لك برنامج إنقاص الوزن الطبي من لاباس — مونجارو و اوزمبيك بوصفة طبيب متخصص"
- Pre-test message: "طبيبك يرشّح لك برنامج إنقاص الوزن الطبي من لاباس — ابدأ بالتقييم الطبي الآن"

**Backend**: When any lab consultation (pre or post-test) closes, trigger auto-send of the obesity program link.

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
