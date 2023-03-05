import {calculateCalories} from "./calories.js";

export function getUserLocation() {
    return new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(`Je huidige locatie is: ${position.coords.latitude}, ${position.coords.longitude}`);

                const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                resolve(userLocation);
            }, (positionError) => reject(positionError))
        } else {
            const error = "Geolocation wordt niet ondersteund door deze browser.";
            console.log(error);
            reject(error);
        }
    });
}

export function getPlace(name = "McDonalds", userLocation, radius = 500, map) {
    return new Promise(function (resolve, reject) {
        let placesService = new google.maps.places.PlacesService(map);

        // Use the Google Maps Places Library to search for McDonald's locations near the user's current location
        let request = {
            location: userLocation, radius: radius, query: name
        };

        placesService.textSearch(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                resolve(results);
            } else {
                reject(status);
            }
        });
    });

}

export async function setupMap(element) {
    const map = new google.maps.Map(element, {
        center: {lat: 51.2206152, lng: 4.4371254},
        zoom: 14
    });
    const userLocation = await getUserLocation();
    //Reposition The map to the user Center
    map.setCenter(userLocation);
    return {userLocation, map}
}

export async function getDirections(userLocation, map) {

    const distanceAndCalories = {
        distance: null,
        kCal: null
    };
    const results = await getPlace("McDonalds", userLocation, 500, map)

    // Get the first McDonald's location and display it on the map
    const nearestMcDonalds = results[0];

    // Use the Google Maps Directions API to show the route to the nearest McDonald's location
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    let request = {
        origin: userLocation,
        destination: nearestMcDonalds.geometry.location,
        travelMode: google.maps.TravelMode.WALKING // Change this to WALKING or TRANSIT to show walking or transit directions
    };

    const result = await directionsService.route(request)
    if (result.status == google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        distanceAndCalories.distance = result.routes[0].legs[0].distance;
        distanceAndCalories.kCal = calculateCalories(result.routes[0].legs[0].distance.value)
    }

    map?.setCenter(userLocation);

    const icon = {
        url: "../src/img/mcdo.png", // url
        scaledSize: new google.maps.Size(35, 35), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(35/2, 35/2), // anchor
        zIndex: 99999
    };

    let marker = new google.maps.Marker({
        position: nearestMcDonalds.geometry.location,
        map: map,
        icon: icon // Set the label to 'McDo'
    });
    return distanceAndCalories
}
