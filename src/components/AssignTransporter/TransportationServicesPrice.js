
export function calculatePrice({ temperature, weight, distance }) {
    let basePrice = 0;
  
    // Base price calculation based on weight and distance
    if (weight === "3 to 7 tons") {
      if (distance === "Short Distance (100-400 km)") basePrice = 450;
      else if (distance === "Medium Distance (400-800 km)") basePrice = 900;
      else if (distance === "Long Distance (1000 km and Above)") basePrice = 1900;
    } else if (weight === "7 to 15 tons") {
      if (distance === "Short Distance (100-400 km)") basePrice = 600;
      else if (distance === "Medium Distance (400-800 km)") basePrice = 1150;
      else if (distance === "Long Distance (1000 km and Above)") basePrice = 2200;
    } else if (weight === "Over 15 tons") {
      if (distance === "Short Distance (100-400 km)") basePrice = 750;
      else if (distance === "Medium Distance (400-800 km)") basePrice = 1300;
      else if (distance === "Long Distance (1000 km and Above)") basePrice = 2700;
    }
  
    // Add 20% for refrigerated delivery
    if (temperature === "Refrigerated Delivery") {
      basePrice *= 1.2;
    }
  
    return basePrice;
}