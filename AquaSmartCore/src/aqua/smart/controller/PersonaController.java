package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Ciudad;
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

public class PersonaController {

    public Persona insertPersona(Persona p) {
        System.out.println("lo que llega al statement");
        System.out.println(p.getNombre());
        String query = "call sp_insertPersona(?,?,?,?,?,?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, p.getNombre());
            pstm.setString(2, p.getApellidoM());
            pstm.setString(3, p.getApellidoP());
            pstm.setInt(4, p.getEdad());
            pstm.setString(5, p.getEmail());
            pstm.setString(6, p.getTelefono());
            pstm.setInt(7, p.getCiudad().getIdCiudad());
            pstm.setString(8, p.getUsuario().getNombre());
            pstm.setString(9, p.getUsuario().getContrasenia());
            pstm.setString(10, p.getUsuario().getFoto());
            pstm.setInt(11, p.getUsuario().getRol());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return p;
    }

    public List<Persona> getAllPersona() throws SQLException {
        String sql = "select * from vistaPersona";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Persona> listaPersona = new ArrayList<>();
        while (rs.next()) {
            listaPersona.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaPersona;
    }

    public Persona fill(ResultSet rs) throws SQLException {
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
        return p;
    }

    public void updatePersona(Persona p) throws SQLException {
        String query = "CALL sp_updatePersona(?,?,?,?,?,?,?,?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, p.getIdPersona());   
        cstm.setString(2, p.getNombre());
            cstm.setString(3, p.getApellidoM());
            cstm.setString(4, p.getApellidoP());
            cstm.setInt(5, p.getEdad());
            cstm.setString(6, p.getEmail());
            cstm.setString(7, p.getTelefono());
            cstm.setInt(8, p.getCiudad().getIdCiudad());
            cstm.setString(9, p.getUsuario().getNombre());
            cstm.setString(10, p.getUsuario().getContrasenia());
            cstm.setString(11, p.getUsuario().getFoto());
            cstm.setInt(12, p.getUsuario().getRol());
            cstm.setInt(13, p.getEstatus());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deletePersona(int idPersona) throws SQLException {
        String query = "{CALL sp_desactivePersona(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idPersona);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
