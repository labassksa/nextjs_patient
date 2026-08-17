export interface WhatsAppDevice {
  name: string;
  device: string;
  jid: string;
}

export interface WhatsAppStatus {
  connected: boolean;
  loggedIn: boolean;
  devices: WhatsAppDevice[];
}

export interface WhatsAppQr {
  loggedIn: boolean;
  qrImage?: string;
  durationSeconds?: number;
}

export interface WhatsAppActionResponse {
  success: boolean;
  message: string;
}

export interface TestMessagePayload {
  phoneNumber: string;
  message?: string;
}

export interface TestMessageResponse {
  sent: boolean;
  messageId?: string;
}
