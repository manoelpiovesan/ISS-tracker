// var map = L.map('map').setView([-22.285353906676182,-42.539959456883565], 6 );



// L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png	', {
//     maxZoom: 19,
// }).addTo(map);


var cities = L.layerGroup();

var mbAttr = '';
var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';



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



var map = L.map('map', {
    center: [-22.285353906676182, -42.539959456883565],
    zoom: 10,
    layers: [dark, cities]
});

var baseLayers = {
    'Dark': dark,
    'Light': light,
    'Default': osm,

};

var overlays = {
   
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);



var satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
layerControl.addBaseLayer(satellite, 'Satellite');




var inverval_timer;

inverval_timer = setInterval(function() { 
    getISSCoords()
}, 5000);

function stop_timer() {
    clearInterval(inverval_timer); 
}

var ListaDeCoordenadas = []

function getISSCoords(){
    const url = 'http://api.open-notify.org/iss-now.json'


    fetch(url, {referrerPolicy: "unsafe-url" })
    .then((resp) => resp.json())
    .then(function(data) {
        

        let latitude =  parseFloat(data.iss_position.latitude)
        let longitude = parseFloat(data.iss_position.longitude)

        getCityName(latitude,longitude)

        // var marker = L.marker([latitude, longitude]).addTo(map);

        var circle = L.circle([latitude, longitude], {
            color: '#BB86FC',
            fillColor: '#BB86FC',
            fillOpacity: 0.5,
            radius: 150
        }).addTo(map);

        map.setView([latitude,longitude], map.getZoom());

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

    const URL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
    let locationData;
    
    fetch(URL, {referrerPolicy: "unsafe-url" })
    .then((resp) => resp.json())
    .then(function(data) {
        
        console.log(data)
        locationData = data

        document.querySelector('#locality').textContent = data.locality 
        
       

    })
    .catch(function(error) {
    console.log(error);
    });

    return locationData

}





 
