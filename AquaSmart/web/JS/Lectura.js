


/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarLecturas();
    cargarMedidores();
});

document.getElementById("lecturaForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/lectura/insertLectura";
    let v_medidor = parseInt(document.getElementById("selectMedidor").value);
    let v_fecha = new Date(document.getElementById("txtFecha").value);
    let v_flujo = parseFloat(document.getElementById("txtFlujo").value);
    let v_pulsaciones = parseFloat(document.getElementById("txtPulsaciones").value);

    let medidor = {
        idMedidor: v_medidor
    };
    let lectura = {
     fecha: v_fecha.toISOString(), // Convierte la fecha en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
    flujo: v_flujo,
    pulsaciones: v_pulsaciones
    };

    lectura.medidor = medidor;
    try {
        let params = new URLSearchParams();
        params.append("datosLectura", JSON.stringify(lectura));

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        };

        const response = await fetch(ruta, requestOptions);
const responseText = await response.text();
console.log("Respuesta del servidor:", responseText);

try {
    const json = JSON.parse(responseText);
    Swal.fire({
        title: "Actualizado!",
        text: `Has registrado exitosamente la lectura: ${json.result}`,
        icon: "success"
    });
    
             // Recargar después de insertar

        cargarLecturas();

        // Limpiar el formulario
        document.getElementById("selectMedidor").value = "";
        document.getElementById("txtFecha").value = "";
        document.getElementById("txtFlujo").value = "";
        document.getElementById("txtPulsaciones").value = "";
} catch (error) {
    console.error("Error al parsear JSON:", error);
    Swal.fire({
        title: "Error",
        text: "Respuesta del servidor inválida.",
        icon: "error"
    });
}
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

async function cargarLecturas() {
    let ruta = "/AquaSmart/api/lectura/getAllLectura";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(lectura => {
            const fechaFormateada = formatTimestampForInput(lectura.fecha);
            const fechaMostrar = formatTimestampForDisplay(lectura.fecha);
            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center lectura-item" 
     data-id="${lectura.idLectura}" id="lectura-${lectura.idLectura}">
    <div class="flip-card ${lectura.estatus === 1 ? '' : 'inactive'}" data-aos="fade-up">
        <div class="flip-card-inner">
            <!-- Parte frontal - Versión para Lectura -->
            <div class="flip-card-front">
                <div class="front-content">
                    <i class="bi bi-speedometer2 front-icon"></i>
                    <h4 class="front-title">Medidor: ${lectura.medidor.nombre}</h4>
                    <div class="front-modelo">Lectura #${lectura.idLectura}</div>
                    <div class="front-precio">
                        <span class="precio-value">${lectura.flujo}</span>
                        <span class="precio-currency">L/min</span>
                    </div>
                </div>
            </div>
            
            <!-- Parte trasera - Detalles de Lectura con Medidor -->
            <div class="flip-card-back">
                <div class="card-header">
                    <i class="bi bi-info-circle"></i> Detalles de Lectura
                </div>
                <div class="list-group">
                    <div class="list-group-item">
                        <i class="bi bi-tag"></i> <strong>ID Lectura:</strong> ${lectura.idLectura}
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-speedometer2"></i> <strong>Medidor:</strong> ${lectura.medidor.nombre} (ID: ${lectura.medidor.idMedidor})
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-water"></i> <strong>Flujo:</strong> ${lectura.flujo} L/min
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-lightning-charge"></i> <strong>Pulsaciones:</strong> ${lectura.pulsaciones}
                    </div>
                    <div class="list-group-item">
                        <i class="bi bi-calendar"></i> <strong>Fecha:</strong> ${fechaMostrar}
                    </div>
                    <div class="list-group-item status-item ${lectura.estatus === 1 ? 'active' : 'inactive'}">
                        <i class="bi bi-power"></i> <strong>Estatus:</strong> 
                        ${lectura.estatus === 1 ? 'Activo' : 'Inactivo'}
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-primary btn-estado" 
                        data-id="${lectura.idLectura}"
                        data-medidor-id="${lectura.medidor.idMedidor}"
                        data-medidor-nombre="${lectura.medidor.nombre}"
                        data-flujo="${lectura.flujo}"
                        data-pulsaciones="${lectura.pulsaciones}"
                        data-fecha="${fechaFormateada}"
                        data-estatus="${lectura.estatus}">
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

            // Agregar evento a los botones (actualizado para Lectura)
            document.querySelectorAll(".btn-estado").forEach(button => {
                button.addEventListener("click", () => {
                    const idLectura = button.getAttribute("data-id");
                    const medidorId = button.getAttribute("data-medidor-id");
                    const medidorNombre = button.getAttribute("data-medidor-nombre");
                    const flujo = button.getAttribute("data-flujo");
                    const pulsaciones = button.getAttribute("data-pulsaciones");
                    const fecha = button.getAttribute("data-fecha");
                    const estatus = button.getAttribute("data-estatus");

                    // Llenar el modal con los datos de Lectura
                    document.getElementById("txtIdLecturaEdit").value = idLectura;
                    document.getElementById("selectMedidorEdit").value = medidorId;
                    document.getElementById("txtFlujoEdit").value = flujo;
                    document.getElementById("txtPulsacionesEdit").value = pulsaciones;
                    document.getElementById("txtFechaEdit").value = fecha || "";
                    document.getElementById("selectEstatusEdit").value = estatus;

                    // Mostrar el modal
                    const modal = new bootstrap.Modal(document.getElementById("lecturaModal"));
                    modal.show();
                });
            });
        } else {
            console.error("Elemento con ID 'tablaRegistros' no encontrado");
        }

    } catch (error) {
        console.error("Error al cargar lecturas:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las lecturas'
        });
    }
}

async function update() {
    let ruta = "/AquaSmart/api/lectura/updateLectura";
    let v_id = document.getElementById("txtIdLecturaEdit").value;
    let v_medidor = parseInt(document.getElementById("selectMedidorEdit").value);
    let v_fecha = new Date(document.getElementById("txtFechaEdit").value);
    let v_flujo = parseFloat(document.getElementById("txtFlujoEdit").value);
    let v_pulsaciones = parseFloat(document.getElementById("txtPulsacionesEdit").value);
    let v_estatus = document.getElementById("selectEstatusEdit").value;

    let medidor = {
        idMedidor: v_medidor
    };
    let lectura = {
        idLectura: v_id,
 fecha: v_fecha.toISOString(), // Convierte la fecha en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
    flujo: v_flujo,
    pulsaciones: v_pulsaciones,
        estatus:v_estatus
    };

    lectura.medidor = medidor;
    try {
        let params = new URLSearchParams();
        params.append("datosLectura", JSON.stringify(lectura));
console.log("Datos enviados:", JSON.stringify(lectura, null, 2));
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: params
        };

        const response = await fetch(ruta, requestOptions);
const responseText = await response.text();
console.log("Respuesta del servidor:", responseText);

try {
    const json = JSON.parse(responseText);
    Swal.fire({
        title: "Actualizado!",
        text: `Has actualizado exitosamente la lectura: ${json.result}`,
        icon: "success"
    });
    
       // Recargar estados después de insertar
        cargarLecturas();

        // Limpiar el formulario
        limpiar();
} catch (error) {
    console.error("Error al parsear JSON:", error);
    Swal.fire({
        title: "Error",
        text: "Respuesta del servidor inválida.",
        icon: "error"
    });
}

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

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

async function deleteLectura() {
    let ruta = "/AquaSmart/api/lectura/deleteLectura";
    let v_id = document.getElementById("txtIdLecturaEdit").value;
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
        params.append("idLectura", v_id);

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
            text: `Has eliminado exitosamente el lectura con ID: ${v_id}`,
            icon: "success"
        });

        cargarLecturas();

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
    deleteLectura();
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
     document.getElementById("txtIdLecturaEdit").value="";
  document.getElementById("selectMedidorEdit").value="";
    document.getElementById("txtFechaEdit").value=""; // Obtener como string directamente
   document.getElementById("txtFlujoEdit").value="";
     document.getElementById("txtPulsacionesEdit").value="";
   document.getElementById("selectEstatusEdit").value="";
}

document.getElementById("btnLimpiar").addEventListener("click", function () {
    limpiar();
});

async function cargarMedidores() {
    let ruta = "/AquaSmart/api/medidor/getAllMedidor";
    const respuesta = await fetch(ruta);
    if (respuesta.ok) {
        const medidores = await respuesta.json();
        const selectMedidor = document.getElementById('selectMedidor');
        const selectMedidorEdit = document.getElementById('selectMedidorEdit');

        medidores.forEach(medidor => {
            const option1 = document.createElement('option');
            option1.value = medidor.idMedidor;
            option1.textContent = medidor.nombre;
            selectMedidor.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = medidor.idMedidor;
            option2.textContent = medidor.nombre;
            selectMedidorEdit.appendChild(option2);
        });

        return true;
    } else {
        alert('Error al cargar los estados.');
        return false;
    }
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