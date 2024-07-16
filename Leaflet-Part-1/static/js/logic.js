// Fetch the data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(response => response.json())
.then(data => {
    // Create the map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5
    });

    // Add a tile layer (the background map image) to our map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);
    
    // Loop through the data
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
        }).addTo(myMap);

        // Attach a popup to the marker
        circle.bindPopup("<h3>" + earthquake.properties.place + "</h3><hr><p>" + new Date(earthquake.properties.time) + "</p><hr><p>Magnitude: " + magnitude + "</p><p>Depth: " + depth + " km</p>");
    }

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
    legend.addTo(myMap)
});