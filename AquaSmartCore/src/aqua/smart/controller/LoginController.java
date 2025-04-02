/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aqua.smart.controller;

import aqua.smart.db.MySQL;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.apache.commons.codec.digest.DigestUtils;


public class LoginController {
      public boolean validar_usuario(String nombre, String contrasenia) throws Exception {
        MySQL conexion = new MySQL();  // Usamos la clase MySQL como mencionaste
        Connection conn = conexion.open();
        CallableStatement stmt = null;
        ResultSet rs = null;
        boolean valido = false;

        try {
            // Preparar la llamada al procedimiento almacenado
            stmt = conn.prepareCall("{CALL validar_usuario(?, ?)}");
            stmt.setString(1, nombre); // Establecer el primer parámetro (nombre)
            stmt.setString(2, contrasenia); // Establecer el segundo parámetro (contrasenia)

            // Ejecutar el procedimiento
            rs = stmt.executeQuery();  // Ejecutamos el procedimiento

            // Procesar el resultado
            if (rs.next()) {
                // Obtener el resultado como un booleano (TRUE o FALSE)
                valido = rs.getBoolean("resultado");  // Si el procedimiento devuelve TRUE o FALSE
            }

        } catch (SQLException e) {
            // Si ocurre un error SQL
            e.printStackTrace();
            throw new Exception("Error en la base de datos: " + e.getMessage(), e);
        } catch (Exception e) {
            // Cualquier otro tipo de error
            e.printStackTrace();
            throw new Exception("Error desconocido: " + e.getMessage(), e);
        } finally {
            // Asegurarse de cerrar los recursos
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
            conexion.close();
        }

        return valido;  // Retorna verdadero o falso dependiendo del resultado
    }
public String checkUsers(String nombre) throws Exception {
        String sql = "select * from usuario where nombre =" + "'" + nombre + "';";
        MySQL conexion = new MySQL();  // Usamos la clase MySQL como mencionaste
        Connection conn = conexion.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        String name = null;
        String tok = null;
        String tokenizer = null;
        Date myDate = new Date();
        String fecha = new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss").format(myDate);
        String sql2 = "";
        while (rs.next()) {
            name = rs.getString("nombre");
            tok = rs.getString(7);
            tok = tok.trim();
            if (!tok.isEmpty()) {
                tokenizer = tok;
                sql2 = "UPDATE usuario SET dateLastToken ='" + fecha + "' WHERE nombre ='" + name + "';";
            } else {
                String token = "aquasmart" + "." + name + "." + fecha;
                tokenizer = DigestUtils.md5Hex(token);
                sql2 = "UPDATE usuario SET lastToken='" + tokenizer + "', dateLastToken ='" + fecha + "' WHERE nombre ='" + name + "';";
            }
            Connection connect = conexion.open();
            PreparedStatement ps = connect.prepareStatement(sql2);
            ps.executeUpdate();
            return tokenizer;
        }
        return name;
}

    public String DeleteUsers(String nombre) throws Exception {
        String sql = "select * from usuario where nombre =" + "'" + nombre + "';";
        MySQL conexion = new MySQL();  // Usamos la clase MySQL como mencionaste
        Connection conn = conexion.open();
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();
        String name = null;
        String tok = null;
        String tokenizer = null;
        Date myDate = new Date();
        String fecha = new SimpleDateFormat("yyyy.MM.dd.HH:mm:ss").format(myDate);
        String sql2 = "";
        while (rs.next()) {
            name = rs.getString("nombre");
            tok = rs.getString(7);
            System.out.println(tok);
            tok = tok.trim();
            if (!tok.isEmpty()) {

                tokenizer = "";
                sql2 = "UPDATE usuario SET lastToken='" + " " + "', dateLastToken ='" + fecha + "' WHERE nombre ='" + name + "';";

            } else {
                sql2 = "UPDATE usuario SET lastToken='" + " " + "', dateLastToken ='" + fecha + "' WHERE nombre ='" + name + "';";

            }
            Connection connect = conexion.open();
            PreparedStatement ps = connect.prepareStatement(sql2);
            ps.executeUpdate();
            return tokenizer;
        }
        return name;
    }
}
