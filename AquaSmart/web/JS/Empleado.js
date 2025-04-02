
/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarEmpleados();
    actualizarOpcionesCiudades();
    actualizarOpcionesCargo();
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

document.getElementById("empleadoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/empleado/insertEmpleado";
    let v_rfc = document.getElementById("txtRfc").value;
    let v_cargo = document.getElementById("selectCargo").value;
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

    let cargo = {
        idCargo: v_cargo
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

    let empleado = {
        rfc: v_rfc
    };

    persona.ciudad = ciudad;
    persona.usuario = usuario;
    empleado.cargo = cargo;
    empleado.persona = persona;
    try {
        let params = new URLSearchParams();
        params.append("datosEmpleado", JSON.stringify(empleado));

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

        cargarEmpleados();

        // Limpiar el formulario
        document.getElementById("txtRfc").value = "";
        document.getElementById("selectCargo").value = "";
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

async function cargarEmpleados() {
    let ruta = "/AquaSmart/api/empleado/getAllEmpleado";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(empleado => {
            let imagen = empleado.persona.usuario.foto && empleado.persona.usuario.foto.trim() !== "" ? empleado.persona.usuario.foto : '../img/nada.jpg';
            let nombreRol;
            if (empleado.persona.usuario.rol === 1) {
                nombreRol = "Cliente";
            } else if (empleado.persona.usuario.rol === 2) {
                nombreRol = "Empleado";
            } else if (empleado.persona.usuario.rol === 3) {
                nombreRol = "Administrador";
            } else {
                nombreRol = "Desconocido";
            }

            cuerpo += ` 
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center usuario-item" 
     data-nombre="${empleado.persona.nombre}" id="${empleado.idEmpleado}">
    <div class="flip-card ${empleado.persona.usuario.estatus === 1 ? '' : 'inactive'}" data-aos="fade-up">
        <div class="flip-card-inner">
            <!-- Parte frontal de la tarjeta -->
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <img src="${imagen}" class="rounded-circle mb-2" width="180" height="180" alt="Foto de ${empleado.persona.nombre}">
                <h4 class="mt-2">${empleado.persona.nombre} ${empleado.persona.apellidoP} ${empleado.persona.apellidoM}</h4>
                <p class="text-muted">${empleado.persona.edad} años</p>
                <p class="text-muted front-modelo"><i class="bi bi-person-badge"></i> ${empleado.cargo.nombreCargo}</p>
            </div>

            <!-- Parte trasera de la tarjeta -->
            <div class="flip-card-back text-center">
                <div class="card-header">
                    <p><i class="bi bi-tag"></i> <strong>ID Empleado:</strong> ${empleado.idEmpleado}</p>
                    <p><i class="bi bi-file-earmark-code"></i> <strong>RFC:</strong> ${empleado.rfc}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><p><i class="bi bi-envelope"></i> <strong>Email:</strong> ${empleado.persona.email}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-phone"></i> <strong>Teléfono:</strong> ${empleado.persona.telefono}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-geo-alt"></i> <strong>Ciudad:</strong> ${empleado.persona.ciudad.nombre}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-person-badge"></i> <strong>Rol:</strong> ${nombreRol}</p></li>
                    <li class="list-group-item status-item ${empleado.persona.usuario.estatus === 1 ? 'active' : 'inactive'}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${empleado.persona.usuario.estatus === 1 ? "Activo" : "Inactivo"}</p></li>
                </ul>
                <div class="card-footer">
                    <button class="btn btn-primary btn-usuario" 
                        data-empleado="${empleado.idEmpleado}"
                        data-idpersona="${empleado.persona.idPersona}"
                        data-nombre="${empleado.persona.nombre}"
                        data-nombreU="${empleado.persona.usuario.nombre}"
                        data-apellidop="${empleado.persona.apellidoP}"
                        data-apellidom="${empleado.persona.apellidoM}"
                        data-edad="${empleado.persona.edad}"
                        data-email="${empleado.persona.email}"
                        data-telefono="${empleado.persona.telefono}"
                        data-ciudad="${empleado.persona.ciudad.idCiudad}"
                        data-idusuario="${empleado.persona.usuario.idUsuario}"
                        data-foto="${imagen}"
                        data-estatus="${empleado.persona.usuario.estatus}"
                        data-rol="${empleado.persona.usuario.rol}"
                        data-contra="${empleado.persona.usuario.contrasenia}"
                        data-rfc="${empleado.rfc}"
                        data-cargo="${empleado.cargo.nombreCargo}"
                        data-puesto="${empleado.cargo.idCargo}">
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
                const idEmpleado = button.getAttribute("data-empleado");
                const rfc = button.getAttribute("data-rfc");
                const cargo = button.getAttribute("data-puesto");
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
                document.getElementById("txtIdEmpleadoEdit").value = idEmpleado;
                document.getElementById("txtRfcEdit").value = rfc;
                document.getElementById("selectCargoEdit").value = cargo;
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
                document.getElementById("selectRolEdit").value = 2;
                document.getElementById("txtContraseniaEdit").value = contra;

                // Mostrar el modal
                const modal = new bootstrap.Modal(document.getElementById("empleadoModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

async function update() {
    let ruta = "/AquaSmart/api/empleado/updateEmpleado";
    let v_id = document.getElementById("txtIdEmpleadoEdit").value;
    let v_rfc = document.getElementById("txtRfcEdit").value;
    let v_cargo = document.getElementById("selectCargoEdit").value;
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

    let cargo = {
        idCargo: v_cargo
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
        estatus: v_estatus
    };

    let empleado = {
        idEmpleado:v_id,
        rfc: v_rfc
    };

    persona.ciudad = ciudad;
    persona.usuario = usuario;
    empleado.cargo = cargo;
    empleado.persona = persona;

    try {
        let params = new URLSearchParams();
        params.append("datosEmpleado", JSON.stringify(empleado));

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
            text: `Has actualizado exitosamente: ${v_nombreP}`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarEmpleados();

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

async function deleteEmpleado() {
    let ruta = "/AquaSmart/api/empleado/deleteEmpleado";
    let v_id = document.getElementById("txtIdEmpleadoEdit").value;
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
        params.append("idEmpleado", v_id);

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

        cargarEmpleados();

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
    deleteEmpleado();
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
    document.getElementById("txtIdEmpleadoEdit").value = "";
    document.getElementById("txtRfcEdit").value = "";
    document.getElementById("selectCargoEdit").value = "";
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

async function actualizarOpcionesCargo() {
    let ruta = "/AquaSmart/api/cargo/getAllCargo";
    const respuesta = await fetch(ruta);
    const ciudades = await respuesta.json();
    const selectCargo = document.getElementById('selectCargo');
    const selectCargoU = document.getElementById('selectCargoEdit');
    ciudades.forEach(cargo => {
        const option = document.createElement('option');
        const optionU = document.createElement('option');
        option.value = cargo.idCargo;
        option.textContent = cargo.nombreCargo;
        optionU.value = cargo.idCargo;
        optionU.textContent = cargo.nombreCargo;
        selectCargo.appendChild(option);
        selectCargoU.appendChild(optionU);
    });
}