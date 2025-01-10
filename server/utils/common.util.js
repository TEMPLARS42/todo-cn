// Arrays of adjectives and animals
const adjectives = [
    "Brave", "Clever", "Happy", "Kind", "Bold", "Swift", "Curious",
    "Gentle", "Loyal", "Playful", "Quiet", "Wise", "Mighty"
];

const animals = [
    "Lion", "Elephant", "Tiger", "Bear", "Wolf", "Fox", "Dolphin",
    "Eagle", "Rabbit", "Panda", "Kangaroo", "Otter", "Hawk"
];

// Function to generate random name
function generateRandomName() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomAdjective} ${randomAnimal}`;
}

function generateRandomId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


module.exports = {
    generateRandomName,
    generateRandomId
}