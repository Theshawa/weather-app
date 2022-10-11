import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext, LoadingContext } from "../../App";
import axios from "axios";
import { API_KEY } from "../../api.config";
import { TimeIcon, WeatherIcon } from "../Icons";

interface LocationData {
  country: string;
  city: string;
}

interface WeatherData {
  dt: number;
  timezone: string;
  wind: {
    speed: number;
  };
  main: {
    pressure: number;
    humidity: number;
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  clouds: {
    all: number;
  };
  weather: {
    description: string;
    main: string;
    icon: string;
  }[];
}
const ViewPage = () => {
  const [query] = useSearchParams();
  const [data, setData] = useState<{
    location: LocationData;
    weather: WeatherData;
  }>();
  const { setError, setLoading, setMessage } = useContext(LoadingContext);
  const DATA = useContext(DataContext);

  const lat = query.get("lat");
  const lng = query.get("lng");

  const navigate = useNavigate();

  const getData = useCallback(async () => {
    setLoading(true);
    setMessage("Fetching data...");
    if (!lat || !lng) {
      setError(true);
      return;
    }
    try {
      const resLocation = await axios.get<{ country: string; name: string }[]>(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`
      );
      const resWeather = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}` //&exclude={part}
      );
      const { country, name } = resLocation.data[0];
      const cname = Object.values(DATA).find((c) => c.code === country);

      setData({
        weather: resWeather.data,
        location: {
          country: cname ? cname.name : country,
          city: name,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }, [lat, lng, setError, setLoading, setMessage, DATA]);

  useEffect(() => {
    getData();
  }, [getData]);

  if (!data) {
    return <p className="p-[20px]">Wait, loading...</p>;
  }

  return (
    <div className="flex flex-col w-full">
      <h1>
        {data?.location.city}, {data?.location.country}
      </h1>
      <h2 className="flex items-center mt-[5px]">
        <TimeIcon />
        <span className="ml-[6px]">
          {new Date(data.weather.dt * 1000).toDateString()}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] mt-[60px] h-full">
        <div className="flex flex-col">
          <WeatherIcon index={data.weather.weather[0].icon as any} />
          <span className="text-[32px]">
            {(data.weather.main.temp - 273).toFixed(2)} <sup>o</sup>C
          </span>
          <span className="text-[14px] text-white text-opacity-60">
            {(data.weather.main.temp_min - 273).toFixed(2)} -{" "}
            {(data.weather.main.temp_max - 273).toFixed(2)} <sup>o</sup>C
          </span>
          <p className="mt-[20px] font-medium text-[18px] capitalize">
            {data.weather.weather[0].description}
          </p>
        </div>
        <div className="flex flex-col space-y-[10px] w-full">
          <p className="flex justify-between">
            <span className="font-light">Wind Speed</span>
            <span className="ml-auto font-medium">
              {((data.weather.wind.speed * 18) / 5).toFixed(2)} kmh<sup>-1</sup>
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-light">Atm. pressure</span>
            <span className="ml-auto font-medium">
              {data.weather.main.pressure.toFixed(2)} hPa
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-light">Humidity</span>
            <span className="ml-auto font-medium">
              {data.weather.main.humidity.toFixed(2)} %
            </span>
          </p>
          <p className="flex justify-between">
            <span className="font-light">Cloudiness</span>
            <span className="ml-auto font-medium">
              {data.weather.clouds.all.toFixed(2)} %
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-[50px] pb-[20px] md:pb-0">
        <button onClick={getData} className="button-primary">
          Refresh
        </button>
        <button
          onClick={() => {
            navigate("/", { replace: true });
          }}
          className="button-link mt-[20px] md:mt-0"
        >
          Change Location
        </button>
      </div>
    </div>
  );
};

export default ViewPage;
