//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var L = require("leaflet");
var ich = require("icanhaz");
var popupHTML = require("./_popup.html");

var team = "world";
var worldLayer;

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
  worldLayer = L.geoJson(data, {
    style: restyle,
    onEachFeature: function (feature, layer) {
      layer.on({
        click: function(e) {
          openTooltip(e);
        }
      });
    }
  })

  worldLayer.addTo(map);
});

var openTooltip = function(event){
  var country = event.target.feature.properties.name;

  if (team == "world") {
    source = worldData;
  } else if (team == "sounders") {
    source = soundersData;
  } else {
    source = teamData[team];
  }

  if (source[country]) {
    var players = source[country].players;
    var options = {
      country: country,
      players: players
    }

    if (source[country].subData) {
      var array = [];
      for (var subCountry in source[country].subData) {
        array.push({
          subCountry: subCountry,
          subPlayers: source[country].subData[subCountry]
        })
      }
      options.subData = array;
    }
    var coords = event.latlng;
    map.openPopup(ich.popup( options ), coords);
  }
};

var restyle = function(feature) {
  return { 
    color: "black",
    fillColor: fillColor(team, feature.properties.name),
    weight: 1,
    fillOpacity: 1
  };
};

$(".sounders-badge").click(function(e){
  team = $(e.target).data("team");
  worldLayer.setStyle(restyle);
  map.closePopup();
});
$(".badge img").click(function(e){
  team = $(e.target).data("team");
  worldLayer.setStyle(restyle);
  map.closePopup();
});

var fillColor = function(teamId, country) {
  var source;
  if (teamId == "world") {
    if (worldData[country]) {
      var players = parseInt(worldData[country].players);
      if (players > 20) {
        return world1;
      } else if (players <= 20 && players > 12) {
        return world2;
      } else if (players <= 12 && players > 6) {
        return world3;
      } else if (players <= 6 && players > 2) {
        return world4;
      } else if (players <= 2 && players > 0) {
        return world5;
      }
    } else {
      return "white";
    }
  } else if (teamId == "sounders") {
    if (soundersData[country]) {
      var players = parseInt(soundersData[country].players);
      if (players > 11) {
        return sounders1;
      } else if (players <= 11 && players > 8) {
        return sounders2;
      } else if (players <= 8 && players > 5) {
        return sounders3;
      } else if (players <= 5 && players > 2) {
        return sounders4;
      } else if (players <= 2 && players > 0) {
        return sounders5;
      }
    } else {
      return "white";
    }
  } else {
    if (teamData[teamId][country]) {
      var players = parseInt(teamData[teamId][country].players);
      if (players > 11) {
        return world1;
      } else if (players <= 11 && players > 8) {
        return world2;
      } else if (players <= 8 && players > 5) {
        return world3;
      } else if (players <= 5 && players > 2) {
        return world4;
      } else if (players <= 2 && players > 0) {
        return world5;
      }
    } else {
      return "white";
    }
  }
};

var world5 = "#e1a8a9";
var world4 = "#e16667";
var world3 = "#e32527";
var world2 = "#ab1b1d";
var world1 = "#831213";

var sounders1 = "#23580a";
var sounders2 = "#3d7a20";
var sounders3 = "#5d9741";
var sounders4 = "#80b069";
var sounders5 = "#bedbb0";