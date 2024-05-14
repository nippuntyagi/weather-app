import axios from "axios"

const weatherInfo = async () =>{
    const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=sonipat&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)
    return data
}

export {
    weatherInfo
}