const ws = new WebSocket(`wss://${location.host}`);
const lista = document.getElementById('listaCondimenti');

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.type === 'update' || data.type === 'init') {
    lista.innerHTML = '';
    const completate = data.completate.condimenti || [];

    data.comande.forEach(comanda => {
      if (completate.includes(comanda.numero)) return; // nascondi comande completate in condimenti

      const extraFiltrati = comanda.extra.filter(x =>
        x === 'mozzarella' || x === 'scamorza' || x === 'pomodoro-insalata');

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Ordine #${comanda.numero}</strong><br>
        Tipo piatto: ${comanda.tipoPiatto}<br>
        Carne: ${comanda.carne.join(', ') || 'Nessuna'}<br>
        Extra: ${extraFiltrati.join(', ') || 'Nessuno'}<br>
        Verdure: ${comanda.verdure.join(', ') || 'Nessuna'}<br>
        Salse: ${comanda.salse.join(', ') || 'Nessuna'}<br>
        <button data-numero="${comanda.numero}">Completato</button>
      `;
      lista.appendChild(li);
    });
  }
};

lista.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    const numero = e.target.getAttribute('data-numero');
    ws.send(JSON.stringify({ type: 'complete', interfaccia: 'condimenti', numero }));
  }
});
