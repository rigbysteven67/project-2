// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [37.132698, -95.822017],
    zoom: 5
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Dartling University",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);
  

  //An array containing each year, superbowl, winner, winner pts, loser. loser pts, mvp, city, state, and location




 // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map
  cities.forEach(city => {
  
    coordinates = city['location'];
    name = city['name'];
    population = city['population'];
  
    marker = L.marker(coordinates, {'title': name});
    marker.bindPopup(`<h1>${year}</h1> <hr/> <h3>Population: ${population}</h3>`)  
    marker.addTo(myMap);
  