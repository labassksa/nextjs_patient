const DoctorInfoCard = () => {
  return (
    <div className="flex flex-row justify-end bg-white p-2 shadow rounded-lg">
      <div className="flex flex-col justify-start">
        <div className="flex flex-row items-center" dir="rtl">
          <img
            src="/images/dr_mohammed.jpg"
            alt="د. محمد"
            className="w-12 h-12 rounded-full ml-2"
          />
          <div className="flex flex-col jus">
            <h3 className="font-bold text-md text-black" dir="rtl">
              د. محمد ماهر عبدالله عوض الكريم
            </h3>
            <h3 className="font-normal text-sm text-black" dir="rtl">
              الجنسية: سوداني
            </h3>
            <h3 className="font-normal text-sm text-black" dir="rtl">
              طبيب عام{" "}
            </h3>
            <h3
              className="font-normal text-sm text-custom-green mt-2"
              dir="rtl"
            >
              طبيب مرخص من هيئة التخصصات الصحية ترخيص رقم 1287495
            </h3>
            <h3
              className="font-normal text-sm text-custom-green mt-2"
              dir="rtl"
            >
              الخبرة: سنتين{" "}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DoctorInfoCard;
