
package aqua.smart.rest;

import aqua.smart.controller.MedidorController;
import aqua.smart.model.Medidor;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
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

@Path("medidor")
public class MedidorRest extends Application{
        
       @Path("insertMedidor")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertMedidor(@FormParam("datosMedidor") @DefaultValue("") String medidor) {
        try {
            Gson gson = new Gson();
            MedidorController cp = new MedidorController();
            Medidor c = gson.fromJson(medidor, Medidor.class);
             cp.insertMedidor(c);
            String out = gson.toJson(c);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (JsonSyntaxException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    
    @Path("getAllMedidor")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllMedidor(@QueryParam("id") @DefaultValue("0") int id) {
        List<Medidor> lista = null;
        Gson gson = new Gson();
        String out = null;
        MedidorController cs = null;
        try {
            cs = new MedidorController();
            lista = cs.getAllMedidor();
            
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updateMedidor")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMedidor(@FormParam("datosMedidor") @DefaultValue("") String datosMedidor) {
        String out = null;
        Medidor s = null;
        MedidorController cp = null;
        Gson gson = new Gson();
        try {
            cp = new MedidorController();
            s = gson.fromJson(datosMedidor, Medidor.class);
            cp.updateMedidor(s);
            System.out.println(datosMedidor);
            out = """
                {"result":"Cambios Realizados"}
                """;
        } catch (JsonSyntaxException | SQLException e) {
            out = """
                {"result":"Error de servidor"}
                """;
        }
        return Response.ok(out).build();
    }

    @Path("deleteMedidor")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMedidor(@FormParam("idMedidor") int idMedidor) {
        String out;
        MedidorController cp = new MedidorController();
        try {
            cp.deleteMedidor(idMedidor);
            out = """
                {"result":"Registro eliminado correctamente"}
                """;
        } catch (SQLException e) {
            out = """
                {"result":"Error al eliminar el registro"}
                """;
        }
        return Response.ok(out).build();
    }
    
    
}
