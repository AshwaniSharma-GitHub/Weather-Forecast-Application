const API_KEY = 'b7c2df8c530350b3c0834ac4506e1d7b';

const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');

searchBtn.addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

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

async function getWeatherByCity(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
        } else {
            alert('City not found. Please enter a valid city name.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (data.cod === 200) {
        } else {
            alert('Unable to retrieve weather data for your location.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}