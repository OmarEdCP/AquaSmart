

/* global Swal, bootstrap */

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
    cargarTickets();
    cargarSelects();
});

// Función para cargar tickets
async function cargarTickets() {
    try {
        const response = await fetch('/AquaSmart/api/ticket/getAllTicket');
        const data = await response.json();

        let cuerpo = '';
        data.forEach(ticket => {
            // Formatear fecha
            const fechaFormateada = formatTimestampForInput(ticket.fecha);
            const fechaMostrar = formatTimestampForDisplay(ticket.fecha);
            cuerpo += `
            <div class="col">
                <div class="flip-card" data-aos="fade-up">
                    <div class="flip-card-inner">
                        <div class="flip-card-front text-center d-flex flex-column align-items-center">
                            <i class="bi bi-receipt service-icon"></i>
                            <h4>Ticket #${ticket.idTicket}</h4>
                            <p class="text-muted">Fecha: ${fechaMostrar}</p>
                            <span class="badge bg-info">Total: $${Number(ticket.total).toFixed(2)}</span>
                        </div>
                        <div class="flip-card-back text-center">
                            <div class="card-header">
                                <p><i class="bi bi-file-text"></i> <strong>Detalles del Ticket</strong></p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <p><i class="bi bi-calendar"></i> <strong>Fecha:</strong> ${fechaMostrar}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-tag"></i> <strong>Subtotal:</strong> $${ticket.subtotal ? Number(ticket.subtotal).toFixed(2) : '0.00'}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-cash"></i> <strong>Total:</strong> $${Number(ticket.total).toFixed(2)}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-person"></i> <strong>Cliente:</strong> ${ticket.cliente?.persona?.nombre || 'Sin cliente'} ${ticket.cliente?.persona?.apellidoP || ''}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-person-badge"></i> <strong>Empleado:</strong> ${ticket.empleado?.persona?.nombre || 'No asignado'}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-credit-card"></i> <strong>Tarjeta:</strong> ${ticket.numTarjeta?.numTarjeta ? `•••• •••• •••• ${ticket.numTarjeta.numTarjeta.slice(-4)}` : 'Sin tarjeta'}</p>
                                </li>
                            </ul>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-editar"
                                    data-id="${ticket.idTicket}"
                                    data-fecha="${fechaFormateada}"
                                    data-subtotal="${ticket.subtotal}"
                                    data-total="${ticket.total}"
                                    data-cliente="${ticket.cliente?.idCliente || ''}"
                                    data-empleado="${ticket.empleado?.idEmpleado || ''}"
                                    data-tarjeta="${ticket.numTarjeta?.numTarjeta || ''}">
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
                document.getElementById("txtFechaEdit").value = formatTimestampForInput(button.getAttribute("data-fecha"));
                document.getElementById("txtSubtotalEdit").value = button.getAttribute("data-subtotal");
                document.getElementById("txtTotalEdit").value = button.getAttribute("data-total");
                document.getElementById("selectClienteEdit").value = button.getAttribute("data-cliente");
                document.getElementById("selectEmpleadoEdit").value = button.getAttribute("data-empleado");
                document.getElementById("selectTarjetaEdit").value = button.getAttribute("data-tarjeta");

                const modal = new bootstrap.Modal(document.getElementById("edicionModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar tickets:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los tickets'
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

        // Cargar empleados
        const resEmpleados = await fetch('/AquaSmart/api/empleado/getAllEmpleado');
        const empleados = await resEmpleados.json();
        const selectEmpleado = document.getElementById("selectEmpleado");
        const selectEmpleadoEdit = document.getElementById("selectEmpleadoEdit");

        empleados.forEach(emp => {
            const option = document.createElement("option");
            option.value = emp.idEmpleado;
            option.textContent = `${emp.persona.nombre} ${emp.persona.apellidoP}`;
            selectEmpleado.appendChild(option.cloneNode(true));
            selectEmpleadoEdit.appendChild(option);
        });

        // Mapa para asociar tarjetas con clientes
        const tarjetaClienteMap = new Map();

        // Cargar tarjetas
        const resTarjetas = await fetch('/AquaSmart/api/tarjeta/getAllTarjeta');
        const tarjetas = await resTarjetas.json();
        const selectTarjeta = document.getElementById("selectTarjeta");
        const selectTarjetaEdit = document.getElementById("selectTarjetaEdit");

        tarjetas.forEach(tar => {
            const ultimosDigitos = tar.numTarjeta.slice(-4);

            // Guardar relación tarjeta-cliente
            if (tar.cliente) {
                tarjetaClienteMap.set(tar.numTarjeta, tar.cliente.idCliente);
            }

            const option = document.createElement("option");
            option.value = tar.numTarjeta;
            option.textContent = `•••• •••• •••• ${ultimosDigitos}`;

            selectTarjeta.appendChild(option.cloneNode(true));
            selectTarjetaEdit.appendChild(option);
        });

        // Evento para seleccionar el cliente al elegir una tarjeta
        selectTarjeta.addEventListener("change", function () {
            const numTarjetaSeleccionada = selectTarjeta.value;
            const idCliente = tarjetaClienteMap.get(numTarjetaSeleccionada);

            if (idCliente) {
                selectCliente.value = idCliente;
            }
        });

    } catch (error) {
        console.error("Error al cargar selects:", error);
    }
}


// Evento para el formulario de registro
document.getElementById("ticketForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    let ruta = "/AquaSmart/api/ticket/insertTicket";
    let v_fecha = new Date(document.getElementById('txtFecha').value);
    let v_total = parseFloat(document.getElementById('txtTotal').value);
    let v_subtotal = parseFloat(document.getElementById('txtSubtotal').value);
    let v_selectCliente = parseInt(document.getElementById('selectCliente').value);
    let v_selectEmpleado = parseInt(document.getElementById('selectEmpleado').value);
    let v_selectTarjeta = document.getElementById('selectTarjeta').value;

    // Validación de campos vacíos
if (!v_fecha || !v_total || !v_subtotal || isNaN(v_selectCliente) || isNaN(v_selectEmpleado) || !v_selectTarjeta) {
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
    
    let empleado ={
        idEmpleado: v_selectEmpleado
    };
    
    let tarjeta ={
        numTarjeta: v_selectTarjeta
    };

    let ticket = {
        total: v_total,
        subtotal:v_subtotal,
        fecha: v_fecha
    };
    ticket.cliente = cliente;
    ticket.empleado = empleado;
    ticket.numTarjeta = tarjeta;

    try {
        let params = new URLSearchParams();
        params.append("datosTicket", JSON.stringify(ticket));

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

        cargarTickets();

        document.getElementById('txtFecha').value = "";
        document.getElementById('txtTotal').value = "";
        document.getElementById('txtSubtotal').value = "";
        document.getElementById('selectCliente').value = "";
        document.getElementById('selectEmpleado').value = "";
        document.getElementById('selectTarjeta').value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

// Evento para actualizar ticket
document.getElementById("btnActualizar").addEventListener("click", async function () {
    let ruta = "/AquaSmart/api/ticket/updateTarjeta";
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

    let ticket = {
        numTarjeta: v_numTarjeta,
        cvv: v_cvv,
        mes: v_selectMes,
        anio: v_selectAnio,
        nombreTitular: v_nombreTitular,
        estatus: v_estatus
    };
    ticket.cliente = cliente;

    try {
        let params = new URLSearchParams();
        params.append("datosTarjeta", JSON.stringify(ticket));

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

        cargarTickets();
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

// Evento para eliminar ticket
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
            let ruta = "/AquaSmart/api/ticket/deleteTarjeta";
            let v_id = document.getElementById("txtNumTarjetaEdit").value;
            // Verifica que el ID sea un número válido
            if (isNaN(v_id)) {
                Swal.fire({
                    title: "Error",
                    text: "El ID del ticket no es válido.",
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
                    text: `Has eliminado exitosamente el ticket con ID: ${v_id}`,
                    icon: "success"
                });

                cargarTickets();

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

function formatTimestampForInput(timestamp) {
    if (!timestamp)
        return "";

    // Intenta convertir a Date primero
    let date;
    try {
        if (timestamp instanceof Date) {
            date = timestamp;
        } else if (!isNaN(timestamp)) {
            date = new Date(Number(timestamp));
        } else if (typeof timestamp === 'string') {
            // Manejar formato MySQL (yyyy-MM-dd HH:mm:ss)
            if (timestamp.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
                timestamp = timestamp.replace(' ', 'T') + 'Z';
            }
            date = new Date(timestamp);
        } else {
            date = new Date(timestamp);
        }

        if (isNaN(date.getTime())) {
            console.warn("Fecha inválida:", timestamp);
            return "";
        }

        // Formatear a yyyy-MM-ddThh:mm
        const pad = (num) => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch (e) {
        console.error("Error procesando fecha:", e);
        return "";
    }
}

// Función para mostrar fechas legibles
function formatTimestampForDisplay(timestamp) {
    if (!timestamp)
        return "Fecha no disponible";

    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime()))
            return timestamp; // Si no es válido, muestra el valor original

        return date.toLocaleString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (e) {
        console.error("Error formateando timestamp:", e);
        return timestamp;
    }
}