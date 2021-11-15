const key = "7011a34791aedf8efad1464566254669"

const searchBtn = document.getElementById("search")
const input = document.getElementById("city-input")
const cityNameEl = document.getElementById("city-name")
const tempEl = document.getElementById("temp")
const windEl = document.getElementById("wind")
const humidityEl = document.getElementById("humidity")
const uvIndexEl = document.getElementById("uvindex")
const previousSearch = document.getElementById("previous-search")


// Log user input into requestUrl
function handleSearch() {
    let city = input.value
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    if(city) {
        getCityData(requestUrl)
    }
    else {
        alert("Please enter a city name")
    }
}

//Return API data
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

//Take cityData longitude and latitude data to get more in depth weather call
function convertOneCall(cityData) {
    cityNameEl.textContent = cityData.name
    saveSearches(cityData)
    let cityLat = cityData.coord.lat
    let cityLon = cityData.coord.lon
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&units=imperial&exclude=minutely&appid=${key}`
    getNewCityData(url)
}

//Return new API data
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

//Populate data to weather dashboard
function populateResults(newCityData) {
    tempEl.textContent = newCityData.current.temp + "°F"
    windEl.textContent = newCityData.current.wind_speed + "MPH"
    humidityEl.textContent = newCityData.current.humidity + "%"
    uvIndexEl.textContent = newCityData.current.uvi

}

//Save recent searches to local storage
function saveSearches(cityData) {
    let newSearch = cityData.name
    localStorage.setItem(newSearch,newSearch)
    addRecent(newSearch)
}

//Adds new button to recents when a city is searched
function addRecent(newSearch) {
    const btnEl = document.createElement("btn")
    previousSearch.appendChild(btnEl)
    btnEl.setAttribute("class","btn btn-dark btn-block mt-1 mb-1 p-2 col- recent")
    btnEl.textContent = newSearch
}

//Refetches search data of previous searches   CURRENTLY NOT FUCTIONING
const recent = document.getElementsByClassName("recent")
function refetch() {
    let city = recent.textContent 
    let fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    console.log(fetchUrl)
}

//Retrieves recent search history and displays it
function recentSearch() {
    for(i = 0; i < localStorage.length; i++) {
        const btnEl = document.createElement("btn")
        previousSearch.appendChild(btnEl)
        btnEl.setAttribute("class","btn btn-dark btn-block mt-1 mb-1 p-2 col- recent")
        btnEl.textContent = localStorage.key(i)
    }
}

recentSearch()
searchBtn.addEventListener('click', handleSearch)
recent.addEventListener("click", refetch)