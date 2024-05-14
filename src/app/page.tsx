"use client"

import { weatherInfo } from "@/api/weatherData";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import { WeatherData } from "@/interfaces/weather";
import { parseISO } from "date-fns";
import { format } from "date-fns/format";
import { useQuery } from "react-query";
import { convertKalvinToCelsius } from "@/utils/convertKalvinToCelsius"
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayNightIcons";

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>('WeatherData', async () =>
    {
      return await weatherInfo();
    }
  )
  if (isLoading) return (
    <div className="flex item-center min-h-screen justify-center">
      <p className="animate-bounce">
        loading...
      </p>
    </div>
  )
  const firstData = data?.list[0]
  return (
    <div className="flex flex-col gap-4 bg-grey-100 min-h-screen">
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
        </section>
        <section></section>
      </main>
    </div>
  );
}
