function getDayFromDateString(dateString) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = dateString.match(regex);
    return parseInt(match[3])
}

function getTimeFromTimeString(timeString) {
    const regex = /^(\d{2}):(\d{2})$/;
    const match = timeString.match(regex);
    return parseInt(match[1])
}

function calculatePoints(receipt) {
    let totalPoints = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name
    totalPoints += receipt.retailer.replace(/[^a-zA-Z0-9]/g, '').length;

    // Rule 2: 50 points if the total is a round dollar amount with no cents
    if (Number.isInteger(parseFloat(receipt.total))) {
      totalPoints += 50;
    }
    
    // Rule 3: 25 points if the total is a multiple of 0.25
    if (parseFloat(receipt.total) % 0.25 === 0) {
      totalPoints += 25;
    }
    
    // Rule 4: 5 points for every two items on the receipt
    totalPoints += Math.floor(receipt.items.length / 2) * 5;

    // Rule 5: If the trimmed length of the item description is a multiple of 3, calculate points
    receipt.items.forEach((item, idx) => {
      const trimmedLength = item.shortDescription.trim().length;
      if (trimmedLength % 3 === 0) {
        let pointsForItem = Math.ceil(parseFloat(item.price) * 0.2);
        totalPoints += pointsForItem
      }
    });

    // Rule 6: 6 points if the day in the purchase date is odd
    const purchaseDay = getDayFromDateString(receipt.purchaseDate);
    if (purchaseDay % 2 !== 0) {
      totalPoints += 6;
    }

    // Rule 7: 10 points if the time of purchase is after 2:00 pm and before 4:00 pm
    const purchaseHour = getTimeFromTimeString(receipt.purchaseTime);
    if (purchaseHour > 14 && purchaseHour < 16) {
      totalPoints += 10;
    }

    return totalPoints;
}

module.exports = { calculatePoints }