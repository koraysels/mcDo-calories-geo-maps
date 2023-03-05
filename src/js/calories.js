const CALORIES_PER_KM = 200;
const CALORIES_PER_BIGMAC = 257;

export function calculateCalories(distanceInMeters) {
    return ((distanceInMeters / 1000) * CALORIES_PER_KM).toFixed(2);
}

export function calculateAmountOfBurgers(calories) {
    return (calories / CALORIES_PER_BIGMAC).toFixed(2);
}
