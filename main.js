const APIkey = "5290321cd72fde7bc229af09c5895949"

const icons = {
  darkCloud : "fa-solid fa-cloud",
  bolt : "fa-solid fa-cloud-bolt",
  sun : "fa-solid fa-sun",
  wind : "fa-solid fa-wind",
  tornado : "fa-solid fa-tornado",
  temperature : "fa-solid fa-temperature-half",
  smog : "fa-solid fa-smog",
  snow : "fa-solid fa-snowflake",
  rain : "fa-solid fa-cloud-showers-heavy",
  sunRain : "fa-solid fa-cloud-sun-rain",
  sunCloud : "fa-solid fa-cloud-sun",
}

async function getUserLocation(){
  
  const successCallback = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const positionRequest = latitude+","+longitude;
    getWeatherData(positionRequest , "coordinates")
  };
  
  const errorCallback = (error) => {
    console.log(error);
    getWeatherData("London")
  };
  
  await navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

function coordinatesFormat(coordinates){
  const splitCoordinates = coordinates.split(',');
  const newCoordinates = `lat=${splitCoordinates[0]}&lon=${splitCoordinates[1]}`
  return newCoordinates
}

async function getWeatherData(request, mode = "city"){
  let location = "London";
  if(mode == "coordinates"){
    location = coordinatesFormat(request);
  } else {
    location = 'q='+request;
  }

  const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?${location}&appid=${APIkey}`, {
    mode: 'cors'
  });
  const weatherData = await fetchData.json();
  console.log(weatherData);
  setDataDom(weatherData);

}

const searchButton = document.getElementById('search');
searchButton.addEventListener('click',() => {
  const cityName = document.getElementById('cityName').value;
  getWeatherData(cityName);
})

function setDataDom(weatherData){
  const cityData =  {
  city : weatherData.name,
  climate : weatherData.weather[0].description,
  date : new Date (weatherData.dt * 1000).toLocaleDateString("default"),
  hour : new Date (weatherData.dt * 1000).toLocaleTimeString("default"),
  temperature : weatherData.main.temp,
  tempFeeling : weatherData,
  humidity : weatherData.main.humidity,
  rainChance : weatherData,
  windSpeed : weatherData,
  futureDaily : {},
  futureHourly : {}
  }
  console.log(cityData);
}

getUserLocation();
