
package aqua.smart.rest;

import aqua.smart.controller.PersonaController;
import aqua.smart.model.Persona;
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

@Path("persona")
public class PersonaRest extends Application{
        
    @Path("insertPersona")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertCiudad(@FormParam("datosPersona") @DefaultValue("") String persona) {
        try {
            Gson gson = new Gson();
            PersonaController pc = new PersonaController();
            Persona p = gson.fromJson(persona, Persona.class);
             pc.insertPersona(p);
            String out = gson.toJson(p);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    
    @Path("getAllPersona")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPersona(@QueryParam("id") @DefaultValue("0") int id) {
        List<Persona> lista = null;
        Gson gson = new Gson();
        String out = null;
        PersonaController pc = null;
        try {
            pc = new PersonaController();
            lista = pc.getAllPersona();
            
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }
    
    @Path("updatePersona")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePersona(@FormParam("datosPersona") @DefaultValue("") String datosPersona) {
        String out = null;
        Persona p = null;
        PersonaController pc = null;
        Gson gson = new Gson();
        try {
            pc = new PersonaController();
            p = gson.fromJson(datosPersona, Persona.class);
            pc.updatePersona(p);
            System.out.println(datosPersona);
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

    @Path("deletePersona")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePersona(@FormParam("idPersona") int idPersona) {
        String out;
         PersonaController pc = new PersonaController();
        try {
            pc.deletePersona(idPersona);
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
