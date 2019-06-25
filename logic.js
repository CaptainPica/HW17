// Center of the US, what the map zooms to and resets to
centerLatLon = [39.8283,-98.5795];
startZoom = 4.5;

// Base map creation goes here
var map = L.map("map", {
    center: centerLatLon,
    zoom: startZoom
});

// Initial background layer goes here
var terrain = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    minZoom: 1,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(map);

// Creates function to color circles and legend
function findColor(mag) {
    if (mag >= 5) {return "rgb(255,0,0)"}
    else if (mag >= 4) {return "rgb(200,50,0)"}
    else if (mag >= 3) {return "rgb(150,100,0)"}
    else if (mag >= 2) {return "rgb(100,150,0)"}
    else if (mag >= 1) {return "rgb(50,200,0)"}
    else {return "rgb(0,255,0)"}
}

// Creates the circles
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data=>{
    data = data["features"];
    data.forEach(element => {
        var circle = L.circle([element["geometry"]["coordinates"][1],element["geometry"]["coordinates"][0]], {
            radius: element["properties"]["mag"]*10000,
            fillColor: findColor(element["properties"]["mag"]),
            color: findColor(element["properties"]["mag"]),
            fillOpacity: .5,
            opacity: .5
        }).addTo(map);

        circle.bindPopup(`The magnitude of the earthquake is ${element["properties"]["mag"]}.
        It happened ${element["properties"]["place"]}.`);
    });
});

// Adds legend, straight off example page from leaflet
var legend = L.control({position: 'bottomright'});

legend.onAdd = function() {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + findColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);