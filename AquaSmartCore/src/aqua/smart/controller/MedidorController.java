package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Medidor;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MedidorController {

    public Medidor insertMedidor(Medidor m) {
        System.out.println("lo que llega al statement");
        System.out.println(m.getNombre());
        String query = "call sp_insertMedidor(?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, m.getNombre());
            pstm.setString(2, m.getModelo());
            pstm.setInt(3, m.getCantidad());
            pstm.setDouble(4, m.getPrecio());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return m;
    }

    public List<Medidor> getAllMedidor() throws SQLException {
        String sql = "select * from vistaMedidor";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Medidor> listaMedidor = new ArrayList<>();
        while (rs.next()) {
            listaMedidor.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaMedidor;
    }

    public Medidor fill(ResultSet rs) throws SQLException {
        Medidor m = new Medidor();
        m.setIdMedidor(rs.getInt("idMedidor"));
        m.setNombre(rs.getString("nombreMedidor"));
        m.setModelo(rs.getString("modelo"));
        m.setCantidad(rs.getInt("cantidad"));
        m.setEstatus(rs.getInt("estatusMedidor"));
        m.setPrecio(rs.getDouble("precio"));
        return m;
    }

    public void updateMedidor(Medidor m) throws SQLException {
        String query = "CALL sp_updateMedidor(?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, m.getIdMedidor());
        cstm.setString(2, m.getNombre());
        cstm.setString(3, m.getModelo());
        cstm.setInt(4, m.getCantidad());
        cstm.setDouble(5, m.getPrecio());
        cstm.setInt(6, m.getEstatus());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deleteMedidor(int idMedidor) throws SQLException {
        String query = "{CALL sp_desactiveMedidor(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idMedidor);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
