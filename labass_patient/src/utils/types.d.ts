// interface MyFatoorahInitConfig {
//   countryCode: string | null;
//   sessionId: string | null;
//   cardViewId: string;
//   supportedNetworks: string;
// }

// interface MyFatoorahResponse {
//   IsSuccess: boolean;
//   Message: string | null;
//   ValidationErrors: string | null;
//   Data: {
//     SessionId: string;
//     CardBrand: string;
//     CardIdentifier: string;
//     CardToken: string | null;
//   };
// }

// interface MyFatoorahSubmitResponse {
//   sessionId: string;
//   cardBrand: string;
//   cardIdentifier: string;
// }

// interface Window {
//   myFatoorah: {
//     init: (config: MyFatoorahInitConfig) => void;
//     submit: () => Promise<any>;
//   };
// }
