const key = "7011a34791aedf8efad1464566254669"

const searchBtn = document.getElementById("search")
const input = document.getElementById("city-input")
const cityNameEl = document.getElementById("city-name")
const tempEl = document.getElementById("temp")
const windEl = document.getElementById("wind")
const humidityEl = document.getElementById("humidity")
const uvIndexEl = document.getElementById("uvindex")
const previousSearch = document.getElementById("previous-search")
const fiveDayCards = document.getElementById("fiveDayCards")


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
    input.value = ""
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
    let logo = document.createElement("img")
    let icon = `http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`
    cityNameEl.textContent = cityData.name + "(" + moment().format("MMM Do YY") + ")"
    cityNameEl.appendChild(logo)
    logo.setAttribute("src", icon)
    logo.setAttribute("alt", "weather condition logo")
    logo.setAttribute("id", "logo") 
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
        populateFiveDayForecast(newCityData)
    }) 
}

//Populate data to weather dashboard
function populateResults(newCityData) {
    tempEl.textContent = "Temp: " + newCityData.current.temp + "??F"
    windEl.textContent = "Wind: " + newCityData.current.wind_speed + "MPH"
    humidityEl.textContent = "Humidity: " + newCityData.current.humidity + "%"
    uvIndexEl.textContent = "UV Index: " + newCityData.current.uvi
    if (newCityData.current.uvi <= 4) {
        uvIndexEl.setAttribute("class", "bg-success ml-3")
    }
    if (newCityData.current.uvi >= 5) {
        uvIndexEl.setAttribute("class", "bg-warning ml-3")
    }
    if (newCityData.current.uvi >= 8) {
        uvIndexEl.setAttribute("class", "bg-danger ml-3")
    }

}

//Save recent searches to local storage
function saveSearches(cityData) {
    let newSearch = cityData.name
    localStorage.setItem(newSearch,newSearch)
    addRecent(newSearch)
    recentSearch()
    
}

//Adds new button to recents when a city is searched
function addRecent(newSearch) {
    const btnEl = document.createElement("btn")
    previousSearch.appendChild(btnEl)
    btnEl.setAttribute("class","btn btn-block mt-1 mb-1 ml-3 mr-3 p-2 text-white col- recent")
    btnEl.textContent = newSearch       
}

//Refetches search data of previous searches
function refetch(event) {
    let city = event.target.textContent
    let fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getCityData(fetchUrl)
}

//Retrieves recent search history and displays it
function recentSearch() {
    previousSearch.innerHTML = ""
    for(i = 0; i < localStorage.length; i++) {
        const btnEl = document.createElement("btn")
        previousSearch.appendChild(btnEl)
        btnEl.setAttribute("class","btn btn-block mt-1 mb-1 ml-3 mr-3 p-2 text-white col- recent")
        btnEl.textContent = localStorage.key(i)
    }
}

//Populates the five day forecast section
function populateFiveDayForecast(newCityData) {
    fiveDayCards.innerHTML = ""
    for(i = 0; i < newCityData.daily.length; i++) {
        const div = document.createElement("div")
        const h5 = document.createElement("h5")
        const p = document.createElement("p")
        let img = document.createElement("img")
        let icon = `http://openweathermap.org/img/wn/${newCityData.daily[i].weather[0].icon}@2x.png`
        div.setAttribute("class", "card m-2")
        h5.setAttribute("class", "text-center")
        fiveDayCards.appendChild(div)
        div.append(h5,img,p)
        h5.textContent = moment().add(i+1, 'days').format("MMM Do YY")
        img.setAttribute("src", icon)
        img.setAttribute("alt", "weather condition logo")
        p.innerHTML = "Temp:" + newCityData.daily[i].temp.day + "??F" + "<br/>" +
                        "Wind:" + newCityData.daily[i].wind_speed + "MPH" + "<br/>" +
                        "Humidity:" + newCityData.daily[i].humidity + "%"
        if(i >= 4) {
            break;
        }
    }
}


recentSearch()
searchBtn.addEventListener('click', handleSearch)
previousSearch.addEventListener('click', refetch)