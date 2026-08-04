// Configuración global de la API
const API_KEY = 'eINdnnn7fiWUYjBQXPpqcHn2pvw0hcHjYpjoMAuK';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Referencias a elementos del DOM
const apodContent = document.getElementById('apod-content');
const fechaUsuario = document.getElementById('fecha');
const btnFecha = document.getElementById('buscarFecha'); // Asegúrate que el ID coincida con tu HTML

/**
 * Obtiene y renderiza la APOD de la NASA.
 * Si no se pasa una fecha, la API devuelve la del día actual.
 * @param {string} date - Fecha en formato YYYY-MM-DD
 */
async function getApod(date = '') {
  apodContent.innerHTML = '<p>Cargando información de la NASA...</p>';

  try {
    const url = `${BASE_URL}?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Estado: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    renderApod(data);
  } catch (error) {
    console.error('Error al obtener APOD:', error);
    apodContent.innerHTML = `<p class="error">Error al cargar la información: ${error.message}</p>`;
  }
}

/**
 * Renderiza el contenido de la APOD en el DOM
 * @param {Object} data - Datos devueltos por la API de la NASA
 */
function renderApod(data) {
  // Conmutación entre imagen e iframe según el tipo de medio
  const mediaElement = data.media_type === 'image'
    ? `<img src="${data.url}" alt="${data.title}" class="apod-media">`
    : `<iframe src="${data.url}" frameborder="0" allowfullscreen class="apod-media"></iframe>`;

  apodContent.innerHTML = `
    <h2>${data.title}</h2>
    <p class="date"><strong>Fecha:</strong> ${data.date}</p>
    ${mediaElement}
    <p class="explanation">${data.explanation}</p>
  `;
}

/**
 * Configura el límite máximo de fecha permitido (hoy) en el input
 */
function setupDateLimits() {
  if (fechaUsuario) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaUsuario.max = hoy;
  }
}

// ==========================================
// EVENTOS Y EJECUCIÓN
// ==========================================

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  setupDateLimits();
  getApod(); // Carga la APOD del día
});

// Evento para buscar por fecha seleccionada
if (btnFecha && fechaUsuario) {
  btnFecha.addEventListener('click', () => {
    const fechaSeleccionada = fechaUsuario.value;
    const hoy = new Date().toISOString().split('T')[0];

    if (!fechaSeleccionada) {
      alert('Por favor selecciona una fecha válida.');
      return;
    }

    if (fechaSeleccionada > hoy) {
      alert('No se pueden consultar fechas futuras.');
      console.warn('Intento de búsqueda con fecha futura:', fechaSeleccionada);
      return;
    }

    // Consulta la API con la fecha elegida y renderiza los resultados
    getApod(fechaSeleccionada);
  });
}