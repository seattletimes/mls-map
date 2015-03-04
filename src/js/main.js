//Use CommonJS style via browserify to load other modules

require("component-responsive-frame/child");
var $ = require("jquery");
var L = require("leaflet");
var ich = require("icanhaz");
var popupHTML = require("./_popup.html");
var legendHTML = require("./_legend.html");

var team = $(".mobile-menu select").val() || "mls";
var worldLayer;

ich.addTemplate("popup", popupHTML);
ich.addTemplate("legend", legendHTML);

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
  var source;
  var country = event.target.feature.properties.name;

  if (team == "mls") {
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

$(".toggle button").click(function(e){
  team = $(e.target).data("team");
  worldLayer.setStyle(restyle);
  map.closePopup();
  $(".toggle button.selected").removeClass("selected");
  $(e.target).addClass("selected");
});

var changeTeam = function(t) {
  team = t;
  worldLayer.setStyle(restyle);
  map.closePopup();
  if (team == "seattle") {
    $(".toggle button").show();
  } else {
    $(".toggle button").hide();
  }
}

$(".badge img").click(function(e){
  changeTeam(e.target.getAttribute("data-team"));
});

$(".mobile-menu select").change(function() {
  changeTeam(this.value);
});

var fillColor = function(teamId, country) {
  var source;
  if (teamId == "mls") {
    // All teams, 2015

    $(".legend").html(ich.legend({
      teamLabel: "MLS", 
      img: "mls", 
      colors: colors.red
    })); 

    if (worldData[country]) {
      var players = parseInt(worldData[country].players);
      if (players > 21) {
        return colors.red[4];
      } else if (players <= 21 && players > 12) {
        return colors.red[3];
      } else if (players <= 12 && players > 6) {
        return colors.red[2];
      } else if (players <= 6 && players > 2) {
        return colors.red[1];
      } else if (players <= 2 && players > 0) {
        return colors.red[0];
      }
    } else {
      return "white";
    }
  } else if (teamId == "sounders") {
    // Sounders, 2009-2015

    $(".legend").html(ich.legend({
      teamLabel: "Seattle Sounders", 
      img: "seattle", 
      colors: colors.green
    })); 

    if (soundersData[country]) {
      var players = parseInt(soundersData[country].players);
      if (players > 11) {
        return colors.green[4];
      } else if (players <= 11 && players > 8) {
        return colors.green[3];
      } else if (players <= 8 && players > 5) {
        return colors.green[2];
      } else if (players <= 5 && players > 2) {
        return colors.green[1];
      } else if (players <= 2 && players > 0) {
        return colors.green[0];
      }
    } else {
      return "white";
    }
  } else {
    if (teamData[teamId][country]) {
      // Specific team, 2015
      var players = parseInt(teamData[teamId][country].players);
      var color = colors[teamData[teamId].color];

      $(".legend").html(ich.legend({
        teamLabel: teamData[teamId].team, 
        img: teamId, 
        colors: color
      }));

      if (players > 11) {
        return color[4];
      } else if (players <= 11 && players > 8) {
        return color[3];
      } else if (players <= 8 && players > 5) {
        return color[2];
      } else if (players <= 5 && players > 2) {
        return color[1];
      } else if (players <= 2 && players > 0) {
        return color[0];
      }
    } else {
      return "white";
    }
  }
};

// first color is lightest, last is darkest
var colors = {
  "red": [ "#e1a8a9", "#e16667", "#e32527", "#ab1b1d", "#831213" ],
  "green": [ "#bedbb0", "#80b069", "#5d9741", "#3d7a20", "#23580a" ],
  "yellow": [ "#ffec9f", "#ffe681", "#ffdb4b", "#c5a524", "#987900" ],
  "orange": [ "#f4d3c9", "#f4af9a", "#f28260", "#f46b40", "#f44d19" ],
  "gray": [ "#bbb", "#999", "#777", "#555", "#333" ],
  "purple": [ "#d3c5e1", "#936fb8", "#7346a1", "#491d76", "#3c0f69" ]
};