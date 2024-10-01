//imports 
import "gptFunctions"

const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const path = require('path');

const openai = new OpenAI();

let sequence = [];
let currentIndex = 0;
let score = 0;
let gameActive = false;
let currentAction = "";

//map of commands
const gameMap = {
    "left button pressed": "press the left button",
    "right button pressed": "press the right button",
    "stick right": "flick stick right",
    "stick left": "flick stick left",
    "stick up": "flick stick up",
    "stick down": "flick stick down",
  };


  const server = createServer(async (req, res) => {
    console.log(`Received ${req.method} request for: ${req.url}`);
  
    if (req.url === '/START') {
      // Start the game
      await startGame();
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Game Started!\n');
    } else {
      // Serve the index.html file
      const htmlContent = await readFile('index.html', 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    }
  });

  server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
  });

  // Function to start the game
async function startGame() {
    gameActive = true;
    currentIndex = 0;
    score = 0;
  
    // Generate the Simon says commands
    sequence = await generateSimonCommands();
    console.log("Command Sequence: ", sequence);
  
    // Display commands to player
    await displayCommands(sequence);
    
    // Set up to listen for player inputs
    listenForPlayerInput();
  }
  
  // Function to generate Simon says commands
  async function generateSimonCommands() {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Write back between 12 to 18 messages within quotes. In 70 percent of them, say 'Simon says' in the beginning, then one of these commands: press the left button, press the right button, flick stick up, flick stick down, flick stick right, flick stick left.",
        },
      ],
    });
  
    // Extract the sequence of commands from the response
    const commands = response.choices[0].message.content.split('\n').map(cmd => cmd.trim());
    return commands;
  }
  
  // Function to display the commands to the player
  async function displayCommands(commands) {
    for (let i = 0; i < commands.length; i++) {
      console.log(commands[i]);  // Display to player (on console, replace with LED or sound if necessary)
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay between commands
    }
    console.log("Player's turn...");
  }
  
  // Listen for player's input from Arduino
  function listenForPlayerInput() {
    parser.on('data', (data) => {
      console.log(`Received from Arduino: ${data}`);
      currentAction = gameMap[data.trim()];
  
      // Check the player's input against the current command in the sequence
      if (gameActive && currentAction) {
        if (checkPlayerInput(currentAction, sequence[currentIndex])) {
          console.log("Correct action!");
          currentIndex++;
  
          if (currentIndex >= sequence.length) {
            console.log("You completed the round! Score: ", ++score);
            gameActive = false;
          }
        } else {
          console.log("Wrong action! Game Over.");
          gameActive = false;
        }
      }
    });
  }
  
  /**
   * 
   * Check Win SecFunction to check if the player's input is correct
   */
  function checkPlayerInput(action, command) {
    if (command.startsWith("Simon says")) {
      // Player followed a "Simon says" command
      return command.includes(action);
    } else {
      // Player avoided doing the action when "Simon says" was not mentioned
      return !command.includes(action);
    }
  }
  
  // for serial port error checking 
  port.on('error', (err) => {
    console.log('Serial port error: ', err.message);
  });
  