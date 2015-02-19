//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var L = require("leaflet");

var map = L.map('map').setView([25, 0], 3);

var request = $.ajax({
  url: "assets/countries.geo.json",
  dataType: "json"
}).then(function(data) {
  L.geoJson(data, {
    style: function (feature) {
      return { 
        color: "black",
        fillColor: fillColor(feature.properties.name),
        weight: 1,
        fillOpacity: 1
      };
    }
  }).addTo(map);
});

var fillColor = function(name) {
  if (soundersData[name]) {
    var players = parseInt(soundersData[name].players);
    if (players > 11) {
      return color1;
    } else if (players <= 11 && players > 8) {
      return color2;
    } else if (players <= 8 && players > 5) {
      return color3;
    } else if (players <= 5 && players > 2) {
      return color4;
    } else if (players <= 2 && players > 0) {
      return color5;
    }
  } else {
    return "white";
  }
};

var color1 = "#23580a";
var color2 = "#3d7a20";
var color3 = "#5d9741";
var color4 = "#80b069";
var color5 = "#bedbb0";