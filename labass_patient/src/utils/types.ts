interface Window {
    myFatoorah: {
      init: (config: {
        countryCode: string;
        sessionId: string;
        cardViewId: string;
        supportedNetworks: string;
      }) => void;
      submit: () => Promise<{
        isSuccess: boolean;
        PaymentURL: string;
        sessionId: string;
        cardBrand: string;
        cardIdentifier: string;
      }>;
    };
  }
  