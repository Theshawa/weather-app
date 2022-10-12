import { FC } from "react";
const LoadingScreen: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="w-full h-full bg-white bg-opacity-10 absolute z-50 top-0 left-0 backdrop-blur-[50px] flex flex-col items-center justify-center">
      <div className="w-[35px] h-[35px] border-[4px] animate-spin border-t-[#ffffff11] border-l-[#ffffff11] border-r-white border-b-white rounded-full"></div>
      <p className="mt-[30px] text-white text-opacity-60 text-[16px] text-center">
        {message || ""}
      </p>
    </div>
  );
};

export default LoadingScreen;
