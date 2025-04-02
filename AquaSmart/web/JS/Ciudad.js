document.getElementById("ciudadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/ciudad/insertCiudad";
    let v_nombre = document.getElementById("txtNombre").value;
    let v_estado = parseInt(document.getElementById("selectEstado").value);

    let estado = {
        idEstado: v_estado
    };
    let ciudad = {nombre: v_nombre};
    ciudad.estado = estado;

    try {
        let params = new URLSearchParams();
        params.append("datosCiudad", JSON.stringify(ciudad));

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

        // Recargar estados después de insertar
        cargarEstados();
        cargarCiudades();

        // Limpiar el formulario
        document.getElementById("txtNombre").value = "";
        document.getElementById("selectEstado").value = "";
    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});


async function cargarCiudades() {
    let ruta = "/AquaSmart/api/ciudad/getAllCiudad";

    try {
        const response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        let cuerpo = "";

        data.forEach(fila => {
            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center estado-item" 
     data-nombre="${fila.nombre}" id="${fila.nombre}">
    <div class="flip-card" data-aos="fade-up">
        <div class="flip-card-inner">
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <i class="bi bi-flag"></i> <h4>${fila.nombre}</h4>
            <div class="front-modelo">Estado ${fila.estado.nombre}</div>
            </div>
            <div class="flip-card-back">
                <p><i class="bi bi-tag"></i> <strong>ID Ciudad:</strong> ${fila.idCiudad}</p>
                <p><i class="bi bi-card-text"></i> <strong>Nombre:</strong> ${fila.nombre}</p>
                <p><i class="bi bi-tag"></i> <strong>ID Estado:</strong> ${fila.estado.idEstado}</p>
                <p><i class="bi bi-card-text"></i> <strong>Nombre Estado:</strong> ${fila.estado.nombre}</p>
                <button class="btn btn-primary btn-estado" 
                    data-id="${fila.idCiudad}" 
                    data-nombre="${fila.nombre}" 
                    data-estado="${fila.estado.idEstado}">
                    <i class="bi bi-eye"></i> Ver Más
                </button>
            </div>
        </div>
    </div>
</div>`;
        });
        document.getElementById("tablaRegistros").innerHTML = cuerpo;

        document.querySelectorAll(".btn-estado").forEach(button => {
            button.addEventListener("click", async function () {
                let txtIdCiudad = document.getElementById("txtIdCiudadEdit");
                let txtNombreCiudad = document.getElementById("txtNombreEdit");
                let selectEstado = document.getElementById("selectEstadoEdit");
                let modal = document.getElementById("ciudadModal");

                if (txtIdCiudad && txtNombreCiudad && modal && selectEstado) {
                    txtIdCiudad.value = this.dataset.id;
                    txtNombreCiudad.value = this.dataset.nombre;
                    // Esperar que los estados se carguen antes de asignar el valor
                    await cargarEstados();

                    // Asignar valor con validación
                    let estadoEncontrado = false;
                    [...selectEstado.options].forEach(option => {
                        if (option.value === this.dataset.estado) {
                            option.selected = true;
                            estadoEncontrado = true;
                        }
                    });

                    if (!estadoEncontrado) {
                        console.warn("El estado no se encontró en el select, revisa los valores.");
                    }

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
    let ruta = "/AquaSmart/api/ciudad/updateCiudad";
    let v_id = document.getElementById("txtIdCiudadEdit").value;
    let v_nombre = document.getElementById("txtNombreEdit").value;
    let v_estado = parseInt(document.getElementById("selectEstadoEdit").value);

    let estado = {idEstado: v_estado};
    let ciudad = {idCiudad: v_id, nombre: v_nombre};
    ciudad.estado = estado;

    try {
        let params = new URLSearchParams();
        params.append("datosCiudad", JSON.stringify(ciudad));

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
            text: `Has actualizado exitosamente: ${v_nombre}`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarCiudades();

        // Limpiar el formulario
        document.getElementById("txtIdCiudadEdit").value = "";
        document.getElementById("txtNombreEdit").value = "";
        document.getElementById("selectEstadoEdit").value = "";
        
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

async function deleteCiudad() {
    let ruta = "/AquaSmart/api/ciudad/deleteCiudad";
       let v_id = document.getElementById("txtIdCiudadEdit").value;
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
        params.append("idCiudad", v_id);

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
            text: `Has eliminado exitosamente el estado con ID: ${v_id}`,
            icon: "success"
        });


        cargarCiudades();

         // Limpiar el formulario
        document.getElementById("txtIdCiudadEdit").value = "";
        document.getElementById("txtNombreEdit").value = "";
        document.getElementById("selectEstadoEdit").value = "";

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
    deleteCiudad();
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

    cargarCiudades();
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

async function cargarEstados() {
    let ruta = "/AquaSmart/api/estado/getAllEstado";
    const respuesta = await fetch(ruta);
    if (respuesta.ok) {
        const estados = await respuesta.json();
        const selectEstado = document.getElementById('selectEstado');
        const selectEstadoEdit = document.getElementById('selectEstadoEdit');

        estados.forEach(estado => {
            const option1 = document.createElement('option');
            option1.value = estado.idEstado;
            option1.textContent = estado.nombre;
            selectEstado.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = estado.idEstado;
            option2.textContent = estado.nombre;
            selectEstadoEdit.appendChild(option2);
        });

        return true;
    } else {
        alert('Error al cargar los estados.');
        return false;
    }
}

async function limpiar(){
 document.getElementById("txtNombreEdit").value = "";
        document.getElementById("selectEstadoEdit").value = "";
}

document.getElementById("btnLimpiar").addEventListener("click", function() {
 limpiar();
});

cargarEstados();
cargarCiudades();




