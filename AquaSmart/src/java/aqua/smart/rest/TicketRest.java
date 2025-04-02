
package aqua.smart.rest;

import aqua.smart.controller.TicketController;
import aqua.smart.model.Ticket;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
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

   @Path("ticket")
public class TicketRest {
    
    @Path("insertTicket")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertServicio(@FormParam("datosTicket") @DefaultValue("") String ticket) {
        try {
            Gson gson = new Gson();
            TicketController tc = new TicketController();
            Ticket t = gson.fromJson(ticket, Ticket.class);
            tc.insertTicket(t);
            String out = gson.toJson(t);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
      @Path("getAllTicket")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTicket(@QueryParam("id") @DefaultValue("0") int id){
        List<Ticket> lista=null;
        Gson gson = new Gson();
        String out=null;
        TicketController tc=null;
        try{
            tc= new TicketController();
            lista=tc.getAllTicket();
            out =gson.toJson(lista);
        }catch(Exception e){
            e.printStackTrace();
              out="""
                  {"result":"Error de servidor"}
                  """;      
        }
        return Response.ok(out).build();
        
    }
    
      @Path("updateTicket")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTicket(@FormParam("datosTicket") @DefaultValue(" ") String datosTicket){
      String out=null;
      Ticket s= null;
      TicketController sc=null;
      Gson gson =new Gson();
      try{
          sc=new TicketController();
          s=gson.fromJson(datosTicket,Ticket.class);
          sc.update(s);
          System.out.println(datosTicket);
          out="""
              {"result":"Cambios Realizados"}
              """;
      }catch(Exception e){
          e.printStackTrace();
          out="""
              {"result":"Error de Servidor"}
              """;
      }
        return Response.ok(out).build();
        
    }
    
      @Path("deleteTicket")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteLectura(@FormParam("idTicket") int idTicket) {
        String out;
        TicketController tc = new TicketController();
        try {
            tc.delete(idTicket);
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
