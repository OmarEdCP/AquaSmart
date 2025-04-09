
/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarClientes();
    actualizarOpcionesCiudades();
    validarForm();
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

document.getElementById("clienteForm").addEventListener("submit", async function (e) {
    e.preventDefault();

if(!validarForm()){
    return;
}
    let ruta = "/AquaSmart/api/cliente/insertCliente";
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

    let cliente = {};

    persona.ciudad = ciudad;
    persona.usuario = usuario;
    cliente.persona = persona;
    try {
        let params = new URLSearchParams();
        params.append("datosCliente", JSON.stringify(cliente));

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
            text: `Has registrado exitosamente: ${json.persona.nombre}`,
            icon: "success"
        });

        // Recargar después de insertar

        cargarClientes();
        actualizarOpcionesCiudades();

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

async function cargarClientes() {
    let ruta = "/AquaSmart/api/cliente/getAllCliente";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(cliente => {
            let imagen = cliente.persona.usuario.foto && cliente.persona.usuario.foto.trim() !== "" ? cliente.persona.usuario.foto : '../img/nada.jpg';
            let nombreRol;
            if (cliente.persona.usuario.rol === 1) {
                nombreRol = "Cliente";
            } else if (cliente.persona.usuario.rol === 2) {
                nombreRol = "Empleado";
            } else if (cliente.persona.usuario.rol === 3) {
                nombreRol = "Administrador";
            } else {
                nombreRol = "Desconocido";
            }

          cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center usuario-item" 
     data-nombre="${cliente.persona.nombre}" id="${cliente.idCliente}">
    <div class="flip-card ${cliente.persona.usuario.estatus === 1 ? '' : 'inactive'}" data-aos="fade-up">
        <div class="flip-card-inner">
            <!-- Parte frontal de la tarjeta -->
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <img src="${imagen}" class="rounded-circle mb-2" width="180" height="180" alt="Foto de ${cliente.persona.nombre}">
                <h4 class="mt-2">${cliente.persona.nombre} ${cliente.persona.apellidoP} ${cliente.persona.apellidoM}</h4>
                <p class="text front-modelo">${cliente.persona.edad} años</p>
            </div>

            <!-- Parte trasera de la tarjeta -->
            <div class="flip-card-back text-center">
                <div class="card-header">
                    <p><i class="bi bi-tag"></i> <strong>ID Cliente:</strong> ${cliente.idCliente}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><p><i class="bi bi-person"></i> <strong>Nombre:</strong> ${cliente.persona.nombre} ${cliente.persona.apellidoP} ${cliente.persona.apellidoM}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-calendar"></i> <strong>Edad:</strong> ${cliente.persona.edad} años</p></li>
                    <li class="list-group-item"><p><i class="bi bi-envelope"></i> <strong>Email:</strong> ${cliente.persona.email}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-phone"></i> <strong>Teléfono:</strong> ${cliente.persona.telefono}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-geo-alt"></i> <strong>Ciudad:</strong> ${cliente.persona.ciudad.nombre}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-person-badge"></i> <strong>Rol:</strong> ${nombreRol}</p></li>
                    <li class="list-group-item status-item ${cliente.persona.usuario.estatus === 1 ? 'active' : 'inactive'}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${cliente.persona.usuario.estatus === 1 ? "Activo" : "Inactivo"}</p></li>
                </ul>
                <div class="card-footer">
                    <button class="btn btn-primary btn-usuario" 
                        data-cliente="${cliente.idCliente}"
                        data-idpersona="${cliente.persona.idPersona}"
                        data-nombre="${cliente.persona.nombre}"
                        data-nombreU="${cliente.persona.usuario.nombre}"
                        data-apellidop="${cliente.persona.apellidoP}"
                        data-apellidom="${cliente.persona.apellidoM}"
                        data-edad="${cliente.persona.edad}"
                        data-email="${cliente.persona.email}"
                        data-telefono="${cliente.persona.telefono}"
                        data-ciudad="${cliente.persona.ciudad.idCiudad}"
                        data-idusuario="${cliente.persona.usuario.idUsuario}"
                        data-foto="${imagen}"
                        data-estatus="${cliente.persona.usuario.estatus}"
                        data-rol="${cliente.persona.usuario.rol}"
                        data-contra="${cliente.persona.usuario.contrasenia}">
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
                const idCliente = button.getAttribute("data-cliente");
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
                document.getElementById("txtIdClienteEdit").value = idCliente;
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
                document.getElementById("selectRolEdit").value = 1;
                document.getElementById("txtContraseniaEdit").value = contra;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById("clienteModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

async function update() {
    let ruta = "/AquaSmart/api/cliente/updateCliente";
    let v_id = document.getElementById("txtIdClienteEdit").value;
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
    let v_estatus = document.getElementById("selectEstatusEdit").value;

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
        nombre: v_nombreP,
        apellidoM: v_apellidoM,
        apellidoP: v_apellidoP,
        telefono: v_telefono,
        edad: v_edad,
        email: v_email,
        estatus:v_estatus
    };

    let cliente = {
        idCliente: v_id
        };

    persona.ciudad = ciudad;
    persona.usuario = usuario;
    cliente.persona = persona;

    try {
let params = new URLSearchParams();
        params.append("datosCliente", JSON.stringify(cliente));

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
        cargarClientes();

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

document.getElementById("btnActualizar").addEventListener("click", function () {
    update();
});

async function deleteUsuario() {
    let ruta = "/AquaSmart/api/cliente/deleteCliente";
    let v_id = document.getElementById("txtIdClienteEdit").value;
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
        params.append("idCliente", v_id);

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

        cargarClientes();

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
        document.getElementById("txtIdClienteEdit").value = "";
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

async function validarForm(){
    let camposTexto = ["txtNombre", "txtApellidoP", "txtApellidoM", "txtNombreEdit", "txtApellidoPEdit", "txtApellidoMEdit"];
        let regexTexto = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
        let regexUsuario = /^[A-Za-z0-9]+$/; // Permite letras y números
        let regexTelefono = /^\d{10}$/; // Exactamente 10 dígitos
        let regexContrasenia = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // 8 caracteres, 1 mayúscula, 1 número, 1 especial

        // Función para evitar la escritura de números y convertir a mayúsculas
        function validarTexto(event) {
            let input = event.target;
            input.value = input.value.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ\s]/g, "");
        }

        // Agregar evento a los campos de texto en Registro y Edición
        camposTexto.forEach(id => {
            document.getElementById(id).addEventListener("input", validarTexto);
        });

        // Restricción para teléfono (máximo 10 dígitos) en Registro y Edición
        ["txtTelefono", "txtTelefonoEdit"].forEach(id => {
            document.getElementById(id).addEventListener("input", function () {
                this.value = this.value.replace(/\D/g, "").slice(0, 10);
            });
        });

        // Restricción para edad (entre 18 y 120) en Registro y Edición
        ["txtEdad", "txtEdadEdit"].forEach(id => {
            document.getElementById(id).addEventListener("input", function () {
                let edad = parseInt(this.value, 10);
                if (isNaN(edad) || edad < 18) this.value = "18";
                if (edad > 120) this.value = "120";
            });
        });

        // Función para mostrar mensajes con SweetAlert2
        function mostrarAlerta(titulo, mensaje, icono) {
            Swal.fire({
                title: titulo,
                text: mensaje,
                icon: icono,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            });
        }

        // Validación final del formulario de Registro y Edición
        function validarFormulario(event, esEdicion) {
            event.preventDefault();

            let prefix = esEdicion ? "Edit" : ""; // Para diferenciar entre Registro y Edición
            let nombre = document.getElementById("txtNombre" + prefix).value.trim();
            let apellidoP = document.getElementById("txtApellidoP" + prefix).value.trim();
            let apellidoM = document.getElementById("txtApellidoM" + prefix).value.trim();
            let edad = document.getElementById("txtEdad" + prefix).value;
            let telefono = document.getElementById("txtTelefono" + prefix).value.trim();
            let usuario = document.getElementById("txtNombreU" + prefix).value.trim();
            let contrasenia = document.getElementById("txtContrasenia" + prefix).value.trim();

            if (!regexTexto.test(nombre) || !regexTexto.test(apellidoP) || !regexTexto.test(apellidoM)) {
                mostrarAlerta("Error", "El nombre y los apellidos solo pueden contener letras y espacios.", "error");
                return;
            }

            if (!regexTelefono.test(telefono)) {
                mostrarAlerta("Error", "El teléfono debe contener exactamente 10 dígitos numéricos.", "error");
                return;
            }

            if (!regexUsuario.test(usuario)) {
                mostrarAlerta("Error", "El usuario solo puede contener letras y números.", "error");
                return;
            }

            if (!regexContrasenia.test(contrasenia)) {
                mostrarAlerta("Error", "La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una mayúscula, un número y un carácter especial.", "error");
                return;
            }

            // Si todo es válido, confirmamos el envío con SweetAlert2
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¿Deseas enviar el formulario?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, enviar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("¡Enviado!", "El formulario se ha enviado correctamente.", "success");
                    event.target.submit(); // Enviar formulario
                }
            });
        }

        // Agregar validación a ambos formularios
        document.getElementById("clienteForm").addEventListener("submit", function (event) {
            validarFormulario(event, false);
        });

        document.getElementById("clienteModal").addEventListener("submit", function (event) {
            validarFormulario(event, true);
        });
}
async function clean(){
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
}

document.getElementById("btnClean").addEventListener("click", function () {
    clean();
});

 cargarClientes();