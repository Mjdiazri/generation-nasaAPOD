import {guardarFavorito,mostrarFavoritos} from "./favorites.js";

const API_KEY = 'eINdnnn7fiWUYjBQXPpqcHn2pvw0hcHjYpjoMAuK';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const apodContent = document.getElementById('apod-content');
const fechaUsuario = document.getElementById('fecha');
const btnFecha = document.getElementById('buscarFecha');

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

function renderApod(data) {
  const mediaElement = data.media_type === 'image'
    ? `<img src="${data.url}" alt="${data.title}" style="max-width: 100%; height: auto;">`
    : `<iframe src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 400px;"></iframe>`;

  apodContent.innerHTML = `
    <h2>${data.title}</h2>
    <p><strong>Fecha:</strong> ${data.date}</p>
    ${mediaElement}

    <button id="btnFavorito">
    se agrega a favoritos
    </button>

    <p style="text-align: justify; line-height: 1.6;">${data.explanation}</p>
  `;

  document
  .getElementById("btnFavorito")
  .addEventListener("click", () => {
    guardarFavorito(data);
    mostrarFavoritos(
        document.getElementById("listaFavoritos"),
        renderApod
    );
  });
}


function setupDateLimits() {
  if (fechaUsuario) {
    const hoy = new Date().toISOString().split('T')[0];
    fechaUsuario.max = hoy;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupDateLimits();
  getApod();
  mostrarFavoritos(
    document.getElementById("listaFavoritos"),
    renderApod
  );
});

if (btnFecha && fechaUsuario) {
  btnFecha.addEventListener('click', () => {
    const fechaSeleccionada = fechaUsuario.value;
    const hoy = new Date().toISOString().split('T')[0];

    if (!fechaSeleccionada) {
      Swal.fire({
        icon: "error",
        title: "Fecha invalida",
        text: "Por favor registra una fecha",
      });
      return;
    }

    if (fechaSeleccionada > hoy) {
      alert('No puedes seleccionar fechas futuras.');
      return;
    }

    getApod(fechaSeleccionada);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDateLimits();
  getApod();

  mostrarFavoritos(
      document.getElementById("listaFavoritos"),
      renderApod
  );
});