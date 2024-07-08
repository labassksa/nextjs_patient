import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StatusSection = () => {
  return (
    <div className="text-center p-4">
      <CheckCircleIcon className="text-custom-green w-24 h-24" />
      <p className="text-lg font-semibold mb-1">تم تقديم طلب الاستشارة بنجاح</p>
      <p className="text-gray-600 text-sm">الرجاء انتظار انضمام الطبيب للموعد</p>
    </div>
  );
};
export default StatusSection
