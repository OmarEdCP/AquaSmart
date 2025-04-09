
package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Cargo;
import aqua.smart.model.Categoria;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Cliente;
import aqua.smart.model.DetalleServicio;
import aqua.smart.model.Empleado;
import aqua.smart.model.Estado;
import aqua.smart.model.Lectura;
import aqua.smart.model.Medidor;
import aqua.smart.model.Persona;
import aqua.smart.model.Propiedad;
import aqua.smart.model.Servicio;
import aqua.smart.model.Tarjeta;
import aqua.smart.model.Ticket;
import aqua.smart.model.Usuario;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DetalleServicioController {
    
  public DetalleServicio insertDetalleServicio(DetalleServicio s) {
        System.out.println("LO que llega al statement");
        System.out.println(s.getDescripcion());
        String query = "call sp_insertDetalleServicio(?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, s.getDescripcion());
             java.sql.Timestamp timestamp = new java.sql.Timestamp(s.getFecha().getTime());
            pstm.setTimestamp(2, timestamp);
            pstm.setInt(3, s.getCliente().getIdCliente());
            pstm.setInt(4, s.getServicio().getIdServicio());
            pstm.setInt(5, s.getLectura().getIdLectura());
            pstm.setInt(6, s.getTicket().getIdTicket());
            pstm.execute();
            pstm.close();
            System.out.println("insert Correcto");

            connMysql.close();
        } catch (SQLException em) {
            em.getStackTrace();
        }

        return s;
    }

    public List<DetalleServicio> getAllDetalleServicio() throws SQLException {
        String sql = "select * from vistaDetalleServicio";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<DetalleServicio> listaDetalle = new ArrayList();
        while (rs.next()) {
            listaDetalle.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaDetalle;
    }

public DetalleServicio fill(ResultSet rs) throws SQLException {
    // ==================== DETALLE SERVICIO ====================
    DetalleServicio detalle = new DetalleServicio();
    detalle.setIdDetalle(rs.getInt("idDetalle"));
    detalle.setDescripcion(rs.getString("descripcionDetalle"));
    detalle.setFecha(rs.getTimestamp("fechaDetalle"));
    detalle.setEstatus(rs.getInt("estatusDetalle"));

    // ==================== CLIENTE (DETALLE) ====================
    Cliente clienteDetalle = new Cliente();
    clienteDetalle.setIdCliente(rs.getInt("idClienteDetalle"));
    
    Persona personaCliente = new Persona();
    personaCliente.setIdPersona(rs.getInt("personaClienteDetalle"));
    personaCliente.setNombre(rs.getString("nombreClienteDetalle"));
    personaCliente.setApellidoP(rs.getString("apellidoPClienteDetalle"));
    personaCliente.setApellidoM(rs.getString("apellidoMClienteDetalle"));
    personaCliente.setEdad(rs.getInt("edadClienteDetalle"));
    personaCliente.setEstatus(rs.getInt("estatusPersonaClienteDetalle"));
    personaCliente.setEmail(rs.getString("emailClienteDetalle"));
    personaCliente.setTelefono(rs.getString("telefonoClienteDetalle"));
    
    Ciudad ciudadCliente = new Ciudad();
    ciudadCliente.setIdCiudad(rs.getInt("idCiudadClienteDetalle"));
    ciudadCliente.setNombre(rs.getString("nombreCiudadClienteDetalle"));
    
    Estado estadoCliente = new Estado();
    estadoCliente.setIdEstado(rs.getInt("idEstadoClienteDetalle"));
    estadoCliente.setNombre(rs.getString("nombreEstadoClienteDetalle"));
    ciudadCliente.setEstado(estadoCliente);
    
    Usuario usuarioCliente = new Usuario();
    usuarioCliente.setIdUsuario(rs.getInt("idUsuarioClienteDetalle"));
    usuarioCliente.setNombre(rs.getString("nombreUsuarioClienteDetalle"));
    usuarioCliente.setRol(rs.getInt("rolClienteDetalle"));
    usuarioCliente.setFoto(rs.getString("fotoClienteDetalle"));
    usuarioCliente.setEstatus(rs.getInt("estatusUsuarioClienteDetalle"));
    usuarioCliente.setLastToken(rs.getString("lastTokenClienteDetalle"));
    usuarioCliente.setDateLastToken(rs.getTimestamp("dateTokenClienteDetalle"));
    
    personaCliente.setCiudad(ciudadCliente);
    personaCliente.setUsuario(usuarioCliente);
    clienteDetalle.setPersona(personaCliente);
    detalle.setCliente(clienteDetalle);

    // ==================== SERVICIO ====================
    Servicio servicio = new Servicio();
    servicio.setIdServicio(rs.getInt("idServicio"));
    servicio.setEstatus(rs.getInt("estatusServicio"));

    // Propiedad del servicio
    Propiedad propiedad = new Propiedad();
    propiedad.setIdPropiedad(rs.getInt("idPropiedad"));
    propiedad.setCalle(rs.getString("calle"));
    propiedad.setColonia(rs.getString("colonia"));
    propiedad.setNumExt(rs.getString("numExt"));
    propiedad.setNumInt(rs.getString("numInt"));
    propiedad.setLatitud(rs.getDouble("latitud"));
    propiedad.setLongitud(rs.getDouble("longitud"));
    propiedad.setCodigoP(rs.getInt("codigoP"));
    propiedad.setFoto(rs.getString("fotoPropiedad"));
    propiedad.setEstatus(rs.getInt("estatusPropiedad"));
    
    Ciudad ciudadPropiedad = new Ciudad();
    ciudadPropiedad.setIdCiudad(rs.getInt("idCiudadPropiedad"));
    ciudadPropiedad.setNombre(rs.getString("nombreCiudadPropiedad"));
    
    Estado estadoPropiedad = new Estado();
    estadoPropiedad.setIdEstado(rs.getInt("idEstadoPropiedad"));
    estadoPropiedad.setNombre(rs.getString("nombreEstadoPropiedad"));
    ciudadPropiedad.setEstado(estadoPropiedad);
    
    Medidor medidorPropiedad = new Medidor();
    medidorPropiedad.setIdMedidor(rs.getInt("idMedidorPropiedad"));
    medidorPropiedad.setNombre(rs.getString("nombreMedidorPropiedad"));
    medidorPropiedad.setModelo(rs.getString("modeloMedidorPropiedad"));
    medidorPropiedad.setCantidad(rs.getInt("cantidadMedidorPropiedad"));
    medidorPropiedad.setEstatus(rs.getInt("estatusMedidorPropiedad"));
    medidorPropiedad.setPrecio(rs.getDouble("precioMedidorPropiedad"));
    
    propiedad.setCiudad(ciudadPropiedad);
    propiedad.setMedidor(medidorPropiedad);
    propiedad.setCliente(clienteDetalle); // Mismo cliente que el detalle
    
    servicio.setPropiedad(propiedad);

    // Categoría del servicio
    Categoria categoria = new Categoria();
    categoria.setIdCategoria(rs.getInt("idCategoria"));
    categoria.setNombre(rs.getString("nombreCategoria"));
    categoria.setDescripcion(rs.getString("descripcionCategoria"));
    categoria.setEstatus(rs.getInt("estatusCategoria"));
    categoria.setPrecio(rs.getDouble("precioCategoria"));
    servicio.setCategoria(categoria);

    // Ciudad del servicio (puede ser diferente a la propiedad)
    Ciudad ciudadServicio = new Ciudad();
    ciudadServicio.setIdCiudad(rs.getInt("idCiudadPropiedad")); // Misma que propiedad
    ciudadServicio.setNombre(rs.getString("nombreCiudadPropiedad")); // Misma que propiedad
    ciudadServicio.setEstado(estadoPropiedad); // Mismo que propiedad
    servicio.setCiudad(ciudadServicio);

    detalle.setServicio(servicio);

    // ==================== LECTURA ====================
    Lectura lectura = new Lectura();
    lectura.setIdLectura(rs.getInt("idLectura"));
    lectura.setEstatus(rs.getInt("estatusLectura"));
    lectura.setFlujo(rs.getDouble("flujo"));
    lectura.setPulsaciones(rs.getDouble("pulsaciones"));
    lectura.setFecha(rs.getTimestamp("fechaLectura"));
    
    Medidor medidorLectura = new Medidor();
    medidorLectura.setIdMedidor(rs.getInt("idMedidorLectura"));
    medidorLectura.setNombre(rs.getString("nombreMedidorLectura"));
    medidorLectura.setModelo(rs.getString("modeloMedidorLectura"));
    medidorLectura.setCantidad(rs.getInt("cantidadMedidorLectura"));
    medidorLectura.setEstatus(rs.getInt("estatusMedidorLectura"));
    medidorLectura.setPrecio(rs.getDouble("precioMedidorLectura"));
    
    lectura.setMedidor(medidorLectura);
    detalle.setLectura(lectura);

    // ==================== TICKET ====================
    Ticket ticket = new Ticket();
    ticket.setIdTicket(rs.getInt("idTicket"));
    ticket.setTotal(rs.getDouble("total"));
    ticket.setSubtotal(rs.getDouble("subtotal"));
    ticket.setEstatus(rs.getInt("estatusTicket"));
    ticket.setFecha(rs.getTimestamp("fechaTicket"));

    // Empleado del ticket
    Empleado empleado = new Empleado();
    empleado.setIdEmpleado(rs.getInt("idEmpleado"));
    empleado.setRfc(rs.getString("rfc"));
    
    Cargo cargo = new Cargo();
    cargo.setIdCargo(rs.getInt("idCargo"));
    cargo.setNombreCargo(rs.getString("nombreCargo"));
    cargo.setDescripcion(rs.getString("descripcionCargo"));
    empleado.setCargo(cargo);
    
    // Persona empleado
    Persona personaEmpleado = new Persona();
    personaEmpleado.setIdPersona(rs.getInt("personaEmpleado"));
    personaEmpleado.setNombre(rs.getString("nombreEmpleado"));
    personaEmpleado.setApellidoP(rs.getString("apellidoPEmpleado"));
    personaEmpleado.setApellidoM(rs.getString("apellidoMEmpleado"));
    personaEmpleado.setEdad(rs.getInt("edadEmpleado"));
    personaEmpleado.setEstatus(rs.getInt("estatusPersonaEmpleado"));
    personaEmpleado.setEmail(rs.getString("emailEmpleado"));
    personaEmpleado.setTelefono(rs.getString("telefonoEmpleado"));
    
    Ciudad ciudadEmpleado = new Ciudad();
    ciudadEmpleado.setIdCiudad(rs.getInt("idCiudadEmpleado"));
    ciudadEmpleado.setNombre(rs.getString("nombreCiudadEmpleado"));
    
    Estado estadoEmpleado = new Estado();
    estadoEmpleado.setIdEstado(rs.getInt("idEstadoEmpleado"));
    estadoEmpleado.setNombre(rs.getString("nombreEstadoEmpleado"));
    ciudadEmpleado.setEstado(estadoEmpleado);
    
    Usuario usuarioEmpleado = new Usuario();
    usuarioEmpleado.setIdUsuario(rs.getInt("idUsuarioEmpleado"));
    usuarioEmpleado.setNombre(rs.getString("nombreUsuarioEmpleado"));
    usuarioEmpleado.setRol(rs.getInt("rolEmpleado"));
    usuarioEmpleado.setFoto(rs.getString("fotoEmpleado"));
    usuarioEmpleado.setEstatus(rs.getInt("estatusUsuarioEmpleado"));
    usuarioEmpleado.setLastToken(rs.getString("lastTokenEmpleado"));
    usuarioEmpleado.setDateLastToken(rs.getTimestamp("dateTokenEmpleado"));
    
    personaEmpleado.setCiudad(ciudadEmpleado);
    personaEmpleado.setUsuario(usuarioEmpleado);
    empleado.setPersona(personaEmpleado);
    
    ticket.setEmpleado(empleado);

    // Cliente del ticket (puede ser diferente al del detalle)
    Cliente clienteTicket = new Cliente();
    clienteTicket.setIdCliente(rs.getInt("idClienteTicket"));
    
    Persona personaClienteTicket = new Persona();
    personaClienteTicket.setIdPersona(rs.getInt("personaClienteTicket"));
    personaClienteTicket.setNombre(rs.getString("nombreClienteTicket"));
    personaClienteTicket.setApellidoP(rs.getString("apellidoPClienteTicket"));
    personaClienteTicket.setApellidoM(rs.getString("apellidoMClienteTicket"));
    personaClienteTicket.setEdad(rs.getInt("edadClienteTicket"));
    personaClienteTicket.setEstatus(rs.getInt("estatusPersonaClienteTicket"));
    personaClienteTicket.setEmail(rs.getString("emailClienteTicket"));
    personaClienteTicket.setTelefono(rs.getString("telefonoClienteTicket"));
    
    clienteTicket.setPersona(personaClienteTicket);
    ticket.setCliente(clienteTicket);

    // Tarjeta del ticket
    Tarjeta tarjeta = new Tarjeta();
    tarjeta.setNumTarjeta(rs.getString("numTarjeta"));
    tarjeta.setCvv(rs.getString("cvv"));
    tarjeta.setMes(rs.getString("mes"));
    tarjeta.setAnio(rs.getString("año"));
    tarjeta.setNombreTitular(rs.getString("nombreTitular"));
    tarjeta.setEstatus(rs.getInt("estatusTarjeta"));
    ticket.setNumTarjeta(tarjeta);

    detalle.setTicket(ticket);

    return detalle;
}

    public void updateDetalle(DetalleServicio s) throws SQLException {
        String query = "call sp_updateDetalleServicio(?,?,?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement pstm = null;

        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        pstm = (CallableStatement) conn.prepareCall(query);
        pstm.setInt(1, s.getIdDetalle());
        pstm.setString(2, s.getDescripcion());
        pstm.setTimestamp(3, s.getFecha());
        pstm.setInt(4, s.getEstatus());
        pstm.setInt(5, s.getCliente().getIdCliente());
        pstm.setInt(6, s.getServicio().getIdServicio());
        pstm.setInt(7, s.getLectura().getIdLectura());
        pstm.setInt(8, s.getTicket().getIdTicket());
        
        pstm.execute();
        pstm.close();
        connMysql.close();
    }

    public void deleteDetalle(int idDetalle) throws SQLException {
        String query = "call sp_desactiveDetalleServicio(?)";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idDetalle);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();

    }   
}
