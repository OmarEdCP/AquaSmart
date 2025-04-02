package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Lectura;
import aqua.smart.model.Medidor;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class LecturaController {

    public Lectura insertLectura(Lectura l) {
        System.out.println("LO que llega al statement");
        System.out.println(l.getFecha());
        String query = "call sp_insertLectura (?,?,?,?)";
        System.out.println(query);

        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setDouble(1, l.getFlujo());
            pstm.setDouble(2, l.getPulsaciones());
            java.sql.Timestamp timestamp = new java.sql.Timestamp(l.getFecha().getTime());
            pstm.setTimestamp(3, timestamp);
            pstm.setInt(4, l.getMedidor().getIdMedidor());
            pstm.execute();
            System.out.println(query);
            System.out.println("insert Correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return l;
    }

    public List<Lectura> getAllLectura() throws SQLException {
    String sql = "SELECT * FROM vistaLectura"; // Consulta a la vista
    MySQL connMysql = new MySQL();
    Connection conn = connMysql.open();
    PreparedStatement pstmt = conn.prepareStatement(sql); // Usamos PreparedStatement en lugar de CallableStatement
    ResultSet rs = pstmt.executeQuery();
    List<Lectura> listaLectura = new ArrayList<>();
    while (rs.next()) {
        listaLectura.add(fill(rs));
    }   
    rs.close();
    pstmt.close();
    connMysql.close();
    return listaLectura;
}

public Lectura fill(ResultSet rs) throws SQLException {
    Medidor m = new Medidor();
    m.setIdMedidor(rs.getInt("idMedidor"));
    m.setNombre(rs.getString("nombreMedidor"));
    m.setModelo(rs.getString("modelo"));
    m.setCantidad(rs.getInt("cantidad"));
    m.setEstatus(rs.getInt("estatusMedidor"));
    m.setPrecio(rs.getDouble("precio"));

    Lectura l = new Lectura();
    l.setIdLectura(rs.getInt("idLectura"));
    l.setEstatus(rs.getInt("estatusLectura")); // Ajuste en el alias
    l.setFlujo(rs.getDouble("flujo"));
    l.setPulsaciones(rs.getDouble("pulsaciones"));
    l.setFecha(rs.getTimestamp("fecha"));
    l.setMedidor(m);
    
    return l;
}

    public void update(Lectura l) throws SQLException {
        String query = "call sp_updateLectura(?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;

        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, l.getIdLectura());
        cstm.setDouble(2, l.getFlujo());
        cstm.setDouble(3, l.getPulsaciones());
        cstm.setTimestamp(4, l.getFecha());
        cstm.setInt(5, l.getMedidor().getIdMedidor());
        cstm.setInt(6, l.getEstatus());

        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

public void delete (int idLectura) throws SQLException{
    String query="call sp_desactiveLectura(?)";
    MySQL connMysql= new MySQL();
    Connection conn=connMysql.open();
    CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
    cstm.setInt(1,idLectura);
    cstm.execute();
    cstm.close();
    connMysql.close();
    conn.close();

    
}

    }

