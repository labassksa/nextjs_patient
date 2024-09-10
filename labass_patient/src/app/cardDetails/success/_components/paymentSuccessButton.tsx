import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StatusSection = () => {
  return (
    <div className="text-center p-4">
      <CheckCircleIcon className="text-custom-green w-24 h-24" />
      <p className="text-lg font-semibold mb-1">تم الدفع بنجاح </p>
      <p className="text-gray-600 text-sm">
        أكمل معلوماتك للحصول على الاستشارة
      </p>
    </div>
  );
};
export default StatusSection;
