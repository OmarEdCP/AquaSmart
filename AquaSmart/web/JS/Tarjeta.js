

/* global Swal, bootstrap */

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
    cargarTarjetas();
    cargarSelects();
});

// Función para cargar tarjetas
async function cargarTarjetas() {
    try {
        const response = await fetch('/AquaSmart/api/tarjeta/getAllTarjeta');
        const data = await response.json();

        let cuerpo = '';
        data.forEach(tarjeta => {
            const estatusTexto = tarjeta.estatus === 1 ? "Activa" : "Inactiva";
            const estatusClase = tarjeta.estatus === 1 ? '' : 'inactive';

            // Ocultar parte del número de tarjeta por seguridad (mostrar solo últimos 4 dígitos)
            const numTarjetaOculto = tarjeta.numTarjeta ? `•••• •••• •••• ${tarjeta.numTarjeta.slice(-4)}` : 'Sin número';

            // Formatear fecha de expiración
            const fechaExp = tarjeta.mes && tarjeta.anio ? `${tarjeta.mes}/${tarjeta.anio}` : 'No especificada';

            cuerpo += `
            <div class="col">
                <div class="flip-card ${estatusClase}" data-aos="fade-up">
                    <div class="flip-card-inner">
                        <div class="flip-card-front text-center d-flex flex-column align-items-center">
                            <i class="bi bi-credit-card service-icon"></i>
                            <h4>${tarjeta.nombreTitular || 'Sin titular'}</h4>
                            <p class="text-muted">${numTarjetaOculto}</p>
                            <span class="badge ${tarjeta.estatus === 1 ? 'bg-success' : 'bg-secondary'}">${estatusTexto}</span>
                        </div>
                        <div class="flip-card-back text-center">
                            <div class="card-header">
                                <p><i class="bi bi-tag"></i> <strong>Detalles de Tarjeta</strong></p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <p><i class="bi bi-credit-card"></i> <strong>Número:</strong> ${numTarjetaOculto}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-person"></i> <strong>Titular:</strong> ${tarjeta.nombreTitular || 'No especificado'}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-calendar"></i> <strong>Expira:</strong> ${fechaExp}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-person"></i> <strong>Cliente:</strong> ${tarjeta.cliente?.persona?.nombre || 'Sin cliente'} ${tarjeta.cliente?.persona?.apellidoP || ''}</p>
                                </li>
                                <li class="list-group-item status-item ${estatusClase}">
                                    <p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${estatusTexto}</p>
                                </li>
                            </ul>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-editar" 
                                    data-numero="${tarjeta.numTarjeta || ''}"
                                    data-titular="${tarjeta.nombreTitular || ''}"
                                    data-cliente="${tarjeta.cliente?.idCliente || ''}"
                                    data-mes="${tarjeta.mes || ''}"
                                    data-anio="${tarjeta.anio || ''}"
                                    data-cvv="${tarjeta.cvv || ''}"
                                    data-estatus="${tarjeta.estatus}">
                                    <i class="bi bi-pencil-square"></i> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        document.getElementById("tablaRegistros").innerHTML = cuerpo;

        // Agregar eventos a los botones de edición
        document.querySelectorAll(".btn-editar").forEach(button => {
            button.addEventListener("click", () => {
                document.getElementById("txtNumTarjetaEdit").value = button.getAttribute("data-numero");
                document.getElementById("txtNombreTitularEdit").value = button.getAttribute("data-titular");
                document.getElementById("selectClienteEdit").value = button.getAttribute("data-cliente");
                document.getElementById("selectMesEdit").value = button.getAttribute("data-mes");
                document.getElementById("selectAnioEdit").value = button.getAttribute("data-anio");
                document.getElementById("txtCVVEdit").value = button.getAttribute("data-cvv");
                document.getElementById("selectEstatusEdit").value = button.getAttribute("data-estatus");

                const modal = new bootstrap.Modal(document.getElementById("edicionModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar tarjetas:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las tarjetas'
        });
    }
}

// Función para cargar selects
async function cargarSelects() {
    try {
        // Cargar clientes
        const resClientes = await fetch('/AquaSmart/api/cliente/getAllCliente');
        const clientes = await resClientes.json();
        const selectCliente = document.getElementById("selectCliente");
        const selectClienteEdit = document.getElementById("selectClienteEdit");

        clientes.forEach(cli => {
            const option = document.createElement("option");
            option.value = cli.idCliente;
            option.textContent = `${cli.persona.nombre} ${cli.persona.apellidoP}`;
            selectCliente.appendChild(option.cloneNode(true));
            selectClienteEdit.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar selects:", error);
    }
}

// Evento para el formulario de registro
document.getElementById("tarjetaForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let ruta = "/AquaSmart/api/tarjeta/insertTarjeta";
    let v_numTarjeta = String(document.getElementById('txtNumTarjeta').value);
    let v_nombreTitular = String(document.getElementById('txtNombreTitular').value);
    let v_cvv = String(document.getElementById('txtCVV').value);
    let v_selectCliente = parseInt(document.getElementById('selectCliente').value);
    let v_selectMes = String(document.getElementById('selectMes').value);
    let v_selectAnio = String(document.getElementById('selectAnio').value);

    // Validación de campos vacíos
    if (!v_numTarjeta || !v_nombreTitular || !v_cvv || isNaN(v_selectCliente) || !v_selectMes || !v_selectAnio) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Todos los campos son obligatorios",
            icon: "warning"
        });
        return;
    }

    let cliente = {
        idCliente: v_selectCliente
    };

    let tarjeta = {
        numTarjeta: v_numTarjeta,
        cvv: v_cvv,
        mes: v_selectMes,
        anio: v_selectAnio,
        nombreTitular: v_nombreTitular,
        estatus: 1
    };
    tarjeta.cliente = cliente;


    try {
        let params = new URLSearchParams();
        params.append("datosTarjeta", JSON.stringify(tarjeta));

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
            text: `Has registrado exitosamente`,
            icon: "success"
        });

        // Recargar después de insertar

        cargarTarjetas();

        document.getElementById('txtNumTarjeta').value = "";
        document.getElementById('txtNombreTitular').value = "";
        document.getElementById('txtCVV').value = "";
        document.getElementById('selectCliente').value = "";
        document.getElementById('selectMes').value = "";
        document.getElementById('selectAnio').value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

// Evento para actualizar tarjeta
document.getElementById("btnActualizar").addEventListener("click", async function () {
    let ruta = "/AquaSmart/api/tarjeta/updateTarjeta";
    let v_numTarjeta = String(document.getElementById('txtNumTarjetaEdit').value);
    let v_nombreTitular = String(document.getElementById('txtNombreTitularEdit').value);
    let v_cvv = String(document.getElementById('txtCVVEdit').value);
    let v_selectCliente = parseInt(document.getElementById('selectClienteEdit').value);
    let v_selectMes = String(document.getElementById('selectMesEdit').value);
    let v_selectAnio = String(document.getElementById('selectAnioEdit').value);
    let v_estatus = document.getElementById("selectEstatusEdit").value;

    let cliente = {
        idCliente: v_selectCliente
    };

    let tarjeta = {
        numTarjeta: v_numTarjeta,
        cvv: v_cvv,
        mes: v_selectMes,
        anio: v_selectAnio,
        nombreTitular: v_nombreTitular,
        estatus: v_estatus
    };
    tarjeta.cliente = cliente;

    try {
        let params = new URLSearchParams();
        params.append("datosTarjeta", JSON.stringify(tarjeta));

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
            text: `Has actualizado exitosamente: ${v_nombreTitular}`,
            icon: "success"
        });

        // Recargar después de insertar

        cargarTarjetas();
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
});

// Evento para eliminar tarjeta
document.getElementById("btnEliminar").addEventListener("click", async function () {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let ruta = "/AquaSmart/api/tarjeta/deleteTarjeta";
            let v_id = document.getElementById("txtNumTarjetaEdit").value;
            // Verifica que el ID sea un número válido
            if (isNaN(v_id)) {
                Swal.fire({
                    title: "Error",
                    text: "El ID del tarjeta no es válido.",
                    icon: "error"
                });
                return;
            }

            try {

                let params = new URLSearchParams();
                params.append("numTarjeta", v_id);

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
                    text: `Has eliminado exitosamente el tarjeta con ID: ${v_id}`,
                    icon: "success"
                });

                cargarTarjetas();

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
    });
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
    document.getElementById('txtNumTarjetaEdit').value;
    document.getElementById('txtNombreTitularEdit').value;
    document.getElementById('txtCVVEdit').value;
    document.getElementById('selectClienteEdit').value;
    document.getElementById('selectMesEdit').value;
    document.getElementById('selectAnioEdit').value;
    document.getElementById("selectEstatusEdit").value;
}