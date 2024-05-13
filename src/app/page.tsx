"use client"

import Navbar from "@/components/Navbar";
import { WeatherData } from "@/interfaces/weather";
import axios from "axios";
import { useQuery } from "react-query";

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>('WeatherData', async () =>
    {
      const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)
      return data
    }
  )
  if (isLoading) return (
    <div className="flex item-center min-h-screen justify-center">
      <p className="animate-bounce">
        loading...
      </p>
    </div>
  )

  return (
    <div className="flex flex-col gap-4 bg-grey-100 min-h-screen">
      <Navbar />
    </div>
  );
}
