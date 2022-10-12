import { FC } from "react";

const ErrorScreen: FC<{ retry: () => void }> = ({ retry }) => {
  return (
    <div className="w-full h-full bg-[#f00] bg-opacity-10 absolute z-50 top-0 left-0 backdrop-blur-[50px] flex flex-col items-center justify-center">
      <h1>😭 Oops!!!</h1>
      <p className="mt-[30px] text-white text-opacity-60 text-[16px] text-center">
        Error occured while loading!!!
      </p>
      <button onClick={retry} className="mt-[40px] underline">
        Try Again
      </button>
    </div>
  );
};

export default ErrorScreen;
