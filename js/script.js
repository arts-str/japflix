const buscar = document.getElementById('btnBuscar');
const buscarInput = document.getElementById('inputBuscar');
const listado = document.getElementById('listadoMovies');
const offcanvas = document.getElementById('offcanvas');
const bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvas);
const offcanvasTitle = document.getElementById('offcanvasTopLabel');
const offcanvasDescription = document.getElementById('offcanvasBody');
const offcanvasGenres = document.getElementById('offcanvasGenres');
const offcanvasDropdownYear = document.getElementById('year');
const offcanvasDropdownRuntime = document.getElementById('runtime');
const offcanvasDropdownBudget = document.getElementById('budget');
const offcanvasDropdownRevenue = document.getElementById('revenue');
const MOVIES_URL = 'https://japceibal.github.io/japflix_api/movies-data.json';
let allMovies;


fetch(MOVIES_URL).then(promise => promise.json()).then(respuesta => {
    allMovies = respuesta; //Pasar respuesta a variable global
});

buscar.addEventListener('click', () =>{
    listado.innerHTML = ""; //Borrar el contenido anterior
    let busqueda = buscarInput.value.toLowerCase(); //Pasar la busqueda a minusculas
    let coincidencias = [];
    if (busqueda != '') { //Si la busqueda no está vacía
        allMovies.forEach((movie, i) => { //Por cada película del array de todas las películas 
            if(busqueda === "*"){ //Si la busqueda es * 
                coincidencias.push([movie, i]); //Agrega todas las peliculas y sus posiciones en el array
                return; //Salir
            }         
            if (movie.title.toLowerCase().includes(busqueda) || movie.overview.toLowerCase().includes(busqueda) || movie.tagline.toLowerCase().includes(busqueda)) { //Si la busqueda esta en el titulo, overview o tagline
                coincidencias.push([movie, i]); //Agregar pelicula y posicion en el array a la lista de coincidencias
                return; //Salir
            }
            for (const genre of movie.genres) { //Para cada genero dentro del listado de generos
                if (genre.name.toLowerCase().includes(busqueda)) { //Si el nombre coincide con la busqueda
                    coincidencias.push([movie, i]); //Agregar pelicula y posicion en el array a la lista de coincidencias
                    return; //Salir
                }
            }
        }); //Si no se sale luego de agregar la pelicula, una búsqueda como "a" puede agregar la misma pelicula varias veces a la lista de coincidencias
    }else{
        alert("El campo está vacío!"); //Si la busqueda esta vacia, alertar al usuario
    }
    
    for (const movieArray of coincidencias) { //Para cada coincidencia
        agregarItemALista(listado, movieArray[0], movieArray[1]); //Agregar el item a la lista
    }

    for (const element of listado.children) { //Para cada elemento agregado a la lista
        element.addEventListener('click', () =>{ //Agregar event de click
            rellenarOffcanvas(allMovies[element.id]); //Llamar funcion que rellena el offcanvas, dandole el objeto movie y utilizando la posicion en el array guardada como ID
        });
        
    }
});

function agregarItemALista(listado, elemento, posicion) {
    let starsArray = [];
    let puntuacion = elemento.vote_average/2; //Dividir en 2 para poder mostrarlo en un total de 5 estrellas
    for (let i = 0; i < Math.trunc(puntuacion); i++) {  //Por cada punto entero
        starsArray.push('<i class="bi bi-star-fill"></i>'); //Agregar estrella llena
    }
    if (puntuacion % 2 != 0) { //Si tiene decimal o es número impar
        starsArray.push('<i class="bi bi-star-half"></i>'); //Agregar media estrella
    }
    if (starsArray.length != 5) { //Si no llega a 5 puntos
        for (let i = starsArray.length; i < 5; i++) {
            starsArray.push('<i class="bi bi-star"></i>'); //Agregar estrella vacía
            
        }
    }
    let stars = starsArray.join(" "); //Transformar array a string

    /*
        Agregar al elemento de listado un nuevo item, con la posicion en el array como ID,
        titulo, tagline y cantidad de estrellas previamente calculadas
    */
    listado.innerHTML += `
        <a id="${posicion}" class="list-group-item list-group-item-action elemento-peli" aria-current="true">
          <div class="p-content">
            <h5 class="p-title">${elemento.title}</h5>
            <p class="p-desc">${elemento.tagline}</p>
          </div>
          <div class="p-stars">
            ${stars}
          </div>
        </a>
        `;
}

function rellenarOffcanvas(movie) {
    offcanvasTitle.innerHTML = movie.title;
    offcanvasDescription.innerHTML = movie.overview;
    let genres = "";
    for (const genre of movie.genres) { //Para cada genero dentro del arreglo de generos
        genres += genre.name + " - "; //Agregar el nombre y -
    }
    offcanvasGenres.innerHTML = genres.slice(0, genres.length-3); //Quitar el ultimo - y agregarlo al elemento de generos
    offcanvasDropdownYear.innerHTML = movie.release_date.slice(0, 4); //Cortar los primeros 4 numeros del release_date, con formato yyyy-mm-dd, para obtener el año
    offcanvasDropdownRuntime.innerHTML = movie.runtime + ' mins';
    offcanvasDropdownRevenue.innerHTML = movie.revenue.toLocaleString('en-US', { //toLocaleString formatea correctamente el numero para que tenga formato de dinero en dolares
        style: 'currency',
        currency: 'USD',
    });
    offcanvasDropdownBudget.innerHTML = movie.budget.toLocaleString('en-US', { //toLocaleString formatea correctamente el numero para que tenga formato de dinero en dolares
        style: 'currency',
        currency: 'USD',
    });
    bootstrapOffcanvas.show(); //Mostrar el offcanvas con bootstrap
}