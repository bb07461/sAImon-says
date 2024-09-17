// server.mjs
import { createServer } from 'node:http';
import { SerialPort, ReadlineParser } from 'serialport';

const server = createServer((req, res) => {

    console.log(`Received ${req.method} request for: ${req.url}`);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!\n');
});

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:3000');
});

const port = new SerialPort({ path: 'COM3', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n'}));

// Log data received from Arduino
port.on('data', (data) => {
    console.log(`Received from Arduino: ${data}`);
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