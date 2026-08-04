// Configuración de credenciales y endpoint de la API de la NASA
const API_KEY = 'eINdnnn7fiWUYjBQXPpqcHn2pvw0hcHjYpjoMAuK';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

// Captura de elementos del DOM por sus IDs
const apodContent = document.getElementById('apod-content');
const fechaUsuario = document.getElementById('fecha');
const btnFecha = document.getElementById('buscarFecha');

/**
 * Consulta la API de la NASA para obtener la APOD.
 * Si no recibe el parámetro 'date', la API devuelve por defecto la APOD de hoy.
 * @param {string} date - Fecha en formato YYYY-MM-DD (opcional)
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
    apodContent.innerHTML = `<p class="error" style="color: red;">Error al cargar la información: ${error.message}</p>`;
  }
}

/**
 * Inyecta el contenido de la APOD en el DOM HTML
 * @param {Object} data - Objeto con los datos devueltos por la API
 */
function renderApod(data) {
  // Manejo condicional por si la NASA entrega una imagen o un video
  const mediaElement = data.media_type === 'image'
    ? `<img src="${data.url}" alt="${data.title}" style="max-width: 100%; height: auto;">`
    : `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 400px;"></iframe>`;

  apodContent.innerHTML = `
    <h2>${data.title}</h2>
    <p><strong>Fecha:</strong> ${data.date}</p>
    ${mediaElement}
    <p style="text-align: justify; line-height: 1.6;">${data.explanation}</p>
  `;
}

/**
 * Configura la fecha máxima permitida en el input de tipo date para evitar fechas futuras.
 */
function setupDateLimits() {
  if (fechaUsuario) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaUsuario.max = hoy;
  }
}

// ==========================================
// INICIALIZACIÓN Y EVENTOS DE INTERACCIÓN
// ==========================================

// Se ejecuta automáticamente al cargar el documento HTML
document.addEventListener('DOMContentLoaded', () => {
  setupDateLimits();
  getApod(); // Carga inicial de la APOD del día
});

// Evento al hacer clic en el botón "Buscar"
if (btnFecha && fechaUsuario) {
  btnFecha.addEventListener('click', () => {
    const fechaSeleccionada = fechaUsuario.value;
    const hoy = new Date().toISOString().split('T')[0];

    if (!fechaSeleccionada) {
      alert('Por favor selecciona una fecha válida.');
      return;
    }

    if (fechaSeleccionada > hoy) {
      alert('No puedes seleccionar fechas futuras.');
      return;
    }

    // Consulta y muestra la APOD de la fecha elegida
    getApod(fechaSeleccionada);
  });
}