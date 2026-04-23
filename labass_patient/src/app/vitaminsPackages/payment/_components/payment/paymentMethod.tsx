import React from "react";
import { PaymentMethodEnum } from "@/types/paymentMethods";

interface PaymentMethodProps {
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<PaymentMethodEnum>>;
}

const methods = [
  { key: PaymentMethodEnum.ApplePay, label: "ابل باي" },
  { key: PaymentMethodEnum.Card, label: "البطاقة الائتمانية" },
  { key: PaymentMethodEnum.Cash, label: "الدفع نقداً" },
];

const PaymentMethod: React.FC<PaymentMethodProps> = ({ method, setMethod }) => {
  return (
    <div
      dir="rtl"
      style={{
        background: "#ffffff",
        border: "0.5px solid rgba(23, 52, 4, 0.1)",
        borderRadius: 14,
        padding: "18px 20px",
        margin: "12px 16px 0",
      }}
    >
      <h2
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#0d2002",
          margin: "0 0 14px",
          letterSpacing: "-0.2px",
        }}
      >
        اختر طريقة الدفع
      </h2>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {methods.map((item, i) => (
          <React.Fragment key={item.key}>
            <button
              onClick={() => setMethod(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "right",
                width: "100%",
                borderRadius: 8,
              }}
            >
              {/* Radio dot */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: `2px solid ${method === item.key ? "#173404" : "rgba(23,52,4,0.22)"}`,
                  background: method === item.key ? "#173404" : "#ffffff",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {method === item.key && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#7ED957",
                    }}
                  />
                )}
              </div>
              <span style={{ fontSize: 14, color: "#0d2002", fontWeight: 400 }}>
                {item.label}
              </span>
            </button>

            {i < methods.length - 1 && (
              <div
                style={{
                  height: "0.5px",
                  background: "rgba(23, 52, 4, 0.07)",
                  margin: "0 4px",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
