let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");


function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="centertext">
                <small>Cantidad</small>
                <div class="carrito-producto-cantidad">
                    <button class="decrementar-cantidad" data-id="${producto.id}">-</button>
                    <p class="cantidad">${producto.cantidad}</p>
                    <button class="incrementar-cantidad" data-id="${producto.id}">+</button>
                </div>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p class="subtotal">$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
        
            contenedorCarritoProductos.append(div);
        
            const cantidadElement = div.querySelector('.cantidad');
            const subtotalElement = div.querySelector('.subtotal');
            const incrementarBtn = div.querySelector('.incrementar-cantidad');
            const decrementarBtn = div.querySelector('.decrementar-cantidad');
        
            incrementarBtn.addEventListener("click", () => {
                producto.cantidad++;
                cantidadElement.textContent = producto.cantidad;
                subtotalElement.textContent = `$${producto.precio * producto.cantidad}`;
                actualizarTotal();
                guardarCarrito();
            });
        
            decrementarBtn.addEventListener("click", () => {
                if (producto.cantidad > 1) {
                    producto.cantidad--;
                    cantidadElement.textContent = producto.cantidad;
                    subtotalElement.textContent = `$${producto.precio * producto.cantidad}`;
                    actualizarTotal();
                    guardarCarrito();
                }
            });
        });
    
    actualizarBotonesEliminar();
    actualizarTotal();
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }

}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #ff0000, #ff0000)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

// Agregar un evento de clic al botón de comprar carrito
botonComprar.addEventListener("click", comprarCarrito);

// Función para comprar el carrito (vaciar el carrito después de la compra)
function comprarCarrito() {
    // Crear el contenido del correo con los elementos del carrito
    let contenidoCorreo = "Pedido de:\n\n";

    productosEnCarrito.forEach(producto => {
        const titulo = producto.titulo;
        const cantidad = producto.cantidad;
        const precio = producto.precio;

        contenidoCorreo += `${titulo} x${cantidad}: $${precio * cantidad}\n`;
    });


    // Enviar el contenido del carrito por correo electrónico con cliente de correo
    const emailContenido = "mailto:mateosv01@gmail.com?subject=Pedido Mary Jane's Market&body=" + encodeURIComponent(contenidoCorreo);

    // Abre el cliente de correo predeterminado del usuario con el contenido del carrito
    window.location.href = emailContenido;

    // Esperar hasta que el usuario regrese a la página web
    window.onfocus = function() {
        // Vaciar el carrito y actualizar la interfaz y el almacenamiento local
        productosEnCarrito.length = 0;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        // Mostrar el mensaje de compra realizada
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");

        // Eliminar el evento onfocus para que no se limpie el carrito cada vez que la página obtenga el foco
        window.onfocus = null;
    };
}
