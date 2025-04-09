
package aqua.smart.controller;

import aqua.smart.model.Servicio;
import aqua.smart.db.MySQL;
import aqua.smart.model.Categoria;
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

public class ServicioController {

    public Servicio insertServicio(Servicio s) {
        System.out.println("LO que llega al statement");
        System.out.println(s.getIdServicio());
        String query = "call sp_insertServicio(?,?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setInt(1, s.getEstatus());
            pstm.setInt(2, s.getPropiedad().getIdPropiedad());
            pstm.setInt(3, s.getCliente().getIdCliente());
            pstm.setInt(4, s.getCategoria().getIdCategoria());
            pstm.setInt(5, s.getCiudad().getIdCiudad());
            pstm.execute();
            pstm.close();
            System.out.println("insert Correcto");

            connMysql.close();
        } catch (SQLException em) {
            em.getStackTrace();
        }

        return s;
    }

    public List<Servicio> getAllServicio() throws SQLException {
        String sql = "select * from vistaServicio";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Servicio> listaServicio = new ArrayList();
        while (rs.next()) {
            listaServicio.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaServicio;
    }

public Servicio fill(ResultSet rs) throws SQLException {
    // Crear y llenar objeto Propiedad
    Propiedad propiedad = new Propiedad();
    propiedad.setIdPropiedad(rs.getInt("idPropiedad"));
    propiedad.setNumExt(rs.getString("numExt"));
    propiedad.setNumInt(rs.getString("numInt"));
    propiedad.setCalle(rs.getString("calle"));
    propiedad.setColonia(rs.getString("colonia"));
    propiedad.setLatitud(rs.getDouble("latitud"));
    propiedad.setLongitud(rs.getDouble("longitud"));
    propiedad.setCodigoP(rs.getInt("codigoP"));
    propiedad.setFoto(rs.getString("foto"));
    propiedad.setEstatus(rs.getInt("estatusPropiedad"));
    
    // Crear y llenar objeto Medidor
    Medidor medidor = new Medidor();
    medidor.setIdMedidor(rs.getInt("idMedidor"));
    medidor.setNombre(rs.getString("nombreMedidor"));
    medidor.setModelo(rs.getString("modelo"));
    medidor.setCantidad(rs.getInt("cantidad"));
    medidor.setEstatus(rs.getInt("estatusMedidor"));
    medidor.setPrecio(rs.getDouble("precio"));
    propiedad.setMedidor(medidor);
    
    // Crear y llenar objeto Ciudad
    Ciudad ciudad = new Ciudad();
    ciudad.setIdCiudad(rs.getInt("idCiudad"));
    ciudad.setNombre(rs.getString("nombreCiudad"));
    
    // Crear y llenar objeto Estado
    Estado estado = new Estado();
    estado.setIdEstado(rs.getInt("idEstado"));
    estado.setNombre(rs.getString("nombreEstado"));
    ciudad.setEstado(estado);
    
    // Crear y llenar objeto Usuario
    Usuario usuario = new Usuario();
    usuario.setIdUsuario(rs.getInt("idUsuario"));
    usuario.setNombre(rs.getString("nombreUsuario"));
    usuario.setContrasenia(rs.getString("contrasenia"));
    usuario.setFoto(rs.getString("fotoUsuario"));
    usuario.setEstatus(rs.getInt("estatusUsuario"));
    usuario.setRol(rs.getInt("rol"));
    usuario.setLastToken(rs.getString("lastToken"));
    usuario.setDateLastToken(rs.getTimestamp("dateLastToken"));
    
    // Crear y llenar objeto Persona
    Persona persona = new Persona();
    persona.setIdPersona(rs.getInt("idPersona"));
    persona.setNombre(rs.getString("nombrePersona"));
    persona.setApellidoP(rs.getString("apellidoP"));
    persona.setApellidoM(rs.getString("apellidoM"));
    persona.setEdad(rs.getInt("edad"));
    persona.setEstatus(rs.getInt("estatus"));
    persona.setEmail(rs.getString("email"));
    persona.setTelefono(rs.getString("telefono"));
    persona.setCiudad(ciudad);
    persona.setUsuario(usuario);
    
    // Crear y llenar objeto Cliente
    Cliente cliente = new Cliente();
    cliente.setIdCliente(rs.getInt("idCliente"));
    cliente.setPersona(persona);
    
    // Asignar cliente a la propiedad
    propiedad.setCliente(cliente);
    
    // Crear y llenar objeto Categoria
    Categoria categoria = new Categoria();
    categoria.setIdCategoria(rs.getInt("idCategoria"));
    categoria.setNombre(rs.getString("nombreCategoria"));
    categoria.setDescripcion(rs.getString("descripcion"));
    categoria.setEstatus(rs.getInt("estatusCategoria"));
    
      // Crear y llenar objeto Ciudad
    Ciudad ciu = new Ciudad();
    ciu.setIdCiudad(rs.getInt("ciudadServ"));
    ciu.setNombre(rs.getString("nomCiudad"));
    
    // Crear y llenar objeto Estado
    Estado est = new Estado();
    est.setIdEstado(rs.getInt("estadoServ"));
    est.setNombre(rs.getString("nomEstado"));
    ciu.setEstado(est);
    
    // Crear y llenar objeto Servicio
    Servicio servicio = new Servicio();
    servicio.setIdServicio(rs.getInt("idServicio"));
    servicio.setEstatus(rs.getInt("estatusServicio"));
    servicio.setPropiedad(propiedad);
    servicio.setCliente(cliente);
    servicio.setCiudad(ciu);
    servicio.setCategoria(categoria);
    
    return servicio;
}

    public void update(Servicio s) throws SQLException {
        String query = "call sp_updateServicio(?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement pstm = null;

        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        pstm = (CallableStatement) conn.prepareCall(query);
        pstm.setInt(1, s.getIdServicio());
        pstm.setInt(2, s.getEstatus());
        pstm.setInt(3, s.getPropiedad().getIdPropiedad());
        pstm.setInt(4, s.getCliente().getIdCliente());
        pstm.setInt(5, s.getCategoria().getIdCategoria());
        pstm.setInt(6, s.getCiudad().getIdCiudad());
        
        pstm.execute();
        pstm.close();
        connMysql.close();
    }

    public void delete(int idServicio) throws SQLException {
        String query = "call sp_desactiveServicio(?)";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idServicio);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();

    }
}
