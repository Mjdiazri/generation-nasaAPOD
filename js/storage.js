const STORAGE_KEY = 'nasa_apod_favorites';

export function getFavorites() {
  const favorites = localStorage.getItem(STORAGE_KEY);
  return favorites ? JSON.parse(favorites) : [];
}

export function saveFavorite(apod) {
  const favorites = getFavorites();
  
  // Evitar duplicados por fecha
  const exists = favorites.some(fav => fav.date === apod.date);
  if (!exists) {
    favorites.push({
      date: apod.date,
      title: apod.title,
      url: apod.url,
      media_type: apod.media_type
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return true;
  }
  return false;
}

export function removeFavorite(date) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => fav.date !== date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}