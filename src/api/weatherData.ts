import axios from "axios"

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

const weatherInfo = async (place: string) =>{
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`)
    return data
}

const citySuggestionInfo = async (value: string) =>  {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`)
    return data
}

const getCurrentLocation = async (latitude : number, longitude: number) => {
    const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      )
    return data
}
export {
    weatherInfo,
    citySuggestionInfo,
    getCurrentLocation
}