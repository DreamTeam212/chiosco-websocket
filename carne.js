const ws = new WebSocket(`ws://${location.host}`);
const lista = document.getElementById('listaCarne');

ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.type === 'update' || data.type === 'init') {
    lista.innerHTML = '';
    const completate = data.completate.carne || [];

    data.comande.forEach(comanda => {
      if (completate.includes(comanda.numero)) return; // nascondi comande completate in carne

      const extraFiltrati = comanda.extra.filter(x => x === 'mozzarella' || x === 'scamorza');

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Ordine #${comanda.numero}</strong><br>
        Tipo piatto: ${comanda.tipoPiatto}<br>
        Carni: ${comanda.carne.join(', ') || 'Nessuna'}<br>
        Extra (mozzarella/scamorza): ${extraFiltrati.join(', ') || 'Nessuno'}<br>
        <button data-numero="${comanda.numero}">Completato</button>
      `;
      lista.appendChild(li);
    });
  }
};

lista.addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    const numero = e.target.getAttribute('data-numero');
    ws.send(JSON.stringify({ type: 'complete', interfaccia: 'carne', numero }));
  }
});
