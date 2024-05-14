"use client"

import { weatherInfo } from "@/api/weatherData";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import { WeatherData } from "@/interfaces/weather";
import { fromUnixTime, parseISO } from "date-fns";
import { format } from "date-fns/format";
import { useQuery } from "react-query";
import { convertKalvinToCelsius } from "@/utils/convertKalvinToCelsius"
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayNightIcons";
import WeatherDetails from "@/components/WeatherDetails";
import { convertWindSpeed, meterToKm } from "@/utils/conversions";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetails";

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>('WeatherData', async () =>
    {
      return await weatherInfo();
    }
  )

  const firstData = data?.list[0]

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ]

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        {/* @ts-ignore */}
        <p className="text-red-400">{error.message}</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstData?.dt_txt ?? ""), 'EEEE')}</p>
              <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ""), 'dd.MM.yyyy')})</p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* {temperature} */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKalvinToCelsius(firstData?.main.temp ?? 0)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feels Like </span>
                  <span>{convertKalvinToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                </p>
                <p className="text-xs space-x-2">
                  <span>{convertKalvinToCelsius(firstData?.main.temp_min ?? 0)}°↓{" "}</span>
                  <span>{" "}{convertKalvinToCelsius(firstData?.main.temp_max ?? 0)}°↑</span>
                </p>
              </div>
              {/* {time and weather icon} */}
              <div className="flex gap-10 sm:gap:16 overflow-x-auto w-full justify-between pr-3">
                {
                  data?.list.map((d,i) => 
                    <div 
                      key={i} 
                      className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                    >
                      <p className="whitespace-nowrap">
                        {format(parseISO(d.dt_txt), "h:mm a")}
                      </p>
                      <WeatherIcon iconName={getDayOrNightIcon(d?.weather[0].icon, d?.dt_txt)}/>
                      <p>
                      {convertKalvinToCelsius(d?.main.temp ?? 0)}°
                      </p>
                    </div>
                  )
                }

              </div>
            </Container>
          </div>
          <div className="flex gap-4 ">
            {/* {left} */}
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstData?.weather[0].description}</p>
              <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "", firstData?.dt_txt ?? "")}/>
            </Container>
            {/* {right} */}
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                <WeatherDetails 
                  visability = {meterToKm(firstData?.visibility ?? 10000)}
                  humidity = {`${firstData?.main.humidity}%`}
                  windSpeed = {convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  airPressure = {`${firstData?.main.pressure} hPa`}
                  sunrise = {format(fromUnixTime(data?.city.sunrise ?? 1702949452), 'H:mm')}
                  sunset = {format(fromUnixTime(data?.city.sunset ?? 1702517657), 'H:mm')}
                />
            </Container>

          </div>
        </section>
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forcast (7 Days)</p>
          {firstDataForEachDate.map((d, i) => (
            <ForecastWeatherDetail
              key={i}
              description={d?.weather[0].description ?? ""}
              weatehrIcon={d?.weather[0].icon ?? "01d"}
              date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
              day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
              feels_like={d?.main.feels_like ?? 0}
              temp={d?.main.temp ?? 0}
              temp_max={d?.main.temp_max ?? 0}
              temp_min={d?.main.temp_min ?? 0}
              airPressure={`${d?.main.pressure} hPa `}
              humidity={`${d?.main.humidity}% `}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1702517657),
                "H:mm"
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1702517657),
                "H:mm"
              )}
              visability={`${meterToKm(d?.visibility ?? 10000)} `}
              windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
