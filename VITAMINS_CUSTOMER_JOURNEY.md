# Vitamins Package — Customer Journey (A to Z)

## Three Customer Types

> **Priority note**: The lab customer is the PRIMARY and highest-converting customer type. Every part of the build should serve this flow first. The lab customer arrives pre-qualified (already in a consultation with a doctor), making them the most likely to subscribe — whether the consultation is pre-test (before results) or post-test (after results). In both cases the customer receives the vitamins package link. Pharmacy and ads customers are secondary channels built on top of the same infrastructure.

| Priority | # | Type | Entry Point | Who Pays for Initial Consultation? |
|----------|---|------|-------------|-------------------------------------|
| 🔴 **PRIMARY** | 1 | **Lab Customer (Pre or Post-Test)** | Lab org portal (pre_test or post_test consultation) | Lab subscription bundle |
| 🟡 Secondary | 2 | **Pharmacy Referral** | Pharmacy org portal (free vitamins consultation) | Free — not counted on pharmacy subscription |
| 🟢 Growth | 3 | **Ads Customer** | TikTok / Instagram / Snap → landing page | Self-pay (vitamins subscription) |

---

## TYPE 1: Lab Customer (Pre or Post-Test) 🔴 PRIMARY

> **Note**: The vitamins package link is sent to the customer in both cases — pre-test (before results, doctor recommends vitamins proactively) and post-test (after results, doctor reviews findings and recommends a program). The lab sends whichever consultation type applies from the org portal.

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل المختبر لإجراء التحاليل، أو للاستفسار قبل إجرائها</li>
<li>يحصل العميل على استشارة من لاباس سواء كانت قبل ظهور النتائج (pre-test) أو بعدها (post-test) — المختبر يرسلها من بوابة المنشأة</li>
<li>يدخل العميل الاستشارة عبر الرابط المرسل على واتساب</li>
<li>يراجع الدكتور حالة العميل الصحية (ويناقش النتائج إن وُجدت) — عند إغلاق الاستشارة يرسل النظام تلقائياً رابط صفحة الفيتامينات إلى العميل</li>
<li><strong>(شرطي — عند الحاجة لتحاليل إضافية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب مباشرةً من تطبيق الدكتور — يُسجّل النظام تلقائياً: اسم المختبر، رقم جوال المدير، وقت الإرسال، رقم الاستشارة، واسم الدكتور</li>
<li><strong>(شرطي — تابع)</strong> يستلم مدير المختبر رسالة الواتساب — يجري التحليل — ثم يدخل إلى تبويب "طلبات التحليل" في بوابة لاباس، يرفع ملف النتيجة PDF، ويضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من باقة المختبر ولا من باقة الفيتامينات</strong></li>
<li>يدخل العميل إلى الصفحة، ويقوم بتعبئة المعلومات المطلوبة، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن رابطًا للدخول مباشرة إلى استشارة فيتامينات جديدة — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة الجديدة مباشرة عبر الرابط (ليست الاستشارة الأصلية مع المختبر) — <em>(مشترك)</em></li>
<li><strong>(للأدمن)</strong> تظهر قائمة بجميع المشتركين مع الباقات والاستشارات المنفذة، ويظهر مصدر كل عميل (مختبر / صيدلية / اشتراك مباشر) — بسبب الاتفاقيات مع الشركاء لإعادة عملائهم إليهم — <em>(مشترك)</em></li>
<li><strong>(للدكتور)</strong> يقبل الدكتور الاستشارة ويرى: مصدر العميل، الباقة المفعّلة، إجابات الاستبيان، ونتائج التحاليل الأصلية — تظهر للدكتور حتى لو رفع تحليل المريض في الاستشارة السابقة (post test lab consultation) — <em>(مشترك)</em></li>
<li>يُصدر الدكتور وصفة طبية مخصّصة بناءً على كل المعلومات — <em>(مشترك)</em></li>
<li><strong>(للأدمن)</strong> يتحقق الأدمن من إرسال الرابط للعميل، ويختار الصيدلية الشريكة ويرسل الوصفة إليها</li>
<li>تصل الوصفة مباشرة لمدير الصيدلية — <em>(مشترك)</em></li>
</ol>
</div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Visits the lab and does a blood test. | — |
| 2 | **Lab — org portal** | B2B | Opens the Labass org portal. Enters the patient's phone number. Selects *pre-test* or *post-test* consultation type. Uploads the lab results PDF if post-test. Submits. | <small>• Remaining bundle count decreases by 1</small> |
| 3 | **System → Customer** | Tech | Sends the patient a WhatsApp + SMS with a one-time consultation link. | <small>• Patient receives: link to enter the consultation chat</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Sees the new consultation in their feed and accepts it. | <small>• Patient name, phone, consultation type (pre-test or post-test), lab results PDF (if post-test)<br>• Source label: "من المختبر — [lab name]" *(to be built)*<br>• Whether patient already has an active vitamins subscription *(to be built)*</small> |
| 6 | **Doctor ↔ Customer** | Medical | Reviews the lab results together. Discusses findings and health status. Recommends a vitamins program. | — |
| 6a *(conditional)* | **Doctor → Lab Manager** | Medical | If additional lab tests are needed: Doctor clicks "إرسال للمختبر" in the doctor app. Selects the lab and enters the lab manager's phone number. Submits. | <small>• Lab manager receives WhatsApp: patient name, patient phone, doctor's note<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 6b *(conditional)* | **Lab Manager** | B2B | Receives the WhatsApp referral. Contacts the patient. Collects blood sample. Runs the tests. Opens the Labass org portal → "طلبات التحليل" tab. Finds the pending referral. Uploads the lab results PDF. Clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created automatically<br>• **NOT deducted** from the lab's bundle or the vitamins package — it is a free post-test consultation<br>• Patient receives WhatsApp link to enter the consultation<br>• Referral log updated: status → completed, postTestConsultationId recorded</small> |
| 6c *(conditional)* | **Doctor** | Medical | Receives the post-test consultation in their feed (same as a normal consultation). Reviews the uploaded lab results PDF. | <small>• Lab results PDF from this referral<br>• Referral source: which lab manager sent it, when<br>• Linked to the original consultation (the pre-test one)</small> |
| 7 | **Doctor** | Medical | Closes the consultation. | — |
| 8 | **System → Customer** | Marketing | The moment the lab consultation closes (whether pre-test or post-test), automatically sends the patient the vitamins package link via WhatsApp. | <small>• Post-test message: "بناءً على نتائج تحاليلك، قد تحتاج لبرنامج فيتامينات مخصّص" + vitamins page link<br>• Pre-test message: "طبيبك يرشّح لك برنامج فيتامينات مخصّص من لاباس" + vitamins page link<br>• ⚠️ Requires Meta WhatsApp template approval</small> |
| 9 | **Customer** | Sales | Visits the vitamins page. Clicks "اشترك الآن". Fills in: name, phone, age, height, weight, city, health goals. Selects a plan (289 SAR/month or 779 SAR/quarter). Verifies phone via OTP. Pays via card or Apple Pay. | — |
| 10 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. Automatically creates a new vitamins consultation and sends the customer a direct entry link (counted against the vitamins subscription, not the lab's bundle). If WhatsApp delivery fails, falls back to SMS. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! ادخل استشارتك الآن" + direct consultation link<br>• Success page shows "ادخل استشارتك الآن" button (replaces current "سيتواصل معك فريقنا")</small> |
| 11 | **Customer** | Tech | Clicks the link and enters the new vitamins consultation directly. | — |
| 12 | **Doctor** | Medical | Accepts the vitamins consultation. | <small>• **Source** — where the patient came from (lab / pharmacy / direct). Shown because Labass has agreements with partner labs and pharmacies to bring their customers back — prescription routed accordingly *(to be built)*<br>• **Survey** — every question asked during signup with the patient's answer (health goals, height, weight, city)<br>• **Previous consultations** — the original lab consultation (pre or post-test): lab name, date, and link<br>• **Lab results** — PDF uploaded by the lab if it was a post-test consultation; displayed here even though it was uploaded in a different consultation; shown as "not yet available" if pre-test</small> |
| 13 | **Doctor → Patient** | Medical | Reviews all context. Issues a vitamins prescription with specific products and dosages. | <small>• Patient receives: prescription PDF via WhatsApp</small> |
| 14 | **Admin** *(to be built)* | Ops | Opens the vitamins subscriber dashboard. Sees all active subscribers with their plan, consultation status, and prescription status. Verifies the system sent the vitamins link after the post-test consultation closed. Sees each patient's source to determine prescription routing. Selects a Labass partner pharmacy and sends the prescription. | <small>• Subscriber name, plan, source (lab / pharmacy / direct), consultations completed, prescription status<br>• ✅ vitamins link sent (with timestamp) / ❌ not sent — needs follow-up<br>• Partner pharmacy list to assign to<br>• Pharmacy manager receives: prescription PDF via WhatsApp</small> |
| 15 | **Pharmacy Manager** | Ops | Receives the prescription. Dispenses the vitamins. Ships to the patient. | — |

---

## TYPE 2: Pharmacy Referral Customer 🟡

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يزور العميل الصيدلية (لشراء أدوية أو استفسار عن فيتامينات)</li>
<li>الصيدلية ترسل استشارة فيتامينات مجانية من بوابة المنشأة (لا تُخصم من باقة الصيدلية)</li>
<li>يحصل العميل على رابط الاستشارة عبر واتساب</li>
<li>يدخل العميل الاستشارة، ثم يقوم الدكتور بإرسال رابط صفحة الفيتامينات والاشتراك</li>
<li>يدخل العميل إلى الصفحة، ويقوم بتعبئة المعلومات المطلوبة، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن كذلك رابطًا لطلب استشارة فيتامينات جديدة — <em>(مشترك)</em></li>
<li>يطلب العميل استشارة فيتامينات جديدة مرتبطة بالباقة عبر الرابط المرسل (لا يدخل نفس الاستشارة الأولى) — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة الجديدة، ثم يقوم الدكتور بإصدار وصفة طبية — <em>(مشترك)</em></li>
<li>تظهر الباقة التي اشترك فيها العميل للطبيب داخل تطبيق الدكتور عند قبول الاستشارة — <em>(مشترك)</em></li>
<li><strong>(شرطي — عند الحاجة لتحاليل مخبرية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب من تطبيق الدكتور — يُسجّل النظام: اسم المختبر، رقم الجوال، وقت الإرسال، رقم الاستشارة</li>
<li><strong>(شرطي — تابع)</strong> يُجري المختبر التحليل — يدخل مدير المختبر إلى تبويب "طلبات التحليل" في بوابة لاباس — يرفع ملف النتيجة PDF — يضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من الباقة</strong></li>
<li><strong>(للأدمن)</strong> تظهر قائمة بالعملاء المشتركين مع الباقات والاستشارات المنفذة، ويظهر مصدر كل عميل (مختبر / صيدلية / اشتراك مباشر) — <em>(مشترك)</em></li>
<li>يتحقق الأدمن من الروابط المرسلة من الدكتور للعميل (رابط صفحة الفيتامينات) للتأكد من إرسالها</li>
<li>يرسل الدكتور الوصفة مباشرة لتلك الصيدلية (الصيدلية المصدر التي أرسلت الاستشارة)</li>
<li>ترسل الوصفة مباشرة لمدير الصيدلية — <em>(مشترك)</em></li>
</ol>
</div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | B2B | Visits a pharmacy. Either asks about vitamins or the pharmacist proactively recommends the Labass vitamins program. | — |
| 2 | **Pharmacy — org portal** *(to be built)* | B2B | Opens the Labass org portal. Enters the patient's phone number. Selects "فيتامينات" as the consultation type. Submits. | <small>• "استشارة الفيتامينات مجانية ولا تُخصم من باقتك"<br>• Bundle count does **not** decrease</small> |
| 3 | **System → Customer** | Tech | Sends the patient a WhatsApp with a consultation link, referencing the pharmacy by name. | <small>• Patient receives: "صيدلية [اسم الصيدلية] ترشّح لك برنامج الفيتامينات من لاباس" + consultation link</small> |
| 4 | **Customer** | Tech | Clicks the link and enters the consultation chat. | — |
| 5 | **Doctor** | Medical | Accepts the consultation. | <small>• 🟢 "فيتامينات" badge<br>• Source: "من الصيدلية — [pharmacy name]"<br>• No lab results<br>• Not yet subscribed to a vitamins package *(to be built)*</small> |
| 6 | **Doctor ↔ Customer** | Medical | Discusses the patient's health concerns, symptoms, and lifestyle. Recommends a vitamins program. Sends the vitamins package link in the chat. | — |
| 7 | **Doctor** | Medical | Closes the consultation. | — |
| 8 | **Customer** | Sales | Visits the vitamins page. Fills in personal info and health goals. Selects a plan. Verifies phone via OTP. Pays. | — |
| 9 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. System sends customer a link to request a new vitamins consultation at any time during their subscription period. If WhatsApp delivery fails, falls back to SMS. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! يمكنك طلب استشارة جديدة في أي وقت يناسبك" + consultation request link</small> |
| 10 | **Customer** | Tech | Clicks the link and requests a new vitamins consultation linked to their subscription. Enters the consultation once it has been created. | — |
| 11 | **Doctor** | Medical | Accepts the vitamins consultation. | <small>• 🟢 "فيتامينات" badge<br>• Source: "من الصيدلية — [pharmacy name]"<br>• Subscription plan + active status<br>• Health goals + physical info from signup<br>• No lab results *(to be built)*</small> |
| 11a *(conditional)* | **Doctor → Lab Manager** | Medical | If lab tests are needed before prescribing: Doctor clicks "إرسال للمختبر". Selects lab name + manager phone. Submits. | <small>• Lab manager receives WhatsApp with patient name + phone + doctor's note<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 11b *(conditional)* | **Lab Manager** | B2B | Receives the referral. Contacts the patient. Collects sample. Runs test. Opens Labass org portal → "طلبات التحليل" tab. Uploads PDF. Clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created — **NOT deducted from any package**<br>• Patient receives WhatsApp link<br>• Referral log: status → completed</small> |
| 11c *(conditional)* | **Doctor** | Medical | Receives post-test consultation. Reviews lab results. Now has full picture to prescribe. | — |
| 12 | **Doctor → Patient** | Medical | Reviews context. Issues a vitamins prescription. | <small>• Patient receives: prescription PDF via WhatsApp</small> |
| 13 | **Doctor → Pharmacy** *(to be built)* | Medical | Since the patient came from this pharmacy, the doctor sends the prescription directly to the source pharmacy. No admin involvement needed. | <small>• Pharmacy manager receives: prescription PDF via WhatsApp</small> |
| 14 | **Pharmacy Manager** | Ops | Receives the prescription. Dispenses the vitamins. Ships to the customer. | — |

---

## TYPE 3: Ads Customer 🟢

<div dir="rtl" style="font-size:0.85em; line-height:2; padding-right:1em">
<ol>
<li>يرى العميل إعلاناً على تيك توك أو انستقرام أو سناب شات</li>
<li>يدخل العميل مباشرة إلى صفحة الفيتامينات عبر رابط الإعلان</li>
<li>يقوم بتعبئة المعلومات المطلوبة، ثم إتمام عملية الدفع — <em>(مشترك)</em></li>
<li>تصل إلى العميل رسالة تؤكد نجاح الاشتراك، وتتضمن كذلك رابطًا لطلب استشارة فيتامينات جديدة — <em>(مشترك)</em></li>
<li>يطلب العميل استشارة فيتامينات جديدة مرتبطة بالباقة عبر الرابط المرسل (لا يدخل نفس الاستشارة الأولى) — <em>(مشترك)</em></li>
<li>يدخل العميل إلى الاستشارة الجديدة، ثم يقوم الدكتور بإصدار وصفة طبية — <em>(مشترك)</em></li>
<li>تظهر الباقة التي اشترك فيها العميل للطبيب داخل تطبيق الدكتور عند قبول الاستشارة — <em>(مشترك)</em></li>
<li><strong>(شرطي — عند الحاجة لتحاليل مخبرية)</strong> يرسل الدكتور معلومات المريض لمدير المختبر عبر الواتساب من تطبيق الدكتور — يُسجّل النظام: اسم المختبر، رقم الجوال، وقت الإرسال، رقم الاستشارة</li>
<li><strong>(شرطي — تابع)</strong> يُجري المختبر التحليل — يدخل مدير المختبر إلى تبويب "طلبات التحليل" في بوابة لاباس — يرفع ملف النتيجة PDF — يضغط "إرسال الاستشارة للدكتور" — يتلقى الدكتور استشارة post-test جديدة <strong>لا تُخصم من الباقة</strong></li>
<li><strong>(للأدمن)</strong> تظهر قائمة بالعملاء المشتركين مع الباقات والاستشارات المنفذة، ويظهر مصدر كل عميل (مختبر / صيدلية / اشتراك مباشر) — <em>(مشترك)</em></li>
<li>يتحقق الأدمن من الروابط المرسلة من الدكتور للعميل (رابط صفحة الفيتامينات) للتأكد من إرسالها</li>
<li>يقوم الأدمن باختيار صيدلية شريكة متعاقدة مع لاباس لبيع الفيتامينات ثم يرسل الوصفة</li>
<li>ترسل الوصفة مباشرة لمدير الصيدلية — <em>(مشترك)</em></li>
</ol>
</div>

| # | Participant | Function | Action | Info Seen / Sent / Received |
|---|-------------|----------|--------|-----------------------------|
| 1 | **Customer** | Marketing | Sees an ad on TikTok, Instagram, or Snap. Clicks and lands on the vitamins page. | — |
| 2 | **Customer** | Sales | Reads about the program — symptoms covered, what's included, pricing, FAQ. Clicks "اشترك الآن". Fills in: name, phone, age, height, weight, city, health goals. Selects a plan. Verifies phone via OTP. Pays via card or Apple Pay. | — |
| 3 | **System** *(to be built)* | Tech | Payment confirmed. Subscription activated. System sends customer a link to request a new vitamins consultation at any time during their subscription period. If WhatsApp delivery fails, falls back to SMS. | <small>• Patient receives: WhatsApp/SMS — "تم الاشتراك بنجاح! يمكنك طلب استشارة جديدة في أي وقت يناسبك" + consultation request link<br>• Success page shows an "اطلب استشارتك الآن" button</small> |
| 4 | **Customer** | Tech | Clicks the link and requests a new vitamins consultation linked to their subscription. Enters the consultation once it has been created. | — |
| 5 | **Doctor** | Medical | Accepts the consultation. | <small>• 🟢 "فيتامينات" badge<br>• Source: "اشتراك مباشر" (came via ads or landing page)<br>• Subscription plan + active status<br>• Health goals + physical info from signup<br>• No lab results *(to be built)*</small> |
| 5a *(conditional)* | **Doctor → Lab Manager** | Medical | If lab tests are needed: Doctor clicks "إرسال للمختبر". Enters lab name + manager phone number. Submits. | <small>• Lab manager receives WhatsApp: patient name, patient phone, doctor's note<br>• **System logs**: lab_referral_id, lab_name, lab_manager_phone, sent_at, consultation_id, doctor_name</small> |
| 5b *(conditional)* | **Lab Manager** | B2B | Receives the referral WhatsApp. Contacts the patient. Collects blood sample. Runs the tests. Opens Labass org portal → "طلبات التحليل" tab. Finds the referral. Uploads lab results PDF. Clicks "إرسال الاستشارة للدكتور". | <small>• Post-test consultation created — **NOT deducted from any package**<br>• Patient receives WhatsApp link to enter the consultation<br>• Referral log: status → completed, postTestConsultationId recorded</small> |
| 5c *(conditional)* | **Doctor** | Medical | Receives the post-test consultation (normal feed). Reviews the lab results PDF. Now has complete picture for a personalised vitamins prescription. | — |
| 6 | **Doctor → Patient** | Medical | Reviews health goals and context. Issues a vitamins prescription with specific products and dosages. | <small>• Patient receives: prescription PDF via WhatsApp</small> |
| 7 | **Admin** *(to be built)* | Ops | Opens the vitamins subscriber dashboard. Finds this patient (no linked pharmacy). Selects a Labass partner pharmacy from the list. Sends the prescription to the pharmacy. | <small>• All active subscribers (name, plan, **source: lab / pharmacy / direct**, status)<br>• Patients with no assigned pharmacy highlighted for action<br>• Per subscriber: consultations completed, prescription status<br>• Partner pharmacy list to choose from<br>• Pharmacy manager receives: prescription PDF via WhatsApp</small> |
| 8 | **Pharmacy Manager** | Ops | Receives the prescription. Dispenses the vitamins. Ships to the customer. | — |

---

## What EXISTS Today

| Feature | Status |
|---------|--------|
| Lab creates pre_test or post_test consultation from org portal (bundle-based) | ✅ EXISTS |
| WhatsApp + SMS magic link sent to patient | ✅ EXISTS |
| Patient enters consultation via magic link | ✅ EXISTS |
| Doctor sees new consultation in feed and accepts | ✅ EXISTS |
| Doctor sends vitamins link manually in chat | ✅ EXISTS (manual) |
| Vitamins landing page with symptoms, plans, and FAQ | ✅ EXISTS |
| 5-step subscribe wizard (plan → info → goals → OTP → confirm) | ✅ EXISTS |
| Payment via MyFatoorah (card / Apple Pay) | ✅ EXISTS |
| Subscription activated on payment webhook | ✅ EXISTS |
| Vitamins Bundle type (filtered on frontend) | ✅ EXISTS |
| Doctor issues prescription (drugs + PDF) | ✅ EXISTS |
| Prescription PDF sent via WhatsApp to patient | ✅ EXISTS |
| Blog / content marketing (4 static articles) | ✅ EXISTS |
| Lab referral log type + frontend controllers (getLabReferrals, createPostTestFromReferral) | ✅ BUILT (awaiting backend) |
| Org portal "طلبات التحليل" tab — referrals inbox, PDF upload, post-test creation | ✅ BUILT (awaiting backend) |
| Badge count on "طلبات التحليل" nav tab showing pending referrals | ✅ BUILT |

---

## What's MISSING

### GAP 1 — Vitamins Consultation Linked to Vitamins Subscription (Not Lab Bundle)

**Problem**: After paying for the vitamins subscription, the success page says "سيتواصل معك فريقنا خلال ٢٤ ساعة". There is no consultation link. The patient has no way to start a consultation.

**What we need**:
1. When a vitamins subscription is activated, a consultation is automatically created and linked to the **vitamins subscription** — not the lab's bundle. This does not count against the lab's consultation count.
2. The patient receives a link valid until the subscription expires (not the current 72h default).
3. The patient can request additional consultations within the subscription period, counted against the vitamins package — not any org bundle.
4. The success page shows a direct "ادخل للاستشارة الآن" button.

**Backend**: On subscription activation: create a vitamins consultation, generate a long-lived link, send it via WhatsApp. Additional consultations within the period deduct from the vitamins subscription.

**Frontend**: Success page — replace "سيتواصل معك فريقنا خلال ٢٤ ساعة" with a direct consultation link and "يمكنك الدخول للاستشارة في أي وقت يناسبك".

---

### GAP 2 — Pharmacy Free Vitamins Consultation (Not Counted on Bundle)

**Problem**: When a pharmacy sends a consultation from the org portal, it always deducts from their bundle. There is no free vitamins referral option.

**What we need**:
- A new "فيتامينات" consultation type in the org portal. When selected, the consultation is created and sent to the patient at no cost to the pharmacy's bundle. The pharmacy's remaining count does not change.
- A note shown to the pharmacy when "فيتامينات" is selected: "مجانية ولا تُخصم من باقتك".

**Backend**: "Vitamins" consultation type bypasses bundle deduction logic.

**Frontend (org portal)**: Add "فيتامينات" as a selectable consultation type; show free note; do not decrement the displayed remaining count.

---

### GAP 3 — Doctor Sees Full Context (Source, Type, Subscription, Lab Results)

**Problem**: When a doctor accepts a consultation, they see only the patient's basic profile — no consultation type, no source, no subscription status.

**What we need**: Every vitamins-related consultation must show the doctor:

| What | Why |
|------|-----|
| Vitamins consultation badge | Doctor knows to focus on vitamins prescription |
| Where the patient came from (lab / pharmacy / direct) | Lab patient has test results; pharmacy patient was referred |
| Active vitamins subscription + plan name | Doctor confirms the patient is subscribed before prescribing |
| Patient's health goals, height, weight, city | Filled during signup — essential for personalized prescription |
| Lab results PDF (if applicable) | Doctor must review actual test results |

**Backend**: Consultation must carry its origin and a reference to the patient's vitamins subscription. Doctor feed must expose this data.

**Frontend (doctor app)**: Consultation card and detail view must display source badge, subscription status, survey answers, and lab results PDF link.

---

### GAP 4 — Admin Dashboard (Subscriber List and Doctor Compliance)

**Problem**: There is no admin view for vitamins subscribers, their packages, or the status of their consultations and prescriptions.

**What we need**: Admin must see:
- All patients subscribed to a vitamins package, with plan and subscription status.
- Per subscriber: consultations completed, prescription issued or pending.
- Whether the doctor sent the vitamins link to the patient during the post-test consultation (✅/❌ with timestamp).

**Backend**: Admin-accessible view of all vitamins subscriptions with consultation and prescription history. Detect and record when a doctor sends the vitamins link in a consultation.

**Frontend (admin)**: Table with subscriber, plan, consultation status, prescription status, and doctor compliance indicator.

---

### GAP 5 — Prescription Routing to Pharmacy

**Problem**: The prescription PDF auto-sends to the marketer who initiated the consultation. For lab and ads customers, there is no marketer — so the prescription has no destination pharmacy.

**What we need**:

**Path A — Patient came from a pharmacy**: Doctor sends the prescription directly to that same pharmacy. No admin needed.

**Path B — Patient came from a lab or ads**: Admin selects a Labass partner pharmacy from a list and sends the prescription. Admin must see which consultations are waiting for pharmacy assignment.

**Backend**: Flag pharmacy organizations as "vitamin fulfillment partners". Allow admin to send a prescription to any partner pharmacy. Allow doctor to send Rx directly to the linked pharmacy (Path A).

**Frontend — Doctor app (Path A)**: Show "أرسل الوصفة للصيدلية" action when consultation source is a pharmacy.

**Frontend — Admin (Path B)**: Show pending prescriptions with no assigned pharmacy; allow admin to pick a partner pharmacy and send.

---

### GAP 6 — Recurring Consultation on Monthly Renewal

**Problem**: When a vitamins subscription renews, nothing happens. The patient receives no notification and no new consultation is created.

**What we need**: When a subscription renews, a new consultation is automatically created and the patient receives a WhatsApp prompt to book their monthly consultation.

**Backend**: On renewal event: create a new consultation and notify the patient.

---

### GAP 7 — Survey Data Visible to Doctor

**Problem**: The subscribe wizard collects health goals, height, weight, and city. This data is stored only in the browser and never reaches the backend or the doctor.

**What we need**: The doctor must see this data when accepting the vitamins consultation.

**Backend**: Store survey answers from the subscribe wizard against the patient's consultation or subscription record.

**Frontend (subscribe)**: Submit survey data to the backend at the payment/confirmation step.

**Frontend (doctor app)**: Display survey answers in the consultation view.

---

### GAP 8 — Auto-Send Vitamins Link When Lab Consultation Closes (Pre or Post-Test)

**Problem**: When a lab consultation closes (whether pre-test or post-test), nothing is sent about vitamins. The doctor must manually remember to send the link.

**What we need**: Every time a lab consultation closes — regardless of type — the system automatically sends the patient the vitamins package link via WhatsApp. This is a safety net in case the doctor forgot.

- Post-test message: "بناءً على نتائج تحاليلك، قد تستفيد من برنامج فيتامينات مخصّص" + link
- Pre-test message: "طبيبك يرشّح لك برنامج فيتامينات مخصّص من لاباس" + link

**Backend**: When any lab consultation (pre or post-test) closes, auto-send vitamins link to patient via WhatsApp.

⚠️ Requires an approved WhatsApp message template with Meta before this can run.

---

### GAP 10 — Doctor-Initiated Lab Referral & Free Post-Test Consultation

**Problem**: When a doctor decides a vitamins patient needs blood work (TYPE 2 or TYPE 3 patients have no lab results), there is no in-platform mechanism to request the lab. The doctor has to call the lab manually, and there is no log of the request. When the lab uploads results, the post-test consultation gets incorrectly deducted from the package.

**What we need**:
1. **Doctor app**: "إرسال للمختبر" button inside any vitamins consultation. Doctor enters lab name + manager phone number + optional note. System sends a WhatsApp to the lab manager with patient info and logs the referral.
2. **System log**: Every referral records: `lab_referral_id`, `lab_name`, `lab_manager_phone`, `sent_at`, `consultation_id`, `patient_id`, `doctor_name`, `status`.
3. **Org portal — "طلبات التحليل" tab** *(BUILT — pending backend)*: Lab manager sees all incoming referrals. Uploads the results PDF for each pending referral. Clicks "إرسال الاستشارة للدكتور". System creates the post-test consultation.
4. **Free post-test consultation**: The post-test consultation created from a doctor referral (`/consultations/create-from-referral`) is flagged `freeConsultation = true` — it is **not deducted** from the lab's bundle or the patient's vitamins package.
5. **Doctor receives** the post-test consultation as a normal consultation in their feed.

**Backend**:
- `POST /lab-referrals` — doctor creates a referral (sends WhatsApp to lab manager, logs entry).
- `GET /lab-referrals` — lab portal fetches its incoming referrals.
- `POST /consultations/create-from-referral` — creates a post_test consultation with `freeConsultation = true`, links it back to the referral, marks referral as completed.

**Frontend (doctor app)**: Add "إرسال للمختبر" button in the vitamins consultation view (separate doctor-side repo).

**Frontend (org portal)**: ✅ "طلبات التحليل" tab built — awaiting backend endpoints.

---

### GAP 9 — Bulk Marketing Campaign to Existing Users

**Problem**: There is no way to reach existing Labass patients who have not yet subscribed to a vitamins package.

**What we need**: Admin can trigger a bulk WhatsApp campaign sending the vitamins package link to all patients in the database who do not already have an active vitamins subscription. The system must handle rate limits, track results (sent / failed / skipped), and never re-send to existing subscribers.

**Backend**: Admin-triggered bulk send with rate limiting and result logging; exclude active vitamin subscribers.

**Frontend (admin)**: Trigger button with confirmation showing the number of users to be contacted; results summary after send.

⚠️ Requires a separate approved WhatsApp marketing template with Meta.

---

## Business Deals Required

> These agreements must be in place before the technical flow can operate.

| # | Deal | Unlocks | Status Needed Before |
|---|------|---------|----------------------|
| 1 | **Lab subscription agreements** — Labs pay Labass for a consultation bundle. Each post-test result generates a consultation via the bundle. | 🔴 Lab customer flow | Sprint 1 |
| 2 | **Partner pharmacy fulfillment agreement** — **جدار (Jadar)** is the first partner pharmacy. Jadar is registered in the system as a pharmacy so the admin can send prescriptions and patient information directly to them. Additional pharmacies can be added later. Must define: delivery area, turnaround time, revenue share or wholesale price. | 🔴 Lab + 🟢 Ads (Rx delivery — GAP 5) | Sprint 1 |
| 3 | **Vitamin supplier / product agreement** — Agreement with the vitamins manufacturer or distributor. Defines which products can be prescribed, pricing, and supply chain. Without this, doctors cannot prescribe specific products. | 🔴 All flows | Sprint 1 |
| 4 | **Pharmacy referral agreement** — Pharmacies agree to use the Labass org portal to send free vitamins consultations as referrals to their customers. Must clarify: who onboards pharmacies, bundle pricing, terms of the free referral consultation. | 🟡 Pharmacy flow (GAP 2) | Sprint 2 |
| 5 | **WhatsApp Business template approvals** — Meta must approve two marketing templates: `vitamins_marketing_post_test` (sent when post-test closes) and `vitamins_marketing_campaign` (bulk campaign). Approval takes 1–3 business days. | 🔴 GAP 8 (template 1), 🟢 GAP 9 (template 2) | Sprint 1 (template 1), Sprint 3 (template 2) |
| 6 | **SFDA / MOH compliance** — Confirm whether an e-prescription is sufficient for vitamin dispensing or if physical pharmacy verification is required. | 🔴 All prescription flows | Before any prescription is sent to a pharmacy |
