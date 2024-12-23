const countryContainer = document.getElementById('countryData');
const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

async function searchCountry() {
  const countryName = document.getElementById('countryInput').value;
  if (!countryName) {
    alert('Please enter a country name!');
    return;
  }

  try {
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countryData = await countryResponse.json();
    if (!countryData || countryData.status === 404) throw new Error('Country not found');

    displayCountryData(countryData);
  } catch (error) {
    alert(error.message);
  }
}

function displayCountryData(countries) {
  countryContainer.innerHTML = '';

  countries.forEach(country => {
    const { name, flags, capital, population } = country;
    const countryCard = document.createElement('div');
    countryCard.className = 'col-md-4';

    countryCard.innerHTML = `
      <div class="card">
        <img src="${flags.png}" class="card-img-top" alt="${name.common}">
        <div class="card-body">
          <h5 class="card-title">${name.common}</h5>
          <p class="card-text">Capital: ${capital ? capital[0] : 'N/A'}</p>
          <p class="card-text">Population: ${population.toLocaleString()}</p>
          <button class="btn btn-primary" onclick="fetchWeather('${capital ? capital[0] : ''}', '${name.common}')">More Details</button>
        </div>
      </div>
    `;
    countryContainer.appendChild(countryCard);
  });
}

async function fetchWeather(capital, country) {
  if (!capital) {
    alert(`Weather data unavailable for ${country}`);
    return;
  }

  try {
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    displayWeatherDetails(weatherData, country);
  } catch (error) {
    alert(error.message);
  }
}

function displayWeatherDetails(weatherData, country) {
  const { main, weather } = weatherData;
  alert(`
    Weather in ${country}:
    Temperature: ${main.temp}°C
    Condition: ${weather[0].description}
  `);
}
