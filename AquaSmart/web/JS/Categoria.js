/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarCategorias();
});

// Función para cargar y mostrar las categorías
async function cargarCategorias() {
    try {
        // Simulación de datos - reemplazar con llamada API real
        const response = await fetch('/AquaSmart/api/categoria/getAllCategoria');
        const data = await response.json();

        let cuerpo = '';
        data.forEach(categoria => {
            const estatusTexto = categoria.estatus === 1 ? "Activo" : "Inactivo";
            const estatusClase = categoria.estatus === 1 ? 'active' : 'inactive';
            const iconClass = categoria.estatus === 1 ? 'text-primary' : 'text-secondary';

            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center categoria-item" 
     data-nombre="${categoria.nombre}" id="categoria-${categoria.idCategoria}">
    <div class="flip-card ${estatusClase}" data-aos="fade-up">
        <div class="flip-card-inner">
            <!-- Parte frontal de la tarjeta -->
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <div class="icon-container bg-light rounded-circle mb-3">
                    <i class="bi bi-tags ${iconClass}" style="font-size: 3rem;"></i>
                </div>
                <h4 class="mt-2">${categoria.nombre}</h4>
                <p class="text-muted">${estatusTexto}</p>
            <span class="badge bg-info">Precio: $${categoria.precio}</span>
            </div>

            <!-- Parte trasera de la tarjeta -->
            <div class="flip-card-back text-center">
                <div class="card-header">
                    <p><i class="bi bi-tag"></i> <strong>ID Categoría:</strong> ${categoria.idCategoria}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><p><i class="bi bi-card-text"></i> <strong>Nombre:</strong> ${categoria.nombre}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-text-paragraph"></i> <strong>Descripción:</strong> ${categoria.descripcion || 'No especificada'}</p></li>
                   <li class="list-group-item">
                                    <p><i class="bi bi-cash"></i> <strong>Total:</strong> $${categoria.precio}</p>
                                </li>
                    <li class="list-group-item status-item ${estatusClase}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${estatusTexto}</p></li>
                </ul>
                <div class="card-footer">
                    <button class="btn btn-primary btn-categoria" 
                        data-id="${categoria.idCategoria}"
                        data-nombre="${categoria.nombre}"
                        data-descripcion="${categoria.descripcion || ''}"
                        data-estatus="${categoria.estatus}">
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
        document.querySelectorAll(".btn-categoria").forEach(button => {
            button.addEventListener("click", () => {
                document.getElementById("txtIdCategoriaEdit").value = button.getAttribute("data-id");
                document.getElementById("txtNombreEdit").value = button.getAttribute("data-nombre");
                document.getElementById("txtDescripcionEdit").value = button.getAttribute("data-descripcion");
                document.getElementById("selectEstatusEdit").value = button.getAttribute("data-estatus");

                const modal = new bootstrap.Modal(document.getElementById("edicionModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las categorías'
        });
    }
}

// Función de búsqueda
function search() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const cards = document.querySelectorAll(".card-categoria");

    cards.forEach(card => {
        const title = card.querySelector(".card-title").textContent.toUpperCase();
        const desc = card.querySelector(".card-text").textContent.toUpperCase();

        if (title.includes(filter) || desc.includes(filter)) {
            card.parentElement.style.display = "";
        } else {
            card.parentElement.style.display = "none";
        }
    });
}

// Evento para el formulario de registro
document.getElementById("categoriaForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/categoria/insertCategoria";
    let categoria = {
        nombre: document.getElementById("txtNombre").value,
        descripcion: document.getElementById("txtDescripcion").value,
        precio: parseFloat(document.getElementById("txtPrecio").value)
    };

    try {
        let params = new URLSearchParams();
        params.append("datosCategoria", JSON.stringify(categoria));

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

        cargarCategorias();

        // Limpiar el formulario
        clean();

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

// Evento para el botón de actualizar
document.getElementById("btnActualizar").addEventListener("click", async function () {
    let ruta = "/AquaSmart/api/categoria/updateCategoria";
    const categoriaData = {
        idCategoria: parseInt(document.getElementById("txtIdCategoriaEdit").value),
        nombre: document.getElementById("txtNombreEdit").value,
        descripcion: document.getElementById("txtDescripcionEdit").value,
        estatus: parseInt(document.getElementById("selectEstatusEdit").value),
        precio: parseFloat(document.getElementById("txtPrecioEdit").value)
    };

    try {
        let params = new URLSearchParams();
        params.append("datosCategoria", JSON.stringify(categoriaData));

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
            text: `Has actualizado exitosamente`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarCategorias();

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

// Evento para el botón de eliminar
document.getElementById("btnEliminar").addEventListener("click", async function () {
    const idCategoria = document.getElementById("txtIdCategoriaEdit").value;

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let ruta = "/AquaSmart/api/categoria/deleteCategoria";

            // Verifica que el ID sea un número válido
            if (isNaN(idCategoria)) {
                Swal.fire({
                    title: "Error",
                    text: "El ID del estado no es válido.",
                    icon: "error"
                });
                return;
            }

            try {

                let params = new URLSearchParams();
                params.append("idCategoria", idCategoria);

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
                    text: `Has eliminado exitosamente la categoria con ID: ${idCategoria}`,
                    icon: "success"
                });


                cargarCategorias();

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

async function limpiar() {
    document.getElementById("txtIdCategoriaEdit").value = "";
    document.getElementById("txtNombreEdit").value = "";
    document.getElementById("txtDescripcionEdit").value = "";
    document.getElementById("selectEstatusEdit").value = "";
}

document.getElementById("btnLimpiar").addEventListener("click", function () {
    limpiar();
});


async function clean(){
    document.getElementById("txtNombre").value = "";
        document.getElementById("txtDescripcion").value = "";
        document.getElementById("txtPrecio").value = "";
}

document.getElementById("btnClean").addEventListener("click", function () {
    clean();
});
cargarCategorias();