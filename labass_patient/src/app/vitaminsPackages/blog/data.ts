export interface ContentBlock {
  type: "lead" | "paragraph" | "heading" | "callout" | "table";
  text?: string;
  label?: string;
  num?: string;
  sup?: string;
  desc?: string;
  headers?: string[];
  rows?: string[][];
}

export interface Article {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  featured: boolean;
  content: ContentBlock[];
  tags: string[];
  references: string[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export const articles: Article[] = [
  {
    slug: "vitamin-d-gulf",
    category: "فيتامينات",
    title: "فيتامين D في الخليج: لماذا يعاني أغلب السعوديين من نقصه؟",
    subtitle:
      "نعيش تحت شمس لا تغيب، ومع ذلك يُعدّ نقص فيتامين D أكثر النقائص الغذائية شيوعاً في تحاليل دم المملكة. ندرس الأسباب ونوضّح متى يكون النقص خطيراً.",
    readTime: "٨ دقائق قراءة",
    date: "٢١ أبريل ٢٠٢٦",
    featured: true,
    content: [
      {
        type: "lead",
        text: "نعيش تحت شمس لا تغيب عنّا معظم أيام السنة، ومع ذلك يُعدّ نقص فيتامين D أكثر النقائص الغذائية شيوعاً في تحاليل دم المملكة.",
      },
      {
        type: "paragraph",
        text: 'المفارقة ليست مفاجئة لمن يطّلع على الأرقام: دراسة مرجعية نشرتها <em>Journal of Steroid Biochemistry and Molecular Biology</em> خلصت إلى أن النقص يشمل نحو <strong>٨١٪ من سكان المملكة</strong> عبر كل الفئات العمرية، بما فيها البالغون والمراهقون والنساء الحوامل والأطفال حديثو الولادة. تحليل تلوي آخر نُشر عام ٢٠١٨ في <em>Journal of Family and Community Medicine</em> قدّر النسبة بـ<strong>٦٣.٦٪ بين البالغين الأصحّاء</strong>، مشيراً إلى أن الأرقام تتفاوت حسب المنطقة ومنهجية القياس.',
      },
      {
        type: "callout",
        label: "الصورة السريعة",
        num: "٨",
        sup: "/١٠",
        desc: "من كل عشرة أشخاص تقابلهم في يومك، يُرجَّح أن ستة إلى ثمانية منهم يعانون من نقص في فيتامين D — حتى لو لم يشعروا بأعراض واضحة.",
      },
      {
        type: "heading",
        text: "لماذا يحدث هذا، رغم الشمس؟",
      },
      {
        type: "paragraph",
        text: "<strong>نمط الحياة الداخلي.</strong> الحرارة العالية تدفع الناس إلى قضاء معظم النهار داخل المباني المكيّفة، والانتقال من البيت إلى السيارة إلى المكتب إلى المول. دراسة على موظفين في المدينة المنوّرة لاحظت أن الغالبية يقضون ساعات العمل في مكاتب مغلقة، مع تعرّض يومي للشمس أقل من ساعة لدى أكثر من ٨٠٪ منهم.",
      },
      {
        type: "paragraph",
        text: "<strong>اللباس التقليدي.</strong> اللباس الذي يغطّي معظم الجسم يقلّل مساحة الجلد المعرّضة للأشعة فوق البنفسجية التي يحتاجها الجسم لتصنيع الفيتامين. دراسة وطنية رصدت أن نقص فيتامين D يصيب نحو <strong>٧٢٪ من الشابات السعوديات</strong>، وربطت ذلك بقلّة التعرّض للشمس مع عوامل أخرى.",
      },
      {
        type: "paragraph",
        text: "<strong>الميل الجمالي لتجنّب السمرة.</strong> بحث أجري في جدة على ٢٥٧ امرأة في عمر ٢٠-٥٠ سنة وجد أن أكثر من نصفهن يتجنّبن الشمس إما لاعتبارات جمالية أو بسبب القلق من الحرارة والصداع، وليس بالضرورة قلقاً من سرطان الجلد.",
      },
      {
        type: "paragraph",
        text: "<strong>النمط الغذائي.</strong> الأسماك الدهنية — وهي من أهمّ المصادر الغذائية للفيتامين — قليلة في الحمية السعودية خاصة في المناطق الداخلية كالرياض. دراسة شملت نساء الرياض وجدت أن الاستهلاك اليومي لفيتامين D غذائياً أقل من الحدّ الأدنى الموصى به (٤٠٠ وحدة) لدى معظم المشاركات.",
      },
      {
        type: "paragraph",
        text: "<strong>لون البشرة.</strong> الميلانين في البشرة الداكنة يقلّل امتصاص الأشعة فوق البنفسجية، مما يعني أن الجسم يحتاج إلى فترة تعرّض أطول للوصول إلى نفس مستوى التصنيع مقارنة بالبشرة الفاتحة.",
      },
      {
        type: "heading",
        text: "لماذا يهمّك هذا الرقم؟",
      },
      {
        type: "paragraph",
        text: "نقص فيتامين D ليس مجرّد رقم في ورقة تحليل. تحليل طولي واسع ربط بين مستويات الفيتامين المنخفضة (أقل من ٣٠ نانومول/لتر) واحتمال أعلى بنسبة <strong>٦٢٪ للإصابة بمقدّمات السكّري</strong> خلال ٤ سنوات. كما تربط الأبحاث النقص المزمن بضعف كثافة العظام، وارتفاع خطر الكسور، وبعض أمراض المناعة الذاتية.",
      },
      {
        type: "heading",
        text: "الخبر الجيّد: الأرقام تتحسّن",
      },
      {
        type: "paragraph",
        text: "دراسة نشرتها مجلة <em>Frontiers in Public Health</em> عام ٢٠٢٥ تابعت مستويات فيتامين D لخمس سنوات (٢٠١٧–٢٠٢١) في مستشفى الملك خالد في المجمعة، وسجّلت تراجعاً ملحوظاً في نسبة النقص من <strong>٣٢٪ عام ٢٠١٧</strong> إلى <strong>٩٪ عام ٢٠٢٠</strong>. يربط الباحثون هذا التحسّن بزيادة الوعي العام، حملات الصحة العامّة، واعتماد المكمّلات بشكل أوسع.",
      },
      {
        type: "heading",
        text: "ماذا الخطوة التالية؟",
      },
      {
        type: "paragraph",
        text: "<strong>أوّلاً، اعرف رقمك.</strong> فحص دم بسيط يقيس مستوى \u200E25(OH)D في الدم. النتيجة واضحة: أقل من ٢٠ نانوغرام/مل يُعدّ نقصاً، بين ٢٠ و٢٩ غير كافٍ، و٣٠ فأعلى ضمن المعدل.",
      },
      {
        type: "paragraph",
        text: "<strong>ثانياً، فكّر في مكمّلات — لكن ليس عشوائياً.</strong> جمعية الخبراء التي عقدتها <em>ESCEO</em> بالتعاون مع باحثين سعوديين نشرت توصيات خاصة بتصحيح مستوى فيتامين D في المملكة، مشيرة إلى أن الجرعة المناسبة تعتمد على المستوى الأوّلي وعوامل أخرى.",
      },
      {
        type: "paragraph",
        text: "<strong>ثالثاً، تعرّض محسوب للشم��.</strong> تعرّض الوجه والساعدين لمدة ١٠-١٥ دقيقة في ساعات الصباح المبكّر أو ما قبل الغروب، ثلاث إلى أربع مرات أسبوعياً.",
      },
    ],
    tags: ["#فيتامين_د", "#نقص_الفيتامينات", "#صحة_العظام", "#السعودية"],
    references: [
      "Al-Daghri NM. Vitamin D in Saudi Arabia: Prevalence, distribution and disease associations. Journal of Steroid Biochemistry and Molecular Biology. 2018;175:102–107.",
      "Sadat-Ali M, Al-Anii FM, Al-Turki HA, et al. Vitamin D deficiency in Saudi Arabians: A meta-analysis (2008–2015). Journal of Family and Community Medicine. 2018;25(1):1–4.",
      "Nasr MH, Othman N, Hassan BA, et al. Vitamin D Deficiency in Al-Madinah Al-Munawwarah. Journal of Pharmacology and Pharmacotherapeutics. 2025.",
      "Al-Yateem NS, Rossiter R. Knowledge and attitudes about vitamin D and sunlight exposure in premenopausal women living in Jeddah. Journal of Health, Population and Nutrition. 2021;40:27.",
      "AlFaris NA, AlKehayez NM, AlMushawah FI, et al. Vitamin D Deficiency and Associated Risk Factors in Women from Riyadh, Saudi Arabia. Scientific Reports. 2019;9:20371.",
      "McCarthy CM, Laird E, O'Halloran AM, et al. Data from The Irish Longitudinal Study on Ageing (TILDA).",
      "Madkhali Y, Janakiraman B, Alsubaie F, et al. Prevalence and trends of vitamin D deficiency in a Saudi Arabian population: five-year retrospective study 2017–2021. Frontiers in Public Health. 2025;13:1535980.",
      "Al-Daghri NM, Al-Saleh Y, Aljohani N, et al. Vitamin D status correction in Saudi Arabia: ESCEO experts' consensus. Archives of Osteoporosis. 2017;12(1):1–8.",
    ],
    prev: null,
    next: { slug: "iron-women-ferritin", title: "الحديد والنساء: دليل الفيرّتين" },
  },
  {
    slug: "iron-women-ferritin",
    category: "صحة المرأة",
    title: "الحديد والنساء: دليلك لفهم نتائج الفيرّتين",
    subtitle:
      'النساء يمثّلن ٩٣٪ من حالات نقص الحديد المشخّصة في المملكة. نشرح الفرق بين الهيموغلوبين والفيرّتين، ولماذا قد تكون "نتيجتك طبيعية" وأنتِ في الحقيقة منهكة.',
    readTime: "٧ دقائق قراءة",
    date: "٢١ أبريل ٢٠٢٦",
    featured: false,
    content: [
      {
        type: "lead",
        text: "الصورة السريعة: في المملكة، النساء يمثّلن ٩٣٪ من حالات نقص الحديد، حسب تحليل ضخم شمل أكثر من ٤٢٠ ألف فرد من بيانات مختبرات البرج.",
      },
      {
        type: "paragraph",
        text: 'هذا التحليل، الذي نُشر في <em>Saudi Medical Journal</em> عام ٢٠٢٥، رصد بيانات امتدّت من ٢٠١٤ إلى ٢٠٢٤. في منطقة مكّة المكرّمة وحدها، وصلت نسبة إصابة الإناث بنقص الحديد إلى <strong>٦٩٪</strong>. والأهمّ من كل ذلك: نحو نصف هذه الحالات ليست فقر دم صريح، بل "نقص حديد بدون فقر دم" — حالة يُعرَف عنها قليلاً، لكنها الأكثر شيوعاً بين نساء الخليج.',
      },
      {
        type: "callout",
        label: "النسبة المذهلة",
        num: "٩٣",
        sup: "%",
        desc: "من حالات نقص الحديد المشخّصة في المملكة هم من النساء. دراسة على ٤٢٠٬٩٥٦ فرداً، Saudi Medical Journal 2025.",
      },
      {
        type: "heading",
        text: "ما هو الفيرّتين وكيف يختلف عن الهيموغلوبين؟",
      },
      {
        type: "paragraph",
        text: 'اعتاد كثيرون على سماع كلمة "هيموغلوبين" في التحاليل، واعتقدوا أنها المؤشّر الوحيد على وضع الحديد. الواقع أعمق:',
      },
      {
        type: "paragraph",
        text: "<strong>الهيموغلوبين</strong> هو البروتين الذي ينقل الأكسجين في كريات الدم الحمراء. انخفاضه يعني أن الدم بدأ فعلاً يعاني من نقص الأكسجين — أي أن القصة وصلت لمرحلة متأخّرة.",
      },
      {
        type: "paragraph",
        text: '<strong>الفيرّتين</strong> هو بروتين تخزين الحديد. فكّر فيه كـ"حساب الادّخار" للحديد في جسمك. عندما تستهلكين من هذا الاحتياطي دون تعويض، ينخفض الفيرّتين أولاً، قبل الهيموغلوبين بشهور أو حتى سنوات. هذا هو السبب في أن <em>نقص الحديد بدون فقر دم</em> (المعروف علمياً بـ NAID) يسبق فقر الدم الكلاسيكي غالباً، ويبقى غير مُشخَّص لأن كثيراً من الأطباء يفحصون الهيموغلوبين فقط.',
      },
      {
        type: "heading",
        text: "ما العتبة الصحيحة للفيرّتين؟",
      },
      {
        type: "paragraph",
        text: 'منظمة الصحة العالمية تستخدم تقليدياً عتبة ١٥ نانوغرام/مل لتشخيص نقص الحديد، لكن أبحاث حديثة تقترح أن هذه العتبة منخفضة جداً. دراسة مرجعية نُشرت في <em>International Journal of Molecular Sciences</em> عام ٢٠٢٥ راجعت الأدلّة المتراكمة واقترحت أن عتبة <strong>٥٠ نانوغرام/مل</strong> أدقّ لتشخيص نقص الحديد عند البالغين. بمعنى آخر: قد تكون نتيجتكِ "طبيعية" حسب تقرير المختبر، لكنّكِ في الواقع تعانين من نقص وظيفي.',
      },
      {
        type: "heading",
        text: "أعراض لا تقال دائماً",
      },
      {
        type: "paragraph",
        text: "مراجعة تحليلية مفصّلة نُشرت في <em>Scientific Reports</em> عام ٢٠٢٥ تابعت ٢٣٩ امرأة مصابة بنقص حديد ووثّقت الأعراض الأكثر شيوعاً:",
      },
      {
        type: "table",
        headers: ["العرض", "النسبة"],
        rows: [
          ["الضعف العام", "٨٧٪"],
          ["التعب المزمن", "٨٢٪"],
          ["سهولة الإرهاق", "٧٩٪"],
          ["ضعف الذاكرة قصيرة المدى", "٧٢٪"],
          ["الشعور الدائم بالبرودة", "٧٢٪"],
          ["تساقط الشعر", "٧٠٪"],
          ["اضطرابات النوم", "٦٧٪"],
          ["تقلّبات المزاج والعصبية", "٦٣٪"],
        ],
      },
      {
        type: "paragraph",
        text: "دراسة يابانية سابقة في <em>Biological Trace Element Research</em> لاحظت ارتباطاً بين نقص الحديد بدون فقر دم وأعراض الغضب والتعب عند النساء الشابات. على الجانب العلاجي، تجربة عشوائية مزدوجة التعمية نشرت في <em>BMJ</em> أظهرت أن تعويض الحديد لدى نساء غير مصابات بفقر دم لكن ذوات فيرّتين منخفض أدّى إلى تحسّن واضح في أعراض التعب مقارنة بالعلاج الوهمي.",
      },
      {
        type: "heading",
        text: "لماذا النساء بالذات؟",
      },
      {
        type: "paragraph",
        text: "<strong>الدورة الشهرية</strong> هي السبب الأوّل؛ المرأة تفقد كمّية معتبرة من الحديد شهرياً. <strong>الحمل والإرضاع</strong> يزيدان الطلب. <strong>النمط الغذائي</strong> لا يحتوي دائماً على كمّيات كافية من اللحوم الحمراء، وهي أفضل مصادر الحديد الهيمي. <strong>الشاي والقهوة بعد الأكل مباشرة</strong> تقلّل امتصاص الحديد بسبب التانينات.",
      },
      {
        type: "heading",
        text: "الصورة في المملكة",
      },
      {
        type: "paragraph",
        text: "الدراسة الوطنية الصادرة في <em>Anemia</em> عام ٢٠٢٠ والتي شملت ٩٨١ طالبة وطالب جامعيّ من أربع مناطق في المملكة وجدت أن <strong>٣٤٪ من المشاركين مصابون بفقر دم ناتج عن نقص الحديد</strong>. دراسة إضافية على الطالبات في منطقة عسير وجدت أن <strong>٦٣٪ يعانين نقص حديد</strong> (فيرّتين أقل من ٢٠).",
      },
      {
        type: "heading",
        text: "ماذا تفعلين إذا كانت نتيجتكِ منخفضة؟",
      },
      {
        type: "paragraph",
        text: "<strong>١. راجعي رقمكِ مع طبيب.</strong> الفيرّتين وحده لا يكفي؛ يجب النظر إلى الهيموغلوبين وMCV وTIBC والنسبة المئوية لتشبّع الترانسفيرين. دراسة سعودية على ١١٢ امرأة في سنّ الإنجاب أظهرت أن دمج عدّة مؤشّرات أدقّ من الاعتماد على واحد.",
      },
      {
        type: "paragraph",
        text: "<strong>٢. ابحثي عن السبب، لا فقط العلاج.</strong> هل الدورة الشهرية غزيرة؟ هل هناك مرض كامن يؤثّر على الامتصاص؟",
      },
      {
        type: "paragraph",
        text: "<strong>٣. احرصي على توقيت الجرعة.</strong> مكمّلات الحديد تُمتَصّ أفضل على معدة شبه فارغة، مع فيتامين C، وبعيداً عن الكالسيوم والشاي والقهوة بساعتين على الأقل.",
      },
    ],
    tags: ["#الحديد", "#الفيرّتين", "#صحة_المرأة", "#فقر_الدم"],
    references: [
      "Radhwi OO, Raslan OM, Almoshary MA, Mansory EM. Unmasking iron deficiency and iron deficiency anemia in Saudi Arabia: Data from a large private sector lab. Saudi Medical Journal. 2025;46(9):1000–1007.",
      "Pasricha SR, Mei Z, Cook JD, et al. Defining Global Thresholds for Serum Ferritin. International Journal of Molecular Sciences. 2025;26(3):1156.",
      "Beyond anemia: iron deficiency symptoms in women and their correlation with biomarkers. Scientific Reports. 2025.",
      "Sawada T, Konomi A, Yokoi K. Iron deficiency without anemia is associated with anger and fatigue in young Japanese women. Biological Trace Element Research. 2014;159(1–3):22–31.",
      "Verdon F, Burnand B, Stubi CL, et al. Iron supplementation for unexplained fatigue in non-anaemic women: randomised placebo controlled trial. BMJ. 2003;326(7399):1124.",
      "Owaidah T, Al-Numair N, Al-Suliman A, et al. Iron Deficiency and Iron Deficiency Anemia in Saudi Arabia. Anemia. 2020:6642568.",
      "The pattern of iron deficiency with and without anemia among medical college girl students in high altitude southern Saudi Arabia. Indian Journal of Community Medicine. 2020.",
      "AlQuaiz JM, et al. Accuracy of Various Iron Parameters in the Prediction of IDA among Healthy Women of Child Bearing Age, Saudi Arabia. Hepatitis Monthly. 2012;12(8):e6359.",
    ],
    prev: { slug: "vitamin-d-gulf", title: "فيتامين D في الخليج" },
    next: { slug: "read-blood-tests", title: "كيف تقرأ تحاليل دمك بنفسك؟" },
  },
  {
    slug: "read-blood-tests",
    category: "تحاليل دم",
    title: "كيف تقرأ نتائج تحاليل دمك بنفسك؟ دليل مبسّط",
    subtitle:
      "تحاليل الدم ليست لغة سرّية. دليل مبسّط لأكثر المؤشّرات شيوعاً، مبنيّ على مراجع طبية معتمدة، ليجعل حوارك مع طبيبك أعمق وأسئلتك أدقّ.",
    readTime: "١٠ دقائق قراءة",
    date: "٢١ أبريل ٢٠٢٦",
    featured: false,
    content: [
      {
        type: "lead",
        text: "القاعدة الذهبية أوّلاً: الأرقام تُفسَّر معاً، لا فُرادى. طبيبك لا يقفز إلى تشخيص من قيمة واحدة شاذّة؛ يبحث عن أنماط بين عدّة مؤشّرات.",
      },
      {
        type: "paragraph",
        text: 'كما أن "النطاق الطبيعي" في تقريركَ هو نطاق مختبركَ تحديداً — قد يختلف قليلاً عن مختبر آخر، لذا استخدم دائماً النطاق المدرج في تقريركَ أنت. هذا ما تُشدّد عليه كتيّبات الصحة المرجعية مثل <em>MedlinePlus</em> التابعة للمكتبة الوطنية الأمريكية للطبّ. نذكر كذلك أن <strong>"طبيعي" لا يعني "مثالي"</strong>. كثير من القيم تكون ضمن النطاق لكنها عند الطرف الأدنى أو الأعلى، وقد يستحقّ ذلك المتابعة.',
      },
      {
        type: "heading",
        text: "تعداد الدم الكامل (CBC)",
      },
      {
        type: "paragraph",
        text: "<strong>الهيموغلوبين (Hb):</strong> بروتين ينقل الأكسجين. النطاق الطبيعي بحسب منظمة الصحة العالمية: ١٢–١٦ غم/ديسيلتر للنساء، ١٣–١٨ للرجال. الانخفاض يُعرَف بفقر الدم.",
      },
      {
        type: "paragraph",
        text: "<strong>MCV (متوسط حجم الكرية):</strong> مؤشّر حيوي. الطبيعي ٨٠–١٠٠ فيمتولتر:",
      },
      {
        type: "paragraph",
        text: "— أقل من ٨٠ (كريات صغيرة) = غالباً نقص حديد أو ثلاسيميا صغرى.<br/>— أكبر من ١٠٠ (كريات كبيرة) = غالباً نقص B12 أو حمض الفوليك، أمراض الكبد، أو قصور الغدة الدرقية.",
      },
      {
        type: "paragraph",
        text: "<strong>كريات الدم البيضاء:</strong> العدد الكلّي الطبيعي ٤٠٠٠–١١٠٠٠ خلية/ميكرولتر. الارتفاع قد يشير إلى عدوى أو التهاب، والانخفاض قد يشير إلى عدوى فيروسية، تأثير دواء، أو مشكلة في النخاع العظمي.",
      },
      {
        type: "paragraph",
        text: "<strong>الصفائح الدموية:</strong> ١٥٠٬٠٠٠–٤٥٠٬٠٠٠ لكل ميكرولتر. الانخفاض الشديد = خطر نزيف؛ الارتفاع = قد يرتبط بالتهاب مزمن.",
      },
      {
        type: "heading",
        text: "ملفّ الحديد وفيتامينات رئيسية",
      },
      {
        type: "paragraph",
        text: "<strong>الفيرّتين:</strong> مخزون الحديد. المعيار الحديث يُفضّل عتبة ٥٠ نانوغرام/مل كحدّ أدنى وظيفي.",
      },
      {
        type: "paragraph",
        text: "<strong>فيتامين D (\u200E25-OH D):</strong> أقل من ٢٠ نقص، ٢٠–٢٩ غير كافٍ، ٣٠ فأعلى كافٍ.<br/><strong>فيتامين B12:</strong> الطبيعي غالباً أعلى من ٣٠٠ بيكوغرام/مل.<br/><strong>حمض الفوليك:</strong> أعلى من ٤ نانوغرام/مل.",
      },
      {
        type: "heading",
        text: "المؤشّرات الأيضية",
      },
      {
        type: "paragraph",
        text: "<strong>السكر الصائم:</strong> تحت ١٠٠ ملغ/ديسيلتر طبيعي، ١٠٠–١٢٥ مقدّمات سكّري، ١٢٦ فأعلى = سكّري.",
      },
      {
        type: "paragraph",
        text: "<strong>HbA1c (الهيموغلوبين السكّري):</strong> يعكس متوسّط السكر في آخر ٣ أشهر. تحت ٥.٧٪ طبيعي، ٥.٧–٦.٤٪ مقدّمات، ٦.٥٪ فأعلى = سكّري.",
      },
      {
        type: "paragraph",
        text: "<strong>وظائف الغدة الدرقية — TSH:</strong> ٠.٤–٤.٠ ملّي وحدة/لتر. ارتفاعه = قصور غدة درقية؛ انخفاضه = فرط نشاط.",
      },
      {
        type: "heading",
        text: "جدول مختصر للمراجع الطبيعية",
      },
      {
        type: "table",
        headers: ["المؤشّر", "النطاق الطبيعي"],
        rows: [
          ["هيموغلوبين (نساء)", "١٢–١٦ g/dL"],
          ["هيموغلوبين (رجال)", "١٣–١٨ g/dL"],
          ["MCV", "٨٠–١٠٠ fL"],
          ["كريات بيض", "٤٠٠٠–١١٠٠٠ /μL"],
          ["صفائح", "١٥٠–٤٥٠ ألف/μL"],
          ["فيرّتين (أدنى حدّ وظيفي)", "≥٥٠ ng/mL"],
          ["فيتامين D (كافٍ)", "≥٣٠ ng/mL"],
          ["B12", "≥٣٠٠ pg/mL"],
          ["HbA1c (طبيعي)", "<٥.٧٪"],
          ["TSH", "٠.٤–٤.٠ mIU/L"],
        ],
      },
      {
        type: "heading",
        text: "قاعدة الاختتام",
      },
      {
        type: "paragraph",
        text: "<strong>أوّلاً، انظر إلى الاتجاه.</strong> نتيجة اليوم أقلّ فائدة من مقارنتها بنتائج قبل ٦ أو ١٢ شهراً.",
      },
      {
        type: "paragraph",
        text: "<strong>ثانياً، السياق يغيّر التفسير.</strong> الجفاف يرفع الهيموغلوبين ظاهرياً. عدوى حديثة ترفع الفيرّتين (لأنه بروتين طور حادّ). الصيام لساعات طويلة يؤثّر على بعض القيم.",
      },
      {
        type: "paragraph",
        text: "<strong>ثالثاً، لا تشخّص نفسك.</strong> هذا الدليل نقطة انطلاق لحوار مع طبيبك، لا بديل عنه.",
      },
    ],
    tags: ["#تحاليل_دم", "#CBC", "#فهم_النتائج", "#الصحة_الوقائية"],
    references: [
      "MedlinePlus. Complete Blood Count (CBC). National Library of Medicine, U.S. National Institutes of Health. Reviewed 2024.",
      "El Brihi J, Pathak S. Normal and Abnormal Complete Blood Count With Differential. StatPearls [Internet]. StatPearls Publishing; 2024.",
      "Cleveland Clinic Health Library. Complete Blood Count (CBC): What It Is & Normal Ranges. Reviewed 2024.",
      "Pasricha SR, et al. Defining Global Thresholds for Serum Ferritin. International Journal of Molecular Sciences. 2025;26(3):1156.",
    ],
    prev: {
      slug: "iron-women-ferritin",
      title: "الحديد والنساء: دليل الفيرّتين",
    },
    next: { slug: "ramadan-supplements", title: "رمضان والمكمّلات" },
  },
  {
    slug: "ramadan-supplements",
    category: "نمط حياة",
    title: "رمضان والمكمّلات: متى تأخذ فيتاميناتك خلال الصيام؟",
    subtitle:
      "الصيام يعيد ترتيب حياتك: مواعيد الأكل، النوم، والمكمّلات. قاعدة بسيطة تحكم كل شيء — الدهني مع الطعام الدهني، والمائي متى شئت.",
    readTime: "٦ دقائق قراءة",
    date: "٢١ أبريل ٢٠٢٦",
    featured: false,
    content: [
      {
        type: "lead",
        text: 'الصيام لـ١٤ إلى ١٦ ساعة يومياً يعيد ترتيب حياتك. كثيرون يسألون "هل أتوقّف عن الفيتامينات في رمضان؟" والإجابة غالباً هي: لا، فقط اضبط التوقيت.',
      },
      {
        type: "paragraph",
        text: "بعض الأخطاء الشائعة في توقيت المكمّلات قد تعني أن جزءاً من جرعتك يذهب هباءً. وقد يبدو هذا كلاماً نظرياً، لكن الدليل عليه واضح ومُقاس.",
      },
      {
        type: "callout",
        label: "الرقم المفتاح",
        num: "+٣٢",
        sup: "%",
        desc: "زيادة امتصاص فيتامين D عند تناوله مع وجبة دهنية مقارنة بوجبة خالية من الدهون. Dawson-Hughes, 2015 — Tufts University.",
      },
      {
        type: "heading",
        text: "القاعدة الأهمّ: قابلية الذوبان",
      },
      {
        type: "paragraph",
        text: "الفيتامينات تنقسم إلى مجموعتين، ولكلّ منهما احتياج مختلف:",
      },
      {
        type: "paragraph",
        text: "<strong>فيتامينات ذائبة في الدهون (A, D, E, K):</strong> تحتاج إلى وجود دهون في الوجبة لتُمتصّ جيداً في الأمعاء. بدون دهون، تمرّ معظم الجرعة دون أن يستفيد منها الجسم.",
      },
      {
        type: "paragraph",
        text: "الدليل على هذا ليس نظرياً فقط. تجربة نشرت في <em>Journal of the Academy of Nutrition and Dietetics</em> عام ٢٠١٥، قادتها د. Bess Dawson-Hughes من جامعة تافتس، وجدت أن امتصاص فيتامين D3 بعد ١٢ ساعة من الجرعة كان أعلى بنسبة <strong>٣٢٪</strong> لدى من تناولوا الجرعة مع وجبة تحتوي على دهون مقارنة بمن تناولوها مع وجبة خالية من الدهون (p=0.003). دراسة أخرى عشوائية نُشرت في <em>ISRN Endocrinology</em> أكّدت النتائج نفسها مع جرعات أعلى.",
      },
      {
        type: "paragraph",
        text: "<strong>فيتامينات ذائبة في الماء (مجموعة B، C):</strong> لا تحتاج دهوناً للامتصاص. يمكن أخذها مع الماء. لكنها قد تسبّب لبعض الناس غثياناً على معدة فارغة.",
      },
      {
        type: "heading",
        text: "جدول التوقيت العملي لرمضان",
      },
      {
        type: "table",
        headers: ["التوقيت", "المكمّلات المناسبة"],
        rows: [
          [
            "مع الإفطار مباشرة",
            "فيتامين D، E، K، A، أوميغا ٣، المالتي، الحديد + C",
          ],
          ["بعد الإفطار بساعتين", "الكالسيوم، المغنيسيوم"],
          ["مع السحور", "مجموعة B، فيتامين C"],
          ["ساعات الصيام", "لا شيء فمياً — اشرب الماء جيداً"],
        ],
      },
      {
        type: "paragraph",
        text: "وجبة الإفطار هي النافذة الأهمّ لأنها تحتوي على أكبر كمّية من الدهون في يومك، وجسمك بعد ١٤ ساعة صيام يكون أكثر استجابة وأكثر إفرازاً للإنزيمات الهضمية.",
      },
      {
        type: "heading",
        text: "خمسة أخطاء شائعة",
      },
      {
        type: "paragraph",
        text: "<strong>١. تناول المالتي على معدة فارغة عند الإفطار.</strong> كثيرون يبتلعون الحبّة قبل حتى أن يأكلوا؛ النتيجة غثيان وامتصاص ضعيف. ابدأ بالتمر والماء والشوربة، ثم تناول طعامك، ثم تناول المكمّل في منتصف الوجبة أو بعدها مباشرة.",
      },
      {
        type: "paragraph",
        text: "<strong>٢. فيتامين D بدون دهون.</strong> حبّة الفيتامين تحتاج وسطاً دهنياً. قطعة سمك، ملعقة زيت زيتون، شريحة أفوكادو، أو حتى بعض الجبن — كلّها تكفي. تذكّر: ٣٢٪ فرق.",
      },
      {
        type: "paragraph",
        text: "<strong>٣. الحديد مع الشاي والقهوة.</strong> التانينات في الشاي والقهوة تقلّل امتصاص الحديد بشكل كبير. افصل بين الحديد والشاي/القهوة بساعتين على الأقل.",
      },
      {
        type: "paragraph",
        text: "<strong>٤. الجرعات الزائدة.</strong> الإفراط في الفيتامينات الذائبة في الدهون (خاصّة A وD) قد يكون ضارّاً لأنها تُخزَّن في الجسم وتتراكم.",
      },
      {
        type: "paragraph",
        text: "<strong>٥. الرياضة قبل الإفطار مع منبّهات.</strong> منبّهات ما قبل التمرين على معدة فارغة قد تسبّب جفافاً وخفقاناً وعدم اتّزان. اكتفِ بالماء عند كسر الصيام مباشرة.",
      },
      {
        type: "heading",
        text: "الخلاصة",
      },
      {
        type: "paragraph",
        text: "رمضان لا يوقف حاجتكَ للمكمّلات، لكنه يعيد رسم جدولها. التوقيت الصحيح يعني أن جرعتكَ تصل فعلاً إلى حيث تحتاجها. والقاعدة الذهبية التي يسهل تذكّرها: <em>الدهني مع الطعام الدهني، والمائي متى شئت</em>.",
      },
    ],
    tags: ["#رمضان", "#المكمّلات", "#الصيام", "#توقيت_الجرعات"],
    references: [
      "Dawson-Hughes B, Harris SS, Lichtenstein AH, Dolnikowski G, Palermo NJ, Rasmussen H. Dietary Fat Increases Vitamin D-3 Absorption. Journal of the Academy of Nutrition and Dietetics. 2015;115(2):225–230.",
      "Cavalier E, Jandrain B, Coffiner M, et al. Effect of High- versus Low-Fat Meal on Serum 25-Hydroxyvitamin D Levels. ISRN Endocrinology. 2011:809069.",
      "Ghufli F. Fasting and Medications: Safely Navigating Ramadan with Proper Medical Compliance. Clinical guidance, Sheikh Shakhbout Medical City, 2024.",
    ],
    prev: {
      slug: "read-blood-tests",
      title: "كيف تقرأ تحاليل دمك بنفسك",
    },
    next: null,
  },
];
