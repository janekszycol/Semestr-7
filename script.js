document.getElementById('weatherButton').addEventListener('click', function() {
    var city = document.getElementById('cityInput').value;
    var apiKey = '';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(city) + '&appid=' + apiKey + '&units=metric&lang=pl', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Odpowiedź z Current Weather:', xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            displayCurrentWeather(data);
        } else {
            console.error('Błąd podczas pobierania danych o aktualnej pogodzie');
        }
    };
    xhr.send();

    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + encodeURIComponent(city) + '&appid=' + apiKey + '&units=metric&lang=pl')
    .then(response => response.json())
    .then(data => {
        console.log('Odpowiedź z Forecast:', data);
        displayForecast(data);
    })
    .catch(error => {
        console.error('Błąd podczas pobierania danych o prognozie pogody', error);
    });
});

function displayCurrentWeather(data) {
    var currentWeatherDiv = document.getElementById('currentWeather');
    var date = new Date(data.dt * 1000);

    currentWeatherDiv.innerHTML = `
        <h2>Aktualna pogoda w ${data.name}</h2>
        <p>${date.toLocaleString('pl-PL')}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Ikona pogody">
        <p><strong>${data.weather[0].description}</strong></p>
        <p>Temperatura: ${data.main.temp} &deg;C</p>
        <p>Temperatura odczuwalna: ${data.main.feels_like} &deg;C</p>
        <p>Wilgotność: ${data.main.humidity}%</p>
    `;
}

function displayForecast(data) {
    var forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    var forecastList = data.list;

    forecastList.forEach(function(forecast) {
        var forecastItem = document.createElement('div');
        forecastItem.className = 'forecastItem';
        var date = new Date(forecast.dt * 1000);

        forecastItem.innerHTML = `
            <h3>${date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' })}</h3>
            <p>${date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Ikona pogody">
            <p><strong>${forecast.weather[0].description}</strong></p>
            <p>Temp: ${forecast.main.temp} &deg;C</p>
            <p>Odczuwalna: ${forecast.main.feels_like} &deg;C</p>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}
