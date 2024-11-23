import React, { useState } from "react";

const MarketerRegistrationForm: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    if (!name || !phone) {
      alert("Please enter both your name and phone number.");
      return;
    }

    // Simulate API call here
    alert(
      "Your details have been saved, and promo codes will be generated for you!"
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Register as a Marketer</h2>
      <p className="mb-4">
        Enter your details below to register and proceed to learn how it works.
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700"
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default MarketerRegistrationForm;
