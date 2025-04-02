package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Cliente;
import aqua.smart.model.Estado;
import aqua.smart.model.Persona;
import aqua.smart.model.Usuario;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ClienteController {

    public Cliente insertCliente(Cliente c) {
        System.out.println("lo que llega al statement");
        System.out.println(c.getPersona().getNombre());
        String query = "call sp_insertCliente(?,?,?,?,?,?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, c.getPersona().getNombre());
            pstm.setString(2, c.getPersona().getApellidoM());
            pstm.setString(3, c.getPersona().getApellidoP());
            pstm.setInt(4, c.getPersona().getEdad());
            pstm.setString(5, c.getPersona().getEmail());
            pstm.setString(6, c.getPersona().getTelefono());
            pstm.setInt(7, c.getPersona().getCiudad().getIdCiudad());
            pstm.setString(8, c.getPersona().getUsuario().getNombre());
            pstm.setString(9, c.getPersona().getUsuario().getContrasenia());
            pstm.setString(10, c.getPersona().getUsuario().getFoto());
            pstm.setInt(11, c.getPersona().getUsuario().getRol());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return c;
    }

    public List<Cliente> getAllCliente() throws SQLException {
        String sql = "select * from vistaCliente";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Cliente> listaCliente = new ArrayList<>();
        while (rs.next()) {
            listaCliente.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaCliente;
    }

    public Cliente fill(ResultSet rs) throws SQLException {
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
        u.setEstatus(rs.getInt("estatus"));
        u.setRol(rs.getInt("rol"));
        u.setLastToken(rs.getString("lastToken"));
        u.setDateLastToken(rs.getTimestamp("dateLastToken"));
        Persona p = new Persona();
        p.setIdPersona(rs.getInt("idPersona"));
        p.setNombre(rs.getString("nombrePersona"));
        p.setApellidoM(rs.getString("apellidoM"));
        p.setApellidoP(rs.getString("apellidoP"));
        p.setEdad(rs.getInt("edad"));
        p.setEstatus(rs.getInt("estatus"));
        p.setEmail(rs.getString("email"));
        p.setTelefono(rs.getString("telefono"));
        p.setCiudad(c);
        p.setUsuario(u);
        Cliente cli = new Cliente();
        cli.setIdCliente(rs.getInt("idCliente"));
        cli.setPersona(p);
        return cli;
    }

    public void updateCliente(Cliente c) throws SQLException {
        String query = "CALL sp_updateCliente(?,?,?,?,?,?,?,?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, c.getIdCliente()); 
        cstm.setString(2, c.getPersona().getNombre());
            cstm.setString(3, c.getPersona().getApellidoM());
            cstm.setString(4, c.getPersona().getApellidoP());
            cstm.setInt(5, c.getPersona().getEdad());
            cstm.setString(6, c.getPersona().getEmail());
            cstm.setString(7, c.getPersona().getTelefono());
            cstm.setInt(8, c.getPersona().getCiudad().getIdCiudad());
            cstm.setString(9, c.getPersona().getUsuario().getNombre());
            cstm.setString(10, c.getPersona().getUsuario().getContrasenia());
            cstm.setString(11, c.getPersona().getUsuario().getFoto());
            cstm.setInt(12, c.getPersona().getUsuario().getRol());
            cstm.setInt(13, c.getPersona().getEstatus());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deleteCliente(int idCliente) throws SQLException {
        String query = "{CALL sp_desactiveCliente(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idCliente);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
