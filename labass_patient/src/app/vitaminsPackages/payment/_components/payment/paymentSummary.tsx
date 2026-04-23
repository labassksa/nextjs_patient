import React from "react";

const PaymentSummary: React.FC<{ discountedPrice: number }> = ({
  discountedPrice,
}) => {
  const taxRate = 0.15;
  const totalAmountIncludingVAT = discountedPrice;
  const priceWithoutVAT = discountedPrice / (taxRate + 1);
  const tax = priceWithoutVAT * taxRate;

  const rows = [
    { label: "الاشتراك", value: `${priceWithoutVAT.toFixed(2)} ريال` },
    { label: "ضريبة القيمة المضافة (15%)", value: `${tax.toFixed(2)} ريال` },
  ];

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
        ملخّص الطلب
      </h2>

      <div>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "0.5px solid rgba(23, 52, 4, 0.07)",
            }}
          >
            <span
              style={{
                fontSize: 13.5,
                color: "rgba(23, 52, 4, 0.68)",
                fontWeight: 400,
              }}
            >
              {row.label}
            </span>
            <span
              style={{
                fontSize: 13.5,
                color: "#0d2002",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}

        {/* Total row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 14,
            marginTop: 6,
            borderTop: "1px solid rgba(23, 52, 4, 0.1)",
          }}
        >
          <span
            style={{ fontSize: 14, fontWeight: 600, color: "#173404" }}
          >
            المبلغ الإجمالي
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0d2002",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.5px",
            }}
          >
            <sub
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(23,52,4,0.55)",
                marginLeft: 3,
                verticalAlign: "baseline",
              }}
            >
              ريال
            </sub>
            {totalAmountIncludingVAT.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
