import { fetchApod } from './api.js';
import { getFavorites, saveFavorite } from './storage.js';

// Referencias del DOM
const apodDateInput = document.getElementById('apod-date');
const btnSearch = document.getElementById('btn-search');
const apodContent = document.getElementById('apod-content');
const btnFavorite = document.getElementById('btn-favorite');
const favoritesList = document.getElementById('favorites-list');

let currentApod = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupDateLimits();
  loadApod(); // Carga la del día
  renderFavorites();
});

// Configurar fecha máxima en el input de tipo date
function setupDateLimits() {
  const today = new Date().toISOString().split('T')[0];
  apodDateInput.max = today;
  apodDateInput.value = today;
}

// Cargar APOD según fecha
async function loadApod(date = '') {
  apodContent.innerHTML = '<p>Cargando información de la NASA...</p>';
  btnFavorite.hidden = true;

  try {
    currentApod = await fetchApod(date);
    displayApod(currentApod);
    btnFavorite.hidden = false;
  } catch (error) {
    apodContent.innerHTML = `<p class="error">Ocurrió un error al cargar la APOD: ${error.message}</p>`;
  }
}

// Renderizar APOD en la interfaz
function displayApod(data) {
  const mediaHTML = data.media_type === 'image'
    ? `<img src="${data.url}" alt="${data.title}" class="apod-media">`
    : `<iframe src="${data.url}" frameborder="0" allowfullscreen class="apod-media"></iframe>`;

  apodContent.innerHTML = `
    <h2>${data.title}</h2>
    <p class="date"><strong>Fecha:</strong> ${data.date}</p>
    ${mediaHTML}
    <p class="explanation">${data.explanation}</p>
  `;
}

// Evento: Buscar por fecha
btnSearch.addEventListener('click', () => {
  const selectedDate = apodDateInput.value;
  if (selectedDate) {
    loadApod(selectedDate);
  }
});

// Evento: Guardar en Favoritos
btnFavorite.addEventListener('click', () => {
  if (currentApod) {
    const saved = saveFavorite(currentApod);
    if (saved) {
      alert('¡Añadido a tus favoritos!');
      renderFavorites();
    } else {
      alert('Esta APOD ya está en tu lista de favoritos.');
    }
  }
});

// Renderizar lista de favoritos
function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesList.innerHTML = '<li>No tienes favoritos guardados aún.</li>';
    return;
  }

  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${fav.date}</strong> - ${fav.title}`;
    li.addEventListener('click', () => {
      apodDateInput.value = fav.date;
      loadApod(fav.date);
    });
    favoritesList.appendChild(li);
  });
}