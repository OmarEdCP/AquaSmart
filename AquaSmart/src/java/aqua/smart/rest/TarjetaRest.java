package aqua.smart.rest;

import aqua.smart.controller.TarjetaController;
import aqua.smart.model.Tarjeta;
import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("tarjeta")
public class TarjetaRest extends Application {

    @Path("insertTarjeta")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertTarjeta(@FormParam("datosTarjeta") @DefaultValue("") String tarjeta) {
        try {
            Gson gson = new Gson();
            TarjetaController cp = new TarjetaController();
            Tarjeta t = gson.fromJson(tarjeta, Tarjeta.class);
            cp.insertTarjeta(t);
            String out = gson.toJson(t);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }

    @Path("getAllTarjeta")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTarjeta(@QueryParam("id") @DefaultValue("0") int id) {
        List<Tarjeta> lista = null;
        Gson gson = new Gson();
        String out = null;
        TarjetaController cs = null;
        try {
            cs = new TarjetaController();
            lista = cs.getAllTarjeta();

            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("updateTarjeta")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTarjeta(@FormParam("datosTarjeta") @DefaultValue("") String datosTarjeta) {
        String out = null;
        Tarjeta t = null;
        TarjetaController cp = null;
        Gson gson = new Gson();
        try {
            cp = new TarjetaController();
            t = gson.fromJson(datosTarjeta, Tarjeta.class);
            cp.update(t);
            System.out.println(datosTarjeta);
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

    @Path("deleteTarjeta")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTarjeta(@FormParam("numTarjeta") String numTarjeta) {
        String out;
        TarjetaController tc = new TarjetaController();
        try {
            tc.delete(numTarjeta);
            out = """
           {"result":"Registro eliminaado correctamente"}
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
