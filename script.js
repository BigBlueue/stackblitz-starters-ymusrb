// script.js

// Define the username variable
let username = "Anonymous";

document.getElementById('messageInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const message = this.value.trim();
        if (message.startsWith('/roll ')) {
            rollDiceCommand(message.substring(6));
        } else {
            sendMessage(message);
        }
        this.value = '';
    }
});

document.getElementById('normalRollButton').addEventListener('click', () => {
    rollDiceCommand("1d6", true);
});

document.getElementById('advantageRollButton').addEventListener('click', () => {
    rollDiceCommand("2d6", false, true);
});

document.getElementById('disadvantageRollButton').addEventListener('click', () => {
    rollDiceCommand("2d6", true, true);
});

function rollDiceCommand(expression, pickLowest = false, pickHighest = false) {
    const match = expression.match(/^(\d+)d(\d+)$/);
    if (match) {
        const numDice = parseInt(match[1]);
        const numSides = parseInt(match[2]);
        let total = 0;
        let rolls = new Uint32Array(numDice);
        window.crypto.getRandomValues(rolls);
        rolls = Array.from(rolls).map(val => val % numSides + 1);
        for (let i = 0; i < numDice; i++) {
            total += rolls[i];
        }
        let message = `${username} rolled ${expression}: Rolls: ${rolls.join(', ')}`;
        if (pickLowest) {
            total = Math.min(...rolls);
            message += `. Total: ${total}`;
        } else if (pickHighest) {
            total = Math.max(...rolls);
            message += `. Total: ${total}`;
        } else {
            message += `. Total: ${total}`;
        }
        appendMessage(message);
    } else {
        const message = `${username}: Invalid dice roll command. Please use the format: /roll [number of dice]d[number of sides]`;
        appendMessage(message);
    }
}

function sendMessage(message) {
    if (message.trim() !== '') {
        const formattedMessage = `${username}: ${message}`;
        appendMessage(formattedMessage);
    }
}

function appendMessage(message) {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
}
