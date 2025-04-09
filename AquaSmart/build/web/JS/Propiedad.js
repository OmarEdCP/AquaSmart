
/* global bootstrap, Swal */

document.addEventListener("DOMContentLoaded", function () {
    cargarPropiedades();
    actualizarOpcionesCiudades();
    cargarMedidores();
    actualizarOpcionesClientes();
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

document.getElementById("propiedadForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let ruta = "/AquaSmart/api/propiedad/insertPropiedad";
    let v_numE = document.getElementById("txtNumExt").value;
    let v_numI = document.getElementById("txtNumInt").value;
    let v_calle = document.getElementById("txtCalle").value;
    let v_colonia = document.getElementById("txtColonia").value;
let v_lat = document.getElementById("txtLatitud").value.replace(",", ".");
let v_long = document.getElementById("txtLongitud").value.replace(",", ".");
    let v_cp = document.getElementById("txtCodigoP").value;
    let v_ciudad = document.getElementById("selectCiudad").value;
    let v_cliente = document.getElementById("selectCliente").value;
    let v_medidor = document.getElementById("selectMedidor").value;
v_lat = parseFloat(v_lat);
v_long = parseFloat(v_long);
    let ciudad = {
        idCiudad: v_ciudad
    };

    let medidor = {
        idMedidor: v_medidor
    };

    let cliente = {
        idCliente: v_cliente
    };

    let propiedad = {
        numExt: v_numE,
        numInt: v_numI,
        calle: v_calle,
        colonia: v_colonia,
        latitud: parseFloat(v_lat),
        longitud: parseFloat(v_long),
        codigoP: v_cp,
        foto: fotoBase64Nuevo,
        estatus: 1
    };
    
    propiedad.ciudad = ciudad;
    propiedad.medidor = medidor;
    propiedad.cliente = cliente;

console.log(typeof propiedad.latitud, propiedad.latitud);
console.log(typeof propiedad.longitud, propiedad.longitud);
    try {
        let params = new URLSearchParams();
        params.append("datosPropiedad", JSON.stringify(propiedad));

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

        cargarPropiedades();


        // Limpiar el formulario
        document.getElementById("txtNumExt").value = "";
        document.getElementById("txtNumInt").value = "";
        document.getElementById("txtCalle").value = "";
        document.getElementById("txtColonia").value = "";
        document.getElementById("txtLatitud").value = "";
        document.getElementById("txtLongitud").value = "";
        document.getElementById("txtCodigoP").value = "";
        document.getElementById("selectCiudad").value = "";
        document.getElementById("selectCliente").value = "";
        document.getElementById("selectMedidor").value = "";
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

async function cargarPropiedades() {
    let ruta = "/AquaSmart/api/propiedad/getAllPropiedad";

    try {
        let response = await fetch(ruta);
        if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        let cuerpo = "";

        data.forEach(propiedad => {
            let imagen = propiedad.foto !== "" ? propiedad.foto : '../img/nada.jpg';
            
            let estatusTexto = propiedad.estatus === 1 ? "Activo" : "Inactivo";
            let estatusClase = propiedad.estatus === 1 ? "active" : "inactive";
  

let clienteFoto = propiedad.cliente.persona.usuario.foto && propiedad.cliente.persona.usuario.foto.trim() !== ""
    ? propiedad.cliente.persona.usuario.foto
    : '../img/nada.jpg';
            cuerpo += `
<div class="col-lg-4 col-md-6 mb-4 d-flex justify-content-center propiedad-item" id="propiedad-${propiedad.idPropiedad}">
    <div class="flip-card ${estatusClase}" data-aos="fade-up">
        <div class="flip-card-inner">
            <div class="flip-card-front text-center d-flex flex-column align-items-center">
                <img src="${imagen}" class="rounded mb-2 propiedad-foto" width="180" height="180" alt="Propiedad ${propiedad.idPropiedad}">
                <h4 class="mt-2">${propiedad.calle} #${propiedad.numExt}</h4>
                <p class="tamaño">${propiedad.colonia}, ${propiedad.ciudad.nombre}</p>
            </div>

            <div class="flip-card-back text-center">
                <div class="card-header">
                    <p><i class="bi bi-house"></i> <strong>ID Propiedad:</strong> ${propiedad.idPropiedad}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><p><i class="bi bi-map"></i> <strong>Dirección:</strong> ${propiedad.calle} #${propiedad.numExt}, ${propiedad.colonia}</p></li>
                    <li class="list-group-item"><p><i class="bi bi-pin-map"></i> <strong>Coordenadas:</strong> (${propiedad.latitud}, ${propiedad.longitud})</p></li>
                    <li class="list-group-item"><p><i class="bi bi-geo"></i> <strong>Ciudad:</strong> ${propiedad.ciudad.nombre}</p></li>
                    <li class="list-group-item">
                        <p><i class="bi bi-person"></i> <strong>Cliente:</strong> ${propiedad.cliente.persona.nombre} ${propiedad.cliente.persona.apellidoP} ${propiedad.cliente.persona.apellidoM}</p>
                        <img src="${clienteFoto}" class="cliente-foto" width="80" height="80" alt="Foto Cliente">
                    </li>
                    <li class="list-group-item"><p><i class="bi bi-speedometer2"></i> <strong>Medidor:</strong> ${propiedad.medidor.nombre} - ${propiedad.medidor.modelo}</p></li>
                    <li class="list-group-item status-item ${estatusClase}"><p><i class="bi bi-toggle-on"></i> <strong>Estatus:</strong> ${estatusTexto}</p></li>
                </ul>
                <div class="card-footer">
                    <button class="btn btn-primary btn-propiedad" 
                        data-id="${propiedad.idPropiedad}"
                        data-calle="${propiedad.calle}"
                        data-numext="${propiedad.numExt}"
                        data-numint="${propiedad.numInt || ''}"
                        data-colonia="${propiedad.colonia}"
                        data-latitud="${propiedad.latitud}"
                        data-longitud="${propiedad.longitud}"
                        data-ciudad="${propiedad.ciudad.idCiudad}"
                        data-codigop="${propiedad.codigoP}"
                        data-cliente="${propiedad.cliente.idCliente}"
                        data-medidor="${propiedad.medidor.idMedidor}"
                        data-foto="${imagen}"
                        data-estatus="${propiedad.estatus}">
                        <i class="bi bi-eye"></i> Ver Más
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>`;

        });

        document.getElementById("tablaRegistros").innerHTML = cuerpo;

      
        // Agregar eventos a los botones
        document.querySelectorAll(".btn-propiedad").forEach(button => {
            button.addEventListener("click", () => {
                const idPropiedad = button.getAttribute("data-id");
                const numEx= button.getAttribute("data-numext");
                const numIn = button.getAttribute("data-numint");
                const calle = button.getAttribute("data-calle");
                const col = button.getAttribute("data-colonia");
                const lat = button.getAttribute("data-latitud");
                const long = button.getAttribute("data-longitud");
                const cp = button.getAttribute("data-codigop");
                const ciudad = button.getAttribute("data-ciudad");
                const cliente = button.getAttribute("data-cliente");
                const medidor = button.getAttribute("data-medidor");
                const estatus = button.getAttribute("data-estatus");
                const foto = button.getAttribute("data-foto");
                console.log(cp);
                document.getElementById("txtIdPropiedadEdit").value = idPropiedad;  
                document.getElementById("txtNumExtEdit").value = numEx;
                document.getElementById("txtNumIntEdit").value = numIn;
                document.getElementById("txtCalleEdit").value = calle;
                document.getElementById("txtColoniaEdit").value = col;
                document.getElementById("txtLatitudEdit").value = lat;
                document.getElementById("txtLongitudEdit").value = long;
                document.getElementById("txtCodigoPEdit").value = cp;
                document.getElementById("selectCiudadEdit").value = ciudad;
                document.getElementById("selectClienteEdit").value = cliente;
                document.getElementById("selectMedidorEdit").value = medidor;
                document.getElementById("selectEstatusEdit").value = estatus;
                fotoBase64Edit = foto;
                document.getElementById("encodedImageEdit").src = fotoBase64Edit;
                
                const modal = new bootstrap.Modal(document.getElementById("propiedadModal"));
                modal.show();
            });
        });

    } catch (error) {
        console.error("Error al cargar propiedades:", error);
    }
}

async function update() {
    let ruta = "/AquaSmart/api/propiedad/updatePropiedad";
    let v_id = document.getElementById("txtIdPropiedadEdit").value;
    let v_numE = document.getElementById("txtNumExtEdit").value;
    let v_numI = document.getElementById("txtNumIntEdit").value;
    let v_calle = document.getElementById("txtCalleEdit").value;
    let v_colonia = document.getElementById("txtColoniaEdit").value;
    let v_lat =parseFloat( document.getElementById("txtLatitudEdit").value);
    let v_long = parseFloat(document.getElementById("txtLongitudEdit").value);
    let v_cp = document.getElementById("txtCodigoPEdit").value;
    let v_ciudad = document.getElementById("selectCiudadEdit").value;
    let v_cliente = document.getElementById("selectClienteEdit").value;
    let v_medidor = document.getElementById("selectMedidorEdit").value;
    let v_estatus = document.getElementById("selectEstatusEdit").value;

    let ciudad = {
        idCiudad: v_ciudad
    };

    let medidor = {
        idMedidor: v_medidor
    };

    let cliente = {
        idCliente: v_cliente
    };

    let propiedad = {
        idPropiedad:v_id,
        numExt: v_numE,
        numInt: v_numI,
        calle: v_calle,
        colonia: v_colonia,
        latitud: parseFloat(v_lat),
        longitud: parseFloat(v_long),
        codigoP: v_cp,
        foto: fotoBase64Edit,
        estatus:v_estatus
    };
    
    propiedad.ciudad = ciudad;
    propiedad.medidor = medidor;
    propiedad.cliente = cliente;

    try {
        let params = new URLSearchParams();
        params.append("datosPropiedad", JSON.stringify(propiedad));
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
            text: `Has actualizado exitosamente: ${v_id}`,
            icon: "success"
        });

        // Recargar estados después de insertar
        cargarPropiedades();

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

async function deletePropiedad() {
    let ruta = "/AquaSmart/api/propiedad/deletePropiedad";
    let v_id = document.getElementById("txtIdPropiedadEdit").value;
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
        params.append("idPropiedad", v_id);

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
            text: `Has eliminado exitosamente el propiedad con ID: ${v_id}`,
            icon: "success"
        });

        cargarPropiedades();

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
    deletePropiedad();
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
    document.getElementById("txtIdPropiedadEdit").value = "";
    document.getElementById("txtNumExtEdit").value = "";
    document.getElementById("txtNumIntEdit").value = "";
    document.getElementById("txtCalleEdit").value = "";
    document.getElementById("txtColoniaEdit").value = "";
    document.getElementById("txtLatitudEdit").value = "";
    document.getElementById("txtLongitudEdit").value = "";
    document.getElementById("txtCodigoPEdit").value = "";
    document.getElementById("selectCiudadEdit").value = "";
    document.getElementById("selectClienteEdit").value = "";
    document.getElementById("selectMedidorEdit").value = "";
    document.getElementById("encodedImageEdit").src = "../img/nada.jpg";
    document.getElementById("txtFotoEdit").value = "";
    document.getElementById("selectEstatusEdit").value = "";
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

async function actualizarOpcionesClientes() {
    let ruta = "/AquaSmart/api/cliente/getAllCliente";
    const respuesta = await fetch(ruta);
    const clientes = await respuesta.json();
    const selectCliente = document.getElementById('selectCliente');
    const selectClienteEdit = document.getElementById('selectClienteEdit');
    clientes.forEach(cliente => {
        const nomCompleto=cliente.persona.nombre +" "+cliente.persona.apellidoP+" "+cliente.persona.apellidoM;
        const option = document.createElement('option');
        const optionU = document.createElement('option');
        option.value = cliente.idCliente;
        option.textContent = nomCompleto;
        optionU.value = cliente.idCliente;
        optionU.textContent = nomCompleto;
        selectCliente.appendChild(option);
        selectClienteEdit.appendChild(optionU);
    });
}

async function clean(){
    
}

document.getElementById("btnClean").addEventListener("click", function () {
    clean();
});

cargarPropiedades();