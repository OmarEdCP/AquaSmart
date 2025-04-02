package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Cargo;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Cliente;
import aqua.smart.model.Empleado;
import aqua.smart.model.Estado;
import aqua.smart.model.Persona;
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

public class TicketController {

    public Ticket insertTicket(Ticket t) {
        System.out.println("Lo que llega al statement");
        System.out.println(t.getNumTarjeta().getNumTarjeta());
        String query = "call sp_insertTicket(?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            java.sql.Timestamp timestamp = new java.sql.Timestamp(t.getFecha().getTime());
            pstm.setTimestamp(1, timestamp);
            pstm.setDouble(2, t.getTotal());
            pstm.setDouble(3, t.getSubtotal());
            pstm.setInt(4, t.getEmpleado().getIdEmpleado());
            pstm.setInt(5, t.getCliente().getIdCliente());
            pstm.setString(6, t.getNumTarjeta().getNumTarjeta());
            pstm.execute();
            System.out.println("insert Correcto");
            pstm.close();
            connMysql.close();
        } catch (SQLException em) {
            em.getStackTrace();
        }

        return t;
    }

public List<Ticket> getAllTicket() throws SQLException {
    String sql = "SELECT * FROM vistaTicket"; // Vista corregida
    MySQL connMysql = new MySQL();
    Connection conn = connMysql.open();
    PreparedStatement pstmt = conn.prepareStatement(sql);
    ResultSet rs = pstmt.executeQuery();
    List<Ticket> listaTicket = new ArrayList<>();

    while (rs.next()) {
        listaTicket.add(fill(rs));
    }

    rs.close();
    pstmt.close();
    connMysql.close();
    return listaTicket;
}

public Ticket fill(ResultSet rs) throws SQLException {
    // EMPLEADO
    Estado e = new Estado();
    e.setIdEstado(rs.getInt("idEstadoEmpleado"));
    e.setNombre(rs.getString("nombreEstadoEmpleado"));

    Ciudad c = new Ciudad();
    c.setIdCiudad(rs.getInt("idCiudadEmpleado"));
    c.setNombre(rs.getString("nombreCiudadEmpleado"));
    c.setEstado(e);

    Usuario u = new Usuario();
    u.setIdUsuario(rs.getInt("idUsuarioEmpleado"));
    u.setNombre(rs.getString("nombreUsuarioEmpleado"));
    u.setFoto(rs.getString("fotoEmpleado"));
    u.setEstatus(rs.getInt("estatusEmpleado"));
    u.setRol(rs.getInt("rolEmpleado"));
    u.setLastToken(rs.getString("lastEmpleado"));
    u.setDateLastToken(rs.getTimestamp("dateEmpleado"));

    Persona p = new Persona();
    p.setIdPersona(rs.getInt("personaEmpleado"));
    p.setNombre(rs.getString("nombreEmpleado"));
    p.setApellidoM(rs.getString("apellidoMEmpleado"));
    p.setApellidoP(rs.getString("apellidoPEmpleado"));
    p.setEdad(rs.getInt("edadEmpleado"));
    p.setEstatus(rs.getInt("estatusPersonaEmpleado"));
    p.setEmail(rs.getString("emailEmpleado"));
    p.setTelefono(rs.getString("telefonoEmpleado"));
    p.setCiudad(c);
    p.setUsuario(u);

    Cargo ca = new Cargo();
    ca.setIdCargo(rs.getInt("idCargo"));
    ca.setNombreCargo(rs.getString("nombreCargo"));
    ca.setDescripcion(rs.getString("descripcionCargo"));

    Empleado em = new Empleado();
    em.setIdEmpleado(rs.getInt("idEmpleado"));
    em.setRfc(rs.getString("rfc"));
    em.setCargo(ca);
    em.setPersona(p);
    
    // CLIENTE
    Estado es = new Estado();
    es.setIdEstado(rs.getInt("idEstadoCliente"));
    es.setNombre(rs.getString("nombreEstadoCliente"));

    Ciudad ci = new Ciudad();
    ci.setIdCiudad(rs.getInt("idCiudadCliente"));
    ci.setNombre(rs.getString("nombreCiudadCliente"));
    ci.setEstado(es);

    Usuario us = new Usuario();
    us.setIdUsuario(rs.getInt("idUsuarioCliente"));
    us.setNombre(rs.getString("nombreUsuarioCliente"));
    us.setFoto(rs.getString("fotoCliente"));
    us.setEstatus(rs.getInt("estatusCliente"));
    us.setRol(rs.getInt("rolCliente"));
    us.setLastToken(rs.getString("lastCliente"));
    us.setDateLastToken(rs.getTimestamp("dateCliente"));

    Persona pe = new Persona();
    pe.setIdPersona(rs.getInt("personaCliente"));
    pe.setNombre(rs.getString("nombreCliente"));
    pe.setApellidoM(rs.getString("clienteApellidoM"));
    pe.setApellidoP(rs.getString("clienteApellidoP"));
    pe.setEdad(rs.getInt("clienteEdad"));
    pe.setEstatus(rs.getInt("estatusPersonaCliente"));
    pe.setEmail(rs.getString("emailCliente"));
    pe.setTelefono(rs.getString("telefonoCliente"));
    pe.setCiudad(ci);
    pe.setUsuario(us);

    Cliente cli = new Cliente();
    cli.setIdCliente(rs.getInt("idCliente"));
    cli.setPersona(pe); 

    Tarjeta tar = new Tarjeta();
        tar.setNumTarjeta(rs.getString("numTarjeta"));
        tar.setCvv(rs.getString("cvv"));
        tar.setMes(rs.getString("mes"));
        tar.setAnio(rs.getString("año"));
        tar.setNombreTitular(rs.getString("nombreTitular"));

    Ticket t = new Ticket();
    t.setIdTicket(rs.getInt("idTicket"));
    t.setFecha(rs.getTimestamp("fechaTicket"));
    t.setTotal(rs.getDouble("total"));
    t.setSubtotal(rs.getDouble("subtotal"));
    t.setCliente(cli);
    t.setEmpleado(em);
    t.setNumTarjeta(tar); 

    return t;
}



    public void update(Ticket t) throws SQLException {
        String query = "call sp_updateTicket(?,?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement pstm = null;

        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        pstm = (CallableStatement) conn.prepareCall(query);
        pstm.setInt(1, t.getIdTicket());
        pstm.setTimestamp(2, t.getFecha());
        pstm.setDouble(3, t.getTotal());
        pstm.setDouble(4, t.getSubtotal());
        pstm.setInt(5, t.getEmpleado().getIdEmpleado());
        pstm.setInt(6, t.getCliente().getIdCliente());
        pstm.setString(7, t.getNumTarjeta().getNumTarjeta());

        pstm.execute();
        pstm.close();
        connMysql.close();
    }
    public void delete(int idTicket) throws SQLException {
        String query = "call sp_deleteTicket(?)";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idTicket);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();

    }

}
