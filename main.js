import './src/css/style.css'
import {setupMap} from './src/js/map.js'


const result = await setupMap(document.querySelector('#map'))
console.log('Walking distance: ', result.distance.text);
console.log('Calories 200kCal/km: ', result.kCal + 'kCal');

document.querySelector(".card").innerHTML =
    `
    Afstand: ${result.distance.text} <br>
    Calorieen te voet: ${result.kCal}kCal 
    `
