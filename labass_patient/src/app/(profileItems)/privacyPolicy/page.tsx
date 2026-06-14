import React from "react";
import Header from "../../../components/common/header";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header title="سياسة الخصوصية" showBackButton />
      <div className="p-4 pt-28 pb-10 text-right leading-relaxed text-gray-800 max-w-2xl mx-auto" dir="rtl">
        <h1 className="text-2xl font-bold mb-1">سياسة الخصوصية</h1>
        <p className="text-sm text-gray-500 mb-6">آخر تحديث: يونيو 2026</p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">مقدمة</h2>
          <p>
            تطبيق &quot;لاباس&quot; مملوك لشركة معالم التطوير، وهو منصة للاستشارات الطبية عن بُعد مرخصة من وزارة الصحة السعودية برقم الترخيص 1400055938. نحن ملتزمون بحماية خصوصية مستخدمينا وبياناتهم الشخصية وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية واللوائح الصحية المعمول بها. باستخدامك لهذا التطبيق، فإنك توافق على أحكام سياسة الخصوصية هذه.
          </p>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">أولاً: الاستشارات الخاصة بكم</h2>
          <p>
            في &quot;لاباس&quot;، نقدم خدمة فريدة تسمح لكم بالتواصل المباشر مع الأطباء عبر مكالمات الفيديو والمحادثة النصية، مما يضمن لكم الحصول على الرعاية المثلى. خلال هذه الاستشارات، يتم تبادل بياناتكم الشخصية والطبية بأمان تام مع الطبيب المعالج، حيث نستخدم أحدث التقنيات لضمان أمان وسرية هذه المعلومات.
          </p>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">ثانياً: التزامنا بسرية معلوماتكم</h2>
          <p>
            نحن في &quot;لاباس&quot; نقدر خصوصيتكم ونلتزم بحماية بياناتكم الشخصية والطبية. نضمن عدم الكشف عن أي معلومات قد تحدد هويتكم لأطراف ثالثة غير مخولة، ونحافظ على سرية المعلومات في جميع الأوقات.
          </p>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">ثالثاً: معايير الخصوصية المتقدمة</h2>
          <ol className="list-decimal list-inside space-y-3 pr-2">
            <li>
              <span className="font-medium">أمان وخصوصية بياناتكم في &quot;لاباس&quot;:</span> نضع خصوصيتكم وأمان بياناتكم في صميم أولوياتنا. لدينا سياسة خصوصية واضحة وشاملة تجيب عن الأسئلة الشائعة حول خدماتنا وكيفية حماية بياناتكم والاستخدام الأمثل لها. نحن ملتزمون بالقوانين والمعايير لضمان الحماية الكاملة لمعلوماتكم.
            </li>
            <li>
              <span className="font-medium">الأمان الرقمي في &quot;لاباس&quot;:</span> نستخدم أحدث التقنيات والبروتوكولات الأمنية لحماية بياناتكم، لضمان الحفاظ على خصوصيتكم وأمان معلوماتكم الشخصية والطبية. تُشفَّر جميع البيانات أثناء النقل باستخدام بروتوكول HTTPS/TLS، وتُخزَّن بيانات المصادقة في مخزن آمن مشفر على جهازك.
            </li>
            <li>
              <span className="font-medium">حماية بياناتكم داخل المملكة العربية السعودية:</span> نؤكد على التزامنا بتخزين ومعالجة جميع بياناتكم داخل الحدود الجغرافية للمملكة العربية السعودية، مما يعزز من مستوى الأمان والخصوصية وفقاً للقوانين والتشريعات المحلية.
            </li>
          </ol>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">رابعاً: البيانات التي نجمعها</h2>
          <p className="mb-2">عند استخدامك للتطبيق، قد نجمع الأنواع التالية من البيانات:</p>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li><span className="font-medium">بيانات الهوية:</span> الاسم الكامل، رقم الهوية الوطنية، تاريخ الميلاد، الجنس</li>
            <li><span className="font-medium">بيانات التواصل:</span> رقم الجوال</li>
            <li><span className="font-medium">البيانات الطبية:</span> محتوى الاستشارات، الرسائل النصية، الرسائل الصوتية، الصور والملفات المرسلة خلال الاستشارة، الوصفات الطبية، إجازات المرض، الملاحظات الطبية</li>
            <li><span className="font-medium">بيانات الجهاز:</span> رمز الإشعارات لإرسال الإشعارات الفورية</li>
            <li><span className="font-medium">البيانات التقنية:</span> عنوان IP ومعلومات الجهاز التي يتم جمعها تلقائياً بواسطة الخوادم</li>
          </ul>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">خامساً: الأساس القانوني لمعالجة البيانات</h2>
          <p className="mb-2">نعالج بياناتكم استناداً إلى الأسس القانونية التالية وفق نظام حماية البيانات الشخصية:</p>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li><span className="font-medium">الموافقة:</span> عند تسجيلك في التطبيق وقبولك لهذه السياسة</li>
            <li><span className="font-medium">تنفيذ العقد:</span> لتقديم خدمة الاستشارة الطبية التي طلبتها</li>
            <li><span className="font-medium">الالتزام القانوني:</span> للامتثال للأنظمة الصحية السعودية المعمول بها</li>
            <li><span className="font-medium">المصلحة المشروعة:</span> لتحسين جودة الخدمة وضمان أمان المنصة</li>
          </ul>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">سادساً: الجهات التي نشارك معها بياناتك</h2>
          <p className="mb-2">لا نبيع بياناتك لأي جهة. قد نشارك بياناتك مع الجهات التالية حصراً لأغراض تقديم الخدمة:</p>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li><span className="font-medium">الطبيب المعالج:</span> لتقديم الاستشارة الطبية</li>
            <li><span className="font-medium">شركة MyFatoorah:</span> لمعالجة عمليات الدفع الإلكتروني</li>
            <li><span className="font-medium">Firebase (Google):</span> لإرسال الإشعارات الفورية</li>
            <li><span className="font-medium">LiveKit:</span> لتوفير خدمة مكالمات الفيديو</li>
            <li><span className="font-medium">الجهات الحكومية والصحية:</span> عند الاقتضاء القانوني أو بأمر قضائي</li>
          </ul>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">سابعاً: مدة الاحتفاظ بالبيانات</h2>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li><span className="font-medium">السجلات الطبية:</span> تُحتفظ بها لمدة لا تقل عن 10 سنوات وفقاً للوائح الصحية السعودية</li>
            <li><span className="font-medium">بيانات الحساب:</span> تُحتفظ بها طوال فترة نشاط الحساب، وتُحذف خلال 30 يوماً من طلب حذف الحساب</li>
            <li><span className="font-medium">بيانات الدفع:</span> تُعالج فقط من قِبل MyFatoorah ولا تُخزَّن على خوادمنا</li>
            <li><span className="font-medium">رموز الإشعارات:</span> تُحدَّث عند كل تسجيل دخول وتُحذف عند حذف الحساب</li>
          </ul>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">ثامناً: حقوق المستخدم والشفافية</h2>
          <p className="mb-2">تتيح لك سياسة الخصوصية التحكم الكامل في بياناتك. وفقاً لنظام حماية البيانات الشخصية في المملكة العربية السعودية، تتمتع بالحقوق التالية:</p>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li><span className="font-medium">حق الوصول:</span> طلب الاطلاع على بياناتك الشخصية المخزنة لدينا</li>
            <li><span className="font-medium">حق التصحيح:</span> طلب تصحيح أي بيانات غير دقيقة</li>
            <li><span className="font-medium">حق الحذف:</span> طلب حذف حسابك وبياناتك عبر خيار &quot;حذف الحساب&quot; في التطبيق أو بالتواصل معنا مباشرة</li>
            <li><span className="font-medium">حق سحب الموافقة:</span> سحب موافقتك على معالجة بياناتك في أي وقت مع مراعاة الالتزامات القانونية</li>
            <li><span className="font-medium">حق تقديم شكوى:</span> يحق لك تقديم شكوى إلى الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) عبر الموقع الرسمي: sdaia.gov.sa</li>
          </ul>
          <p className="mt-3">
            لممارسة أي من هذه الحقوق، يرجى التواصل معنا على:{" "}
            <a href="mailto:yazeed@labass.sa" className="text-blue-600 underline" dir="ltr">yazeed@labass.sa</a>
          </p>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">تاسعاً: سياسة الأطفال والقاصرين</h2>
          <p>
            التطبيق مخصص للمستخدمين البالغين من العمر 18 عاماً فأكثر. يمكن إضافة أفراد الأسرة القاصرين كمعالين تحت إشراف ومسؤولية ولي الأمر المسجل في التطبيق، والذي يتحمل المسؤولية الكاملة عن موافقته على معالجة بياناتهم.
          </p>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">عاشراً: التغييرات على سياسة الخصوصية</h2>
          <p>
            قد نقوم بتحديث هذه السياسة من وقت لآخر. في حال إجراء تغييرات جوهرية، سنخطرك عبر إشعار داخل التطبيق أو رسالة نصية على رقم جوالك المسجل. يُعدّ استمرارك في استخدام التطبيق بعد التحديث موافقةً على السياسة الجديدة.
          </p>
        </section>

        <hr className="my-4 border-gray-200" />

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">حادي عشر: التواصل معنا</h2>
          <div className="space-y-1">
            <p className="font-medium">شركة معالم التطوير</p>
            <p>الرياض، طريق الأمير بندر بن عبدالعزيز، مبنى رقم 3486</p>
            <p>
              البريد الإلكتروني لشؤون الخصوصية:{" "}
              <a href="mailto:yazeed@labass.sa" className="text-blue-600 underline" dir="ltr">yazeed@labass.sa</a>
            </p>
            <p>رقم الهاتف: <span dir="ltr">0505117551</span></p>
            <p>أوقات العمل: من 8 صباحاً إلى 5 مساءً</p>
          </div>
        </section>

        <hr className="my-4 border-gray-200" />

        <p className="text-center font-semibold text-gray-700 mt-6">
          نحن ملتزمون بحماية خصوصيتك وأمان بياناتك
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
