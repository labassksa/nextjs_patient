"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrganization } from "../orgPortal/_controllers/getOrganization";
import { getUserData } from "../orgPortal/_controllers/getUserData";
import { createBundleConsultation } from "../orgPortal/_controllers/createBundleConsultation";
import { createMagicLink } from "../orgPortal/_controllers/createMagicLink";
import { getMarketerConsultaion } from "../orgPortal/_controllers/getMarketerConsultaion";
import { getLabPatients } from "../orgPortal/_controllers/getLabPatients";
import { Gender } from "../orgPortal/_types/genderType";
import { DealType } from "../orgPortal/_types/dealType";
import { convertArabicToEnglishNumbers } from "../../utils/arabicToenglish";

/* ─── Types ─── */
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalId?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
}

interface Consultation {
  id: number;
  status: string;
  createdAt: string;
  patient: { id: number; firstName: string; lastName: string; phoneNumber: string };
}

type View = "list" | "detail" | "confirm" | "register";

/* ─── Nationalities ─── */
const NATIONALITIES = [
  "سعودي", "باكستاني", "مصري", "إماراتي", "قطري", "كويتي", "بحريني", "عماني",
  "يمني", "لبناني", "سوري", "أردني", "فلسطيني", "عراقي", "ليبي", "تونسي",
  "جزائري", "مغربي", "سوداني", "صومالي", "أفغاني", "بنغلاديشي", "هندي",
  "سريلانكي", "نيبالي", "فلبيني", "إندونيسي", "ماليزي", "تايلندي", "صيني",
  "تركي", "إيراني", "بريطاني", "فرنسي", "ألماني", "أمريكي", "كندي", "أسترالي",
  "نيجيري", "إثيوبي", "جنوب أفريقي", "برازيلي", "أخرى",
];

/* ─── Mock students for development/testing ─── */
const MOCK_STUDENTS: Student[] = [
  { id: 9001, firstName: "محمد", lastName: "العتيبي", phoneNumber: "0501234567", nationalId: "1234567890", gender: "male", nationality: "سعودي" },
  { id: 9002, firstName: "أحمد", lastName: "الغامدي", phoneNumber: "0557654321", nationalId: "1098765432", gender: "male", nationality: "سعودي" },
  { id: 9003, firstName: "فاطمة", lastName: "الزهراني", phoneNumber: "0531122334", nationalId: "2345678901", gender: "female", nationality: "سعودي" },
  { id: 9004, firstName: "عبدالله", lastName: "القحطاني", phoneNumber: "0509988776", nationalId: "1122334455", gender: "male", nationality: "سعودي" },
  { id: 9005, firstName: "نورة", lastName: "السهلي", phoneNumber: "0568877665", nationalId: "2233445566", gender: "female", nationality: "سعودي" },
  { id: 9006, firstName: "خالد", lastName: "الدوسري", phoneNumber: "0544332211", nationalId: "1345678901", gender: "male", nationality: "سعودي" },
  { id: 9007, firstName: "سارة", lastName: "الحربي", phoneNumber: "0512233445", nationalId: "2456789012", gender: "female", nationality: "سعودي" },
  { id: 9008, firstName: "عمر", lastName: "الشمري", phoneNumber: "0598765432", nationalId: "1567890123", gender: "male", nationality: "سعودي" },
  { id: 9009, firstName: "ريم", lastName: "العمري", phoneNumber: "0543219876", nationalId: "2678901234", gender: "female", nationality: "سعودي" },
  { id: 9010, firstName: "يوسف", lastName: "البقمي", phoneNumber: "0526677889", nationalId: "1789012345", gender: "male", nationality: "سعودي" },
  { id: 9011, firstName: "هند", lastName: "الرشيدي", phoneNumber: "0556644332", nationalId: "2890123456", gender: "female", nationality: "سعودي" },
  { id: 9012, firstName: "علي", lastName: "الجهني", phoneNumber: "0534455667", nationalId: "1890123456", gender: "male", nationality: "سعودي" },
  { id: 9013, firstName: "منى", lastName: "الأحمدي", phoneNumber: "0578899001", nationalId: "2901234567", gender: "female", nationality: "سعودي" },
  { id: 9014, firstName: "عبدالرحمن", lastName: "الزيد", phoneNumber: "0511223344", nationalId: "1901234567", gender: "male", nationality: "سعودي" },
  { id: 9015, firstName: "لمياء", lastName: "الصالح", phoneNumber: "0565544332", nationalId: "2012345678", gender: "female", nationality: "سعودي" },
  { id: 9016, firstName: "طارق", lastName: "المطيري", phoneNumber: "0502233441", nationalId: "1456789012", gender: "male", nationality: "سعودي" },
  { id: 9017, firstName: "أسماء", lastName: "الحمدان", phoneNumber: "0539988123", nationalId: "2567890123", gender: "female", nationality: "سعودي" },
  { id: 9018, firstName: "بندر", lastName: "العنزي", phoneNumber: "0556677889", nationalId: "1678901234", gender: "male", nationality: "سعودي" },
  { id: 9019, firstName: "رنا", lastName: "السبيعي", phoneNumber: "0583344556", nationalId: "2789012345", gender: "female", nationality: "سعودي" },
  { id: 9020, firstName: "ماجد", lastName: "الثبيتي", phoneNumber: "0527788990", nationalId: "1789012356", gender: "male", nationality: "سعودي" },
  { id: 9021, firstName: "شيماء", lastName: "المالكي", phoneNumber: "0561122334", nationalId: "2890123457", gender: "female", nationality: "سعودي" },
  { id: 9022, firstName: "فيصل", lastName: "الحارثي", phoneNumber: "0548877665", nationalId: "1890123458", gender: "male", nationality: "سعودي" },
  { id: 9023, firstName: "دانة", lastName: "الشهري", phoneNumber: "0572211334", nationalId: "2901234569", gender: "female", nationality: "سعودي" },
  { id: 9024, firstName: "حمد", lastName: "البلوي", phoneNumber: "0515566778", nationalId: "1012345670", gender: "male", nationality: "سعودي" },
  { id: 9025, firstName: "وفاء", lastName: "الزهيري", phoneNumber: "0569900112", nationalId: "2123456781", gender: "female", nationality: "سعودي" },
];

/* ─── Helpers ─── */
const calcDOB = (ageStr: string) => {
  const yr = parseInt(convertArabicToEnglishNumbers(ageStr) || ageStr, 10);
  if (isNaN(yr)) return new Date().toISOString().split("T")[0];
  const d = new Date();
  d.setFullYear(d.getFullYear() - yr);
  return d.toISOString().split("T")[0];
};

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const deriveStudents = (consultList: Consultation[]): Student[] => {
  const seen = new Set<number>();
  const derived: Student[] = [];
  for (const c of consultList) {
    if (c.patient && !seen.has(c.patient.id)) {
      seen.add(c.patient.id);
      derived.push({
        id: c.patient.id,
        firstName: (c.patient as any).firstName || "",
        lastName: (c.patient as any).lastName || "",
        phoneNumber: (c.patient as any).phoneNumber || "",
        nationalId: (c.patient as any).nationalId,
        dateOfBirth: (c.patient as any).dateOfBirth,
        gender: (c.patient as any).gender,
        nationality: (c.patient as any).nationality,
      });
    }
  }
  return derived;
};

/* ─── Highlight matching text ─── */
const normalizeStr = (str: string) =>
  str.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").toLowerCase();

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const nQuery = normalizeStr(query.trim());
  const nText = normalizeStr(text);
  const idx = nText.indexOf(nQuery);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function SchoolPortal() {
  const router = useRouter();

  /* Org / user */
  const [orgName, setOrgName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [dealType, setDealType] = useState("");
  const [initLoading, setInitLoading] = useState(true);

  /* Data */
  const [students, setStudents] = useState<Student[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  /* Navigation */
  const [view, setView] = useState<View>("list");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  /* Search */
  const [search, setSearch] = useState("");

  /* New student form */
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState<Gender>(Gender.Male);
  const [regNationality, setRegNationality] = useState("سعودي");
  const [regNationalId, setRegNationalId] = useState("");

  /* UI state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idError, setIdError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ── Init ── */
  useEffect(() => {
    const token = localStorage.getItem("labass_token");
    if (!token) { setInitLoading(false); router.push("/schoolLogin"); return; }

    Promise.all([getOrganization(), getUserData(), getMarketerConsultaion(), getLabPatients()])
      .then(([orgRes, userRes, consultRes, patientsRes]) => {
        if (!orgRes.success) { router.push("/schoolLogin"); return; }
        if (orgRes.data?.type !== "school") { router.push("/orgPortal"); return; }

        setOrgName(orgRes.data?.name || "");
        setDealType(orgRes.data?.dealType || "");

        if (userRes.success) {
          const fn = userRes.data?.firstName || "";
          const ln = userRes.data?.lastName || "";
          setEmployeeName(`${fn} ${ln}`.trim());
        }

        // Consultations for history view
        const consultList = consultRes.success
          ? (consultRes.data?.consultations ?? consultRes.data ?? [])
          : [];
        setConsultations(consultList);

        // Primary: registered patients from backend
        // Fallback: derive from consultations
        if (patientsRes.success && patientsRes.data) {
          const raw = patientsRes.data?.patients ?? patientsRes.data ?? [];
          const list: Student[] = Array.isArray(raw) ? raw.map((p: any) => ({
            id: p.id,
            firstName: p.firstName || "",
            lastName: p.lastName || "",
            phoneNumber: p.phoneNumber || "",
            nationalId: p.nationalId,
            dateOfBirth: p.dateOfBirth,
            gender: p.gender,
            nationality: p.nationality,
          })) : [];
          const derived = deriveStudents(consultList);
          setStudents(list.length > 0 ? list : derived.length > 0 ? derived : MOCK_STUDENTS);
        } else {
          const derived = deriveStudents(consultList);
          setStudents(derived.length > 0 ? derived : MOCK_STUDENTS);
        }
      })
      .catch(() => setStudents(MOCK_STUDENTS))
      .finally(() => setInitLoading(false));
  }, []);

  /* ── Refresh data ── */
  const refreshData = async () => {
    const [cr, pr] = await Promise.all([getMarketerConsultaion(), getLabPatients()]);
    const consultList = cr.success ? (cr.data?.consultations ?? cr.data ?? []) : [];
    setConsultations(consultList);

    if (pr.success && pr.data) {
      const raw = pr.data?.patients ?? pr.data ?? [];
      const list: Student[] = Array.isArray(raw) ? raw.map((p: any) => ({
        id: p.id, firstName: p.firstName || "", lastName: p.lastName || "",
        phoneNumber: p.phoneNumber || "", nationalId: p.nationalId,
        dateOfBirth: p.dateOfBirth, gender: p.gender, nationality: p.nationality,
      })) : [];
      setStudents(list.length > 0 ? list : deriveStudents(consultList));
    } else {
      setStudents(deriveStudents(consultList));
    }
  };

  /* ── Create consultation (shared for both flows) ── */
  const createConsultation = async (patientInfo: {
    phoneNumber: string;
    role: string[];
    firstName: string;
    lastName: string;
    gender: Gender;
    nationality: string;
    nationalId: string;
    dateOfBirth: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      if (dealType === DealType.SUBSCRIPTION) {
        const res = await createBundleConsultation({
          patientInfo,
          consultationType: "general",
          sendSMS: true,
        });
        if (!res.success) throw new Error(res.message || "حدث خطأ");
        setMagicLink(res.data?.magicLink || "");
      } else {
        const res = await createMagicLink({
          patientInfo,
          paymentMethod: "REVENUE_SHARE",
          orgType: "school",
          dealType: "REVENUE_SHARE",
          consultationPrice: null,
          testType: "",
          consultationType: "general",
          sendSMS: true,
        });
        setMagicLink(res.link || "");
      }
      setShowModal(true);
      await refreshData();
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  /* ── Confirm consultation for existing student ── */
  const handleConfirm = async () => {
    if (!selectedStudent) return;
    const parts = `${selectedStudent.firstName} ${selectedStudent.lastName}`.trim().split(/\s+/);
    const raw = selectedStudent.phoneNumber || "";
    const phoneFormatted = raw.startsWith("05")
      ? `+966${raw.slice(1)}`
      : raw.startsWith("+966") ? raw : `+966${raw}`;
    await createConsultation({
      phoneNumber: phoneFormatted,
      role: ["student"],
      firstName: parts[0],
      lastName: parts.slice(1).join(" ") || ".",
      gender: (selectedStudent.gender as Gender) || Gender.Male,
      nationality: selectedStudent.nationality || "سعودي",
      nationalId: selectedStudent.nationalId || "",
      dateOfBirth: selectedStudent.dateOfBirth?.split("T")[0] || calcDOB("15"),
    });
  };

  /* ── Register new student and create consultation ── */
  const handleRegister = async () => {
    setError("");
    setIdError(null);
    setPhoneError(null);
    if (!regName.trim() || !regPhone.trim() || !regAge.trim() || !regNationalId.trim()) {
      setError("يرجى تعبئة جميع الحقول المطلوبة"); return;
    }
    const phoneClean = convertArabicToEnglishNumbers(regPhone) || regPhone;
    if (!/^05\d{8}$/.test(phoneClean)) {
      setPhoneError("رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"); return;
    }
    if (!/^[0-9]{10}$/.test(regNationalId)) {
      setIdError("رقم الهوية يجب أن يتكون من 10 أرقام"); return;
    }
    const phoneFormatted = `+966${phoneClean.slice(1)}`;
    const parts = regName.trim().split(/\s+/);
    await createConsultation({
      phoneNumber: phoneFormatted,
      role: ["student"],
      firstName: parts[0],
      lastName: parts.slice(1).join(" ") || ".",
      gender: regGender,
      nationality: regNationality,
      nationalId: regNationalId,
      dateOfBirth: calcDOB(regAge),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(magicLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("labass_token");
    localStorage.removeItem("labass_userId");
    router.push("/home");
  };

  const goBack = () => {
    setError(""); setIdError(null); setPhoneError(null);
    if (view === "confirm" && selectedStudent) {
      setView("detail");
    } else {
      setView("list"); setSelectedStudent(null);
      setRegName(""); setRegPhone(""); setRegAge(""); setRegNationalId("");
      setRegGender(Gender.Male); setRegNationality("سعودي");
    }
  };

  const goToList = () => {
    setMagicLink(""); setCopied(false); setError("");
    setShowModal(false); setView("list"); setSelectedStudent(null);
  };

  /* ── Derived data ── */
  const normalize = (str: string) =>
    str.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").toLowerCase().trim();

  const filtered = search.trim()
    ? students.filter((s) =>
        normalize(`${s.firstName} ${s.lastName} ${s.phoneNumber} ${s.nationalId || ""}`).includes(normalize(search))
      )
    : students;

  const studentConsultations = selectedStudent
    ? consultations.filter((c) => c.patient?.id === selectedStudent.id)
    : [];

  /* ════════════════════════════════════ RENDER ═══════ */

  if (initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <p className="text-gray-400 text-sm animate-pulse">جارٍ التحميل...</p>
      </div>
    );
  }

  /* Header title per view */
  const headerTitle = view === "detail" && selectedStudent
    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
    : view === "confirm"
    ? "تأكيد الاستشارة"
    : view === "register"
    ? "طالب جديد"
    : null;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50" style={{ fontFamily: "Tajawal, system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <header
        className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top, 0.75rem))" }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {view !== "list" && (
            <button onClick={goBack} className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-1 p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 5l5 5-5 5M18 10H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <div className="min-w-0 flex-1">
            {headerTitle ? (
              <h1 className="text-base font-bold text-gray-900 leading-tight truncate">{headerTitle}</h1>
            ) : (
              <>
                <p className="text-xs text-gray-400 leading-none mb-0.5">مرحباً،</p>
                <h1 className="text-base font-bold text-gray-900 leading-tight truncate">{orgName || "بوابة المدرسة"}</h1>
                {employeeName && <p className="text-xs text-gray-400 leading-none mt-0.5 truncate">{employeeName}</p>}
              </>
            )}
          </div>
        </div>
        <button onClick={handleLogout} className="flex-shrink-0 text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 active:bg-red-100 transition-colors mr-2">
          خروج
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}>

        {/* ══════════ VIEW: LIST ══════════ */}
        {view === "list" && (
          <>
            {/* Action bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث باسم الطالب أو رقم الهوية..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                onClick={() => { setError(""); setView("register"); }}
                className="flex-shrink-0 flex items-center gap-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                <span className="text-lg leading-none">+</span>
                طالب جديد
              </button>
            </div>

            {/* Student count */}
            {students.length > 0 && (
              <p className="text-xs text-gray-400 px-1">{students.length} طالب مسجّل</p>
            )}

            {/* Student list */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-400 text-sm">
                  {students.length === 0 ? "لا يوجد طلاب مسجلون بعد" : "لا توجد نتائج"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => { setSelectedStudent(student); setError(""); setView("detail"); }}
                    className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:border-gray-300 transition-colors active:bg-gray-50"
                  >
                    {/* Avatar + info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700 text-sm font-bold">
                          {(student.firstName?.[0] || "").toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          <Highlight text={`${student.firstName} ${student.lastName}`} query={search} />
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate" dir="ltr">
                          <Highlight text={student.phoneNumber} query={search} />
                        </p>
                      </div>
                    </div>

                    {/* Request consultation button — stops propagation so card click goes to detail */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); setError(""); setView("confirm"); }}
                      className="flex-shrink-0 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                      استشارة
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════ VIEW: DETAIL (student past consultations) ══════════ */}
        {view === "detail" && selectedStudent && (
          <>
            {/* Student info card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 text-lg font-bold">
                    {(selectedStudent.firstName?.[0] || "").toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{selectedStudent.phoneNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                {selectedStudent.nationalId && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-400 mb-0.5">رقم الهوية</p>
                    <p className="font-medium text-gray-700" dir="ltr">{selectedStudent.nationalId}</p>
                  </div>
                )}
                {selectedStudent.gender && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-400 mb-0.5">الجنس</p>
                    <p className="font-medium text-gray-700">{selectedStudent.gender === "male" ? "ذكر" : "أنثى"}</p>
                  </div>
                )}
                {selectedStudent.nationality && (
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-gray-400 mb-0.5">الجنسية</p>
                    <p className="font-medium text-gray-700">{selectedStudent.nationality}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => { setError(""); setView("confirm"); }}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                طلب استشارة جديدة
              </button>
            </div>

            {/* Past consultations */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 px-1">
                الاستشارات السابقة
                {studentConsultations.length > 0 && (
                  <span className="mr-1 text-gray-300">({studentConsultations.length})</span>
                )}
              </p>

              {studentConsultations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <p className="text-gray-400 text-sm">لا توجد استشارات سابقة</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {studentConsultations.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-700">{formatDate(c.createdAt)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">استشارة #{c.id}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        c.status === "Closed" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                      }`}>
                        {c.status === "Closed" ? "مكتملة" : "نشطة"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════ VIEW: CONFIRM (existing student) ══════════ */}
        {view === "confirm" && selectedStudent && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-800">تأكيد بدء الاستشارة</h2>
              <p className="text-sm text-gray-400 mt-0.5">راجع بيانات الطالب قبل الإرسال</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {[
                { label: "الاسم", value: `${selectedStudent.firstName} ${selectedStudent.lastName}` },
                { label: "رقم الجوال", value: selectedStudent.phoneNumber, ltr: true },
                { label: "رقم الهوية", value: selectedStudent.nationalId || "—", ltr: true },
                { label: "الجنس", value: selectedStudent.gender === "male" ? "ذكر" : selectedStudent.gender === "female" ? "أنثى" : "—" },
                { label: "الجنسية", value: selectedStudent.nationality || "—" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 text-xs">{row.label}</span>
                  <span className="font-medium text-gray-800" dir={row.ltr ? "ltr" : undefined}>{row.value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={goBack} className="py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                رجوع
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="py-3 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white transition-colors"
              >
                {loading ? "جارٍ الإنشاء..." : "تأكيد وإرسال"}
              </button>
            </div>
          </div>
        )}

        {/* ══════════ VIEW: REGISTER (new student) ══════════ */}
        {view === "register" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-800">تسجيل طالب جديد</h2>
              <p className="text-sm text-gray-400 mt-0.5">أدخل بيانات الطالب وسيتم إنشاء الاستشارة فوراً</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">اسم الطالب *</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">رقم الجوال *</label>
              <input
                type="tel"
                value={regPhone}
                onChange={(e) => {
                  setRegPhone(convertArabicToEnglishNumbers(e.target.value) || e.target.value);
                  setPhoneError(null);
                }}
                placeholder="05xxxxxxxx"
                dir="ltr"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${phoneError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {phoneError && (
                <p className="text-red-500 mt-1 text-xs text-right">{phoneError}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">العمر *</label>
              <input
                type="text"
                inputMode="numeric"
                value={regAge}
                onChange={(e) => setRegAge(convertArabicToEnglishNumbers(e.target.value) || e.target.value)}
                placeholder="بالسنوات"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">الجنس *</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ val: Gender.Male, lbl: "ذكر" }, { val: Gender.Female, lbl: "أنثى" }].map((g) => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setRegGender(g.val)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                      regGender === g.val
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {g.lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">الجنسية</label>
              <select
                value={regNationality}
                onChange={(e) => setRegNationality(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">رقم الهوية *</label>
              <input
                type="text"
                inputMode="numeric"
                value={regNationalId}
                onChange={(e) => {
                  setRegNationalId(convertArabicToEnglishNumbers(e.target.value) || e.target.value);
                  setIdError(null);
                }}
                placeholder="10 أرقام"
                dir="ltr"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${idError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
              />
              {idError && (
                <p className="text-red-500 mt-1 text-xs text-right">{idError}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={goBack} className="py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                رجوع
              </button>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="py-3 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white transition-colors"
              >
                {loading ? "جارٍ الإنشاء..." : "سجّل وادخل الاستشارة"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ══════════ CONFIRMATION MODAL ══════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 text-center shadow-xl">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            {/* Message */}
            <div>
              <h2 className="text-base font-bold text-gray-900">تمت إنشاء الاستشارة</h2>
              <p className="text-sm text-gray-400 mt-1">
                هل تريد الدخول للاستشارة مع الطالب الآن؟
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={() => { if (magicLink) window.location.href = magicLink; }}
              className="w-full py-3.5 rounded-xl text-sm font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              نعم، ادخل الاستشارة الآن
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${
                  copied ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {copied ? "تم النسخ ✓" : "نسخ الرابط"}
              </button>
              <button
                onClick={goToList}
                className="py-3 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                لا، العودة للقائمة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
