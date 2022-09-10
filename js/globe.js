

// ------ API das coordenadas da ISS
const urlISS = 'https://api.wheretheiss.at/v1/satellites/25544'

// variaveis globais (nao alterar)
var ListaDeCoordenadas = []
// -------------------------------------------------------
//config globo
const markerSvg = `<img src='img/iconPurple.png' style='width: 2rem;'/>`;

var gData = [{
    lat: -22.2,
    lng: -42.2,
    size:20 ,
    color: 'red'
  }];

const arcsData = [{
    startLat: -22,
    startLng: -42,
    endLat: 40,
    endLng: 20,
    color: 'red'
  }];



var world = Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  .htmlElementsData(gData)
  .htmlElement(d => {
      const el = document.createElement('div');
      el.innerHTML = markerSvg;
      el.style.color = d.color;
      el.style.width = `${d.size}px`;

      el.style['pointer-events'] = 'auto';
      el.style.cursor = 'pointer';
      el.onclick = () => console.info(d);
      return el;
    })
   // .htmlAltitude(0.15)
    .htmlTransitionDuration([4000])
    .arcsData(arcsData)
    .arcAltitudeAutoScale(0.15)
(document.getElementById('myGlobe'))
// clouds



// Add clouds sphere
const CLOUDS_IMG_URL = './img/clouds.png'; // from https://github.com/turban/webgl-earth
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.003; // deg/frame

new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
  const clouds = new THREE.Mesh(
    new THREE.SphereBufferGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
    new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
  );
  world.scene().add(clouds);

  (function rotateClouds() {
    clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
    requestAnimationFrame(rotateClouds);
  })();
});

//--- end clouds


// adding arcs
document.querySelector('#toggle-day-night').addEventListener('click', ()=>{
    toggleDayNightGlobe()
})

var day = false
function toggleDayNightGlobe(){

    day = !day

    if(day){
        world.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        document.querySelector('#day-night-icon').setAttribute('src', 'img/sun.svg')
        
    }else{
       
        world.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        document.querySelector('#day-night-icon').setAttribute('src', 'img/moon.svg')
    }

    

}


function changeCoords(lat, lng){
    gData[0].lat = lat
    gData[0].lng = lng

    world.htmlElementsData(gData)
}


// fim config globo

// Loop de 5 segundos
var inverval_timer;

inverval_timer = setInterval(function() { 
    getISSCoords()
}, 4000);



var firstPoint = true


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
        

        //arco
        if(firstPoint){
            arcsData[0].startLat = latitude
            arcsData[0].startLng = longitude

            world.pointOfView({lat: latitude, lng: longitude}, 0)

            firstPoint = !firstPoint
        }

        arcsData[0].endLat = latitude
        arcsData[0].endLng = longitude

        world.arcsData(arcsData)

        // atualizando localizacao do icone da ISS
       
        
        // resgatando local das coordenadas
        getCityName(latitude,longitude)

        changeCoords(latitude,longitude)

       
        

        
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





 