//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var L = require("leaflet");
var ich = require("icanhaz");
var popupHTML = require("./_popup.html");

var team = "chicago";
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
    style: restyle
  })

  worldLayer.eachLayer(function(l) {
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

  worldLayer.addTo(map);
});

var restyle = function(feature) {
  return { 
    color: "black",
    fillColor: fillTeamColor(team, feature.properties.name),
    weight: 1,
    fillOpacity: 1
  };
};

$(".badge").click(function(e){
  team = $(e.target).data("team");
  worldLayer.setStyle(restyle);
});

var fillTeamColor = function(teamId, country) {
  if (teamData[teamId][country]) {
    var players = parseInt(teamData[teamId][country].players);
    if (players > 11) {
      return mls1;
    } else if (players <= 11 && players > 8) {
      return mls2;
    } else if (players <= 8 && players > 5) {
      return mls3;
    } else if (players <= 5 && players > 2) {
      return mls4;
    } else if (players <= 2 && players > 0) {
      return mls5;
    }
  } else {
    return "white";
  }
};

var fillSoundersColor = function(country) {
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
};

var mls5 = "#e1a8a9";
var mls4 = "#e16667";
var mls3 = "#e32527";
var mls2 = "#ab1b1d";
var mls1 = "#831213";

var sounders1 = "#23580a";
var sounders2 = "#3d7a20";
var sounders3 = "#5d9741";
var sounders4 = "#80b069";
var sounders5 = "#bedbb0";