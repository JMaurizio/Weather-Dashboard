var searchBtn = document.getElementById("search")
const input = document.getElementById("city-input")

function handleSearch() {
    let city = input.value
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7011a34791aedf8efad1464566254669`
    input.value = ""

}


searchBtn.addEventListener('click', handleSearch)