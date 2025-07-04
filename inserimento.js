const ws = new WebSocket(`wss://${location.host}`);

const form = document.getElementById('comandaForm');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  function getMultipleValues(id) {
    const options = document.getElementById(id).selectedOptions;
    return Array.from(options).map(opt => opt.value);
  }

  const comanda = {
    numero: document.getElementById('numero').value,
    tipoPiatto: document.getElementById('tipoPiatto').value,
    carne: getMultipleValues('carne'),
    extra: getMultipleValues('extra'),
    verdure: getMultipleValues('verdure'),
    salse: getMultipleValues('salse'),
    fritti: getMultipleValues('fritti')
  };

  ws.send(JSON.stringify({ type: 'new', comanda }));

  form.reset();
});
