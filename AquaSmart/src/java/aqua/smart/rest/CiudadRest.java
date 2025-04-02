
package aqua.smart.rest;
import aqua.smart.controller.CiudadController;
import aqua.smart.model.Ciudad;
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

@Path("ciudad")
public class CiudadRest extends Application{
    
       @Path("insertCiudad")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCiudad(@FormParam("datosCiudad") @DefaultValue("") String ciudad) {
        try {
            Gson gson = new Gson();
            CiudadController cp = new CiudadController();
            Ciudad c = gson.fromJson(ciudad, Ciudad.class);
             cp.insertCiudad(c);
            String out = gson.toJson(c);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    
    @Path("getAllCiudad")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCiudad(@QueryParam("id") @DefaultValue("0") int id) {
        List<Ciudad> lista = null;
        Gson gson = new Gson();
        String out = null;
        CiudadController cs = null;
        try {
            cs = new CiudadController();
            lista = cs.getAllCiudad();
            
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updateCiudad")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCiudad(@FormParam("datosCiudad") @DefaultValue("") String datosCiudad) {
        String out = null;
        Ciudad s = null;
        CiudadController cp = null;
        Gson gson = new Gson();
        try {
            cp = new CiudadController();
            s = gson.fromJson(datosCiudad, Ciudad.class);
            cp.updateCiudad(s);
            System.out.println(datosCiudad);
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

    @Path("deleteCiudad")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCiudad(@FormParam("idCiudad") int idCiudad) {
        String out;
        CiudadController cp = new CiudadController();
        try {
            cp.deleteCiudad(idCiudad);
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
