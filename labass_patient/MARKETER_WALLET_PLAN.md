# Marketer Wallet — UI/UX Prototype (orgPortal) — Implementation Spec

> Self-contained build spec. Follow it top-to-bottom. All numbers are **mock data**; no backend work. Everything is **Arabic / RTL**, built in the **new design system**. Target is **mobile width** primarily.

---

## 0. Context (why)

Labass is launching **wallets for marketers**. A marketer earns a percentage (e.g. 10%) of each consultation or subscription that comes through their marketing link / promo / referral code. Today there is **no balance/ledger/earnings concept** in the codebase — only a `marketerPercentage` rate on promo codes and consultation/referral counts; payouts are manual weekly transfers.

This task builds a **Wallet tab** inside the existing marketer-facing `orgPortal` so we can show marketers the experience. UI only. Data is mocked. Built in the new brand look (forest/lime/cream + Cairo + pill buttons per `doctor_web_nextjs/LABASS_DESIGN_SYSTEM.md`).

**Confirmed scope:** New design system ✓ · Mock data only ✓ · Include time filters (week/month/all) ✓ · Include share-links + payout history ✓ · **Exclude** withdraw/payout CTA and available-vs-pending split (single balance figure) ✗.

Working dir for all paths below: `/Users/mostafayassin/Projects/labass/nextjs_patient/labass_patient`

---

## 1. Design tokens — `tailwind.config.ts`

Add the new palette to `theme.extend.colors` (additive; **do not** remove `custom-green`, other tabs use it). Exact hex values:

```ts
// inside theme.extend.colors { ... }
forest:      "#173404",
forestDeep:  "#0d2002",
lime:        "#7ED957",
sage:        "#97C459",
green600:    "#639922",
green700:    "#27500A",
paleGreen:   "#EAF3DE",
paleGreen2:  "#C0DD97",
surface:     "#fdfcf7",
surfaceAlt:  "#f7fbf0",
surfaceTint: "#f2faed",
```

Also add the card shadow + radii (extend, don't replace):

```ts
boxShadow: {
  "wallet-card":  "0 24px 64px rgba(23,52,4,0.08)",
  "wallet-hover": "0 16px 36px rgba(23,52,4,0.10)",
  "wallet-chip":  "0 8px 22px rgba(23,52,4,0.15)",
},
borderRadius: {
  "wallet-md": "14px",
  "wallet-lg": "16px",
  "wallet-xl": "18px",
},
```

Font: **Cairo** is already shipped/loaded globally (`public/fonts/Cairo-*.ttf`) — no font work needed. For balance/amount numerals use `tabular-nums` via inline style `style={{ fontVariantNumeric: "tabular-nums" }}`.

---

## 2. Types — create `src/app/orgPortal/_types/walletTypes.ts`

```ts
export type WalletPeriod = "week" | "month" | "all";

export type WalletTxnType = "consultation" | "subscription";
export type WalletTxnStatus = "completed" | "pending";

export interface WalletTransaction {
  id: string;
  type: WalletTxnType;
  patientLabel: string;   // e.g. "المريض س" (already localized in mock)
  amount: number;         // SAR, the marketer's cut
  date: string;           // ISO yyyy-mm-dd
  status: WalletTxnStatus;
}

export type PayoutMethod = "stcpay" | "bank";
export type PayoutStatus = "completed" | "processing";

export interface PayoutRecord {
  id: string;
  amount: number;         // SAR
  date: string;           // ISO
  method: PayoutMethod;
  status: PayoutStatus;
}

export interface WalletPeriodData {
  consultationsCount: number;
  subscriptionsCount: number;
  earned: number;               // total earned in this period (SAR)
  transactions: WalletTransaction[];
}

export interface WalletData {
  balance: number;              // current withdrawable/total balance (SAR)
  totalEarned: number;          // lifetime earned (SAR)
  commissionPercentage: number; // e.g. 10
  referralCode: string;
  marketingLink: string;
  periods: Record<WalletPeriod, WalletPeriodData>;
  payouts: PayoutRecord[];
}
```

---

## 3. Mock data — create `src/app/orgPortal/_components/wallet/walletMockData.ts`

```ts
import { WalletData } from "../../_types/walletTypes";

export const walletMockData: WalletData = {
  balance: 1240,
  totalEarned: 3675,
  commissionPercentage: 10,
  referralCode: "LABASS-MK-8492",
  marketingLink: "https://labass.sa/r/LABASS-MK-8492",
  periods: {
    week: {
      consultationsCount: 6,
      subscriptionsCount: 2,
      earned: 140,
      transactions: [
        { id: "w1", type: "consultation", patientLabel: "المريض س", amount: 15, date: "2026-07-12", status: "completed" },
        { id: "w2", type: "subscription", patientLabel: "المريض ص", amount: 25, date: "2026-07-11", status: "completed" },
        { id: "w3", type: "consultation", patientLabel: "المريض ع", amount: 15, date: "2026-07-10", status: "pending" },
        { id: "w4", type: "subscription", patientLabel: "المريض ن", amount: 25, date: "2026-07-09", status: "completed" },
        { id: "w5", type: "consultation", patientLabel: "المريض ك", amount: 15, date: "2026-07-08", status: "completed" },
        { id: "w6", type: "consultation", patientLabel: "المريض ه", amount: 15, date: "2026-07-08", status: "completed" },
      ],
    },
    month: {
      consultationsCount: 23,
      subscriptionsCount: 8,
      earned: 545,
      transactions: [
        { id: "m1", type: "subscription", patientLabel: "المريض ص", amount: 25, date: "2026-07-11", status: "completed" },
        { id: "m2", type: "consultation", patientLabel: "المريض س", amount: 15, date: "2026-07-12", status: "completed" },
        { id: "m3", type: "subscription", patientLabel: "المريض و", amount: 25, date: "2026-07-05", status: "completed" },
        { id: "m4", type: "consultation", patientLabel: "المريض ط", amount: 15, date: "2026-07-03", status: "completed" },
        { id: "m5", type: "consultation", patientLabel: "المريض ي", amount: 15, date: "2026-07-02", status: "pending" },
        { id: "m6", type: "subscription", patientLabel: "المريض ل", amount: 25, date: "2026-07-01", status: "completed" },
      ],
    },
    all: {
      consultationsCount: 148,
      subscriptionsCount: 41,
      earned: 3675,
      transactions: [
        { id: "a1", type: "subscription", patientLabel: "المريض ص", amount: 25, date: "2026-07-11", status: "completed" },
        { id: "a2", type: "consultation", patientLabel: "المريض س", amount: 15, date: "2026-07-12", status: "completed" },
        { id: "a3", type: "subscription", patientLabel: "المريض ب", amount: 25, date: "2026-06-28", status: "completed" },
        { id: "a4", type: "consultation", patientLabel: "المريض د", amount: 15, date: "2026-06-20", status: "completed" },
        { id: "a5", type: "subscription", patientLabel: "المريض ر", amount: 25, date: "2026-06-14", status: "completed" },
        { id: "a6", type: "consultation", patientLabel: "المريض ز", amount: 15, date: "2026-06-09", status: "completed" },
      ],
    },
  },
  payouts: [
    { id: "p1", amount: 545, date: "2026-07-01", method: "stcpay", status: "completed" },
    { id: "p2", amount: 610, date: "2026-06-01", method: "bank",   status: "completed" },
    { id: "p3", amount: 480, date: "2026-05-01", method: "stcpay", status: "completed" },
  ],
};
```

---

## 4. i18n — edit `src/utils/i18n.ts`

Add a `wallet` block under **both** `ar` and `en` `translation` objects (ar is default `lng`). Match the existing nesting style already used for `subscription.tabLabel`.

**Arabic (`ar.translation.wallet`):**
```ts
wallet: {
  tabLabel: "المحفظة",
  title: "محفظتي",
  currentBalance: "الرصيد الحالي",
  currency: "ر.س",
  totalEarned: "إجمالي الأرباح",
  commissionRate: "نسبتك",
  commissionExplainer: "تحصل على {{percent}}٪ من كل استشارة أو اشتراك يتم عبر رابطك",
  consultationsCount: "الاستشارات",
  subscriptionsCount: "الاشتراكات",
  filter: { week: "هذا الأسبوع", month: "هذا الشهر", all: "الكل" },
  transactionsTitle: "سجل الأرباح",
  earnedFromConsultation: "‎+{{amount}} ر.س من استشارة {{patient}}",
  earnedFromSubscription: "‎+{{amount}} ر.س من اشتراك {{patient}}",
  status: { completed: "مكتمل", pending: "قيد المعالجة" },
  emptyTransactions: "لا توجد أرباح في هذه الفترة بعد",
  shareTitle: "شارك رابطك واربح",
  shareSubtitle: "شارك الرابط أو الكود مع عملائك لتبدأ بجمع الأرباح",
  referralCodeLabel: "كود الإحالة",
  copyCode: "نسخ الكود",
  copied: "تم النسخ",
  shareLink: "مشاركة الرابط",
  payoutHistoryTitle: "سجل التحويلات",
  payoutMethod: { stcpay: "STC Pay", bank: "تحويل بنكي" },
  payoutStatus: { completed: "تم التحويل", processing: "قيد التحويل" },
  emptyPayouts: "لا توجد تحويلات سابقة",
  payoutNote: "يتم تحويل أرباحك أسبوعياً. للاستفسار تواصل مع الدعم المالي على ٠٥٠٥١١٧٥٥١",
},
```

**English (`en.translation.wallet`):** same keys, translated:
```ts
wallet: {
  tabLabel: "Wallet",
  title: "My Wallet",
  currentBalance: "Current balance",
  currency: "SAR",
  totalEarned: "Total earned",
  commissionRate: "Your rate",
  commissionExplainer: "You earn {{percent}}% of every consultation or subscription through your link",
  consultationsCount: "Consultations",
  subscriptionsCount: "Subscriptions",
  filter: { week: "This week", month: "This month", all: "All time" },
  transactionsTitle: "Earnings history",
  earnedFromConsultation: "+{{amount}} SAR from {{patient}}'s consultation",
  earnedFromSubscription: "+{{amount}} SAR from {{patient}}'s subscription",
  status: { completed: "Completed", pending: "Pending" },
  emptyTransactions: "No earnings in this period yet",
  shareTitle: "Share your link & earn",
  shareSubtitle: "Share the link or code with your clients to start earning",
  referralCodeLabel: "Referral code",
  copyCode: "Copy code",
  copied: "Copied",
  shareLink: "Share link",
  payoutHistoryTitle: "Payout history",
  payoutMethod: { stcpay: "STC Pay", bank: "Bank transfer" },
  payoutStatus: { completed: "Transferred", processing: "Processing" },
  emptyPayouts: "No previous payouts",
  payoutNote: "Earnings are transferred weekly. For questions contact financial support at 0505117551",
},
```

Interpolation note: `t('wallet.commissionExplainer', { percent: 10 })`, `t('wallet.earnedFromConsultation', { amount: 15, patient: 'المريض س' })`.

---

## 5. Add the Wallet tab to the nav — edit `src/app/orgPortal/_components/bottomNavBar.tsx`

Two changes:

**(a) Import a wallet icon** — add to the MUI import block at top:
```ts
import {
  Home as HomeIcon,
  Assignment as PatientsIcon,
  PersonAdd as RegistrationIcon,
  CardMembership as SubscriptionIcon,
  AccountBalanceWalletOutlined as WalletIcon, // ADD
} from "@mui/icons-material";
```

**(b) Extend the union type in BOTH prop declarations** — change every `"patients" | "registration" | "subscription"` to `"patients" | "registration" | "subscription" | "wallet"` (there are two: the `onToggleView` dispatch type and the `currentView` type).

**(c) Add a 4th button** after the subscription button (copy the existing button pattern exactly):
```tsx
<button
  className={`flex flex-col items-center ${
    currentView === "wallet" ? "text-blue-500" : "text-gray-500"
  }`}
  onClick={() => onToggleView("wallet")}
>
  <WalletIcon fontSize="small" />
  <span>{t('wallet.tabLabel')}</span>
</button>
```
Leave the nav bar's own styling unchanged (it's shared by all tabs). Only the wallet *content* uses the new design.

---

## 6. Wire the render branch — edit `src/app/orgPortal/page.tsx`

1. **Import** near the other `_components` imports:
```ts
import WalletSection from "./_components/wallet/WalletSection";
```
2. **Extend the `currentView` state union** (~line 65):
```ts
const [currentView, setCurrentView] = useState<
  "patients" | "registration" | "subscription" | "wallet"
>("registration");
```
   Also check the `viewParam` initializer (~line 199, `setCurrentView(viewParam)`) — if `viewParam` is typed/narrowed, widen it to accept `"wallet"` so `?view=wallet` works. If it's cast loosely, no change needed.
3. **Add the render branch** in the same area as the other `currentView === ...` blocks (~line 1147, before/after the existing branches). The `<LabBottomNavBar>` is already rendered once at the bottom — do not duplicate it:
```tsx
{currentView === "wallet" && <WalletSection />}
```

---

## 7. Wallet UI components — create under `src/app/orgPortal/_components/wallet/`

All components `"use client"` where they use hooks/state. Use `react-i18next` `useTranslation`. Container is `dir="rtl"`. Bottom padding `pb-24` so the fixed nav doesn't cover the last card.

### 7.1 `WalletSection.tsx` (top-level, owns period state)
```tsx
"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { WalletPeriod } from "../../_types/walletTypes";
import { walletMockData } from "./walletMockData";
import WalletBalanceCard from "./WalletBalanceCard";
import WalletTimeFilter from "./WalletTimeFilter";
import WalletStats from "./WalletStats";
import WalletTransactions from "./WalletTransactions";
import WalletShareLinks from "./WalletShareLinks";
import WalletPayoutHistory from "./WalletPayoutHistory";

const WalletSection: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<WalletPeriod>("week");
  const data = walletMockData;
  const periodData = data.periods[period];

  return (
    <div dir="rtl" className="min-h-screen bg-surface px-4 pt-6 pb-24 space-y-5 max-w-md mx-auto font-cairo">
      <h1 className="text-forestDeep text-xl font-extrabold">{t("wallet.title")}</h1>

      <WalletBalanceCard
        balance={data.balance}
        totalEarned={data.totalEarned}
        commissionPercentage={data.commissionPercentage}
      />

      <WalletTimeFilter value={period} onChange={setPeriod} />

      <WalletStats
        consultations={periodData.consultationsCount}
        subscriptions={periodData.subscriptionsCount}
      />

      <WalletTransactions transactions={periodData.transactions} />

      <WalletShareLinks
        referralCode={data.referralCode}
        marketingLink={data.marketingLink}
      />

      <WalletPayoutHistory payouts={data.payouts} />
    </div>
  );
};

export default WalletSection;
```
> If a `font-cairo` utility doesn't exist in the config, drop that class — Cairo is the global default. Verify against `globals.css` / `tailwind.config.ts`; add a `fontFamily.cairo` token only if convenient.

### 7.2 `WalletBalanceCard.tsx` (forest hero)
```tsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props { balance: number; totalEarned: number; commissionPercentage: number; }

const WalletBalanceCard: React.FC<Props> = ({ balance, totalEarned, commissionPercentage }) => {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden rounded-wallet-xl bg-forest text-paleGreen p-6 shadow-wallet-card">
      {/* brand-mark accent */}
      <span className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-lime/20" />
      <span className="absolute top-6 left-6 w-2.5 h-2.5 rounded-full bg-lime" />

      <p className="text-sm opacity-75">{t("wallet.currentBalance")}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-4xl font-extrabold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
          {balance.toLocaleString("en-US")}
        </span>
        <span className="text-base mb-1 opacity-90">{t("wallet.currency")}</span>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div>
          <p className="text-xs opacity-60">{t("wallet.totalEarned")}</p>
          <p className="text-sm font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
            {totalEarned.toLocaleString("en-US")} {t("wallet.currency")}
          </p>
        </div>
        <div className="text-left">
          <span className="inline-flex items-center gap-1 bg-paleGreen text-forestDeep text-xs font-bold px-3 py-1 rounded-full">
            {commissionPercentage}٪ · {t("wallet.commissionRate")}
          </span>
        </div>
      </div>

      <p className="text-[11px] opacity-70 mt-3 leading-relaxed">
        {t("wallet.commissionExplainer", { percent: commissionPercentage })}
      </p>
    </div>
  );
};
export default WalletBalanceCard;
```

### 7.3 `WalletTimeFilter.tsx` (segmented pill)
```tsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { WalletPeriod } from "../../_types/walletTypes";

interface Props { value: WalletPeriod; onChange: (p: WalletPeriod) => void; }
const ORDER: WalletPeriod[] = ["week", "month", "all"];

const WalletTimeFilter: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="flex bg-surfaceAlt rounded-full p-1 border border-[rgba(23,52,4,0.08)]">
      {ORDER.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`flex-1 text-sm py-2 rounded-full transition-all ${
            value === p ? "bg-forest text-paleGreen font-bold shadow-wallet-chip" : "text-forest/60"
          }`}
        >
          {t(`wallet.filter.${p}`)}
        </button>
      ))}
    </div>
  );
};
export default WalletTimeFilter;
```

### 7.4 `WalletStats.tsx` (two stat tiles)
```tsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { ChatBubbleOutline, CardMembership } from "@mui/icons-material";

interface Props { consultations: number; subscriptions: number; }

const StatTile: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="flex-1 bg-white rounded-wallet-lg p-4 border border-[rgba(23,52,4,0.08)] shadow-wallet-card">
    <div className="w-9 h-9 rounded-full bg-paleGreen text-green700 flex items-center justify-center mb-3">{icon}</div>
    <p className="text-2xl font-extrabold text-forestDeep" style={{ fontVariantNumeric: "tabular-nums" }}>{value}</p>
    <p className="text-xs text-forest/60 mt-0.5">{label}</p>
  </div>
);

const WalletStats: React.FC<Props> = ({ consultations, subscriptions }) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      <StatTile icon={<ChatBubbleOutline fontSize="small" />} label={t("wallet.consultationsCount")} value={consultations} />
      <StatTile icon={<CardMembership fontSize="small" />} label={t("wallet.subscriptionsCount")} value={subscriptions} />
    </div>
  );
};
export default WalletStats;
```

### 7.5 `WalletTransactions.tsx` (earnings feed)
```tsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { ChatBubbleOutline, CardMembership } from "@mui/icons-material";
import { WalletTransaction } from "../../_types/walletTypes";

interface Props { transactions: WalletTransaction[]; }

const WalletTransactions: React.FC<Props> = ({ transactions }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-forestDeep font-bold text-base mb-3">{t("wallet.transactionsTitle")}</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-forest/50 bg-white rounded-wallet-lg p-6 text-center border border-[rgba(23,52,4,0.08)]">
          {t("wallet.emptyTransactions")}
        </p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => {
            const isConsult = tx.type === "consultation";
            const label = t(isConsult ? "wallet.earnedFromConsultation" : "wallet.earnedFromSubscription", {
              amount: tx.amount, patient: tx.patientLabel,
            });
            return (
              <li key={tx.id} className="flex items-center gap-3 bg-white rounded-wallet-lg p-3 border border-[rgba(23,52,4,0.08)] shadow-wallet-card">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isConsult ? "bg-paleGreen text-green700" : "bg-surfaceTint text-forest"}`}>
                  {isConsult ? <ChatBubbleOutline fontSize="small" /> : <CardMembership fontSize="small" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-forestDeep font-medium truncate">{label}</p>
                  <p className="text-[11px] text-forest/50" style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${tx.status === "completed" ? "bg-paleGreen text-green700" : "bg-orange-100 text-orange-600"}`}>
                  {t(`wallet.status.${tx.status}`)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default WalletTransactions;
```

### 7.6 `WalletShareLinks.tsx` (copy code + share link)
```tsx
"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ContentCopy, IosShare, Check } from "@mui/icons-material";

interface Props { referralCode: string; marketingLink: string; }

const WalletShareLinks: React.FC<Props> = ({ referralCode, marketingLink }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(referralCode); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ url: marketingLink, title: "Labass" }); } catch {} }
    else { try { await navigator.clipboard.writeText(marketingLink); } catch {} }
  };

  return (
    <div className="rounded-wallet-lg bg-surfaceTint p-5 border border-[rgba(23,52,4,0.08)]">
      <h2 className="text-forestDeep font-bold text-base">{t("wallet.shareTitle")}</h2>
      <p className="text-xs text-forest/60 mt-1 mb-4">{t("wallet.shareSubtitle")}</p>

      <div className="flex items-center justify-between bg-white rounded-full px-4 py-2 border border-[rgba(23,52,4,0.10)] mb-3">
        <span className="text-sm font-bold text-forestDeep tracking-wide" style={{ fontVariantNumeric: "tabular-nums" }}>{referralCode}</span>
        <button onClick={copyCode} className="text-green700 flex items-center gap-1 text-xs font-bold">
          {copied ? <><Check fontSize="small" /> {t("wallet.copied")}</> : <><ContentCopy fontSize="small" /> {t("wallet.copyCode")}</>}
        </button>
      </div>

      <button onClick={share} className="w-full bg-forest text-paleGreen rounded-full py-3 text-sm font-bold flex items-center justify-center gap-2 active:translate-y-[-1px] transition-transform">
        <IosShare fontSize="small" /> {t("wallet.shareLink")}
      </button>
    </div>
  );
};
export default WalletShareLinks;
```

### 7.7 `WalletPayoutHistory.tsx`
```tsx
"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { PayoutRecord } from "../../_types/walletTypes";

interface Props { payouts: PayoutRecord[]; }

const WalletPayoutHistory: React.FC<Props> = ({ payouts }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-forestDeep font-bold text-base mb-3">{t("wallet.payoutHistoryTitle")}</h2>
      {payouts.length === 0 ? (
        <p className="text-sm text-forest/50 bg-white rounded-wallet-lg p-6 text-center border border-[rgba(23,52,4,0.08)]">
          {t("wallet.emptyPayouts")}
        </p>
      ) : (
        <ul className="space-y-2">
          {payouts.map((p) => (
            <li key={p.id} className="flex items-center justify-between bg-white rounded-wallet-lg p-3 border border-[rgba(23,52,4,0.08)]">
              <div>
                <p className="text-sm font-bold text-forestDeep" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {p.amount.toLocaleString("en-US")} {t("wallet.currency")}
                </p>
                <p className="text-[11px] text-forest/50">{t(`wallet.payoutMethod.${p.method}`)} · {p.date}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-paleGreen text-green700" : "bg-orange-100 text-orange-600"}`}>
                {t(`wallet.payoutStatus.${p.status}`)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-forest/50 mt-3 leading-relaxed">{t("wallet.payoutNote")}</p>
    </div>
  );
};
export default WalletPayoutHistory;
```

---

## 8. File checklist

Create:
- `src/app/orgPortal/_types/walletTypes.ts`
- `src/app/orgPortal/_components/wallet/walletMockData.ts`
- `src/app/orgPortal/_components/wallet/WalletSection.tsx`
- `src/app/orgPortal/_components/wallet/WalletBalanceCard.tsx`
- `src/app/orgPortal/_components/wallet/WalletTimeFilter.tsx`
- `src/app/orgPortal/_components/wallet/WalletStats.tsx`
- `src/app/orgPortal/_components/wallet/WalletTransactions.tsx`
- `src/app/orgPortal/_components/wallet/WalletShareLinks.tsx`
- `src/app/orgPortal/_components/wallet/WalletPayoutHistory.tsx`

Edit:
- `tailwind.config.ts` (colors + shadow + radius tokens)
- `src/utils/i18n.ts` (`wallet.*` in `ar` and `en`)
- `src/app/orgPortal/_components/bottomNavBar.tsx` (icon import + union + 4th button)
- `src/app/orgPortal/page.tsx` (import + union widen + render branch)

---

## 9. Gotchas / must-verify

- **MUI icon names**: confirm `AccountBalanceWalletOutlined`, `ChatBubbleOutline`, `CardMembership`, `ContentCopy`, `IosShare`, `Check` exist in the installed `@mui/icons-material` version (they're standard). Swap to a close equivalent if any import fails.
- **Tailwind arbitrary borders**: `border-[rgba(23,52,4,0.08)]` and opacity utilities like `text-forest/60`, `bg-lime/20` require the custom colors to exist in config (step 1) — add them first or these silently no-op.
- **`font-cairo` / `fontVariantNumeric`**: if no `cairo` font utility exists, remove the class (Cairo is global). Numeral tabular styling is via inline `style`, so it works regardless.
- **RTL**: container is `dir="rtl"`; the fixed `LabBottomNavBar` already renders once in `page.tsx` — don't add another.
- **`viewParam` typing** in `page.tsx`: ensure `?view=wallet` is accepted after widening the union.
- Keep other tabs visually untouched — all changes are additive.

---

## 10. Verification

1. `npm run dev`; open `/orgPortal` as a marketer (or append `?view=wallet`, and `?lang=en` to check English).
2. A 4th **المحفظة** tab shows in the bottom nav and switches to the wallet view.
3. New look renders: cream `bg-surface`, forest balance hero with lime accent + pale-green rate chip, hairline cards with soft shadow, pill time-filter — clearly distinct from the old-green tabs.
4. RTL correct; Arabic reads right-to-left; amounts use tabular Latin numerals.
5. Toggle week/month/all → stats + transactions update from mock data.
6. Copy code → shows "تم النسخ" for ~1.5s; Share → native share sheet (or link copied) with no error.
7. Empty states render if a transactions/payouts array is emptied.
8. Mobile width: last card not hidden behind the fixed nav (`pb-24`), no horizontal scroll.
9. Patients / registration / subscription tabs unchanged.

---

## 11. Future backend (out of scope — note for later)

Real wallet needs an **earnings/ledger** endpoint computing `sum(payment.invoiceValue * promotionalCode.marketerPercentage / 100)` per marketer + a payout/transaction table. Counts already exist (`getConsultationCountsForAllMarketers`, `getReferralReport.summary.byMarketer` in `src/features/dashboard/…`); only the money ledger and payout records are missing. `_controllers/getMarketerConsultaion.ts` (`GET /marketers/consultations/{userId}`) is the closest real feed to swap in for the transactions list when going live.
