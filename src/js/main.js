//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var L = require("leaflet");
var ich = require("icanhaz");
var popupHTML = require("./_popup.html");

ich.addTemplate("popup", popupHTML);

var map = L.map('map');
map.fitBounds([
    [-28, -135],
    [63, 14],
    [-40, 125],
    [-41, -68]
]);

var request = $.ajax({
  url: "assets/countries.geo.json",
  dataType: "json"
}).then(function(data) {
  var layer = L.geoJson(data, {
    style: function (feature) {
      return { 
        color: "black",
        fillColor: fillColor(feature.properties.name),
        weight: 1,
        fillOpacity: 1
      };
    }
  })

  layer.eachLayer(function(l) {
    var country = l.feature.properties.name;
    
    if (soundersData[country]) {
      var players = soundersData[country].players;

      var options = {
        country: country,
        players: players
      }

      if (soundersData[country].subData) {
        var array = [];
        for (var subCountry in soundersData[country].subData) {
          array.push({
            subCountry: subCountry,
            subPlayers: soundersData[country].subData[subCountry]
          })
        }
        options.subData = array;
      }

      l.bindPopup(ich.popup( options ));
    }

  });

  layer.addTo(map);
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