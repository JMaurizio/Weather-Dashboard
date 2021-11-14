const key = "7011a34791aedf8efad1464566254669"

const searchBtn = document.getElementById("search")
const input = document.getElementById("city-input")
const cityNameEl = document.getElementById("city-name")
const tempEl = document.getElementById("temp")
const windEl = document.getElementById("wind")
const humidityEl = document.getElementById("humidity")
const uvIndexEl = document.getElementById("uvindex")

function handleSearch() {
    let city = input.value
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    input.value = ""
    if(city) {
        getCityData(requestUrl)
    }
}

function getCityData(requestUrl) {
    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let cityData = data
        convertOneCall(cityData)
    })
}

function convertOneCall(cityData) {
    cityNameEl.textContent = cityData.name
    let cityLat = cityData.coord.lat
    let cityLon = cityData.coord.lon
    console.log(cityLat)
    console.log(cityLon)
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely&appid=${key}`
    getNewCityData(url)
}

function getNewCityData(url) {
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        let newCityData = data
        populateResults(newCityData)
    }) 
}

function populateResults(newCityData) {
    tempEl.textContent = newCityData.current.temp + "°F"
    windEl.textContent = newCityData.current.wind_speed + "MPH"
    humidityEl.textContent = newCityData.current.humidity + "%"
    uvIndexEl.textContent = newCityData.current.uvi

}
searchBtn.addEventListener('click', handleSearch)