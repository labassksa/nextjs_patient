export {};

declare global {
  interface Window {
    myFatoorah: {
      init: (config: { 
        sessionId: string;
        countryCode: string;
        currencyCode: string;
        amount: string;
        containerId: string;
        paymentOptions?: string[];
        callback: (response: any) => void;
        language?: string;
      }) => void;
    };
    myFatoorahAP: {
      init: (config: any) => void;
      updateAmount: (amount: string) => void;
    };
  }
} 