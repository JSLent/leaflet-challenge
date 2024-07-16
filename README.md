# leaflet-challenge
Repo for Challenge 15

## Earthquake Visualization (Part 1)
# Overview
This challenge asked us to create visualizations to display earthquake data using Leaflet.js. I fetched the data from the USGS GeoJSON Feed page and includes all earthquakes from the past 7 days.  The map I am pulling from openstreetmap.org.  

# Features
The main features include a map plot with interactive markers indicating the key metrics associated with earthquakes in the last 7 days.  The markers have different sizes indicating the magnitude and colors indicating the depth of the earthquakes.  When you click on each marker, it displays the key metrics associated with the earthquake.  There is also a legend in the lower right corner to help interpret the colors of each marker.  

# How to Run
Clone this repository.
Open the index.html file in a web browser.
Click into any marker you want to display the key metrics.  


## Earthquake and Tectonic Plates Visualization (Part 2)
# Overview
Part 2 of this challenge extends the earthquake visualization from Part 1 by adding data on tectonic plates. The tectonic plates data is fetched from USGS GeoJSON similar to part 1.

# Features
All the features from Part 1.
A second dataset that illustrates the relationship between tectonic plates and seismic activity.
Additional map layers to choose from to change the map view.
Each dataset (earthquakes and tectonic plates) is put into separate overlays that can be turned on and off independently.
Layer controls to choose which base map to display and which overlays to show.

# How to Run
Clone this repository.
Open the index.html file in a web browser.
Click into any marker you want to display the key metrics.
Select alternate map layers to change the map view.