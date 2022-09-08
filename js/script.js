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
    layers: [dark, cities],
    attributionControl: false
});

var issIcon = L.icon({
    iconUrl: 'https://cdn.discordapp.com/attachments/978879748782563361/1017279167210999889/iconPurple.PNG',
    shadowUrl: 'https://cdn.discordapp.com/attachments/978879748782563361/1017279167210999889/iconPurple.PNG',

    iconSize:     [38, 38], // size of the icon
    shadowSize:   [0, 0], // size of the shadow
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
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
var issMarker = L.marker([0, 0], {icon: issIcon}).addTo(map)
var ListaDeCoordenadas = []

function getISSCoords(){
    const url = 'https://api.wheretheiss.at/v1/satellites/25544'


    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {




        document.querySelector('#speed').textContent = parseInt(data.velocity)
        document.querySelector('#altitude').textContent = data.altitude.toFixed(2)

        let latitude =  parseFloat(data.latitude)
        let longitude = parseFloat(data.longitude)

        

        
        var newLatLng = new L.LatLng(latitude, longitude);
        issMarker.setLatLng(newLatLng);
        
        
        


        // var issMarker = L.marker([latitude, longitude], {icon: issIcon}).addTo(map);

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

    const URL1 = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
    const URL2 = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`

    var url = URL2
    let locationData;
    
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        
       
        locationData = data
        console.log(data)
        
        if(url == URL2){
            document.querySelector('#locality').textContent = data.address.state + ', ' + data.address.country
        }
        if(url == URL1){document.querySelector('#locality').textContent = data.city }

        
        
        
       

    })
    .catch(function(error) {
    console.log(error);
    });

    return locationData

}





 
