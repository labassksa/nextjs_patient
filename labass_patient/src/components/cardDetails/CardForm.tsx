import React from "react";

interface CardFormProps {
  sessionId: string;
  countryCode: string;
}

const CardForm: React.FC<CardFormProps> = () => {
  return (
    <div className="bg-white">
      <div id="card-element"></div>
    </div>
  );
};

export default React.memo(CardForm);
