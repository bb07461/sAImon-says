// server.mjs
import { createServer } from 'node:http';
import { SerialPort, ReadlineParser } from 'serialport';
import { readFile } from 'node:fs/promises';


const server = createServer(async (req, res) => {

    console.log(`Received ${req.method} request for: ${req.url}`);

    handleRequest(req, res);

    const htmlContent = await readFile('index.html', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
});

const handleRequest = (req, res) => {
    
    if(req.url === '/START?'){
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Game Started!\n');
    }
}

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
});

const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n'}));

let gameMap = {
    "start pressed":"start",
    "left button pressed": "press the left button",
    "right button pressed": "press the right button",
    "stick right": "flick stick right",
    "stick left": "flick stick left",
    "stick up": "flick stick up",
    "stick down": "flick stick down",
};

let currentAction;
// Log data received from Arduino
parser.on('data', (data) => {
    console.log(`Received from Arduino: ${data}`);
    currentAction = gameMap[data];
});

// Send data to Arduino
// port.write('Hello Arduino\n', (err) => {
//     if (err) {
//         return console.log('Error on write: ', err.message);
//     }
//     console.log('Message sent to Arduino');
// })

port.on('error', (err) => {
    console.log('Serial port error: ', err.message);
})

