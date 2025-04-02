package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Cliente;
import aqua.smart.model.Estado;
import aqua.smart.model.Persona;
import aqua.smart.model.Tarjeta;
import aqua.smart.model.Usuario;
import com.mysql.cj.jdbc.CallableStatement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TarjetaController {

    public Tarjeta insertTarjeta(Tarjeta t) {
        System.out.println("lo que llega al statement");
        System.out.println(t.getNombreTitular());
        String query = "call sp_insertTarjeta(?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, t.getNumTarjeta());
            pstm.setString(2, t.getCvv());
            pstm.setString(3, t.getMes());
            pstm.setString(4, t.getAnio());
            pstm.setString(5, t.getNombreTitular());
            pstm.setInt(6, t.getCliente().getIdCliente());

            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return t;
    }

    public List<Tarjeta> getAllTarjeta() throws SQLException {
        String sql = "select * from vistaTarjeta;";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Tarjeta> listaTarjeta = new ArrayList<>();
        while (rs.next()) {
            listaTarjeta.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        System.out.println(listaTarjeta);

        return listaTarjeta;
    }

    public Tarjeta fill(ResultSet rs) throws SQLException {
        Estado e = new Estado();
        e.setIdEstado(rs.getInt("idEstado"));
        e.setNombre(rs.getString("nombreEstado"));
        Ciudad c = new Ciudad();
        c.setIdCiudad(rs.getInt("idCiudad"));
        c.setNombre(rs.getString("nombreCiudad"));
        c.setEstado(e);
        Usuario u = new Usuario();
        u.setIdUsuario(rs.getInt("idUsuario"));
        u.setNombre(rs.getString("nombreUsuario"));
        u.setContrasenia(rs.getString("contrasenia"));
        u.setFoto(rs.getString("foto"));
        u.setEstatus(rs.getInt("estatusUsuario"));
        u.setRol(rs.getInt("rol"));
        u.setLastToken(rs.getString("lastToken"));
        u.setDateLastToken(rs.getTimestamp("dateLastToken"));
        Persona p = new Persona();
        p.setIdPersona(rs.getInt("idPersona"));
        p.setNombre(rs.getString("nombrePersona"));
        p.setApellidoM(rs.getString("apellidoM"));
        p.setApellidoP(rs.getString("apellidoP"));
        p.setEdad(rs.getInt("edad"));
        p.setEstatus(rs.getInt("estatusPersona"));
        p.setEmail(rs.getString("email"));
        p.setTelefono(rs.getString("telefono"));
        p.setCiudad(c);
        p.setUsuario(u);
        Cliente cli = new Cliente();
        cli.setIdCliente(rs.getInt("idCliente"));
        cli.setPersona(p);
        Tarjeta t = new Tarjeta();
        t.setNumTarjeta(rs.getString("numTarjeta"));
        t.setCvv(rs.getString("cvv"));
        t.setMes(rs.getString("mes"));
        t.setAnio(rs.getString("año"));
        t.setNombreTitular(rs.getString("nombreTitular"));
        t.setEstatus(rs.getInt("estatusTarjeta"));
        t.setCliente(cli);
        return t;
    }

    public void update(Tarjeta t) throws SQLException {
        String query = "CALL sp_updateTarjeta(?,?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;

        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);

        cstm.setString(1, t.getNumTarjeta());
        cstm.setString(2, t.getCvv());
        cstm.setString(3, t.getMes());
        cstm.setString(4, t.getAnio());
        cstm.setString(5, t.getNombreTitular());
        cstm.setInt(6, t.getEstatus());
        cstm.setInt(7, t.getCliente().getIdCliente());

        // ejecutamos el PreparedStatement
        cstm.execute();
//Cerramos todos nuestros objetos de conexión con el servidor
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void delete(String numTarjeta) throws SQLException {
        String query = "call sp_desactiveTarjeta(?)";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setString(1, numTarjeta);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();

    }

}
