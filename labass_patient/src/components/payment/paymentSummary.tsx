const PaymentSummary: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 mt-4 mx-2 text-black">
      <div className="flex justify-between">
        <span>$10</span>
        <span>الاستشارة</span>
      </div>
      <div className="flex justify-between">
        <span>$10</span>
        <span>الضريبة</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>$350</span>
        <span>المبلغ الاجمالي</span>
      </div>
    </div>
  );
};
export default PaymentSummary;
