const socket = io.connect();
//------------------------------------------------------------------------------------
document.querySelectorAll('.botonComprar').forEach(prod => {
    prod.addEventListener('click', function (event) {
        event.preventDefault();
        let valor = prod.value;
        socket.emit('comprarProductos', {idCart:valor})
    })
});