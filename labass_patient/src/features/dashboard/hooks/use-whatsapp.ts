import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/query-keys";
import {
  getWhatsAppQr,
  getWhatsAppStatus,
  logoutWhatsApp,
  reconnectWhatsApp,
  sendWhatsAppTestMessage,
} from "../api/whatsapp.api";

const PAIRING_POLL_MS = 4_000;
const LINKED_POLL_MS = 30_000;
const DEFAULT_QR_LIFETIME_S = 30;
const QR_REFRESH_MARGIN_S = 5;

export function useWhatsAppStatus() {
  return useQuery({
    queryKey: queryKeys.whatsapp.status,
    queryFn: getWhatsAppStatus,
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data?.loggedIn ? LINKED_POLL_MS : PAIRING_POLL_MS,
  });
}

export function useWhatsAppQr(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.whatsapp.qr,
    queryFn: getWhatsAppQr,
    enabled,
    staleTime: 0,
    // The QR expires server-side; fetch a fresh one a few seconds before it
    // rotates, so the displayed code is never already dead mid-scan.
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || data.loggedIn) return false;
      const lifetimeSeconds = data.durationSeconds ?? DEFAULT_QR_LIFETIME_S;
      return (
        Math.max(lifetimeSeconds - QR_REFRESH_MARGIN_S, QR_REFRESH_MARGIN_S) *
        1000
      );
    },
  });
}

function useInvalidateWhatsAppQueries() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.whatsapp.all });
  };
}

export function useLogoutWhatsApp() {
  const queryClient = useQueryClient();
  const invalidateWhatsApp = useInvalidateWhatsAppQueries();
  return useMutation({
    mutationFn: logoutWhatsApp,
    retry: false,
    onSuccess: async () => {
      // Drop the cached (now expired) QR so the re-enabled query starts from
      // a pending state instead of flashing the dead code.
      queryClient.removeQueries({ queryKey: queryKeys.whatsapp.qr });
      await invalidateWhatsApp();
    },
  });
}

export function useReconnectWhatsApp() {
  const invalidateWhatsApp = useInvalidateWhatsAppQueries();
  return useMutation({
    mutationFn: reconnectWhatsApp,
    retry: false,
    onSuccess: invalidateWhatsApp,
  });
}

export function useSendWhatsAppTestMessage() {
  return useMutation({
    mutationFn: sendWhatsAppTestMessage,
    retry: false,
  });
}
