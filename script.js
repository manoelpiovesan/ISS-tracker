var map = L.map('map').setView([-22.285353906676182,-42.539959456883565], 2);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png	', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


document.querySelector('#get-iss-coords').addEventListener('click', ()=>{getISSCoords()})

var ListaDeCoordenadas = []


var inverval_timer;

inverval_timer = setInterval(function() { 
    getISSCoords()
}, 7000);
    
//IF you want to stop above timer
function stop_timer() {
    clearInterval(inverval_timer); 
}


function getISSCoords(){
    const url = 'http://api.open-notify.org/iss-now.json'


    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        

        let latitude =  parseFloat(data.iss_position.latitude)
        let longitude = parseFloat(data.iss_position.longitude)

        // var marker = L.marker([latitude, longitude]).addTo(map);

        var circle = L.circle([latitude, longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 50
        }).addTo(map);

        map.setView([latitude,longitude], 7);

        var atualCoordenada = new L.LatLng(latitude, longitude);
       
        if(ListaDeCoordenadas.length == 2 ){

            ListaDeCoordenadas.shift() 
        
        }

        ListaDeCoordenadas.push(atualCoordenada)
        
        

        
        var firstpolyline = new L.Polyline(ListaDeCoordenadas, {
            color: 'red',
            weight: 3,
            opacity: 0.4,
            smoothFactor: 1
        });
        firstpolyline.addTo(map);

        
    })
    .catch(function(error) {
    console.log(error);
    });
}