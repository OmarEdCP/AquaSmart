/* global Swal, bootstrap */

// Inicializar
document.addEventListener("DOMContentLoaded", function () {
    cargarServicios();
    cargarSelects();
});

// Función para cargar servicios
async function cargarServicios() {
    try {
        const response = await fetch('/AquaSmart/api/servicio/getAllServicio');
        const data = await response.json();

        let cuerpo = '';
        data.forEach(servicio => {
            const estatusTexto = servicio.estatus === 1 ? "Activo" : "Inactivo";
            const estatusClase = servicio.estatus === 1 ? '' : 'inactive';

            // Asignación segura de iconos con verificación de null/undefined
            let icono = 'bi-tools'; // Icono por defecto
            if (servicio.categoria && servicio.categoria.nombre) {
                const nombreCategoria = servicio.categoria.nombre.toLowerCase();
                if (nombreCategoria.includes('agua')) {
                    icono = 'bi-droplet';
                } else if (nombreCategoria.includes('luz') || nombreCategoria.includes('eléctric')) {
                    icono = 'bi-lightbulb';
                }
            }

            cuerpo += `
            <div class="col">
                <div class="flip-card ${estatusClase}" data-aos="fade-up">
                    <div class="flip-card-inner">
                        <div class="flip-card-front text-center d-flex flex-column align-items-center">
                            <i class="bi ${icono} service-icon"></i>
                            <h4>${servicio.categoria?.nombre || 'Sin categoría'}</h4>
                            <p class="text-muted">${servicio.propiedad?.calle || 'Sin dirección'} #${servicio.propiedad?.numExt || ''}</p>
                            <span class="badge ${servicio.estatus === 1 ? 'bg-success' : 'bg-secondary'}">${estatusTexto}</span>
                        </div>
                        <div class="flip-card-back text-center">
                            <div class="card-header">
                                <p><i class="bi bi-tag"></i> <strong>ID Servicio:</strong> ${servicio.idServicio}</p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item"><p><i class="bi bi-house"></i> <strong>Propiedad:</strong> ${servicio.propiedad?.calle || 'Sin dirección'} #${servicio.propiedad?.numExt || ''}, ${servicio.propiedad?.colonia || ''}</p></li>
                                <li class="list-group-item"><p><i class="bi bi-person"></i> <strong>Cliente:</strong> ${servicio.cliente?.persona?.nombre || 'Sin cliente'} ${servicio.cliente?.persona?.apellidoP || ''}</p></li>
                                <li class="list-group-item"><p><i class="bi bi-geo-alt"></i> <strong>Ciudad:</strong> ${servicio.ciudad?.nombre || 'Sin ciudad'}</p></li>
                                <li class="list-group-item"><p><i class="bi bi-tags"></i> <strong>Categoría:</strong> ${servicio.categoria?.nombre || 'Sin categoría'}</p></li>
                                <li class="list-group-item status-item ${estatusClase}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${estatusTexto}</p></li>
                            </ul>
                            <div class="card-footer">
                                <button class="btn btn-primary btn-editar" 
                                    data-id="${servicio.idServicio}"
                                    data-propiedad="${servicio.propiedad?.idPropiedad || ''}"
                                    data-cliente="${servicio.cliente?.idCliente || ''}"
                                    data-ciudad="${servicio.ciudad?.idCiudad || ''}"
                                    data-categoria="${servicio.categoria?.idCategoria || ''}"
                                    data-estatus="${servicio.estatus}">
                                    <i class="bi bi-pencil-square"></i> Ver más
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
                document.getElementById("txtIdServicioEdit").value = button.getAttribute("data-id");
                document.getElementById("selectPropiedadEdit").value = button.getAttribute("data-propiedad");
                document.getElementById("selectClienteEdit").value = button.getAttribute("data-cliente");
                document.getElementById("selectCiudadEdit").value = button.getAttribute("data-ciudad");
                document.getElementById("selectCategoriaEdit").value = button.getAttribute("data-categoria");
                document.getElementById("selectEstatusEdit").value = button.getAttribute("data-estatus");

                const modal = new bootstrap.Modal(document.getElementById("edicionModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar servicios:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los servicios'
        });
    }
}

// Función para cargar selects
async function cargarSelects() {
    try {
        // Cargar propiedades
        const resPropiedades = await fetch('/AquaSmart/api/propiedad/getAllPropiedad');
        const propiedades = await resPropiedades.json();
        const selectPropiedad = document.getElementById("selectPropiedad");
        const selectPropiedadEdit = document.getElementById("selectPropiedadEdit");

        propiedades.forEach(prop => {
            const option = document.createElement("option");
            option.value = prop.idPropiedad;
            option.textContent = `${prop.calle} #${prop.numExt}, ${prop.colonia}`;
            selectPropiedad.appendChild(option.cloneNode(true));
            selectPropiedadEdit.appendChild(option);
        });

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

        // Cargar ciudades
        const resCiudades = await fetch('/AquaSmart/api/ciudad/getAllCiudad');
        const ciudades = await resCiudades.json();
        const selectCiudad = document.getElementById("selectCiudad");
        const selectCiudadEdit = document.getElementById("selectCiudadEdit");

        ciudades.forEach(ciudad => {
            const option = document.createElement("option");
            option.value = ciudad.idCiudad;
            option.textContent = ciudad.nombre;
            selectCiudad.appendChild(option.cloneNode(true));
            selectCiudadEdit.appendChild(option);
        });

        // Cargar categorías
        const resCategorias = await fetch('/AquaSmart/api/categoria/getAllCategoria');
        const categorias = await resCategorias.json();
        const selectCategoria = document.getElementById("selectCategoria");
        const selectCategoriaEdit = document.getElementById("selectCategoriaEdit");

        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.idCategoria;
            option.textContent = cat.nombre;
            selectCategoria.appendChild(option.cloneNode(true));
            selectCategoriaEdit.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar selects:", error);
    }
}

// Evento para el formulario de registro
document.getElementById("servicioForm").addEventListener("submit", async function (e) {
    e.preventDefault();


    let ruta = "/AquaSmart/api/servicio/insertServicio";
    let v_propiedad = document.getElementById("selectPropiedad").value;
    let v_ciudad = document.getElementById("selectCiudad").value;
    let v_cliente = document.getElementById("selectCliente").value;
    let v_categoria = document.getElementById("selectCategoria").value;

    let ciudad = {
        idCiudad: v_ciudad
    };

    let categoria = {
        idCategoria: v_categoria
    };

    let cliente = {
        idCliente: v_cliente
    };

    let propiedad = {
        idPropiedad: v_propiedad
    };

    let servicio = {
        estatus: 1
    };

    servicio.ciudad = ciudad;
    servicio.categoria = categoria;
    servicio.cliente = cliente;
    servicio.propiedad = propiedad;

    try {
        let params = new URLSearchParams();
        params.append("datosServicio", JSON.stringify(servicio));

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

        cargarServicios();

        // Limpiar el formulario
        document.getElementById("selectPropiedad").value = "";
        document.getElementById("selectCiudad").value = "";
        document.getElementById("selectCliente").value = "";
        document.getElementById("selectCategoria").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

// Evento para actualizar servicio
document.getElementById("btnActualizar").addEventListener("click", async function () {
    let ruta = "/AquaSmart/api/servicio/updateServicio";
    let v_id = parseInt(document.getElementById("txtIdServicioEdit").value);
    let v_propiedad = parseInt(document.getElementById("selectPropiedadEdit").value);
    let v_estatus = parseInt(document.getElementById("selectEstatusEdit").value);
    let v_ciudad = parseInt(document.getElementById("selectCiudadEdit").value);
    let v_cliente = parseInt(document.getElementById("selectClienteEdit").value);
    let v_categoria = parseInt(document.getElementById("selectCategoriaEdit").value);

    let ciudad = {
        idCiudad: v_ciudad
    };

    let categoria = {
        idCategoria: v_categoria
    };

    let cliente = {
        idCliente: v_cliente
    };

    let propiedad = {
        idPropiedad: v_propiedad
    };

    let servicio = {
        idServicio: v_id,
        estatus: v_estatus
    };

    servicio.ciudad = ciudad;
    servicio.categoria = categoria;
    servicio.cliente = cliente;
    servicio.propiedad = propiedad;

    try {
        let params = new URLSearchParams();
        params.append("datosServicio", JSON.stringify(servicio));

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
            text: `Has actualizado exitosamente: ${v_id}`,
            icon: "success"
        });

        // Recargar estados después de insertar

        cargarServicios();
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

// Evento para eliminar servicio
document.getElementById("btnEliminar").addEventListener("click", async function () {
    const idServicio = document.getElementById("txtIdServicioEdit").value;

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
            let ruta = "/AquaSmart/api/servicio/deleteServicio";
    let v_id = document.getElementById("txtIdServicioEdit").value;
    // Verifica que el ID sea un número válido
    if (isNaN(v_id)) {
        Swal.fire({
            title: "Error",
            text: "El ID del servicio no es válido.",
            icon: "error"
        });
        return;
    }

    try {

        let params = new URLSearchParams();
        params.append("idServicio", v_id);

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
            text: `Has eliminado exitosamente el servicio con ID: ${v_id}`,
            icon: "success"
        });

                cargarServicios();

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
    document.getElementById("txtIdServicioEdit").value = "";
    document.getElementById("selectPropiedadEdit").value = "";
    document.getElementById("selectEstatusEdit").value = "";
    document.getElementById("selectCiudadEdit").value = "";
    document.getElementById("selectClienteEdit").value = "";
    document.getElementById("selectCategoriaEdit").value = "";
}