document.getElementById("estadoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/estado/insertEstado";
    let v_nombre = document.getElementById("txtNombre").value;

    let estados = { nombre: v_nombre };

    try {
        let params = new URLSearchParams();
        params.append("datosEstado", JSON.stringify(estados));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

        // Recargar estados después de insertar
        cargarEstados();

        // Limpiar el formulario
        document.getElementById("txtNombre").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});


async function cargarEstados() {
    let ruta = "/AquaSmart/api/estado/getAllEstado";

    try {
        const response = await fetch(ruta);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        let cuerpo = "";

    data.forEach(fila => {
            cuerpo += `
                <div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center estado-item" data-nombre="${fila.nombre}" id="${fila.nombre}">
                    <div class="flip-card">
                        <div class="flip-card-inner">
                            <div class="flip-card-front">
                                <i class="bi bi-flag"></i> <h4>${fila.nombre}</h4>
                            </div>
                            <div class="flip-card-back">
                                <p><i class="bi bi-tag"></i> <strong>ID Estado:</strong> ${fila.idEstado}</p>
                                <p><i class="bi bi-card-text"></i> <strong>Nombre:</strong> ${fila.nombre}</p>
                                <button class="btn btn-primary btn-estado" data-id="${fila.idEstado}" data-nombre="${fila.nombre}">
                                    <i class="bi bi-eye"></i> Ver Más
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
        document.getElementById("tablaRegistros").innerHTML = cuerpo;

        // Agregar eventos a los botones "Ver Más"
        document.querySelectorAll(".btn-estado").forEach(button => {
            button.addEventListener("click", function () {
                let txtIdEstado = document.getElementById("txtIdEstado");
                let txtNombreEstado = document.getElementById("txtNombreEstado");
                let modal = document.getElementById("estadoModal");

                if (txtIdEstado && txtNombreEstado && modal) {
                    txtIdEstado.value = this.dataset.id;
                    txtNombreEstado.value = this.dataset.nombre;

                    let myModal = new bootstrap.Modal(modal);
                    myModal.show();
                } else {
                    console.error("Los elementos del modal no existen en el DOM");
                }
            });
        });

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
}

 async function update() {
    let ruta = "/AquaSmart/api/estado/updateEstado";
    let v_id = document.getElementById("txtIdEstado").value;
    let v_nombre = document.getElementById("txtNombreEstado").value;

    let estados = { nombre: v_nombre , idEstado:v_id};

    try {
        let params = new URLSearchParams();
        params.append("datosEstado", JSON.stringify(estados));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        };

        const response = await fetch(ruta, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        Swal.fire({
            title: "Registrado!",
            text: `Has actualizado exitosamente: ${v_nombre}`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarEstados();

        // Limpiar el formulario
        document.getElementById("txtIdEstado").value="";
        document.getElementById("txtNombreEstado").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
}

document.getElementById("btnActualizar").addEventListener("click", function() {
    update();
});

 async function deleteEstado() {
    let ruta = "/AquaSmart/api/estado/deleteEstado";
    let v_id = parseInt(document.getElementById("txtIdEstado").value); // Obtén el ID del estado

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
        // Crea los parámetros para la solicitud
        let params = new URLSearchParams();
        params.append("idEstado", v_id); // Envía solo el ID, no un objeto JSON

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        };

        // Envía la solicitud al servidor
        const response = await fetch(ruta, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        Swal.fire({
            title: "Eliminado!",
            text: `Has eliminado exitosamente el estado con ID: ${v_id}`,
            icon: "success"
        });

        // Recargar estados después de eliminar
        cargarEstados();

        // Limpiar el formulario
        document.getElementById("txtIdEstado").value = "";
        document.getElementById("txtNombreEstado").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
}

document.getElementById("btnEliminardo").addEventListener("click", function() {
 deleteEstado();
});

$(document).ready(function () {
    $('#searchTags').on('taginput-change', function () {
        let tags = $('#searchTags').taginput('values');

        // Si no hay etiquetas, mostrar todos los estados
        if (tags.length === 0) {
            $('.estado-item').show();
            return;
        }

        $('.estado-item').each(function () {
            let estadoNombre = $(this).data('nombre').toLowerCase();
            let match = tags.some(tag => estadoNombre.includes(tag.toLowerCase()));
            $(this).toggle(match);
        });
    });

    cargarEstados();
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

async function limpiar(){
document.getElementById("txtNombreEstado").value = "";
}

document.getElementById("btnLimpiar").addEventListener("click", function() {
 limpiar();
});

cargarEstados();




