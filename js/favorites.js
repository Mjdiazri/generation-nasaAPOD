const CLAVE_FAVORITOS = "favoritosNASA";

export function obtenerFavoritos() {

    const favoritos = localStorage.getItem(CLAVE_FAVORITOS);
    return favoritos ? JSON.parse(favoritos) : [];
}

export function guardarFavorito(apod) {
    const favoritos = obtenerFavoritos();
    const existe = favoritos.some(item => item.date === apod.date);

    if (existe) {
        alert("Esta imagen ya está en favoritos.");
        return;
    }

    favoritos.push(apod);
    localStorage.setItem(
        CLAVE_FAVORITOS,
        JSON.stringify(favoritos)
    );
}

export function mostrarFavoritos(lista, callback) {

    lista.innerHTML = "";
    const favoritos = obtenerFavoritos();
    if (favoritos.length === 0) {
        lista.innerHTML = "<li>No hay favoritos guardados.</li>";
        return;
    }
    favoritos.forEach(apod => {
        const li = document.createElement("li");
        li.textContent = `${apod.date} - ${apod.title}`;
        li.addEventListener("click", () => {

            callback(apod);

        });
        lista.appendChild(li);
    });
}