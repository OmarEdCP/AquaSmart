
package aqua.smart.rest;

import aqua.smart.controller.ClienteController;
import aqua.smart.controller.EmpleadoController;
import aqua.smart.model.Cliente;
import aqua.smart.model.Empleado;
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

@Path("empleado")
public class EmpleadoRest extends Application{
            
       @Path("insertEmpleado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertEmpleado(@FormParam("datosEmpleado") @DefaultValue("") String empleado) {
        try {
            Gson gson = new Gson();
            EmpleadoController cp = new EmpleadoController();
            Empleado c = gson.fromJson(empleado, Empleado.class);
             cp.insertEmpleado(c);
            String out = gson.toJson(c);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    
    @Path("getAllEmpleado")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllEmpleado(@QueryParam("id") @DefaultValue("0") int id) {
        List<Empleado> lista = null;
        Gson gson = new Gson();
        String out = null;
        EmpleadoController cs = null;
        try {
            cs = new EmpleadoController();
            lista = cs.getAllEmpleado();
            
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updateEmpleado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEmpleado(@FormParam("datosEmpleado") @DefaultValue("") String datosEmpleado) {
        String out = null;
        Empleado s = null;
        EmpleadoController cp = null;
        Gson gson = new Gson();
        try {
            cp = new EmpleadoController();
            s = gson.fromJson(datosEmpleado, Empleado.class);
            cp.updateEmpleado(s);
            System.out.println(datosEmpleado);
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

    @Path("deleteEmpleado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteCliente(@FormParam("idEmpleado") int idEmpleado) {
        String out;
        EmpleadoController cp = new EmpleadoController();
        try {
            cp.deleteEmpleado(idEmpleado);
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
