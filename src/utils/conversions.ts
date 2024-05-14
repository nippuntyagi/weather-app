export function meterToKm(meter: number) : string {
    const km = meter/1000;
    return `${km.toFixed(0)}km`
}

export function convertWindSpeed(speedInMeterPerSec: number) : string {
    const speedInKmPerHour = speedInMeterPerSec * 3.6;
    return `${speedInKmPerHour.toFixed(0)}km/h`
}