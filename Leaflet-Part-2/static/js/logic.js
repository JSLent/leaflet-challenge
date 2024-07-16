// Define base maps
var streetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

var satelliteMap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoianNsZW50IiwiYSI6ImNseW01NDZycDFrYmYyaXB3YXAza2J5dW0ifQ.tRSWWi1oPRK_HtI4PWOczA', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoianNsZW50IiwiYSI6ImNseW01NDZycDFrYmYyaXB3YXAza2J5dW0ifQ.tRSWWi1oPRK_HtI4PWOczA'
});

// Initialize map with street map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetMap]
});

// Create overlay object to hold our overlay layers
var overlayMaps = {};

// Fetch the earthquake data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(response => response.json())
.then(data => {
    // Loop through the data
    var earthquakeMarkers = [];
    for (var i = 0; i < data.features.length; i++) {
        var earthquake = data.features[i];
        var magnitude = earthquake.properties.mag;
        var depth = earthquake.geometry.coordinates[2];
        var latlng = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];

        // Create a circle marker
        var circle = L.circleMarker(latlng, {
            radius: magnitude * 5,
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });

        // Attach a popup to the marker
        circle.bindPopup("<h3>" + earthquake.properties.place + "</h3><hr><p>" + new Date(earthquake.properties.time) + "</p><hr><p>Magnitude: " + magnitude + "</p><p>Depth: " + depth + " km</p>");

        // Add the marker to the earthquakeMarkers array
        earthquakeMarkers.push(circle);
    }

    // Create a layer group made from the earthquakeMarkers array, add it to the map
    var earthquakes = L.layerGroup(earthquakeMarkers).addTo(myMap);

    // Add the earthquakes layer to the overlay object
    overlayMaps["Earthquakes"] = earthquakes;

    // Fetch the tectonic plates data
    fetch("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
    .then(response => response.json())
    .then(data => {
        // Create a GeoJSON layer and add it to the map
        var tectonicPlates = L.geoJSON(data, {
            style: function() {
                return {color: "#FF4500", weight: 2}
            }
        }).addTo(myMap);

        // Add the tectonic plates layer to the overlay object
        overlayMaps["Tectonic Plates"] = tectonicPlates;

        // Define a baseMaps object to hold our base layers
        var baseMaps = {
            "Street Map": streetMap,
            "Satellite Map": satelliteMap
        };

        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);
    });
});

// Function to determine marker color based on depth
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#ea2c2c";
        case depth > 70:
            return "#ea822c";
        case depth > 50:
            return "#ee9c00";
        case depth > 30:
            return "#eecc00";
        case depth > 10:
            return "#d4ee00";
        default:
            return "#98ee00";
    }
}

// Create a legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90],
    labels = [];
    div.innerHTML += "<h4>Depth</h4>"
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '; width:10px; height:10px; display:inline-block;"></i> ' +
        grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);
