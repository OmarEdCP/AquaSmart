package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Estado;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.util.List;
import java.sql.ResultSet;
import java.util.ArrayList;

public class EstadoController {

public Estado insertEstado(Estado estado) {
    String sp = "CALL sp_insertEstado(?)";  
    Connection conn = null;
    CallableStatement cstm = null;

    try {
        MySQL mysql = new MySQL();
        conn = mysql.open();
        cstm = (CallableStatement) conn.prepareCall(sp);
        cstm.setString(1, estado.getNombre());
        cstm.execute(); // Solo ejecuta sin obtener ID

        System.out.println("Insert Correcto");
    } catch (SQLException em) {
        em.printStackTrace();
    } finally {
        try {
            if (cstm != null) cstm.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    return estado; // Devuelve el objeto sin modificar el ID
}


    public void updateEstado(Estado estado) {
        String sp = "CALL sp_updateEstado(?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        
        try {
            MySQL mysql = new MySQL();
            conn = mysql.open();
            cstm = (CallableStatement) conn.prepareCall(sp);
            cstm.setInt(1, estado.getIdEstado());
            cstm.setString(2, estado.getNombre());
            cstm.execute();

            System.out.println("Actualizar correcto");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (cstm != null) cstm.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public void deleteEstado(int idEstado) {
        String sp = "CALL sp_deleteEstado(?)";
        Connection conn = null;
        CallableStatement cstm = null;

        try {
            MySQL mysql = new MySQL();
            conn = mysql.open();
            cstm = (CallableStatement) conn.prepareCall(sp);
            cstm.setInt(1, idEstado);
            cstm.execute();

            System.out.println("Delete exitoso");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (cstm != null) cstm.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public List<Estado> getAllEstado() {
        List<Estado> estados = new ArrayList<>();
        String query = "SELECT * FROM vistaEstado";
        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            MySQL mysql = new MySQL();
            conn = mysql.open();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                estados.add(fill(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (pstm != null) pstm.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return estados;
    }

    public Estado fill(ResultSet rs) throws SQLException {
        Estado e = new Estado();
        e.setIdEstado(rs.getInt("idEstado"));
        e.setNombre(rs.getString("nombreEstado"));
        return e;
    }
}
