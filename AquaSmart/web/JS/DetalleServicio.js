/* global Swal, bootstrap */

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
    cargarDetalles();
    cargarSelects();
});

// Función para cargar detalles
async function cargarDetalles() {
    try {
        const response = await fetch('/AquaSmart/api/detalle/getAllDetalle');
        const data = await response.json();

        let cuerpo = '';
        data.forEach(detalle => {
            const estatusTexto = detalle.estatus === 1 ? "Activo" : "Inactivo";
            const estatusClase = detalle.estatus === 1 ? '' : 'inactive';

            // Icono basado en el tipo de servicio relacionado
            let icono = 'bi-file-earmark-text'; // Icono por defecto
            if (detalle.servicio?.categoria?.nombre) {
                const nombreCategoria = detalle.servicio.categoria.nombre.toLowerCase();
                if (nombreCategoria.includes('agua')) {
                    icono = 'bi-droplet';
                } else if (nombreCategoria.includes('luz') || nombreCategoria.includes('eléctric')) {
                    icono = 'bi-lightning-charge';
                }
            }

            const fechaFormateada = formatTimestampForInput(detalle.fecha);
            const fechaMostrar = formatTimestampForDisplay(detalle.fecha);

            cuerpo += `
            <div class="col">
                <div class="flip-card ${estatusClase}" data-aos="fade-up">
                    <div class="flip-card-inner">
                        <div class="flip-card-front text-center d-flex flex-column align-items-center">
                            <i class="bi ${icono} service-icon"></i>
                            <h4>${detalle.servicio?.categoria?.nombre || 'Servicio general'}</h4>
                            <p class="text-muted">${fechaMostrar}</p>
                            <span class="badge ${detalle.estatus === 1 ? 'bg-success' : 'bg-secondary'}">${estatusTexto}</span>
                        </div>
                        <div class="flip-card-back text-center">
                            <div class="card-header">
                                <p><i class="bi bi-tag"></i> <strong>ID Detalle:</strong> ${detalle.idDetalle}</p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <p><i class="bi bi-journal-text"></i> <strong>Descripción:</strong> ${detalle.descripcion || 'Sin descripción'}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-tools"></i> <strong>Servicio:</strong> ${detalle.servicio?.categoria?.nombre || 'N/A'} (ID: ${detalle.servicio?.idServicio || 'N/A'})</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-person"></i> <strong>Cliente:</strong> ${detalle.cliente?.persona?.nombre || 'N/A'} ${detalle.cliente?.persona?.apellidoP || ''}</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-speedometer2"></i> <strong>Lectura:</strong> ${detalle.lectura?.flujo || 'N/A'} m³ (${detalle.lectura?.fecha ? new Date(detalle.lectura.fecha).toLocaleDateString() : 'Sin fecha'})</p>
                                </li>
                                <li class="list-group-item">
                                    <p><i class="bi bi-receipt"></i> <strong>Ticket:</strong> ${detalle.ticket?.idTicket ? `#${detalle.ticket.idTicket} ($${detalle.ticket.total})` : 'No asociado'}</p>
                                </li>
                                <li class="list-group-item status-item ${estatusClase}">
                                    <p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${estatusTexto}</p>
                                </li>
                            </ul>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-editar" 
                                    data-id="${detalle.idDetalle}"
                                    data-servicio="${detalle.servicio?.idServicio || ''}"
                                    data-cliente="${detalle.cliente?.idCliente || ''}"
                                    data-lectura="${detalle.lectura?.idLectura || ''}"
                                    data-ticket="${detalle.ticket?.idTicket || ''}"
                                    data-descripcion="${detalle.descripcion || ''}"
                                    data-fecha="${fechaFormateada}"
                                    data-estatus="${detalle.estatus}">
                                    <i class="bi bi-pencil-square"></i> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        document.getElementById("tablaRegistros").innerHTML = cuerpo;

        // Actualizar eventos de edición
        document.querySelectorAll(".btn-editar").forEach(button => {
            button.addEventListener("click", () => {
                const fecha = new Date(button.getAttribute("data-fecha")).toISOString().slice(0, 16);

                document.getElementById("txtIdDetalleEdit").value = button.getAttribute("data-id");
                document.getElementById("selectServicioEdit").value = button.getAttribute("data-servicio");
                document.getElementById("selectClienteEdit").value = button.getAttribute("data-cliente");
                document.getElementById("selectLecturaEdit").value = button.getAttribute("data-lectura");
                document.getElementById("selectTicketEdit").value = button.getAttribute("data-ticket");
                document.getElementById("txtDescripcionEdit").value = button.getAttribute("data-descripcion");
                document.getElementById("txtFechaEdit").value = fecha;
                document.getElementById("selectEstatusEdit").value = button.getAttribute("data-estatus");

                const modal = new bootstrap.Modal(document.getElementById("edicionModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar detalles:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los detalles de servicio'
        });
    }
}

// Función para cargar selects
async function cargarSelects() {
    try {
        // Cargar Servicios
        const resServicios = await fetch('/AquaSmart/api/servicio/getAllServicio');
        const servicios = await resServicios.json();
        const selectServicio = document.getElementById("selectServicio");
        const selectServicioEdit = document.getElementById("selectServicioEdit");

        servicios.forEach(serv => {
            const option = document.createElement("option");
            option.value = serv.idServicio;
            option.textContent = `#${serv.idServicio} - ${serv.categoria?.nombre || 'Servicio'} (${serv.propiedad?.calle || 'Sin propiedad'})`;
            selectServicio.appendChild(option.cloneNode(true));
            selectServicioEdit.appendChild(option);
        });

        // Cargar Clientes (actualizado para mostrar mejor la información)
        const resClientes = await fetch('/AquaSmart/api/cliente/getAllCliente');
        const clientes = await resClientes.json();
        const selectCliente = document.getElementById("selectCliente");
        const selectClienteEdit = document.getElementById("selectClienteEdit");

        clientes.forEach(cli => {
            const option = document.createElement("option");
            option.value = cli.idCliente;
            option.textContent = `${cli.persona?.nombre || 'Cliente'} ${cli.persona?.apellidoP || ''} (${cli.persona?.email || 'Sin email'})`;
            selectCliente.appendChild(option.cloneNode(true));
            selectClienteEdit.appendChild(option);
        });

        // Cargar Lecturas (nuevo)
        const resLecturas = await fetch('/AquaSmart/api/lectura/getAllLectura');
        const lecturas = await resLecturas.json();
        const selectLectura = document.getElementById("selectLectura");
        const selectLecturaEdit = document.getElementById("selectLecturaEdit");

        lecturas.forEach(lec => {
            const option = document.createElement("option");
            option.value = lec.idLectura;
            const fechaLectura = new Date(lec.fecha).toLocaleDateString('es-MX');
            option.textContent = `Lectura #${lec.idLectura} - ${fechaLectura} (${lec.flujo} m³)`;
            selectLectura.appendChild(option.cloneNode(true));
            selectLecturaEdit.appendChild(option);
        });

        // Cargar Tickets (nuevo)
        const resTickets = await fetch('/AquaSmart/api/ticket/getAllTicket');
        const tickets = await resTickets.json();
        const selectTicket = document.getElementById("selectTicket");
        const selectTicketEdit = document.getElementById("selectTicketEdit");

        tickets.forEach(tick => {
            const option = document.createElement("option");
            option.value = tick.idTicket;
            option.textContent = `Ticket #${tick.idTicket} - $${tick.total} (${new Date(tick.fecha).toLocaleDateString('es-MX')})`;
            selectTicket.appendChild(option.cloneNode(true));
            selectTicketEdit.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar selects:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos necesarios para el formulario'
        });
    }
}
// Evento para el formulario de registro
document.getElementById("registroModal").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/detalle/insertDetalle";

    let selectServicio = document.getElementById("selectServicio").value;
    let selectCliente = document.getElementById("selectCliente").value;
    let selectLectura = document.getElementById("selectLectura").value;
    let selectTicket = document.getElementById("selectTicket").value;
    let txtFecha = new Date(document.getElementById("txtFecha").value);
    let txtDescripcion = document.getElementById("txtDescripcion").value;

    let lectura = {
        idLectura: selectLectura
    };

    let ticket = {
        idTicket: selectTicket
    };

    let cliente = {
        idCliente: selectCliente
    };

    let servicio = {
        idServicio: selectServicio
    };

    let detalle = {
        descripcion: txtDescripcion,
        fecha: txtFecha.toISOString()
    };

    detalle.servicio = servicio;
    detalle.ticket = ticket;
    detalle.cliente = cliente;
    detalle.lectura = lectura;

    try {
        let params = new URLSearchParams();
        params.append("datosDetalle", JSON.stringify(detalle));

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

        cargarDetalles();

        // Limpiar el formulario
        document.getElementById("selectServicio").value = "";
        document.getElementById("selectCliente").value = "";
        document.getElementById("selectLectura").value = "";
        document.getElementById("selectTicket").value = "";
        document.getElementById("txtFecha").value = "";
        document.getElementById("txtDescripcion").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

// Evento para actualizar detalle
document.getElementById("btnActualizar").addEventListener("click", async function () {
    let ruta = "/AquaSmart/api/detalle/updateDetalle";
    const txtIdDetalleEdit = document.getElementById("txtIdDetalleEdit").value;
    const selectServicioEdit = document.getElementById("selectServicioEdit").value;
    const selectClienteEdit = document.getElementById("selectClienteEdit").value;
    const selectLecturaEdit = document.getElementById("selectLecturaEdit").value;
    const selectTicketEdit = document.getElementById("selectTicketEdit").value;
    const txtFechaEdit = new Date(document.getElementById("txtFechaEdit").value);
    const txtDescripcionEdit = document.getElementById("txtDescripcionEdit").value;
    const selectEstatusEdit = document.getElementById("selectEstatusEdit").value;

    let lectura = {
        idLectura: selectLecturaEdit
    };

    let ticket = {
        idTicket: selectTicketEdit
    };

    let cliente = {
        idCliente: selectClienteEdit
    };

    let servicio = {
        idServicio: selectServicioEdit
    };

    let detalle = {
        idDetalle: txtIdDetalleEdit,
        descripcion: txtDescripcionEdit,
        estatus:selectEstatusEdit,
        fecha: txtFechaEdit.toISOString()
    };

    detalle.servicio = servicio;
    detalle.ticket = ticket;
    detalle.cliente = cliente;
    detalle.lectura = lectura;

    try {
        let params = new URLSearchParams();
        params.append("datosDetalle", JSON.stringify(detalle));

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
            text: `Has actualizado exitosamente: ${txtIdDetalleEdit}`,
            icon: "success"
        });

        // Recargar estados después de insertar

        cargarDetalles();
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

// Evento para eliminar detalle
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
            let ruta = "/AquaSmart/api/detalle/deleteDetalle";
            let v_id = document.getElementById("txtIdDetalleEdit").value;
            // Verifica que el ID sea un número válido
            if (isNaN(v_id)) {
                Swal.fire({
                    title: "Error",
                    text: "El ID del detalle no es válido.",
                    icon: "error"
                });
                return;
            }

            try {

                let params = new URLSearchParams();
                params.append("idDetalle", v_id);

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
                    text: `Has eliminado exitosamente el detalle con ID: ${v_id}`,
                    icon: "success"
                });

                cargarDetalles();

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
    document.getElementById("txtIdDetalleEdit").value = "";
    document.getElementById("selectServicioEdit").value = "";
    document.getElementById("selectClienteEdit").value = "";
    document.getElementById("selectLecturaEdit").value = "";
    document.getElementById("selectTicketEdit").value = "";
    document.getElementById("txtFechaEdit").value = "";
    document.getElementById("txtDescripcionEdit").value = "";
    document.getElementById("selectEstatusEdit").value = "";
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