import React, { useEffect } from "react";

interface CardFormProps {
  sessionId: string;
  countryCode: string;
}

const CardForm: React.FC<CardFormProps> = ({ sessionId, countryCode }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://demo.myfatoorah.com/cardview/v2/session.js"; // Adjust URL based on environment
    script.onload = () => {
      console.log("MyFatoorah script loaded.");
      initializeMyFatoorah();
    };
    script.onerror = () => {
      console.error("Failed to load MyFatoorah script.");
    };
    document.body.appendChild(script);

    function initializeMyFatoorah() {
      if (window.myFatoorah) {
        console.log("Initializing MyFatoorah with:", {
          countryCode,
          sessionId,
        });
        window.myFatoorah.init({
          countryCode,
          sessionId,
          cardViewId: "card-element",
          supportedNetworks: "v,m,md,ae",
        });
        console.log("MyFatoorah initialized.");
      } else {
        console.error("MyFatoorah is not available on window.");
      }
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [sessionId, countryCode]);

  return (
    <div>
      <div id="card-element"></div>{" "}
      {/* MyFatoorah will render the card form here */}
    </div>
  );
};

export default CardForm;
