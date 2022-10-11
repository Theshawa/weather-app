import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/pages/Home";
import ViewPage from "./components/pages/View";

export const LoadingContext = createContext<{
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<boolean>>;
}>({
  setLoading: () => {},
  setMessage: () => {},
  setError: () => {},
});

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  return (
    <LoadingContext.Provider
      value={{
        setLoading,
        setMessage,
        setError,
      }}
    >
      <div className="w-[96vw] max-w-[656px] mx-auto mt-[7vh] h-[86vh] rounded-[10px] overflow-hidden relative">
        <div className="w-[20vw] h-[20vw] bg-blue absolute blur-[50px] rounded-full bg-opacity-10 left-0 top-0 z-0"></div>
        <div
          style={{
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            display: loading ? "none" : "flex",
          }}
          className="bg-white bg-opacity-[0.09] backdrop-blur-[50px] relative scrollbar overflow-auto px-[23px] md:px-[63px] py-[45px] w-full h-full"
        >
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="view" element={<ViewPage />} />
          </Routes>
        </div>
        {loading ? (
          <div className="w-full h-full bg-white bg-opacity-10 absolute z-50 top-0 left-0 backdrop-blur-[50px] flex flex-col items-center justify-center">
            <div className="w-[35px] h-[35px] border-[4px] animate-spin border-t-[#ffffff11] border-l-[#ffffff11] border-r-white border-b-white rounded-full"></div>
            <p className="mt-[30px] text-white text-opacity-60 text-[16px] text-center">
              {message || ""}
            </p>
          </div>
        ) : (
          ""
        )}
        {error ? (
          <div className="w-full h-full bg-[#f00] bg-opacity-10 absolute z-50 top-0 left-0 backdrop-blur-[50px] flex flex-col items-center justify-center">
            <h1>😭 Oops!!!</h1>
            <p className="mt-[30px] text-white text-opacity-60 text-[16px] text-center">
              Error occured while loading!!!
            </p>
            <button
              onClick={() => {
                navigate("/", { replace: true });
                setError(false);
                setLoading(false);
              }}
              className="mt-[40px] underline"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <p className="fixed right-0 bottom-0 p-[20px] text-[15px] text-white text-opacity-30">
        Developed by{" "}
        <a
          href="https://theshawa-dev.web.app"
          className="font-medium hover:underline"
        >
          Theshawa Dasun
        </a>
      </p>
    </LoadingContext.Provider>
  );
}

export default App;
