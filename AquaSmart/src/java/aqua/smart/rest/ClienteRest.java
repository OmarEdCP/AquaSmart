
package aqua.smart.rest;

import aqua.smart.controller.ClienteController;
import aqua.smart.model.Cliente;
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

@Path("cliente")
public class ClienteRest extends Application{
        
       @Path("insertCliente")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCiudad(@FormParam("datosCliente") @DefaultValue("") String cliente) {
        try {
            Gson gson = new Gson();
            ClienteController cp = new ClienteController();
            Cliente c = gson.fromJson(cliente, Cliente.class);
             cp.insertCliente(c);
            String out = gson.toJson(c);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    
    @Path("getAllCliente")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCliente(@QueryParam("id") @DefaultValue("0") int id) {
        List<Cliente> lista = null;
        Gson gson = new Gson();
        String out = null;
        ClienteController cs = null;
        try {
            cs = new ClienteController();
            lista = cs.getAllCliente();
            
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updateCliente")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCliente(@FormParam("datosCliente") @DefaultValue("") String datosCliente) {
        String out = null;
        Cliente s = null;
        ClienteController cp = null;
        Gson gson = new Gson();
        try {
            cp = new ClienteController();
            s = gson.fromJson(datosCliente, Cliente.class);
            cp.updateCliente(s);
            System.out.println(datosCliente);
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

    @Path("deleteCliente")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCliente(@FormParam("idCliente") int idCliente) {
        String out;
        ClienteController cp = new ClienteController();
        try {
            cp.deleteCliente(idCliente);
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
