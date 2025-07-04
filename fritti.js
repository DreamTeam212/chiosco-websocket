const ws = new WebSocket(`ws://${location.host}`);
const lista = document.getElementById('listaFritti');

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.type === 'update' || data.type === 'init') {
    lista.innerHTML = '';
    const completate = data.completate.fritti || [];

    data.comande.forEach(comanda => {
      if (completate.includes(comanda.numero)) return; // Nasconde le comande completate in fritti

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Ordine #${comanda.numero}</strong><br>
        Tipo piatto: ${comanda.tipoPiatto}<br>
        Fritti: ${comanda.fritti.join(', ') || 'Nessuno'}<br>
        <button data-numero="${comanda.numero}">Completato</button>
      `;
      lista.appendChild(li);
    });
  }
};

lista.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    const numero = e.target.getAttribute('data-numero');
    ws.send(JSON.stringify({ type: 'complete', interfaccia: 'fritti', numero }));
  }
});
