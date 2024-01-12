const RAINICON = "https://img.icons8.com/hatch/124/FFFFFF/heavy-rain.png"
const SUNICON = "https://img.icons8.com/ios/100/FFFFFF/sun--v1.png"
const CLOUDICON = "https://img.icons8.com/ios/100/FFFFFF/cloud--v1.png"

let currentLocation = ["haifa"]

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

async function getWeather (searchValue) {
    let defaultWeatherData = await getWeatherJson(searchValue)
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

async function runSearch (searchValue) {
let weatherObj = await getWeather(searchValue)
renderWeather(weatherObj)}

runSearch()

async function getForecastJson (location=currentLocation[0]) {
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

let createDailyForecastCell = (forecast,count) => {
    let div = document.createElement("div")
    let day = document.createElement("p")
    let temp = document.createElement("h2")
    let icon = document.createElement("img")

    div.classList = "forecastDiv"

    let dayName = new Date()
    dayName.setDate(dayName.getDate() + count)
    dayName = dayName.toLocaleDateString('en-US',{weekday: "long"})

    icon.src = "https:" + forecast.forecast.forecastday[count].day.condition.icon
    temp.textContent = forecast.forecast.forecastday[count].day.avgtemp_c + "°C"
    day.textContent = dayName

    let cont = document.querySelector(".forecastContainer")
    cont.appendChild(div)
    div.appendChild(day)
    div.appendChild(temp)
    div.appendChild(icon)
}

async function runDailyForecast(searchValue=currentLocation[0]) {
    let forecastJson = await getForecastJson(searchValue)
    let forecastArray = forecastJson.forecast.forecastday
    for (let i = 1; i < forecastArray.length; i++) {
        createDailyForecastCell(forecastJson,i)
    }

    let moveHours = document.querySelector(".moveHours")
    moveHours.style.display = "none"
}
runDailyForecast()

let createHourlyForecastCell = (forecast,count,startingHour) => {
    let div = document.createElement("div")
    let hour = document.createElement("p")
    let temp = document.createElement("h2")
    let icon = document.createElement("img")

    div.classList = "forecastDiv"
    let infoHour = startingHour + count
    let forecastDayCount = 0

    if (infoHour > 23) {infoHour = infoHour - 24
        forecastDayCount = 1
    }

    icon.src = "https:" + forecast.forecast.forecastday[forecastDayCount].hour[infoHour].condition.icon
    temp.textContent = forecast.forecast.forecastday[forecastDayCount].hour[infoHour].temp_c + "°C"
    hour.textContent = infoHour

    let cont = document.querySelector(".forecastContainer")
    cont.appendChild(div)
    div.appendChild(hour)
    div.appendChild(temp)
    div.appendChild(icon)

}


async function runHourlyForecast(startHourNum=0) {
    let forecastJson = await getForecastJson()
    let currentHour = new Date
    currentHour = currentHour.getHours()
    // startHour = startHourNum
    for (let i = 0; i + startHourNum < startHourNum + 8; i++) {
        createHourlyForecastCell(forecastJson,i,currentHour+startHourNum)
    }
    
    let moveHours = document.querySelector(".moveHours")
    moveHours.style.display = "flex"
}
// runHourlyForecast()

let dailyButton = document.querySelector(".botButtons > span")
let hourlyButton = document.querySelector(".botButtons > span + span")

let getDaily = (e,searchValue=currentLocation[0]) => {
    forecastContainer = document.querySelector(".forecastContainer")
    forecastContainer.innerHTML = ""
    forecastContainer.classList = "forecastContainer"
    runDailyForecast(searchValue)

    let clearActiveChoice = () => {
        let selection = document.querySelectorAll(".botButtons > span")
        for (let i = 0 ; i < selection.length ; i++) {
        if (selection[i].classList.contains("activeBottomButton")) {
            selection[i].classList.remove("activeBottomButton")
        }
    }
}
    clearActiveChoice()

    let setActiveChoice = () => {
        let selection = document.querySelectorAll(".botButtons>span")
        selection[0].classList = "botButton activeBottomButton"
    }
    setActiveChoice()
}


let getHourly = (e,count=0) => {
    forecastContainer = document.querySelector(".forecastContainer")
    forecastContainer.innerHTML = ""
    forecastContainer.classList = "forecastContainer hourlyForecastContainer"
    runHourlyForecast(count)

    let cleanActive = () => {
        let hourButtons = document.querySelectorAll(".hourButton")
        for (let i = 0 ; i < hourButtons.length ; i++) {
            if (hourButtons[i].classList.contains("activeHourButton")) {
                hourButtons[i].classList.remove("activeHourButton")
            }
        }
    }
    cleanActive()

    let setActive = () => {
        let hourButtons = document.querySelectorAll(".hourButton")
        console.log(hourButtons)
        if (count < 8) {hourButtons[0].classList.add("activeHourButton")}
        else if (count > 8) {hourButtons[2].classList.add("activeHourButton")}
        else {hourButtons[1].classList.add("activeHourButton")}

    }
    setActive()

    let clearActiveChoice = () => {
        let selection = document.querySelectorAll(".botButtons>span")
        for (let i = 0 ; i < selection.length ; i++) {
        if (selection[i].classList.contains("activeBottomButton")) {
            selection[i].classList.remove("activeBottomButton")
        }
    }
}
    clearActiveChoice()

    let setActiveChoice = () => {
        let selection = document.querySelectorAll(".botButtons>span")
        selection[1].classList = "botButton activeBottomButton"
    }
    setActiveChoice()

}

dailyButton.addEventListener("click",getDaily)
hourlyButton.addEventListener("click",getHourly)

let hourButtons = document.querySelectorAll(".hourButton")
for (let i = 0; i < hourButtons.length ; i++) {
    hourButtons[i].addEventListener("click",getHourly.bind(this,null,i*8))
}

let runFullSearch = async () => {
    let searchBox = document.querySelector(".searchBox")
    searchVal = searchBox.value
    let test = await fetch(`http://api.weatherapi.com/v1/current.json?key=ad9dadca166a4007806152802240801&q=${searchVal}`)
    if (!test.ok) {
        alert("bad entry")
        return}
    currentLocation[0] = searchVal
    runSearch(searchVal)
    getDaily(searchVal)
}

let searchBox = document.querySelector(".searchBox")
let searchButton = document.querySelector(".searchButton")
searchButton.addEventListener("click",runFullSearch)
searchBox.addEventListener("keydown",function (e) {
    if (e.key == "Enter") {
        runFullSearch()
    }
    })




