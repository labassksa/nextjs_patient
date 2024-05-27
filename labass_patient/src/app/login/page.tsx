// src/pages/CardDetailsPage.tsx
import React from "react";
import SimpleLoginForm from "../../components/login/form";

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col justify-between text-lg text-black bg-custom-background min-h-screen rtl">
      <h1 className="text-right text-bold text-4xl m-6">تسجيل الدخول</h1>
      <div className="flex-1" /> {/* This will push the form down */}
      <SimpleLoginForm />
    </div>
  );
};

export default LoginPage;
