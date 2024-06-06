const DoctorInfoCard = () => {
  return (
    <div className="flex flex-row justify-end bg-white p-2  shadow rounded-lg">
      <div className="flex flex-col justify-start">
        <h2 className="text-sm font-bold ">doctorName</h2>
        <p className="text-gray-400 text-sm">doctorSpeciality</p>
      </div>
      <img src="/icons/MOHLogo.svg" alt="Doctor" className="w-12 h-12 rounded-full m-2" />
    </div>
  );
};
export default DoctorInfoCard