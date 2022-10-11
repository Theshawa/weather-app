import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingContext } from "../../App";
import data from "../../data.json";

const DATA: {
  [key: string]: {
    code: string;
    name: string;
    cities: { lat: number; lng: number; name: string }[];
  };
} = data as any;

const HomePage = () => {
  const [countryCode, setCountryCode] = useState<string>("");
  const [coordinates, setCoordinates] = useState<string>("");

  const navigate = useNavigate();
  const { setLoading, setError, setMessage } = useContext(LoadingContext);

  const CITIES = useMemo(() => {
    if (!countryCode) return [];

    return DATA[countryCode].cities;
  }, [countryCode]);

  const moveToView = async () => {
    console.log(coordinates);
    let finalCoordinates = coordinates.split(",");
    if (finalCoordinates && finalCoordinates.length === 2) {
      navigate(`/view?lat=${finalCoordinates[0]}&lng=${finalCoordinates[1]}`);
    } else {
      setError(true);
    }
  };

  const selectCurrentLocation = async () => {
    setLoading(true);
    setMessage("Getting your coordinates...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          navigate(
            `/view?lng=${position.coords.longitude}&lat=${position.coords.latitude}`
          );
        },
        (err) => {
          setLoading(false);
          if (err) {
            setError(true);
          }
        }
      );
    } else {
      setLoading(false);
      setError(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <h1>Let’s find weather </h1>
      <div className="flex flex-col mt-[41px] h-full">
        <h2>Select Country</h2>
        <select
          value={countryCode}
          onChange={(e) => {
            setCountryCode(e.target.value);
          }}
          className="input mt-[14px]"
        >
          <option value="">Select a country</option>
          {Object.values(DATA).map((country) => (
            <option value={country.code} key={country.name}>
              {country.name}
            </option>
          ))}
        </select>

        <h2 className="mt-[34px]">Select City</h2>
        <select
          disabled={countryCode === ""}
          value={coordinates}
          onChange={(e) => {
            setCoordinates(e.target.value as any);
          }}
          className="input mt-[14px]"
        >
          <option value={""}>
            {countryCode ? "Select a city" : "Select a country first"}
          </option>
          {CITIES &&
            CITIES.map((city) => (
              <option
                value={[city.lat.toString(), city.lng.toString()].join(",")}
                key={city.name}
              >
                {city.name}
              </option>
            ))}
        </select>

        <button
          onClick={selectCurrentLocation}
          className="button-link w-max max-w-full mt-[41px]"
        >
          Get weather around you
        </button>
      </div>

      <div className="flex justify-between flex-col md:flex-row mt-[40px]">
        <button
          onClick={moveToView}
          disabled={!countryCode || !coordinates}
          className="button-primary md:mt-0 mt-[41px]"
        >
          View Weather
        </button>
      </div>
    </div>
  );
};

export default HomePage;
