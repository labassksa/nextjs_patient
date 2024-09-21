import { ErrorOutline } from "@mui/icons-material";

const ErrorSection = () => {
  return (
    <div className="text-center p-4">
      <ErrorOutline className="text-red-500 w-24 h-24" />
      <p className="text-lg font-semibold text-black mb-1">لم يتم الدفع</p>
      <p className="text-gray-600 text-xs">
        في حال تكرار الخطأ تواصل مع خدمة العملاء{" "}
      </p>
    </div>
  );
};
export default ErrorSection;
