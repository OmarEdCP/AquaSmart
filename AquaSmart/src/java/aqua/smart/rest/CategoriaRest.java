
package aqua.smart.rest;

import aqua.smart.controller.CategoriaController;
import aqua.smart.model.Categoria;
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

@Path("categoria")
public class CategoriaRest extends Application {

    @Path("insertCategoria")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCategoria(@FormParam("datosCategoria") @DefaultValue("") String categoria) {
        try {
            Gson gson = new Gson();
            CategoriaController cc = new CategoriaController();

            Categoria ca = gson.fromJson(categoria, Categoria.class);

            // Insertar la ciudad en la base de datos
            cc.insertCategoria(ca);

            // Devolver la respuesta con el objeto insertado
            String out = gson.toJson(ca);
            return Response.status(Response.Status.CREATED).entity(out).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();

        }
    }

    @Path("getAllCategoria")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategoria(@QueryParam("id") @DefaultValue("0") int id) {
        List<Categoria> lista = null;
        Gson gson = new Gson();
        String out = null;
        CategoriaController cc = null;
        try {
            cc = new CategoriaController();
            lista = cc.getAllCategoria();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("updateCategoria")
   @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategoria(@FormParam("datosCategoria") @DefaultValue("") String datosCategoria) {
        String out = null;
        Categoria ca = null;
        CategoriaController cc = null;
        Gson gson = new Gson();
        try {
            cc = new CategoriaController();
            ca = gson.fromJson(datosCategoria, Categoria.class);
            cc.update(ca);
            System.out.println(datosCategoria);
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

    @Path("deleteCategoria")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCategoria(@FormParam("idCategoria") int idCategoria) {
        String out;
        CategoriaController cc = new CategoriaController();
        try {
            cc.delete(idCategoria);
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
