// Function to fetch and load events from JSON file
async function loadEvents() {
    try {
        const response = await fetch('events.json');
        const eventData = await response.json();
        return eventData;
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize thegame
let events = [];

loadEvents().then((eventData) => {
    events = eventData;
    shuffleArray(events);
    updateEventDisplay();
});

// JavaScript code goes here
let currentEventIndex = 0;

let states = {
    physical: 50,
    mental: 50,
    economy: 50,
    dignity: 50
};

//Function to update the displayed event and choices
function updateEventDisplay() {
    // Update state values display
    for (let state in states) {
        document.getElementById(state).textContent = state.charAt(0).toUpperCase() + state.slice(1) + ": " + states[state];
    }

    if (currentEventIndex < events.length) {
        const event = events[currentEventIndex];
        document.getElementById("event").innerHTML = "<p>" + event.text + "</p>";

        const choicesContainer = document.getElementById("choices");
        choicesContainer.innerHTML = ""; // Clear previous choices

        if (event.choices) {
            event.choices.forEach((choice, index) => {
                const button = document.createElement("button");
                button.textContent = choice.text;
                button.addEventListener("click", () => handleChoice(index));
                choicesContainer.appendChild(button);
            });
        }
    } else {
        document.getElementById("event").innerHTML = "<p>Event end.</p>";
        document.getElementById("choices").innerHTML = "";
    }
}
// Update state values display
document.getElementById("physical").textContent = "Physical: " + states.physical;
document.getElementById("mental").textContent = "Mental: " + states.mental;
document.getElementById("economy").textContent = "Economy: " + states.economy;
document.getElementById("dignity").textContent = "Dignity: " + states.dignity;


// Function to handle a choice
function handleChoice(choiceIndex) {
    const choiceEffects = events[currentEventIndex].choices[choiceIndex].effects;
    applyEffects(choiceEffects);
    const choiceResult = events[currentEventIndex].choices[choiceIndex].result;
    if (choiceResult) {
        displayResult(choiceResult);
    } else {
        displayResult("No result description available.");
    }

    console.log("currentEventIndex: ", currentEventIndex);
    console.log("choiceIndex: ", choiceIndex);
    console.log("events: ", events);
    console.log("choiceEffects: ", choiceEffects);
    console.log("result", choiceResult);

    currentEventIndex++;
    updateEventDisplay();
}
        
// Function to apply effects to states
function applyEffects(effects) {
    for (let state in effects) {
        states[state] += effects[state] || 0;
        states[state] = Math.max(0, Math.min(100, states[state])); // Ensure values stay within the range of 0 to 100
    }
}

// Function to display the choice result
function displayResult(resultText) {
    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = "<p>" + resultText + "</p>";
}
// Set up event listeners
document.getElementById("choice1").addEventListener("click", handleChoice);
document.getElementById("choice2").addEventListener("click", handleChoice);

// Initialize the game
updateEventDisplay();

