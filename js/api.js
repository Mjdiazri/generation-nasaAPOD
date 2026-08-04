const API_KEY = 'eINdnnn7fiWUYjBQXPpqcHn2pvw0hcHjYpjoMAuK';
const URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;

const apodContent = document.getElementById('apod-content');

// Función para obtener la APOD del día actual
async function getTodayApod() {
  try {
    const response = await fetch(URL);
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = await response.json();
    renderApod(data);
  } catch (error) {
    apodContent.innerHTML = `<p class="error">Error al cargar la imagen: ${error.message}</p>`;
  }
}

// Función para renderizar título, fecha, media (imagen/video) y explicación
function renderApod(data) {
  // Manejo de renderizado si la NASA publica una imagen o un video
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

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', getTodayApod);