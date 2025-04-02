/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aqua.smart.rest;

import aqua.smart.controller.LoginController;
import aqua.smart.controller.UsuarioController;
import aqua.smart.model.Usuario;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("login")
public class LoginRest {
    
    @Path("validarLogin")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response validarLogin(
            @FormParam("nombre") String nombre,
            @FormParam("contrasenia") String contrasenia
    ) {
        LoginController loginController = new LoginController();  // Asegúrate de que esta es la clase correcta
        JsonObject response = new JsonObject();
        boolean isValidUser = false;

        try {
            // Validamos el usuario con la clase LoginController que tiene el método validar_usuario
            isValidUser = loginController.validar_usuario(nombre, contrasenia);

            if (isValidUser) {
                String  token=loginController.checkUsers(nombre);

                
                response.addProperty("status", "success");
                response.addProperty("message", "Login exitoso");
                response.addProperty("tokenL", token);

            } else {
                response.addProperty("status", "fail");
                response.addProperty("message", "Credenciales incorrectas o inactivas");
            }

        } catch (Exception e) {
            // Manejo de excepciones y errores
            e.printStackTrace();
            response.addProperty("status", "error");
            response.addProperty("message", "Error en el servidor: " + e.getMessage());
        }

        return Response.status(Response.Status.OK).entity(response.toString()).build();
    }
    
    
    @Path("cheecky")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response checkingUser(@QueryParam("nombre") @DefaultValue("") String nombre){
        String out = null;
        String usuario = null;
        LoginController cu = new LoginController(); 
        try{
            usuario = cu.checkUsers(nombre);
            out = new Gson().toJson(usuario);

        }catch(Exception e){
            out = """
                  {"error":"Por ahi no joven"}
                  """;
            System.out.println(e.getMessage());
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @Path("delechecky")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response delechecky(@QueryParam("nombre") @DefaultValue("") String nombre){
        String out = null;
        String usuario = null;
        LoginController cu = new LoginController(); 
        try{
            System.out.println(nombre+"Desde el delechecky");
            usuario = cu.DeleteUsers(nombre);
            out = new Gson().toJson(usuario);

        }catch(Exception e){
            out = """
                  {"error":"Por ahi no joven"}
                  """;
            System.out.println(e.getMessage());
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    
    @Path("validarCierre")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response validarCierre(
            @FormParam("nombre") String nombre
           
    ) {
        LoginController loginController = new LoginController();  // Asegúrate de que esta es la clase correcta
        JsonObject response = new JsonObject();
        boolean isValidUser = false;

        try {
            // Validamos el usuario con la clase LoginController que tiene el método validar_usuario
            if(!nombre.isEmpty()){
                isValidUser=true;
            }else{
                isValidUser=false;
            }

            if (isValidUser) {
                System.out.println(nombre + "Dedsde el rest");
                loginController.DeleteUsers(nombre);
                response.addProperty("status", "success");
                response.addProperty("message", "Cierre exitoso");
            } else {
                response.addProperty("status", "fail");
                response.addProperty("message", "Credenciales incorrectas o inactivas");
            }

        } catch (Exception e) {
            // Manejo de excepciones y errores
            e.printStackTrace();
            response.addProperty("status", "error");
            response.addProperty("message", "Error en el servidor: " + e.getMessage());
        }

        return Response.status(Response.Status.OK).entity(response.toString()).build();
    }
    
    
     @Path("getAllUsuario")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsuario(@QueryParam("id") @DefaultValue("0") int id) {
        List<Usuario> lista = null;
        Gson gson = new Gson();
        String out = null;
        UsuarioController uc = null;
        try {
            uc = new UsuarioController();
            lista = uc.getAllUsuario();
            
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """   
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
}
