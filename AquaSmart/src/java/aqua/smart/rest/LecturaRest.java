
package aqua.smart.rest;

import aqua.smart.controller.LecturaController;
import aqua.smart.model.Lectura;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("lectura")
public class LecturaRest {

    @Path("insertLectura")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertLecura(@FormParam("datosLectura") @DefaultValue("") String lectura) {
        try {
            Gson gson = new Gson();
            LecturaController cp = new LecturaController();
            Lectura l = gson.fromJson(lectura, Lectura.class);
            cp.insertLectura(l);
            String out = gson.toJson(l);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }

    @Path("getAllLectura")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllLectura(@QueryParam("id") @DefaultValue("0") int id) {
        List<Lectura> lista = null;
        Gson gson = new Gson();
        String out = null;
        LecturaController lc = null;
        try {
            lc = new LecturaController();
            lista = lc.getAllLectura();
            out = gson.toJson(lista);

        } catch (Exception e) {
            e.printStackTrace();
            out = """
            {"result":"Error de Servidor"}
            """;
        }
        return Response.ok(out).build();
    }

    @Path("updateLectura")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateLectura(@FormParam("datosLectura") @DefaultValue(" ") String datosLectura) {
        String out = null;
        Lectura l = null;
        LecturaController lc = null;
        Gson gson = new Gson();
        try {
            lc = new LecturaController();
            l = gson.fromJson(datosLectura, Lectura.class);

            lc.update(l);
            System.out.println(datosLectura);
            out = "{\"result\":\"Cambios Realizados\"}";
         
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"result\":\"Error del servidor\"}";
        }
        return Response.ok(out).build();

    }

    @Path("deleteLectura")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteLectura(@FormParam("idLectura") int idLectura) {
        String out;
        LecturaController lc = new LecturaController();
        try {
            lc.delete(idLectura);
            out = """
                {"result":"Registro eliminado Correctamente"}
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
