
/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarPersonas();
    actualizarOpcionesCiudades();
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

document.getElementById("personaForm").addEventListener("submit", async function (e) {
    e.preventDefault();
document.getElementById('txtNombre').focus();
    let ruta = "/AquaSmart/api/persona/insertPersona";

    let v_nombreP = document.getElementById("txtNombre").value;
    let v_apellidoM = document.getElementById("txtApellidoM").value;
    let v_apellidoP = document.getElementById("txtApellidoP").value;
    let v_telefono = document.getElementById("txtTelefono").value;
    let v_edad = document.getElementById("txtEdad").value;
    let v_email = document.getElementById("txtEmail").value;
    let v_ciudad = document.getElementById("selectCiudad").value;
    let v_nombreU = document.getElementById("txtNombreU").value;
    let v_contrasenia = document.getElementById("txtContrasenia").value;
    let v_rol = document.getElementById("selectRol").value;

    let ciudad = {
        idCiudad: v_ciudad
    };

    let usuario = {
        nombre: v_nombreU,
        contrasenia: v_contrasenia,
        foto: fotoBase64Nuevo,
        rol: v_rol
    };

    let persona = {
        nombre: v_nombreP,
        apellidoM: v_apellidoM,
        apellidoP: v_apellidoP,
        telefono: v_telefono,
        edad: v_edad,
        email: v_email
    };

    persona.ciudad = ciudad;
    persona.usuario = usuario;

    try {
        let params = new URLSearchParams();
        params.append("datosPersona", JSON.stringify(persona));

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

        cargarPersonas();
        actualizarOpcionesCiudades();

        // Limpiar el formulario
        document.getElementById("txtNombre").value = "";
        document.getElementById("txtApellidoM").value = "";
        document.getElementById("txtApellidoP").value = "";
        document.getElementById("txtTelefono").value = "";
        document.getElementById("txtEdad").value = "";
        document.getElementById("txtEmail").value = "";
        document.getElementById("selectCiudad").value = "";
        document.getElementById("txtNombreU").value = "";
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

async function cargarPersonas() {
    let ruta = "/AquaSmart/api/persona/getAllPersona";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(persona => {
            let imagen = persona.usuario.foto && persona.usuario.foto.trim() !== "" ? persona.usuario.foto : '../img/nada.jpg';
            let nombreRol;
            if (persona.usuario.rol === 1) {
                nombreRol = "Cliente";
            } else if (persona.usuario.rol === 2) {
                nombreRol = "Empleado";
            } else if (persona.usuario.rol === 3) {
                nombreRol = "Administrador";
            } else {
                nombreRol = "Desconocido";
            }

            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center usuario-item" 
     data-nombre="${persona.nombre}" id="${persona.idPersona}">
    <div class="flip-card ${persona.usuario.estatus === 1 ? '' : 'inactive'}" data-aos="fade-up">
        <div class="flip-card-inner">
            <!-- Parte frontal de la tarjeta -->
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <img src="${imagen}" class="rounded-circle mb-2" width="180" height="180" alt="Foto de ${persona.nombre}">
                <h4 class="mt-2">${persona.nombre} ${persona.apellidoP} ${persona.apellidoM}</h4>
                <p class="text-muted front-modelo">${persona.edad} años</p>
            </div>

            <!-- Parte trasera de la tarjeta -->
            <div class="flip-card-back text-center">
                <div class="card-header">
                    <p><i class="bi bi-tag"></i> <strong>ID Persona:</strong> ${persona.idPersona}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <!-- Información de la Persona -->          
                    <li class="list-group-item"><p><i class="bi bi-person"></i> <strong>Nombre:</strong> ${persona.nombre} ${persona.apellidoP} ${persona.apellidoM}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-calendar"></i> <strong>Edad:</strong> ${persona.edad} años</p></li>
                    <li class="list-group-item"><p><i class="bi bi-envelope"></i> <strong>Email:</strong> ${persona.email}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-phone"></i> <strong>Teléfono:</strong> ${persona.telefono}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-geo-alt"></i> <strong>Ciudad:</strong> ${persona.ciudad.nombre}</p></li>

                    <!-- Información del Usuario -->
                    <li class="list-group-item"><p><i class="bi bi-person-badge"></i> <strong>Rol:</strong> ${nombreRol}</p></li>
                    <li class="list-group-item status-item ${persona.usuario.estatus === 1 ? 'active' : 'inactive'}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${persona.usuario.estatus === 1 ? "Activo" : "Inactivo"}</p></li>
                </ul>
                <div class="card-footer">
                    <!-- Botón para ver más detalles -->
                    <button class="btn btn-primary btn-usuario" 
                        data-idpersona="${persona.idPersona}"
                        data-nombre="${persona.nombre}"
                        data-nombreU="${persona.usuario.nombre}"
                        data-apellidop="${persona.apellidoP}"
                        data-apellidom="${persona.apellidoM}"
                        data-edad="${persona.edad}"
                        data-email="${persona.email}"
                        data-telefono="${persona.telefono}"
                        data-ciudad="${persona.ciudad.idCiudad}"
                        data-idusuario="${persona.usuario.idUsuario}"
                        data-foto="${imagen}"
                        data-estatus="${persona.usuario.estatus}"
                        data-rol="${persona.usuario.rol}"
                        data-contra="${persona.usuario.contrasenia}">
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
            button.addEventListener("click", () => {
                const idPersona = button.getAttribute("data-idpersona");
                const nombre = button.getAttribute("data-nombre");
                const nombreU = button.getAttribute("data-nombreU");
                const apellidoP = button.getAttribute("data-apellidop");
                const apellidoM = button.getAttribute("data-apellidom");
                const edad = button.getAttribute("data-edad");
                const email = button.getAttribute("data-email");
                const telefono = button.getAttribute("data-telefono");
                const ciudad = button.getAttribute("data-ciudad");
                const idUsuario = button.getAttribute("data-idusuario");
                const foto = button.getAttribute("data-foto");
                const estatus = button.getAttribute("data-estatus");
                const rol = button.getAttribute("data-rol");
                const contra = button.getAttribute("data-contra");

                // Llenar el modal con los datos
                document.getElementById("txtIdPersonaEdit").value = idPersona;
                document.getElementById("txtNombreEdit").value = nombre;
                document.getElementById("txtNombreUEdit").value = nombreU;
                document.getElementById("txtApellidoPEdit").value = apellidoP;
                document.getElementById("txtApellidoMEdit").value = apellidoM;
                document.getElementById("txtEdadEdit").value = edad;
                document.getElementById("txtEmailEdit").value = email;
                document.getElementById("txtTelefonoEdit").value = telefono;
                document.getElementById("selectCiudadEdit").value = ciudad;
                fotoBase64Edit = foto;
                document.getElementById("encodedImageEdit").src = fotoBase64Edit;
                document.getElementById("selectEstatusEdit").value = estatus;
                document.getElementById("selectRolEdit").value = rol;
                document.getElementById("txtContraseniaEdit").value = contra;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById("personaModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

async function update() {
    let ruta = "/AquaSmart/api/persona/updatePersona";
    let v_id = document.getElementById("txtIdPersonaEdit").value;
    let v_nombreP = document.getElementById("txtNombreEdit").value;
    let v_apellidoM = document.getElementById("txtApellidoMEdit").value;
    let v_apellidoP = document.getElementById("txtApellidoPEdit").value;
    let v_telefono = document.getElementById("txtTelefonoEdit").value;
    let v_edad = document.getElementById("txtEdadEdit").value;
    let v_email = document.getElementById("txtEmailEdit").value;
    let v_ciudad = document.getElementById("selectCiudadEdit").value;
    let v_nombreU = document.getElementById("txtNombreUEdit").value;
    let v_contrasenia = document.getElementById("txtContraseniaEdit").value;
    let v_rol = document.getElementById("selectRolEdit").value;

    let ciudad = {
        idCiudad: v_ciudad
    };

    let usuario = {
        nombre: v_nombreU,
        contrasenia: v_contrasenia,
        foto: fotoBase64Edit,
        rol: v_rol
    };

    let persona = {
        idPersona: v_id,
        nombre: v_nombreP,
        apellidoM: v_apellidoM,
        apellidoP: v_apellidoP,
        telefono: v_telefono,
        edad: v_edad,
        email: v_email
    };

    persona.ciudad = ciudad;
    persona.usuario = usuario;

    try {
        let params = new URLSearchParams();
        params.append("datosPersona", JSON.stringify(persona));

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
            text: `Has actualizado exitosamente: ${v_nombreP}`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarPersonas();
        actualizarOpcionesCiudades();

        // Limpiar el formulario
        document.getElementById("txtIdPersonaEdit").value = "";
        document.getElementById("txtNombreEdit").value = "";
        document.getElementById("txtApellidoMEdit").value = "";
        document.getElementById("txtApellidoPEdit").value = "";
        document.getElementById("txtTelefonoEdit").value = "";
        document.getElementById("txtEdadEdit").value = "";
        document.getElementById("txtEmailEdit").value = "";
        document.getElementById("selectCiudadEdit").value = "";
        document.getElementById("txtNombreUEdit").value = "";
        document.getElementById("txtContraseniaEdit").value = "";
        document.getElementById("selectRolEdit").value = "";
        document.getElementById("encodedImageEdit").src = "../img/nada.jpg";
        document.getElementById("txtFotoEdit").value = "";

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
    let ruta = "/AquaSmart/api/persona/deletePersona";
    let v_id = document.getElementById("txtIdPersonaEdit").value;
    // Verifica que el ID sea un número válido
    if (isNaN(v_id)) {
        Swal.fire({
            title: "Error",
            text: "El ID de la persona no es válido.",
            icon: "error"
        });
        return;
    }

    try {

        let params = new URLSearchParams();
        params.append("idPersona", v_id);

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
            text: `Has eliminado exitosamente la persona con ID: ${v_id}`,
            icon: "success"
        });

        cargarPersonas();

        // Limpiar el formulario
        document.getElementById("txtIdPersonaEdit").value = "";
        document.getElementById("txtNombreEdit").value = "";
        document.getElementById("txtApellidoMEdit").value = "";
        document.getElementById("txtApellidoPEdit").value = "";
        document.getElementById("txtTelefonoEdit").value = "";
        document.getElementById("txtEdadEdit").value = "";
        document.getElementById("txtEmailEdit").value = "";
        document.getElementById("selectCiudadEdit").value = "";
        document.getElementById("txtNombreUEdit").value = "";
        document.getElementById("txtContraseniaEdit").value = "";
        document.getElementById("selectRolEdit").value = "";
        document.getElementById("encodedImageEdit").src = "../img/nada.jpg";
        document.getElementById("txtFotoEdit").value = "";

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

async function actualizarOpcionesCiudades() {
    let ruta = "/AquaSmart/api/ciudad/getAllCiudad";
    const respuesta = await fetch(ruta);
    const ciudades = await respuesta.json();
    const selectCiudad = document.getElementById('selectCiudad');
    const selectCiudadU = document.getElementById('selectCiudadEdit');
    ciudades.forEach(ciudad => {
        const option = document.createElement('option');
        const optionU = document.createElement('option');
        option.value = ciudad.idCiudad;
        option.textContent = ciudad.nombre;
         optionU.value = ciudad.idCiudad;
        optionU.textContent = ciudad.nombre;
        selectCiudad.appendChild(option);
        selectCiudadU.appendChild(optionU);
    });
}
