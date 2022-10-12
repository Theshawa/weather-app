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
import ErrorScreen from "./components/ErrorScreen";
import LoadingScreen from "./components/LoadingScreen";
import HomePage from "./components/pages/Home";
import ViewPage from "./components/pages/View";
import TradeMark from "./components/TradeMark";

export const LoadingContext = createContext<{
  setLoading: Dispatch<SetStateAction<boolean>>;
  setMessage: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<boolean>>;
  getData: () => void;
}>({
  setLoading: () => {},
  setMessage: () => {},
  setError: () => {},
  getData() {},
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
    if (!Object.keys(data).length) {
      getData();
    }
  }, [data]);

  const navigate = useNavigate();

  return (
    <LoadingContext.Provider
      value={{
        setLoading,
        setMessage,
        setError,
        getData,
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
        {loading ? <LoadingScreen message={message} /> : ""}
        {error ? (
          <ErrorScreen
            retry={() => {
              navigate("/", { replace: true });
              setError(false);
              setLoading(false);
              if (!Object.keys(data).length) {
                getData();
              }
            }}
          />
        ) : (
          ""
        )}
        <TradeMark />
      </div>
    </LoadingContext.Provider>
  );
}

export default App;
