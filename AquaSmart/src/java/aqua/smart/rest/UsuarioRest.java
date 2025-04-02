
package aqua.smart.rest;

import aqua.smart.controller.UsuarioController;
import aqua.smart.model.Usuario;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("usuario")
public class UsuarioRest extends Application{
    
    @Path("insertUsuario")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCiudad(@FormParam("datosUsuario") @DefaultValue("") String usuario) {
        try {
            Gson gson = new Gson();
            UsuarioController uc = new UsuarioController();
            Usuario u = gson.fromJson(usuario, Usuario.class);
             uc.insertUsuario(u);
            String out = gson.toJson(u);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
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
    
    @Path("updateUsuario")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUsuario(@FormParam("datosUsuario") @DefaultValue("") String datosUsuario) {
        String out = null;
        Usuario u = null;
        UsuarioController uc = null;
        Gson gson = new Gson();
        try {
            uc = new UsuarioController();
            u = gson.fromJson(datosUsuario, Usuario.class);
            uc.updateUsuario(u);
            System.out.println(datosUsuario);
            out = """
                {"result":"Cambios Realizados"}
                """;
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                {"result":"Error de servidor"}
                """;
        }
        return Response.ok(out).build();
    }

    @Path("deleteUsuario")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUsuario(@FormParam("idUsuario") int idUsuario) {
        String out;
         UsuarioController uc = new UsuarioController();
        try {
            uc.deleteUsuario(idUsuario);
            out = """
                {"result":"Registro eliminado correctamente"}
                """;
        } catch (SQLException e) {
            e.printStackTrace();
            out = """
                {"result":"Error al eliminar el registro"}
                """;
        }
        return Response.ok(out).build();
    }
    
    
}
