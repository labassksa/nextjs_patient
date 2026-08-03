This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Record the Wallet onboarding demo

The Playwright demo validates the safe demo credentials, preloads a privacy-safe
demo session, and begins the visible recording on the organization portal. It
then opens the marketer Wallet and records a native 9:16 mobile viewport with an
animated cursor, click rings, cinematic spotlight zooms, animated revenue
figures, and self-hosted IBM Plex Sans Arabic captions. The captured video is
upscaled to vertical 1080 × 1920 and exported as both WebM and shareable H.264
MP4 for Shorts/Reels without changing its aspect ratio. Network responses are
replaced with deterministic, synthetic demo data during the run; this prevents
SMS delivery and guarantees that no real patient or payment data can enter the
recording.

1. Install dependencies and the Playwright browser:

   ```bash
   npm install
   npx playwright install chromium
   ```

2. Create the untracked demo environment file:

   ```bash
   cp .env.demo.example .env.demo
   ```

3. In `.env.demo`, set `DEMO_PHONE` and `DEMO_OTP` to the safe demo account
   values. Do not use a production account.

4. Record the video:

   ```bash
   npm run demo:wallet
   ```

The final recordings are written to:

```text
demo-output/wallet-onboarding.webm
demo-output/wallet-onboarding.mp4
```

The test intentionally fails when the Wallet, full history, consultation
commission, subscription referral commission, or payout cannot be found. A
failure video and trace remain under `test-results/playwright/` for debugging.
