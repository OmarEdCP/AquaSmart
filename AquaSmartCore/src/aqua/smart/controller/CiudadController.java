package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Ciudad;
import aqua.smart.model.Estado;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CiudadController {

    public Ciudad insertCiudad(Ciudad c) {
        System.out.println("lo que llega al statement");
        System.out.println(c.getNombre());
        String query = "call sp_insertCiudad(?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, c.getNombre());
            pstm.setInt(2, c.getEstado().getIdEstado());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return c;
    }

    public List<Ciudad> getAllCiudad() throws SQLException {
        String sql = "select * from vistaCiudad";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Ciudad> listaCiudad = new ArrayList<>();
        while (rs.next()) {
            listaCiudad.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaCiudad;
    }

    public Ciudad fill(ResultSet rs) throws SQLException {
        Estado e = new Estado();
        e.setIdEstado(rs.getInt("idEstado"));
        e.setNombre(rs.getString("nombreEstado"));
        Ciudad c = new Ciudad();
        c.setIdCiudad(rs.getInt("idCiudad"));
        c.setNombre(rs.getString("nombreCiudad"));
        c.setEstado(e);
        return c;
    }

    public void updateCiudad(Ciudad c) throws SQLException {
        String query = "CALL sp_updateCiudad(?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, c.getIdCiudad());
        cstm.setString(2, c.getNombre());
        cstm.setInt(3, c.getEstado().getIdEstado());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deleteCiudad(int idCiudad) throws SQLException {
        String query = "{CALL sp_deleteCiudad(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idCiudad);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
