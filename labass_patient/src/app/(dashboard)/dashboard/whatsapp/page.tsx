"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { QrCode, RefreshCw, Send, Smartphone, Unlink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/features/dashboard/components/shared/page-header";
import { ConfirmDialog } from "@/features/dashboard/components/shared/confirm-dialog";
import { ErrorState } from "@/features/dashboard/components/shared/error-state";
import {
  useLogoutWhatsApp,
  useReconnectWhatsApp,
  useSendWhatsAppTestMessage,
  useWhatsAppQr,
  useWhatsAppStatus,
} from "@/features/dashboard/hooks/use-whatsapp";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message;
    if (message) return message;

    if (error.response?.status === 403)
      return "Only admin accounts can manage the WhatsApp connection.";
    if (error.response?.status === 502)
      return "The backend could not reach the WhatsApp gateway. Check that the gowa service is running.";
  }
  return fallback;
}

function formatJid(jid: string) {
  const number = jid.split("@")[0];
  return number ? `+${number}` : jid;
}

export default function WhatsAppPage() {
  const statusQuery = useWhatsAppStatus();
  const status = statusQuery.data;
  const qrQuery = useWhatsAppQr(status?.loggedIn === false);

  const logoutMutation = useLogoutWhatsApp();
  const reconnectMutation = useReconnectWhatsApp();
  const testMessageMutation = useSendWhatsAppTestMessage();

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [testText, setTestText] = useState("");

  const linkedJid = status?.devices.find((device) => device.jid)?.jid;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => setLogoutOpen(false),
    });
  };

  const handleSendTest = () => {
    testMessageMutation.mutate({
      phoneNumber: phoneNumber.trim(),
      message: testText.trim() || undefined,
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="WhatsApp"
        description="Link and monitor the WhatsApp account used for customer notifications."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              Connection
            </CardTitle>
            <CardDescription>
              Notifications are sent from the linked WhatsApp account.
            </CardDescription>
          </div>
          {status && (
            <div className="flex gap-2">
              <Badge variant={status.loggedIn ? "default" : "outline"}>
                {status.loggedIn ? "Linked" : "Not linked"}
              </Badge>
              <Badge variant={status.connected ? "default" : "destructive"}>
                {status.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {statusQuery.isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : statusQuery.isError ? (
            <ErrorState
              title="Could not load WhatsApp status"
              message={getErrorMessage(
                statusQuery.error,
                "An error occurred while loading the WhatsApp status."
              )}
              onRetry={() => statusQuery.refetch()}
            />
          ) : status ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">Linked number</p>
                <p className="mt-1 text-sm font-medium" dir="ltr">
                  {linkedJid ? formatJid(linkedJid) : "—"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {status.loggedIn && !status.connected && (
                  <Button
                    variant="outline"
                    onClick={() => reconnectMutation.mutate()}
                    disabled={reconnectMutation.isPending}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {reconnectMutation.isPending ? "Reconnecting..." : "Reconnect"}
                  </Button>
                )}
                {status.loggedIn && (
                  <Button
                    variant="destructive"
                    onClick={() => setLogoutOpen(true)}
                    disabled={logoutMutation.isPending}
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    Unlink account
                  </Button>
                )}
              </div>
              {reconnectMutation.isError && (
                <p className="text-sm text-destructive">
                  {getErrorMessage(reconnectMutation.error, "Reconnect failed.")}
                </p>
              )}
              {logoutMutation.isError && (
                <p className="text-sm text-destructive">
                  {getErrorMessage(logoutMutation.error, "Unlink failed.")}
                </p>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {status?.loggedIn === false && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <QrCode className="h-4 w-4 text-muted-foreground" />
              Link a device
            </CardTitle>
            <CardDescription>
              Scan the QR code with the WhatsApp account that should send
              customer notifications. The code refreshes automatically until a
              device is linked.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qrQuery.isError ? (
              <ErrorState
                title="Could not load QR code"
                message={getErrorMessage(
                  qrQuery.error,
                  "An error occurred while loading the QR code."
                )}
                onRetry={() => qrQuery.refetch()}
              />
            ) : (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-md border bg-white p-2">
                  {qrQuery.isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : qrQuery.data?.qrImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrQuery.data.qrImage}
                      alt="WhatsApp pairing QR code"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <p className="px-4 text-center text-sm text-muted-foreground">
                      Waiting for a QR code from the gateway...
                    </p>
                  )}
                </div>
                <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Open WhatsApp on the phone that owns the sending number.</li>
                  <li>
                    Go to <span className="font-medium text-foreground">Settings → Linked devices</span>.
                  </li>
                  <li>
                    Tap <span className="font-medium text-foreground">Link a device</span> and scan this code.
                  </li>
                  <li>This page updates on its own once the device is linked.</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {status?.loggedIn && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Send className="h-4 w-4 text-muted-foreground" />
              Send a test message
            </CardTitle>
            <CardDescription>
              Confirm the linked account can deliver messages before relying on
              it for customer notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="test-phone">Phone number</Label>
                  <Input
                    id="test-phone"
                    dir="ltr"
                    placeholder="+9665XXXXXXXX"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="test-text">Message (optional)</Label>
                  <Input
                    id="test-text"
                    placeholder="labass GOWA test message"
                    value={testText}
                    onChange={(event) => setTestText(event.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleSendTest}
                disabled={!phoneNumber.trim() || testMessageMutation.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                {testMessageMutation.isPending ? "Sending..." : "Send test message"}
              </Button>
              {testMessageMutation.isSuccess && (
                <p className="text-sm text-custom-green">
                  Test message sent
                  {testMessageMutation.data.messageId
                    ? ` (id ${testMessageMutation.data.messageId})`
                    : ""}
                  .
                </p>
              )}
              {testMessageMutation.isError && (
                <p className="text-sm text-destructive">
                  {getErrorMessage(
                    testMessageMutation.error,
                    "The test message could not be sent."
                  )}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Unlink WhatsApp account?"
        description="Customer notifications sent over WhatsApp will fail until a device is linked again. Flows with an SMS fallback will fall back to SMS."
        confirmLabel="Unlink"
        variant="destructive"
        isLoading={logoutMutation.isPending}
        onConfirm={handleLogout}
      />
    </div>
  );
}
