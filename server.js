const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let comande = [];

// Stato comande completate per interfaccia
let completate = {
  carne: new Set(),
  condimenti: new Set(),
  fritti: new Set()
};

wss.on('connection', function connection(ws) {
  console.log('Nuovo client connesso');

  // Invia stato iniziale
  ws.send(JSON.stringify({ type: 'init', comande, completate }));

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'new') {
      comande.push(data.comanda);
    } else if (data.type === 'complete') {
      // Aggiorna completamento per interfaccia specifica
      const { interfaccia, numero } = data;
      if (completate[interfaccia]) {
        completate[interfaccia].add(numero);
      }
    }

    // Broadcast a tutti i client con stato aggiornato
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'update',
          comande,
          completate: {
            carne: Array.from(completate.carne),
            condimenti: Array.from(completate.condimenti),
            fritti: Array.from(completate.fritti)
          }
        }));
      }
    });
  });
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
