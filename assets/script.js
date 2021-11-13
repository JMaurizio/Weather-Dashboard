const searchBtn = document.getElementById("search")
const input = document.getElementById("city-input")
const cityNameEl = document.getElementById("city-name")
const tempEl = document.getElementById("temp")
const windEl = document.getElementById("wind")
const humidityEl = document.getElementById("humidity")
const uvIndexEl = document.getElementById("UV-index")

function handleSearch() {
    let city = input.value
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7011a34791aedf8efad1464566254669`
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
        var cityData = data
        populateResults(cityData)
    })
}

function populateResults(cityData) {
    cityNameEl.textContent = cityData.name
    tempEl.textContent = cityData.main.temp + "°F"
    windEl.textContent = cityData.wind.speed + "MPH"
    humidityEl.textContent = cityData.main.humidity + "%"

}
searchBtn.addEventListener('click', handleSearch)