const APIkey = "5290321cd72fde7bc229af09c5895949";
const gApiKey = 'AIzaSyCIbCZZpXyYli4pp6eIx5GKWFWD5TvApiY';
let units = 'metric';
let lastCity = '';
let coordinates = {};

const icons = {
  i03d : "fa-solid fa-cloud",
  i04d : "fa-solid fa-cloud",
  i11d : "fa-solid fa-cloud-bolt",
  i01d : "fa-solid fa-sun",
  wind : "fa-solid fa-wind",
  tornado : "fa-solid fa-tornado",
  temperature : "fa-solid fa-temperature-half",
  i50d : "fa-solid fa-smog",
  i13d : "fa-solid fa-snowflake",
  i09d : "fa-solid fa-cloud-showers-heavy",
  i10d : "fa-solid fa-cloud-sun-rain",
  i02d : "fa-solid fa-cloud-sun",
}

function iconClass(weather){
  let icon = ''
  switch (weather) {
    case 'i03d':
      icon = icons.i03d;
      break;
    case 'i04d':
      icon = icons.i04d;
      break;
    case 'i11d':
      icon = icons.i11d;
      break;
    case 'i01d':
      icon = icons.i01d;
      break;
    case 'wind':
      icon = icons.wind;
      break; 
    case 'tornado':
      icon = icons.tornado;
      break;
    case 'temperature':
      icon = icons.temperature;
      break;
    case 'i50d' :
      icon = icons.i50d;
      break;
    case 'i13d':
      icon = icons.i13d;
      break;
    case 'i09d':
      icon = icons.i09d;
      break;
    case 'i10d':
      icon = icons.i10d;
      break;
    case 'i02d':
      icon = icons.i02d;
      break;
    default:
      console.log(`no icon for ${weather}`)
      break;
  }
  return icon
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

async function getUserLocation(){

  try {
    const { coords: { latitude, longitude } }= await new Promise (function (resolve , reject){
      navigator.geolocation.getCurrentPosition(resolve,reject,{timeout:5000});
    })
    const positionRequest = `${latitude},${longitude}`;
    getClimate([positionRequest, 'coordinates']);
  } catch (error) {
    console.log(error);
    getClimate(['London','city']);
  }
}

function coordinatesFormat(coordinates){
  const splitCoordinates = coordinates.split(',');
  const newCoordinates = `lat=${splitCoordinates[0]}&lon=${splitCoordinates[1]}`
  return newCoordinates
}

const getWeatherData = async(request, mode = "city") => {
  if(mode === "coordinates"){
    query = coordinatesFormat(request);
  } else {
    query = 'q='+request;
  }
  try{
    const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${APIkey}&units=${units}`, {
      mode: 'cors'
    });
    const weatherData = await fetchData.json();
    return weatherData
  } catch (error){
    console.log('error');
    alert('unavailable');
    return
  }
}

function formatTemperature(temperature){
  let newTemp = temperature.toFixed(2) + '°C';
  if(units==='imperial'){
    newTemp = temperature.toFixed(2) + '°F'
  }
  return newTemp
}

function formatWindSpeed(speed){
  let newSpeed = speed.toFixed(2) + ' m/s';
  if(units==='imperial'){
    newSpeed = speed.toFixed(2) + ' ft/s'
  }
  return newSpeed
}

function setDataDomCurrent(weatherData){
  coordinates = { lat: parseFloat(weatherData.coord.lat) , lng: parseFloat(weatherData.coord.lon) };
  initMap(coordinates);
  const cityData =  {
  city : weatherData.name,
  climate : weatherData.weather[0].description,
  date : new Date (weatherData.dt * 1000).toLocaleDateString("default"),
  hour : new Date (weatherData.dt * 1000).toLocaleTimeString("default"),
  sunrise : new Date (weatherData.sys.sunrise * 1000).toLocaleTimeString("default"),
  sunset : new Date (weatherData.sys.sunset * 1000).toLocaleTimeString("default"),
  temperature : formatTemperature(weatherData.main.temp),
  tempFeeling : formatTemperature(weatherData.main.feels_like),
  humidity : weatherData.main.humidity,
  windSpeed : formatWindSpeed(weatherData.wind.speed),
  }

  document.getElementById('city').textContent = cityData.city;
  document.getElementById('climate').textContent = cityData.climate;
  document.getElementById('date').textContent = cityData.date;
  document.getElementById('hour').textContent = cityData.hour;
  document.getElementById('temperature').textContent = cityData.temperature;
  document.getElementById('feelsTemperature').textContent = cityData.tempFeeling;
  document.getElementById('humidity').textContent = cityData.humidity + '%';
  document.getElementById('sunTimes').textContent = 'Sunrise: '+cityData.sunrise+'\r\n'+'Sunset: '+cityData.sunset;
  document.getElementById('windSpeed').textContent = cityData.windSpeed

}

const getForecastWeatherData = async(request, mode = "city") => {
  if(mode === "coordinates"){
    query = coordinatesFormat(request);
  } else {
    query = 'q='+request;
  }
  try{
    const fetchData = await fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${APIkey}&units=${units}`, {
      mode: 'cors'
    });
    const forecastWeatherData = await fetchData.json();
    return forecastWeatherData
  } catch (error){
    console.log('error');
    alert('unavailable');
    return
  }
}


function setDataDomForecast(forecastData){

  const bottom = document.getElementById('bottom');
  
  function createCard(data , number){
    const card = document.createElement('div');
    card.setAttribute('class',`card ${number}`);
    if (number > 3){
      card.setAttribute('style','display: none');
    }
    const hour = document.createElement('div');
    hour.setAttribute('class','hour');
    hour.textContent = data.hour;
    const temperature = document.createElement('div');
    temperature.setAttribute('class','temperature');
    temperature.textContent = data.temperature;
    const icon = document.createElement('i');
    icon.setAttribute('class', iconClass(data.icon));
    card.append(hour , temperature , icon)
    bottom.appendChild(card);
  }
  for (let i = 0 ; i < 8 ; i++){
    const hourData = {
      hour: new Date (forecastData[i].dt*1000).toLocaleTimeString("default"),
      temperature : formatTemperature(forecastData[i].main.temp),
      weather : forecastData[i].weather[0].main,
      icon : 'i'+forecastData[i].weather[0].icon.replace('n','d'),
    }
    
    createCard(hourData , i);
  }
}

async function getClimate(city){
  lastCity = [...city]
  const weatherData = await getWeatherData(...city);
  setDataDomCurrent(weatherData);
  const forecastWeatherData = await getForecastWeatherData(...city);
  setDataDomForecast(forecastWeatherData.list);
}

const searchButton = document.getElementById('search');
searchButton.addEventListener('click',() => {
  removeElementsByClass('card');
  const cityName = document.getElementById('cityName').value;
  getClimate([cityName]);
})

const changeUnits = document.getElementById('changeUnits');
changeUnits.addEventListener('click',() => {
  units = (units === 'metric') ? 'imperial' : 'metric';
  changeUnits.textContent = (units === 'metric') ? 'Use imperial system' : 'Use metric system';
  removeElementsByClass('card');
  getClimate(lastCity);
})

getUserLocation();

//Add google map with location (using google api)
// Initialize and add the map
function initMap(uluru) {
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
}