

// ------ API das coordenadas da ISS
const urlISS = 'https://api.wheretheiss.at/v1/satellites/25544'

// variaveis globais (nao alterar)
var ListaDeCoordenadas = []
// -------------------------------------------------------


// ------------ Inicio da config do Leaflet ---------
var cities = L.layerGroup();

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
});

var dark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
});

var light = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
});

var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: ''});



var map = L.map('map', {
    center: [-22.285353906676182, -42.539959456883565],
    zoom: 10,
    layers: [dark, cities],
    attributionControl: false
});

// icone da ISS roxo
var issIcon = L.icon({
    iconUrl: 'https://cdn.discordapp.com/attachments/978879748782563361/1017279167210999889/iconPurple.PNG',
    shadowUrl: 'https://cdn.discordapp.com/attachments/978879748782563361/1017279167210999889/iconPurple.PNG',

    iconSize:     [38, 38], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// adicionado icone no mapa
var issMarker = L.marker([0, 0], {icon: issIcon}).addTo(map)

var baseLayers = {
    'Dark': dark,
    'Light': light,
    'Default': osm,
    'Satélite': satellite,
};

var overlays = {
   
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
// -----------------  fim config do LEAFLET ---------

//travar visao e alternar
var viewStatus = true


document.querySelector('#lock').addEventListener('click', ()=>{

    viewStatus = !viewStatus

    if(viewStatus){
        document.querySelector('#lock-img').setAttribute('src', './img/lock.svg') 
    }else{
        document.querySelector('#lock-img').setAttribute('src', './img/open.svg') 
    }

})





// Loop de 5 segundos
var inverval_timer;

inverval_timer = setInterval(function() { 
    getISSCoords()
}, 4000);





function getISSCoords(){

    fetch(urlISS)
    .then((resp) => resp.json())
    .then(function(data) {

        // enviando velocidade e altitude p interface
        document.querySelector('#speed').textContent = parseInt(data.velocity)
        document.querySelector('#altitude').textContent = data.altitude.toFixed(2)

        // salvando coordenadas em variaveis
        let latitude =  parseFloat(data.latitude)
        let longitude = parseFloat(data.longitude)
        
        // atualizando localizacao do icone da ISS
        var newLatLng = new L.LatLng(latitude, longitude);
        issMarker.setLatLng(newLatLng);
        
        // resgatando local das coordenadas
        getCityName(latitude,longitude)

        // adicionando pontos
        var circle = L.circle([latitude, longitude], {
            color: '#BB86FC',
            fillColor: '#BB86FC',
            fillOpacity: 0.5,
            radius: 150
        }).addTo(map);

        // atualizando a vista se estiver travada no alvo
        if(viewStatus){map.setView([latitude,longitude], map.getZoom());}

        //salvando apenas as ultimas 2 coordenadas para trançar uma linha
        var atualCoordenada = new L.LatLng(latitude, longitude);
       
        if(ListaDeCoordenadas.length == 2 ){
            ListaDeCoordenadas.shift() 
        }

        ListaDeCoordenadas.push(atualCoordenada)
        
        var firstpolyline = new L.Polyline(ListaDeCoordenadas, {
            color: '#BB86FC',
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1
        });

        firstpolyline.addTo(map);

        
    })
    .catch(function(error) {
    console.log(error);
    });
}

function getCityName(latitude, longitude){
    
    // ------------------VARIAVEIS AJUSTAVEIS-----------------

        // URL1: API que retorna o oceano também, porém com limites de requisições.
        const URL1 = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`

        // URL2: API sem limites de requisições mas não mostra o oceano.
        const URL2 = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`

        // A API que vai ser usada no momento
        var url = URL2


    let locationData;
    
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {



        locationData = data

        console.log(data)
        
        if(url == URL2){

            try{
                document.querySelector('#locality').textContent = data.address.state + ', ' + data.address.country
            }catch{
                document.querySelector('#locality').textContent = 'Em meio ao oceâno'
            }

            
        }
        if(url == URL1){document.querySelector('#locality').textContent = data.locality }

    })
    .catch(function(error) {
    console.log(error);
    });

    return locationData
}





 
