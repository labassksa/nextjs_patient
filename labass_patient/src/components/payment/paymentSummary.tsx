const PaymentSummary: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 mt-4 mx-2 text-black">
      <div className="flex justify-between">
        <span>35 SR</span>
        <span>الاستشارة</span>
      </div>
      <div className="flex justify-between">
        <span>5.25 SR</span>
        <span>الضريبة</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>40.25 SR</span>
        <span>المبلغ الاجمالي</span>
      </div>
    </div>
  );
};
export default PaymentSummary;
