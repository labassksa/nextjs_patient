const PaymentSummary: React.FC<{ discountedPrice: number }> = ({
  discountedPrice,
}) => {
  const taxRate = 0.15;
  const totalAmountIncludingVAT = discountedPrice;
  const consultationPriceWithoutVAT = discountedPrice / (taxRate + 1);
  const tax = consultationPriceWithoutVAT * taxRate;

  return (
    <div className="bg-gray-100 rounded-xl p-4 mt-4 mx-2 text-black">
      <div className="flex justify-between">
        <span>{consultationPriceWithoutVAT.toFixed(2)} SR</span>
        <span>الاستشارة</span>
      </div>
      <div className="flex justify-between">
        <span>{tax.toFixed(2)} SR</span>
        <span>الضريبة</span>
      </div>
      <div className="flex justify-between font-bold mb-2">
        <span>{totalAmountIncludingVAT.toFixed(2)} SR</span>
        <span>المبلغ الاجمالي</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
