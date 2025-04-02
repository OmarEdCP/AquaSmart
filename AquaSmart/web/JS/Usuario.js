
/* global bootstrap */

document.addEventListener("DOMContentLoaded", function () {
    cargarUsuarios();
});
let fotoBase64 = '../img/nada.jpg'; // Para nuevos usuarios
let fotoBase64Edit = '../img/nada.jpg';  // Para edición

document.getElementById('txtFoto').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            fotoBase64Nuevo = reader.result;
            document.getElementById('encodedImage').src = fotoBase64Nuevo;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('txtFotoEdit').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            fotoBase64Edit = reader.result;
            document.getElementById('encodedImageEdit').src = fotoBase64Edit;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("usuarioForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/usuario/insertUsuario";
    let v_nombre = document.getElementById("txtNombre").value;
    let v_contrasenia = document.getElementById("txtContrasenia").value;
    let v_rol = document.getElementById("selectRol").value;

    let usuario = {
        nombre: v_nombre,
        contrasenia: v_contrasenia,
        foto: fotoBase64Nuevo,
        rol: v_rol
    };

    try {
        let params = new URLSearchParams();
        params.append("datosUsuario", JSON.stringify(usuario));

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

        cargarUsuarios();

        // Limpiar el formulario
        document.getElementById("txtNombre").value = "";
        document.getElementById("txtContrasenia").value = "";
        document.getElementById("selectRol").value = "";
        document.getElementById("encodedImage").src = "../img/nada.jpg";
        document.getElementById("txtFoto").value = "";

    } catch (error) {
        console.error("Error:", error);
        Swal.fire({
            title: "Error",
            text: "Ocurrió un error al procesar la solicitud.",
            icon: "error"
        });
    }
});

async function cargarUsuarios() {
    let ruta = "/AquaSmart/api/usuario/getAllUsuario";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(usuario => {
            let imagen = usuario.foto && usuario.foto.trim() !== "" ? usuario.foto : '../img/nada.jpg';
            let nombreRol;
            if (usuario.rol === 1) {
                nombreRol = "Cliente";
            } else if (usuario.rol === 2) {
                nombreRol = "Empleado";
            } else if (usuario.rol === 3) {
                nombreRol = "Administrador";
            } else {
                nombreRol = "Desconocido";
            }

            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center usuario-item" 
     data-nombre="${usuario.nombre}" id="${usuario.idUsuario}">
    <div class="flip-card ${usuario.estatus === 1 ? '' : 'inactive'}" data-aos="fade-up">
        <div class="flip-card-inner">
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <img src="${imagen}" class="rounded-circle mb-2" width="180" height="180" alt="Foto de ${usuario.nombre}">
                <h4 class="mt-2">${usuario.nombre}</h4>
            <p class="text-muted front-modelo">${nombreRol} años</p>
            </div>
            <div class="flip-card-back text-center">
             <div class="card-header">
                    <p><i class="bi bi-tag"></i> <strong>ID Cliente:</strong> ${usuario.idUsuario}</p>
                </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><p><i class="bi bi-person-badge"></i> <strong>Rol:</strong> ${nombreRol}</p></li>
                <li class="list-group-item status-item ${usuario.estatus === 1 ? 'active' : 'inactive'}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${usuario.estatus === 1 ? "Activo" : "Inactivo"}</p></li>
                </ul>  
            <div class="card-footer">
                   <button class="btn btn-primary btn-usuario" 
                    data-id="${usuario.idUsuario}" 
                    data-nombre="${usuario.nombre}" 
                    data-foto="${imagen}" 
                    data-estatus="${usuario.estatus}" 
                    data-rol="${usuario.rol}"
                    data-contra="${usuario.contrasenia}">
                    <i class="bi bi-eye"></i> Ver Más
                </button>
            </div>
            </div>
        </div>
    </div>
</div>`;
        });

        document.getElementById("tablaRegistros").innerHTML = cuerpo;

        // Agregar evento a los botones
        document.querySelectorAll(".btn-usuario").forEach(button => {
            button.addEventListener("click", async function () {
                let txtIdUsuario = document.getElementById("txtIdUsuarioEdit");
                let contrasena = document.getElementById("txtContraseniaEdit");
                let txtNombreUsuario = document.getElementById("txtNombreEdit");
                let encodedImageEdit = document.getElementById("encodedImageEdit");
                let selectEstatus = document.getElementById("selectEstatusEdit");
                let selectRol = document.getElementById("selectRolEdit");
                let modal = document.getElementById("usuarioModal");

                if (txtIdUsuario && txtNombreUsuario && modal && selectEstatus && selectRol && contrasena) {
                    txtIdUsuario.value = this.dataset.id;
                    contrasena.value = this.dataset.contra;
                    txtNombreUsuario.value = this.dataset.nombre;
                    selectEstatus.value = this.dataset.estatus;
                    selectRol.value = this.dataset.rol;

                    // **Aquí aseguramos que fotoBase64Edit tenga la imagen actual del usuario**
                    fotoBase64Edit = this.dataset.foto || '../img/nada.jpg';
                    encodedImageEdit.src = fotoBase64Edit;

                    let myModal = new bootstrap.Modal(modal);
                    myModal.show();
                } else {
                    console.error("Los elementos del modal no existen en el DOM");
                }
            });

        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

async function update() {
    let ruta = "/AquaSmart/api/usuario/updateUsuario";
    let v_id = document.getElementById("txtIdUsuarioEdit").value;
    let v_nombre = document.getElementById("txtNombreEdit").value;
    let v_contrasenia = document.getElementById("txtContraseniaEdit").value;
    let v_estatus = parseInt(document.getElementById("selectEstatusEdit").value);
    let v_rol = document.getElementById("selectRolEdit").value;

    let usuario = {
        idUsuario: v_id,
        nombre: v_nombre,
        contrasenia: v_contrasenia,
        foto: fotoBase64Edit,
        estatus: v_estatus,
        rol: v_rol
    };

    try {
        let params = new URLSearchParams();
        params.append("datosUsuario", JSON.stringify(usuario));

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
        cargarUsuarios();

        // Limpiar el formulario
        document.getElementById("txtIdUsuarioEdit").value = "";
        document.getElementById("encodedImageEdit").src = "../img/nada.jpg";
        document.getElementById("txtFotoEdit").value = "";
        document.getElementById("txtNombreEdit").value = "";
        document.getElementById("txtContraseniaEdit").value = "";
        document.getElementById("selectEstatusEdit").value = "";
        document.getElementById("selectRolEdit").value = "";

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

async function deleteUsuario() {
    let ruta = "/AquaSmart/api/usuario/deleteUsuario";
    let v_id = document.getElementById("txtIdUsuarioEdit").value;
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
        params.append("idUsuario", v_id);

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
            text: `Has eliminado exitosamente el usuario con ID: ${v_id}`,
            icon: "success"
        });

        cargarUsuarios();

        // Limpiar el formulario
        document.getElementById("txtIdUsuarioEdit").value = "";
        document.getElementById("encodedImageEdit").src = "../img/nada.jpg";
        document.getElementById("txtFotoEdit").value = "";
        document.getElementById("txtNombreEdit").value = "";
        document.getElementById("txtContraseniaEdit").value = "";
        document.getElementById("selectEstatusEdit").value = "";
        document.getElementById("selectRolEdit").value = "";

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
    deleteUsuario();
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
    document.getElementById("txtNombreEdit").value = "";
    document.getElementById("selectEstadoEdit").value = "";
}

document.getElementById("btnLimpiar").addEventListener("click", function () {
    limpiar();
});

function base64Encoder(input) {
    if (input instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log('Imagen codificada en base64:', reader.result);
            document.getElementById('encodedImage').src = reader.result;
        };
        reader.readAsDataURL(input);
    } else if (typeof input === 'string' && input.startsWith('data:image/') && input.includes('base64,')) {
        console.log('Texto representando imagen en base64:', input);
        document.getElementById('encodedImage').src = input;
    } else {
        console.error('El texto ingresado no es una URL base64 válida.');
    }
}

function base64Encoder1(input) {
    if (input instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log('Imagen codificada en base64:', reader.result);
            document.getElementById('encodedImageEdit').src = reader.result;
        };
        reader.readAsDataURL(input);
    } else if (typeof input === 'string' && input.startsWith('data:image/') && input.includes('base64,')) {
        console.log('Texto representando imagen en base64:', input);
        document.getElementById('encodedImageEdit').src = input;
    } else {
        console.error('El texto ingresado no es una URL base64 válida.');
    }
}

document.getElementById('encodeButtonEdit').onclick = () => {
    const encFile = document.getElementById('txtFotoEdit');
    const encText = document.getElementById('txttext');
    if (encFile.files.length > 0) {
        base64Encoder1(encFile.files[0]);
    } else if (encText.value !== '') {
        base64Encoder1(encText.value);
    } else {
        console.log('No se ha seleccionado un archivo ni se ha ingresado texto.');
    }
};
