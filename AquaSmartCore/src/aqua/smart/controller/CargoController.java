
package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Cargo;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CargoController {
    
    public Cargo insertCargo(Cargo c) {
        System.out.println("lo que llega al statement");
        System.out.println(c.getNombreCargo());
        String query = "call sp_insertCargo(?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, c.getNombreCargo());
            pstm.setString(2, c.getDescripcion());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return c;
    }

    public List<Cargo> getAllCargo() throws SQLException {
        String sql = "select * from vistaCargo";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Cargo> listaCargo = new ArrayList<>();
        while (rs.next()) {
            listaCargo.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaCargo;
    }

    public Cargo fill(ResultSet rs) throws SQLException {
        Cargo c = new Cargo();
        c.setIdCargo(rs.getInt("idCargo"));
        c.setNombreCargo(rs.getString("nombreCargo"));
        c.setDescripcion(rs.getString("descripcion"));
        return c;
    }

    public void updateCargo(Cargo c) throws SQLException {
        String query = "CALL sp_updateCargo(?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, c.getIdCargo());
        cstm.setString(2, c.getNombreCargo());
        cstm.setString(3, c.getDescripcion());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deleteCargo(int idCargo) throws SQLException {
        String query = "{CALL sp_deleteCargo(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idCargo);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
}
