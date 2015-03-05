//Use CommonJS style via browserify to load other modules

require("component-responsive-frame/child");
var $ = require("jquery");
var L = require("leaflet");
var ich = require("icanhaz");
var popupHTML = require("./_popup.html");
var legendHTML = require("./_legend.html");

var team = $(".mobile-menu select").val() || "mls";
var worldLayer;

var legend = $(".legend");
var soundersTime = $(".toggle button");

ich.addTemplate("popup", popupHTML);
ich.addTemplate("legend", legendHTML);

var map = L.map('map', {
  scrollWheelZoom: false
});

var bounds = [
  [-28, -135],
  [63, 14],
  [-40, 125],
  [-41, -68]
];

map.fitBounds(bounds);
$(window).on("resize", function() { map.fitBounds(bounds) });

var restyle = function(feature) {
  return { 
    color: "black",
    fillColor: fillColor(team, feature.properties.name),
    weight: 1,
    fillOpacity: 1
  };
};

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

soundersTime.click(function(e){
  team = $(e.target).data("team");
  worldLayer.setStyle(restyle);
  map.closePopup();
  $(".toggle button.selected").removeClass("selected");
  $(e.target).addClass("selected");
});

// first color is lightest, last is darkest
var colors = {
  red: [ "#e1a8a9", "#e16667", "#e32527", "#ab1b1d", "#831213" ],
  green: [ "#bedbb0", "#80b069", "#5d9741", "#3d7a20", "#23580a" ],
  yellow: [ "#ffec9f", "#ffe681", "#ffdb4b", "#c5a524", "#987900" ],
  orange: [ "#f4d3c9", "#f4af9a", "#f28260", "#f46b40", "#f44d19" ],
  gray: [ "#bbb", "#999", "#777", "#555", "#333" ],
  purple: [ "#d3c5e1", "#936fb8", "#7346a1", "#491d76", "#3c0f69" ]
};

//team scales
var scales = {
  mls: [0, 2, 6, 12, 21],
  sounders: [0, 2, 5, 8, 11],
  default: [0, 2, 5, 8, 11]
};

var changeTeam = function(t) {
  team = t || team;
  if (worldLayer) worldLayer.setStyle(restyle);
  map.closePopup();
  if (team == "seattle") {
    soundersTime.removeClass("selected").show().filter("[data-team=\"seattle\"]").addClass("selected");
  } else {
    soundersTime.hide();
  }

  var data = team == "mls" ? worldData : teamData[team];

  legend.html(ich.legend({
    name: data.team || "MLS",
    img: team,
    colors: team == "mls" ? colors.red : colors.green
  }));
};

changeTeam();

$(".badge img").click(function(e){
  changeTeam(e.target.getAttribute("data-team"));
});

$(".mobile-menu select").change(function() {
  changeTeam(this.value);
});

var fillColor = function(teamId, country) {
  var data;
  var color;
  if (teamId == "mls") {
    data = worldData;
    color = "red";
  } else if (teamId == "sounders") {
    data = soundersData;
    color = "green";
  } else {
    data = teamData[teamId].countries;
    color = teamData[teamId].color;
  }

  if (!data[country]) return "white";

  var scale = scales[teamId] || scales.default;
  var palette = colors[color];
  var players = worldData[country].players * 1;
  for (var i = scale.length - 1; i >= 0; i--) {
    if (players > scale[i]) return palette[i];
  }

  return "black";
};