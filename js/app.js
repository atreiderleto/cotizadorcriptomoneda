const criptoMonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');



const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// creando promise 


const obtenerCriptimonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomoneda();

    formulario.addEventListener('submit', submitFormulario);

    criptoMonedaSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCriptomoneda() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptimonedas(resultado.Data))
        .then(criptoMonedas => selectCriptoMonedas(criptoMonedas))


}



function selectCriptoMonedas(criptoMonedas) {


    criptoMonedas.forEach(cripto => {

        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');

        option.value = Name;
        option.textContent = FullName
        criptoMonedaSelect.appendChild(option);
    });
}


function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;


}


function submitFormulario(e) {

    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {

        mostrarAlerta('Ambos campos son Obligatorios');

        return
    }

    //consultar la API con los resultados

    consultarAPI();



}

function mostrarAlerta(msg) {

    const existeError = document.querySelector('.error');

    if (!existeError) {

        const divMensaje = document.createElement('div');

        divMensaje.classList.add('error');

        //mensaje de error

        divMensaje.textContent = msg;

        formulario.prepend(divMensaje);

        setTimeout(() => {

            divMensaje.remove();

        }, 2000);
    }


}

function consultarAPI(){

    const {moneda, criptomoneda} = objBusqueda;

    mostrarSpinner();

    const url =  `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    fetch(url)
        .then(respuesta =>respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })

}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();


    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = ` El precio es <span>${PRICE}</span>`;

    resultado.appendChild(precio);


    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Mas Alto del dia</p><span>${HIGHDAY}</span>`;


    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = ` <p>mas bajo del dia</p><span>${LOWDAY}</span>`;


    
    const ultimas24H = document.createElement('p');
    ultimas24H.innerHTML = ` <p>Variacion en las ultimas  24 Horas</p><span>${CHANGEPCT24HOUR}%</span>`;


    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = ` <p>Ultima Actualizacion:</p><span>${LASTUPDATE}</span>`;


    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimas24H);
    resultado.appendChild(lastUpdate);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML()

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = ` 
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>`;

        resultado.appendChild(spinner);


}