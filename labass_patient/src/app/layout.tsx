import "./globals.css";
import { PushNotificationProvider } from "@/components/PushNotificationProvider";
import { IncomingCallNotification } from "@/components/IncomingCallNotification";

export const metadata = {
  title: "لباس - منصة الاستشارات الطبية",
  description: "منصة الاستشارات الطبية والمكالمات المرئية",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <PushNotificationProvider>
          <IncomingCallNotification />
          {children}
        </PushNotificationProvider>
      </body>
    </html>
  );
}
