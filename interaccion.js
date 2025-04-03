function toggleSidebar() {
    let sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
}

function toggleSubMenu(event) {
    event.preventDefault();
    let submenu = event.target.nextElementSibling;
    if (submenu) {
        submenu.style.display = submenu.style.display === "block" ? "none" : "block";
    }
}

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(nombre, precio, imagen) {
    precio = parseFloat(precio) || 0;
    let productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    alert(`${nombre} agregado al carrito`);
}

function actualizarCarrito() {
    let listaCarrito = document.getElementById("lista-carrito");
    let totalCarrito = document.getElementById("total");
    let contadorCarrito = document.getElementById("contador-carrito");

    if (contadorCarrito) {
        contadorCarrito.innerText = carrito.reduce((total, item) => total + item.cantidad, 0);
    }

    if (listaCarrito) {
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;
            let div = document.createElement("div");
            div.classList.add("item-carrito");
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}" class="img-carrito">
                <p>${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad}</p>
                <button onclick="modificarCantidad(${index}, -1)">➖</button>
                <button onclick="modificarCantidad(${index}, 1)">➕</button>
                <button class="eliminar" onclick="eliminarProducto(${index})">❌</button>
            `;
            listaCarrito.appendChild(div);
        });

        if (totalCarrito) {
            totalCarrito.textContent = total.toFixed(2);
        }
    }
}

function modificarCantidad(index, cambio) {
    if (carrito[index].cantidad + cambio > 0) {
        carrito[index].cantidad += cambio;
    } else {
        carrito.splice(index, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("pagar")) {
        document.getElementById("pagar").addEventListener("click", function () {
            if (carrito.length === 0) {
                alert("El carrito está vacío.");
                return;
            }
            vaciarCarrito();
            let mensajePago = document.getElementById("mensaje-pago");
            if (mensajePago) {
                mensajePago.innerText = "Pagado con éxito";
                mensajePago.style.display = "block";
            }
        });
    }

    if (document.getElementById("lista-carrito")) {
        actualizarCarrito();
    }

    let params = new URLSearchParams(window.location.search);
    let nombre = params.get("nombre");
    let precio = params.get("precio");
    let img = params.get("img");
    let descripcion = params.get("descripcion");

    if (nombre && precio && img && descripcion) {
        document.getElementById("producto-nombre").textContent = nombre;
        document.getElementById("producto-precio").textContent = `$${parseFloat(precio).toFixed(2)}`;
        document.getElementById("producto-img").src = img;
        document.getElementById("producto-descripcion").textContent = descripcion;
    }

    let btnAgregar = document.getElementById("btn-agregar-carrito");
    if (btnAgregar) {
        btnAgregar.addEventListener("click", function () {
            agregarAlCarrito(nombre, precio, img);
        });
    }
});
