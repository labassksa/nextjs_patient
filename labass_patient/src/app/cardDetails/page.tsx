"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CardForm from "../../components/cardDetails/CardForm";

const CardDetailsPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");

  // useEffect(() => {
  //   const fetchSessionData = async () => {
  //     try {
  //       const response = await axios.get("/api/initiate-session");
  //       if (response.data.IsSuccess) {
  //         setSessionId(response.data.Data.SessionId);
  //         setCountryCode(response.data.Data.CountryCode);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching session data:", error);
  //     }
  //   };

  //   fetchSessionData();
  // }, []);

  const handlePaymentSubmit = async () => {
    try {
      console.log("Submitting payment...");
      const result = await window.myFatoorah.submit();
      if (result.isSuccess) {
        handle3DSecure(result.PaymentURL);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handle3DSecure = (paymentUrl: string) => {
    const iframeUrl = `${paymentUrl}&iframeEnabled=true`;
    const iframe = document.createElement("iframe");
    iframe.src = iframeUrl;
    iframe.width = "100%";
    iframe.height = "500"; // Set appropriate height
    document.body.appendChild(iframe);

    window.addEventListener(
      "message",
      function (event) {
        if (!event.data) return;
        try {
          const message = JSON.parse(event.data);
          if (message.sender === "MF-3DSecure") {
            console.log("3D Secure completed:", message.url);
          }
        } catch (error) {
          console.error("Error processing 3D Secure:", error);
        }
      },
      false
    );
  };

  return (
    <div>
      <h1>Card Details</h1>
      {
        <CardForm
          sessionId="387220c2-6e74-4bfb-a1e8-5e8ce76ef5b5"
          countryCode="KWT"
        />
      }
      <button onClick={handlePaymentSubmit}>Submit Payment</button>
    </div>
  );
};

export default CardDetailsPage;
