package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Categoria;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CategoriaController {

    public Categoria insertCategoria(Categoria ca) {
        System.out.println("lo que llega al statement");
        System.out.println(ca.getNombre());
        String query = "call sp_insertCategoria(?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, ca.getNombre());
            pstm.setString(2, ca.getDescripcion());
            pstm.setDouble(3, ca.getPrecio());
            pstm.execute();
            System.out.println("Insert Correcto");
            pstm.close();
            connMysql.close();
        } catch (SQLException em) {
            em.getStackTrace();
        }
        return ca;
    }

    public List<Categoria> getAllCategoria() throws SQLException {
        String sql = "select * from categoria";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Categoria> listaCategoria = new ArrayList<>();
        while (rs.next()) {
            listaCategoria.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaCategoria;

    }

    public Categoria fill(ResultSet rs) throws SQLException {
        Categoria ca = new Categoria();
        ca.setIdCategoria(rs.getInt("idCategoria"));
        ca.setNombre(rs.getString("nombre"));
        ca.setDescripcion(rs.getString("descripcion"));
        ca.setEstatus(rs.getInt("estatus"));
        ca.setPrecio(rs.getDouble("precio"));
        return ca;
    }

    public void update(Categoria ca) throws SQLException {
        String query = "call sp_updateCategoria(?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;

        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        CallableStatement pstm = (CallableStatement) conn.prepareCall(query);

        pstm.setInt(1, ca.getIdCategoria());
        pstm.setString(2, ca.getNombre());
        pstm.setString(3, ca.getDescripcion());
        pstm.setInt(4, ca.getEstatus());
            pstm.setDouble(5, ca.getPrecio());
        pstm.execute();
        System.out.println("Actualización Correcta");
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void delete(int idCategoria ) throws SQLException {
        String query = "call sp_desactiveCategoria (?)";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
        pstm.setInt(1, idCategoria);
         pstm.execute();
        System.out.println("El estatus se desactivo correctamente");
        pstm.close();
        connMysql.close();
        conn.close();
    }
}
