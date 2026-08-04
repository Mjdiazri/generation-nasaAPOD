//Funcion selector de fechas
const llave = 'eINdnnn7fiWUYjBQXPpqcHn2pvw0hcHjYpjoMAuK';
const fechaUsuario = document.getElementById('fecha');
const btnFecha = document.getElementById('buscarFecha');


btnFecha.addEventListener('click', function(){
    console.log(fechaUsuario.value);
    buscarDatosFecha();
    pruebaDatosFecha();    
})


async function  buscarDatosFecha() {
    const url = (`https://api.nasa.gov/planetary/apod?api_key=${llave}&date=${fechaUsuario.value}`);
    const responseApi = await fetch(url);
    if(! responseApi.ok) {
        console.log(`\nEstado solicitud: ${responseApi.status} - ${responseApi.statusText}`);
        return null;
    }  
    return await responseApi.json();  
}


async function pruebaDatosFecha(){
    const datosResponse = await buscarDatosFecha();
    if (datosResponse === null){
        console.log("\nDatos no encontrados")
    } else {
        console.log(`\nFecha buscada: ${datosResponse.date} \nExplicacion: ${datosResponse.explanation}`);
    }     
}
