import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DATA_SOURCE } from "./api.config";
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

export interface DATA {
  [key: string]: {
    code: string;
    name: string;
    cities: { lat: number; lng: number; name: string }[];
  };
}

export const DataContext = createContext<DATA>({});

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState<DATA>({});

  const getData = async () => {
    setLoading(true);
    setMessage("Loading...");
    try {
      const res = await axios.get<DATA>(DATA_SOURCE);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
          <DataContext.Provider value={data}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="view" element={<ViewPage />} />
            </Routes>
          </DataContext.Provider>
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
                getData();
              }}
              className="mt-[40px] underline"
            >
              Try Again
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
