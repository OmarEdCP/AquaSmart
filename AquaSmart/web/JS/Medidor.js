
/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarMedidores();
});

document.getElementById("medidorForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/medidor/insertMedidor";
    let v_modelo = document.getElementById("txtModelo").value;
    let v_cantidad = parseInt(document.getElementById("txtCantidad").value);
    let v_nombreM = document.getElementById("txtNombre").value;
    let v_precio = parseFloat(document.getElementById("txtPrecio").value);

    let medidor = {
        nombre: v_nombreM,
        modelo: v_modelo,
        cantidad: v_cantidad,
        precio: v_precio
    };

    try {
        let params = new URLSearchParams();
        params.append("datosMedidor", JSON.stringify(medidor));

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        };

        const response = await fetch(ruta, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        Swal.fire({
            title: "Registrado!",
            text: `Has registrado exitosamente: ${json.nombre}`,
            icon: "success"
        });

        // Recargar después de insertar

        cargarMedidores();

        // Limpiar el formulario
        document.getElementById("txtModelo").value = "";
        document.getElementById("txtCantidad").value = "";
        document.getElementById("txtNombre").value = "";
        document.getElementById("txtPrecio").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

async function cargarMedidores() {
    let ruta = "/AquaSmart/api/medidor/getAllMedidor";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(medidor => {
            let imagen = "../img/medidor.png";
            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center usuario-item" 
     data-nombre="${medidor.nombre}" id="${medidor.idMedidor}">
    <div class="flip-card ${medidor.estatus === 1 ? '' : 'inactive'}" data-aos="fade-up">
        <div class="flip-card-inner">
            <!-- Parte frontal - Versión mejorada pero compatible -->
            <div class="flip-card-front">
                <div class="front-content">
<img src="${imagen}" alt="Ícono" class="front-icon" style="width: 250px; ">
                    <h4 class="front-title">${medidor.nombre}</h4>
                    <div class="front-modelo">Modelo ${medidor.modelo}</div>
                    <div class="front-precio">
                        <span class="precio-value">${medidor.precio}</span>
                        <span class="precio-currency">MXN</span>
                    </div>
                </div>
            </div>
            
            <!-- Parte trasera - Versión mejorada pero compatible -->
            <div class="flip-card-back">
                <div class="card-header">
                    <i class="bi bi-info-circle"></i> Detalles del Medidor
                </div>
                <div class="list-group">
                    <div class="list-group-item">
                        <i class="bi bi-tag"></i> <strong>ID:</strong> ${medidor.idMedidor}
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-fonts"></i> <strong>Nombre:</strong> ${medidor.nombre}
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-gear"></i> <strong>Modelo:</strong> ${medidor.modelo}
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-box"></i> <strong>Cantidad:</strong> ${medidor.cantidad}
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-cash"></i> <strong>Precio:</strong> ${medidor.precio} MXN
                    </div>
                    <div class="list-group-item status-item ${medidor.estatus === 1 ? 'active' : 'inactive'}">
                        <i class="bi bi-power"></i> <strong>Estatus:</strong> 
                        ${medidor.estatus === 1 ? 'Activo' : 'Inactivo'}
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-estado" 
                        data-id="${medidor.idMedidor}" 
                        data-nombre="${medidor.nombre}"
                        data-cantidad="${medidor.cantidad}"
                        data-modelo="${medidor.modelo}"
                        data-estatus="${medidor.estatus}"
                        data-precio="${medidor.precio}">
                        <i class="bi bi-eye"></i> Ver Más
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`;
        });

        const tablaRegistros = document.getElementById("tablaRegistros");
        if (tablaRegistros) {
            tablaRegistros.innerHTML = cuerpo;

            // Agregar evento a los botones
            document.querySelectorAll(".btn-estado").forEach(button => {
                button.addEventListener("click", () => {
                    const idMedidor = button.getAttribute("data-id");
                    const nombre = button.getAttribute("data-nombre");
                    const cantidad = button.getAttribute("data-cantidad");
                    const precio = button.getAttribute("data-precio");
                    const modelo = button.getAttribute("data-modelo");
                    const estatus = button.getAttribute("data-estatus");

                    // Llenar el modal con los datos
                    document.getElementById("txtIdMedidorEdit").value = idMedidor;
                    document.getElementById("txtNombreEdit").value = nombre;
                    document.getElementById("txtModeloEdit").value = modelo;
                    document.getElementById("txtCantidadEdit").value = cantidad;
                    document.getElementById("txtPrecioEdit").value = precio;
                    document.getElementById("selectEstatusEdit").value = estatus;

                    // Mostrar el modal
                    const modal = new bootstrap.Modal(document.getElementById("medidorModal"));
                    modal.show();
                });
            });
        } else {
            console.error("Elemento con ID 'tablaRegistros' no encontrado");
        }

    } catch (error) {
        console.error("Error al cargar medidores:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los medidores'
        });
    }
}

async function update() {
    let ruta = "/AquaSmart/api/medidor/updateMedidor";
    let v_id = document.getElementById("txtIdMedidorEdit").value;
    let v_modelo = document.getElementById("txtModeloEdit").value;
    let v_cantidad = parseInt(document.getElementById("txtCantidadEdit").value);
    let v_nombreM = document.getElementById("txtNombreEdit").value;
    let v_precio = parseFloat(document.getElementById("txtPrecioEdit").value);
    let v_estatus = document.getElementById("selectEstatusEdit").value;

    let medidor = {
        idMedidor: v_id,
        nombre: v_nombreM,
        modelo: v_modelo,
        cantidad: v_cantidad,
        precio: v_precio,
        estatus: v_estatus
    };

    try {
        let params = new URLSearchParams();
        params.append("datosMedidor", JSON.stringify(medidor));

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        };

        const response = await fetch(ruta, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        Swal.fire({
            title: "Actualizado!",
            text: `Has actualizado exitosamente: ${v_nombreM}`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarMedidores();

        // Limpiar el formulario
        limpiar();

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
}

document.getElementById("btnActualizar").addEventListener("click", function () {
    update();
});

async function deleteMedidor() {
    let ruta = "/AquaSmart/api/medidor/deleteMedidor";
    let v_id = document.getElementById("txtIdMedidorEdit").value;
    // Verifica que el ID sea un número válido
    if (isNaN(v_id)) {
        Swal.fire({
            title: "Error",
            text: "El ID del estado no es válido.",
            icon: "error"
        });
        return;
    }

    try {

        let params = new URLSearchParams();
        params.append("idMedidor", v_id);

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        };

        const response = await fetch(ruta, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        Swal.fire({
            title: "Eliminado!",
            text: `Has eliminado exitosamente el medidor con ID: ${v_id}`,
            icon: "success"
        });

        cargarMedidores();

        // Limpiar el formulario
        limpiar();

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
}

document.getElementById("btnEliminar").addEventListener("click", function () {
    deleteMedidor();
});

function search() {
    let num_cols = 3;
    let input = document.getElementById("searchInput");
    let filter = input.value.toUpperCase();
    let table_body = document.getElementById("tablaRegistros");
    let divs = table_body.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
        let display = "none";
        let p = divs[i].getElementsByTagName("p");
        let h4 = divs[i].getElementsByTagName("h4");
        for (let j = 0; j < p.length; j++) {
            let txtValue = p[j].textContent || p[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                display = "";
                break;
            }
        }
        for (let j = 0; j < h4.length; j++) {
            let txtValue = h4[j].textContent || h4[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                display = "";
                break;
            }
        }
        divs[i].style.display = display;
    }
}

async function limpiar() {
    document.getElementById("txtIdMedidorEdit").value = "";
    document.getElementById("txtModeloEdit").value = "";
    document.getElementById("txtCantidadEdit").value = "";
    document.getElementById("txtNombreEdit").value = "";
    document.getElementById("txtPrecioEdit").value = "";
    document.getElementById("selectEstatusEdit").value = "";
}

document.getElementById("btnLimpiar").addEventListener("click", function () {
    limpiar();
});

