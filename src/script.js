const API_KEY = 'b7c2df8c530350b3c0834ac4506e1d7b'; // OpenWeatherMap API
const cityInput = document.getElementById('city');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const forecastCards = document.getElementById('forecastCards');
const recentSearchesContainer = document.getElementById('recentSearchesContainer');
const recentSearches = document.getElementById('recentSearches');

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
        saveToLocalStorage(city);
    }
});

// Event listener for current location button
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
        });
    } else {
        alert('Geolocation is not supported by the browser.');
    }
});

// Fetch weather by city name
async function getWeatherByCity(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
            displayCurrentWeather(data);
            getForecast(data.coord.lat, data.coord.lon);
        } else {
            alert('City not found. Please enter a valid city name.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Fetch weather by geolocation
async function getWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
            displayCurrentWeather(data);
            getForecast(lat, lon);
        } else {
            alert('Unable to retrieve weather data for your location.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    // Get current date and format it
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = currentDate.toLocaleDateString('en-US', options); // Set formatted date
    
    cityName.textContent = data.name;

    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

    // Improved weather description and icons
    const icon = data.weather[0].icon;
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherDescription.textContent = capitalizeFirstLetter(data.weather[0].description);

    currentWeatherContainer.classList.remove('hidden');
}

// Fetch 5-days forecast
async function getForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

// Display 5-days forecast
function displayForecast(data) {
    forecastCards.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) { 
        const forecast = data.list[i];
        const card = document.createElement('div');
        card.classList.add('bg-black', 'bg-opacity-50', 'p-4', 'rounded-lg', 'text-center', 'text-white', 'shadow-lg');
        card.innerHTML = `
            <h4 class="text-lg font-bold">${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}" class="mx-auto">
            <p class="text-lg">${forecast.main.temp}°C</p>
            <p class="text-xs">${capitalizeFirstLetter(forecast.weather[0].description)}</p>
        `;
        forecastCards.appendChild(card);
    }

    forecastContainer.classList.remove('hidden');
}

// Save to local storage for recently searched cities
function saveToLocalStorage(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(cities));
        updateRecentSearchesDropdown(cities);
    }
}

// Update the recent searches in dropdown
function updateRecentSearchesDropdown(cities) {
    recentSearches.innerHTML = '';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentSearches.appendChild(option);
    });
    recentSearchesContainer.classList.remove('hidden');
}

// Load recently searched cities on page load
window.onload = function () {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (cities.length > 0) {
        updateRecentSearchesDropdown(cities);
    }

    recentSearches.addEventListener('change', () => {
        const selectedCity = recentSearches.value;
        if (selectedCity) {
            getWeatherByCity(selectedCity);
        }
    });
};

// capitalize the first letter of the weather description
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}