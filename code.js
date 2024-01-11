const RAINICON = "https://img.icons8.com/hatch/124/FFFFFF/heavy-rain.png"
const SUNICON = "https://img.icons8.com/ios/100/FFFFFF/sun--v1.png"
const CLOUDICON = "https://img.icons8.com/ios/100/FFFFFF/cloud--v1.png"

let getWeatherJson = async (location="haifa") => {
    try {
    let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=ad9dadca166a4007806152802240801&q=${location}`)
    if (!response.ok) {throw new Error(`HTTP error! Status: ${response.status}`)}
    let responseObj = await response.json()
    return responseObj
    }   
    catch (error) {console.log(error)
    return null}
    }

let createWeatherObject = (weatherData) => {
    let currentDate = new Date
    const options = {
        timeZone: weatherData.location.tz_id,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    }
    let formattedDate = currentDate.toLocaleDateString('en-US',options)

    let iconImage = ""

    if (weatherData.current.precip_mm > 0.3) {iconImage = RAINICON}
    else if (weatherData.current.cloud > 45) {iconImage = CLOUDICON}
    else {iconImage = SUNICON}

    let weatherObject = {
        date: formattedDate,
        location: weatherData.location.name,
        temperature: weatherData.current.temp_c,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_kph,
        description: weatherData.current.condition.text,    
        iconImage: iconImage,
        feelsLike: weatherData.current.feelslike_c
    }
    console.log(weatherObject)
    return weatherObject
}

async function getWeather () {
    let defaultWeatherData = await getWeatherJson()
    if (!defaultWeatherData) return
    console.log(defaultWeatherData)
    let weatherObject = createWeatherObject(defaultWeatherData)
    return weatherObject
}

let renderWeather = (weatherObject) => {
    // left Infobar
    let header = document.querySelector(".header")
    let location = document.querySelector(".location")
    let date = document.querySelector(".date")
    let temperature = document.querySelector(".temperature")
    let icon = document.querySelector(".icon")
    
    header.textContent = weatherObject.description
    location.textContent = weatherObject.location
    date.textContent = weatherObject.date
    temperature.textContent = weatherObject.temperature + " °C"
    icon.src = weatherObject.iconImage
    icon.height = 75
    icon.width = 75

    //Right infobar

    let feelsLike = document.querySelector(".feelsLike > h2")
    feelsLike.textContent = weatherObject.feelsLike + "°C"

    let humidity = document.querySelector(".humidity > h2")
    humidity.textContent = weatherObject.humidity + "%"

    let windSpeed = document.querySelector(".windSpeed > h2")
    windSpeed.textContent = weatherObject.windSpeed + "km/h"

}

async function runSearch () {
let weatherObj = await getWeather()
renderWeather(weatherObj)}

runSearch()

async function getForecastJson (location="haifa") {
    try {
    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ad9dadca166a4007806152802240801&q=${location}&days=8`)
    if (!response.ok) {throw new Error(`HTTP error! Status: ${response.status}`)}
    let responseObj = await response.json()
    console.log(responseObj)
    return responseObj
    }   
    catch (error) {console.log(error)
    return null}
}

let createForecastCell = (count) => {
    
}

async function runForecast() {
    let forecastJson = await getForecastJson()
    let forecastArray = forecastJson.forecast.forecastday
    for (let i = 1; i < forecastArray.length; i++) {
    }
}
runForecast()