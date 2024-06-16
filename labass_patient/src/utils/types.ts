interface MyFatoorahInitConfig {
  countryCode: string | null;
  sessionId: string | null;
  cardViewId: string;
  supportedNetworks: string;
}



interface MyFatoorahResponse {
  isSuccess: boolean;
  message: string | null;
  validationErrors: string | null;
  sessionId: string;
  cardBrand: string;
  cardIdentifier: string;
  cardToken: string | null;
}

interface Window {
  myFatoorah: {
    init: (config: MyFatoorahInitConfig) => void;
    submit: () => Promise<MyFatoorahResponse>;
  };
}
