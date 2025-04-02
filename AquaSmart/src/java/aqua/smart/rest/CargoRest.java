
package aqua.smart.rest;

import aqua.smart.controller.CargoController;
import aqua.smart.model.Cargo;
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

@Path("cargo")
public class CargoRest extends Application{
    
    @Path("insertCargo")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCargo(@FormParam("datosCargo") @DefaultValue("") String cargo) {
        try {
            Gson gson = new Gson();
            CargoController cp = new CargoController();
            Cargo c = gson.fromJson(cargo, Cargo.class);
             cp.insertCargo(c);
            String out = gson.toJson(c);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (JsonSyntaxException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    
    @Path("getAllCargo")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCargo(@QueryParam("id") @DefaultValue("0") int id) {
        List<Cargo> lista = null;
        Gson gson = new Gson();
        String out = null;
        CargoController cs = null;
        try {
            cs = new CargoController();
            lista = cs.getAllCargo();
            
            out = gson.toJson(lista);
        } catch (SQLException e) {
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updateCargo")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCargo(@FormParam("datosCargo") @DefaultValue("") String datosCargo) {
        String out = null;
        Cargo s = null;
        CargoController cp = null;
        Gson gson = new Gson();
        try {
            cp = new CargoController();
            s = gson.fromJson(datosCargo, Cargo.class);
            cp.updateCargo(s);
            System.out.println(datosCargo);
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

    @Path("deleteCargo")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCargo(@FormParam("idCargo") int idCargo) {
        String out;
        CargoController cp = new CargoController();
        try {
            cp.deleteCargo(idCargo);
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
