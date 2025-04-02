
package aqua.smart.controller;

import aqua.smart.db.MySQL;
import aqua.smart.model.Usuario;
import com.mysql.cj.jdbc.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UsuarioController {
      public Usuario insertUsuario(Usuario u) {

        String query = "call sp_insertUsuario(?,?,?,?)";
        try {
            MySQL connMysql = new MySQL();
            Connection conn = connMysql.open();
            CallableStatement pstm = (CallableStatement) conn.prepareCall(query);
            pstm.setString(1, u.getNombre());
            pstm.setString(2, u.getContrasenia());
             pstm.setString(3, u.getFoto());
            pstm.setInt(4, u.getRol());
            pstm.execute();
            System.out.println("Insert correcto");
            pstm.close();
            connMysql.close();

        } catch (SQLException em) {
            em.getStackTrace();
        }
        return u;
    }

    public List<Usuario> getAllUsuario() throws SQLException {
        String sql = "select * from vistaUsuario";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        List<Usuario> listaUsuario = new ArrayList<>();
        while (rs.next()) {
            listaUsuario.add(fill(rs));
        }
        rs.close();
        connMysql.close();
        return listaUsuario;
    }

    public Usuario fill(ResultSet rs) throws SQLException {

        Usuario u = new Usuario();
        u.setIdUsuario(rs.getInt("idUsuario"));
        u.setNombre(rs.getString("nombre"));
        u.setContrasenia(rs.getString("contrasenia"));
        u.setFoto(rs.getString("foto"));
        u.setEstatus(rs.getInt("estatus"));
        u.setRol(rs.getInt("rol"));
        u.setLastToken(rs.getString("lastToken"));
        u.setDateLastToken(rs.getTimestamp("dateLastToken"));
 
        return u;
    }

    public void updateUsuario(Usuario u) throws SQLException {
        String query = "CALL sp_updateUsuario(?,?,?,?,?,?)";
        Connection conn = null;
        CallableStatement cstm = null;
        MySQL connMysql = new MySQL();
        conn = connMysql.open();
        cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, u.getIdUsuario());
        cstm.setString(2, u.getNombre());
        cstm.setString(3, u.getContrasenia());
        cstm.setString(4, u.getFoto());
        cstm.setInt(5, u.getRol());
        cstm.setInt(6, u.getEstatus());
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }

    public void deleteUsuario(int idUsuario) throws SQLException {
        String query = "{CALL sp_desactiveUsuario(?)}";
        MySQL connMysql = new MySQL();
        Connection conn = connMysql.open();
        CallableStatement cstm = (CallableStatement) conn.prepareCall(query);
        cstm.setInt(1, idUsuario);
        cstm.execute();
        cstm.close();
        connMysql.close();
        conn.close();
    }
    
}
