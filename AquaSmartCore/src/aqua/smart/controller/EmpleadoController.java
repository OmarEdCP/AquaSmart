package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Cargo;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Empleado;
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

public class EmpleadoController {

    public Empleado insertEmpleado(Empleado e) {
        System.out.println("lo que llega al statement");
        System.out.println(e.getPersona().getNombre());
        String query = "call sp_insertEmpleado(?,?,?,?,?,?,?,?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, e.getRfc());
            pstm.setInt(2, e.getCargo().getIdCargo());
            pstm.setString(3, e.getPersona().getNombre());
            pstm.setString(4, e.getPersona().getApellidoM());
            pstm.setString(5, e.getPersona().getApellidoP());
            pstm.setInt(6, e.getPersona().getEdad());
            pstm.setString(7, e.getPersona().getEmail());
            pstm.setString(8, e.getPersona().getTelefono());
            pstm.setInt(9, e.getPersona().getCiudad().getIdCiudad());
            pstm.setString(10, e.getPersona().getUsuario().getNombre());
            pstm.setString(11, e.getPersona().getUsuario().getContrasenia());
            pstm.setString(12, e.getPersona().getUsuario().getFoto());
            pstm.setInt(13, e.getPersona().getUsuario().getRol());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return e;
    }

    public List<Empleado> getAllEmpleado() throws SQLException {
        String sql = "select * from vistaEmpleado";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Empleado> listaEmpleado = new ArrayList<>();
        while (rs.next()) {
            listaEmpleado.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaEmpleado;
    }

    public Empleado fill(ResultSet rs) throws SQLException {
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
        Cargo ca = new Cargo();
        ca.setIdCargo(rs.getInt("idCargo"));
        ca.setNombreCargo(rs.getString("nombreCargo"));
        ca.setDescripcion(rs.getString("descripcion"));
        Empleado em = new Empleado();
        em.setIdEmpleado(rs.getInt("idEmpleado"));
        em.setRfc(rs.getString("rfc"));
        em.setCargo(ca);
        em.setPersona(p);
        return em;
    }

    public void updateEmpleado(Empleado e) throws SQLException {
        String query = "CALL sp_updateEmpleado(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, e.getIdEmpleado());
        cstm.setString(2, e.getRfc());
        cstm.setInt(3, e.getCargo().getIdCargo());
        cstm.setString(4, e.getPersona().getNombre());
        cstm.setString(5, e.getPersona().getApellidoM());
        cstm.setString(6, e.getPersona().getApellidoP());
        cstm.setInt(7, e.getPersona().getEdad());
        cstm.setString(8, e.getPersona().getEmail());
        cstm.setString(9, e.getPersona().getTelefono());
        cstm.setInt(10, e.getPersona().getCiudad().getIdCiudad());
        cstm.setString(11, e.getPersona().getUsuario().getNombre());
        cstm.setString(12, e.getPersona().getUsuario().getContrasenia());
        cstm.setString(13, e.getPersona().getUsuario().getFoto());
        cstm.setInt(14, e.getPersona().getUsuario().getRol());
        cstm.setInt(15, e.getPersona().getEstatus());

        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deleteEmpleado(int idEmpleado) throws SQLException {
        String query = "{CALL sp_desactiveEmpleado(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idEmpleado);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
