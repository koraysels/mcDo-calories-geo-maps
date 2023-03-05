import './src/css/style.css'
import {getDirections, setupMap} from './src/js/map.js'
import {calculateAmountOfBurgers} from "./src/js/calories.js";

let cardElement = document.querySelector(".card");

try {
    const {userLocation, map} = await setupMap(document.querySelector('#map'))
    const button = document.getElementById("getDirections");

    button.classList.remove("hidden")
    button.addEventListener('click', async () => {

        cardElement.innerHTML = "Loading...";

        const {distance, kCal} = await getDirections(userLocation, map)

        console.log('Walking distance: ', distance?.text);
        console.log('Calories 200kCal/km: ', kCal + 'kCal');

        cardElement.innerHTML =
            `
    <p>
       <span>Distance:</span> ${distance?.text} <br>
        <span>Calories to regain:</span> ${kCal}kCal <br>
    </p>
    <h3>That's ${calculateAmountOfBurgers(kCal)} BigMac's 🍔</h3> 
    `
    });
} catch (e) {
    cardElement.innerHTML = `
        Ooops somehting went wrong! 
        <pre>${e}</pre>
    `
}
