
/* global Swal */

function iniciarSesion(){
    const username=document.getElementById("txtUsuario").value;
    const password=document.getElementById("txtContrasenia").value;
    
    if(username===" " || password=== " "){
      Swal.fire({
  title: '¡Advertencia!',
  text: 'Por favor, ingresa tu usuario y contraseña.Operación completada correctamente',
  icon: 'warning',
  confirmButtonText: 'Aceptar'
});
return;
    }
     fetch('/AquaSmart/api/login/validarLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre=${encodeURIComponent(username)}&contrasenia=${encodeURIComponent(password)}`
    }).then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            
            .then(data => {//Si la respuesta es correcta guarda  el token de autotetificacion y el nom usuario en localStorage
                console.log("Respuesta del servidor", data.tokenL);  // muestra la respuesta del servidor

                //localStorage.getItem('tokenL',data.token);

                if (data.status === 'success') {
                    // Guardar token y datos en localStorage
                    localStorage.setItem("usuarioAutenticado", 'true');
                    localStorage.setItem("nombreU", username);
                    localStorage.setItem("tokenL", data.tokenL); // Guardar el token recibido
                    //window.location.href = 'Servicios.html'; //  y redirige a la página de servicios
                    console.log("Token almacenado:", localStorage.getItem("tokenL"));

                    // Retrasa la redirección para asegurarte de ver el log
                    setTimeout(() => {
                        window.location.href = 'ServiciosA.html';
                        
                        
                    }, 2000);  // 2 segundos de retraso
                } else {
                    Swal.fire({//Si la respusta no es correcta manda alerta de datos incorrectos
                        icon: "error",
                        title: "Error",
                        text: data.message || 'Datos incorrectos o usuario no activo.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: "error", //O que hay probelmas con el servidor
                    title: "Oops...",
                    text: "Hubo un problema al conectarse al servidor. Intenta nuevamente más tarde."
                });
            });
}

// Esta función se ejecuta al cerrar sesión
function cerrarSesion() {
    // Enviar solicitud  post al servidor para validar el cierre de sesión con el nomb usuario que esta el localstorage
    fetch('/AquaSmart/api/login/validarCierre', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre=${encodeURIComponent(localStorage.getItem("nombreU"))}`
    })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {// si el servidor lo confirma, cierra sesion y 
                    // Eliminar los datos de sesión del localStorage
                    localStorage.removeItem('usuarioAutenticado');
                    localStorage.removeItem('nombreU');
                    localStorage.removeItem('tokenL'); // Eliminar el token
                    window.location.href = 'index.html'; // y redirige al login
                    
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.message || 'No se pudo cerrar sesión.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hubo un problema al conectarse al servidor. Intenta nuevamente más tarde."
                });
            });
}

    

// Valida si el usuar io tiene un token valido almacenado en el localstorage cuando la pagina carga
function validarToken() {
    const token = localStorage.getItem("tokenL");

    if (token) {
        // Si el token existe y es válido muestra una alerta de exito
        Swal.fire({
            icon: "success",
            title: "Token Validado",
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "servicio.html"; // y redirige a la pagina de servicio si el token es válido
        });
    } else {
        Swal.fire({// y si no es valido  
            icon: "error",
            title: "Token caducado",
            text: "Por favor, inicie sesión de nuevo.",
            timer: 3000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "index.html"; // Redirigir a la página de login
        });
    }
}



/* Animación de Letras */
document.addEventListener('DOMContentLoaded', function() {
    // Animación letra por letra para el título
    const title = document.querySelector('.login-title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--char-index', index);
            title.appendChild(span);
            
            // Manejar espacios
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            }
        });
    }
});



