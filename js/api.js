const API_KEY = 'eINdnnn7fiWUYjBQXPpqcHn2pvw0hcHjYpjoMAuK'; // Puedes usar DEMO_KEY o registrarte en api.nasa.gov
const BASE_URL = 'https://api.nasa.gov/planetary/apod';


/**
 * Obtiene la APOD de la NASA para una fecha específica (o el día de hoy si no se envía fecha).
 * @param {string} date
 */
export async function fetchApod(date = '') {
  try {
    const url = `${BASE_URL}?api_key=${API_KEY}${date ? `&date=${date}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error obteniendo APOD:', error);
    throw error;
  }
}