import { httpServer } from './src/http_server/index.js';
import { startWebSocket } from './src/ws_server/index.js';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
startWebSocket();

// const ws = new WebSocket("ws://127.0.0.1:8000")

// const send = (event) => {
//     const name = getInput
// }
// const submitButton = document.querySelector("button")
// submitButton?.addEventListener("click", send)
// ws.onmessage = (message) => {}
