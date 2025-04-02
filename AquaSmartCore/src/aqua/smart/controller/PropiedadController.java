package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Cliente;
import aqua.smart.model.Estado;
import aqua.smart.model.Medidor;
import aqua.smart.model.Persona;
import aqua.smart.model.Propiedad;
import aqua.smart.model.Usuario;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PropiedadController {

    public Propiedad insertPropiedad(Propiedad pro) {
        System.out.println("lo que llega al statement");
        System.out.println(pro.getCalle());
        String query = "call sp_insertPropiedad(?,?,?,?,?,?,?,?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, pro.getNumExt());
            pstm.setString(2, pro.getNumInt());
            pstm.setString(3, pro.getCalle());
            pstm.setString(4, pro.getColonia());
            pstm.setDouble(5, pro.getLatitud());
            pstm.setDouble(6, pro.getLongitud());
            pstm.setInt(7, pro.getCodigoP());
            pstm.setString(8, pro.getFoto());
            pstm.setInt(9, pro.getEstatus());
            pstm.setInt(10, pro.getCliente().getIdCliente());
            pstm.setInt(11, pro.getCiudad().getIdCiudad());
            pstm.setInt(12, pro.getMedidor().getIdMedidor());
            pstm.execute();
            pstm.close();
            connMysql.close();
        } catch (SQLException em) {
            em.getStackTrace();
        }
        return pro;
    }

   public List<Propiedad> getAllPropiedad() throws SQLException {
    String sql = "SELECT * FROM vistaPropiedad"; // Consulta a la vista
    MySQL connMysql = new MySQL();
    Connection conn = connMysql.open();
    PreparedStatement pstmt = conn.prepareStatement(sql);
    ResultSet rs = pstmt.executeQuery();
    List<Propiedad> listaPropiedad = new ArrayList<>();
    
    while (rs.next()) {
        listaPropiedad.add(fill(rs));
    }

    rs.close();
    pstmt.close();
    connMysql.close();
    return listaPropiedad;
}

public Propiedad fill(ResultSet rs) throws SQLException {
    // Estado y Ciudad de la Persona
    Estado e = new Estado();
    e.setIdEstado(rs.getInt("idEstado"));
    e.setNombre(rs.getString("nombreEstado"));

    Ciudad c = new Ciudad();
    c.setIdCiudad(rs.getInt("idCiudad"));
    c.setNombre(rs.getString("nombreCiudad"));
    c.setEstado(e);

    // Usuario
    Usuario u = new Usuario();
    u.setIdUsuario(rs.getInt("idUsuario"));
    u.setNombre(rs.getString("nombreUsuario"));
    u.setContrasenia(rs.getString("contrasenia"));
    u.setFoto(rs.getString("fotoUsuario"));
    u.setEstatus(rs.getInt("estatusUsuario"));
    u.setRol(rs.getInt("rol"));
    u.setLastToken(rs.getString("lastToken"));
    u.setDateLastToken(rs.getTimestamp("dateLastToken"));

    // Persona
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

    // Cliente
    Cliente cli = new Cliente();
    cli.setIdCliente(rs.getInt("idCliente"));
    cli.setPersona(p);

    // Estado y Ciudad de la Propiedad
    Estado est = new Estado();
    est.setIdEstado(rs.getInt("idestadoPropiedad"));
    est.setNombre(rs.getString("nomEstado"));

    Ciudad ci = new Ciudad();
    ci.setIdCiudad(rs.getInt("idciudadPropidedad"));
    ci.setNombre(rs.getString("nomCiudad"));
    ci.setEstado(est);

    // Medidor
    Medidor m = new Medidor();
    m.setIdMedidor(rs.getInt("idMedidor"));
    m.setNombre(rs.getString("nombreMedidor"));
    m.setModelo(rs.getString("modelo"));
    m.setCantidad(rs.getInt("cantidad"));
    m.setEstatus(rs.getInt("estatusMedidor"));
    m.setPrecio(rs.getDouble("precio"));

    // Propiedad
    Propiedad pp = new Propiedad();
    pp.setIdPropiedad(rs.getInt("idPropiedad"));
    pp.setNumExt(rs.getString("numExt"));
    pp.setNumInt(rs.getString("numInt"));
    pp.setCalle(rs.getString("calle"));
    pp.setCodigoP(rs.getInt("codigoP"));
    pp.setColonia(rs.getString("colonia"));
    pp.setLatitud(rs.getDouble("latitud"));
    pp.setLongitud(rs.getDouble("longitud"));
    pp.setFoto(rs.getString("foto"));
    pp.setEstatus(rs.getInt("estatusPropiedad"));
    pp.setCliente(cli);
    pp.setCiudad(ci);
    pp.setMedidor(m);

    return pp;
}

    public void update(Propiedad pro) throws SQLException {
        String query = "call sp_updatePropiedad(?,?,?,?,?,?,?,?,?,?,?,?,?)";

        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
        pstm.setInt(1, pro.getIdPropiedad());
        pstm.setString(2, pro.getNumExt());
        pstm.setString(3, pro.getNumInt());
        pstm.setString(4, pro.getCalle());
        pstm.setString(5, pro.getColonia());
        pstm.setDouble(6, pro.getLatitud());
        pstm.setDouble(7, pro.getLongitud());
        pstm.setInt(8, pro.getCodigoP());
        pstm.setString(9, pro.getFoto());
        pstm.setInt(10, pro.getEstatus());
        pstm.setInt(11, pro.getCliente().getIdCliente());
        pstm.setInt(12, pro.getCiudad().getIdCiudad());
        pstm.setInt(13, pro.getMedidor().getIdMedidor());

        pstm.execute();
        pstm.close();
        connMysql.close();

    }

    public void delete(int idPropiedad) throws SQLException {
        String query = "call sp_desactivePropiedad(?)";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idPropiedad);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();

    }
}
