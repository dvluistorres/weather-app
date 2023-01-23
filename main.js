const APIkey = "5290321cd72fde7bc229af09c5895949"

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
}

const searchButton = document.getElementById('search');
searchButton.addEventListener('click',() => {
  const cityName = document.getElementById('cityName').value;
  getWeatherData(cityName);
})
getUserLocation();
