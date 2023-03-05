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

export function getPlace(name = "McDonalds", userLocation, radius = 500) {
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

    const distanceAndCalories = {
        distance: null,
        kCal: null
    };
    const userLocation = await getUserLocation();

    const results = await getPlace("McDonalds", userLocation)

    // Get the first McDonald's location and display it on the map
    const nearestMcDonalds = results[0];

    const map = new google.maps.Map(element, {
        zoom: 14
    });
    let marker = new google.maps.Marker({
        position: nearestMcDonalds.geometry.location,
        map: map,
        label: 'McDo' // Set the label to 'McDo'
    });

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
        let kCal = (result.routes[0].legs[0].distance.value / 1000) * 200;
        distanceAndCalories.distance = result.routes[0].legs[0].distance;
        distanceAndCalories.kCal = kCal.toFixed(2);
    }

    map.setCenter(userLocation);
    return distanceAndCalories
}

