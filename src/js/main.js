//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var L = require("leaflet");

var map = L.map('map').setView([25, 0], 2);

L.tileLayer('//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  subdomains: ["server", "services"],
  attribution: "Esri, NAVTEQ, DeLorme" 
}).addTo(map);

var request = $.ajax({
  url: "assets/countries.geo.json",
  dataType: "json"
}).then(function(data) {
  L.geoJson(data).addTo(map);
});