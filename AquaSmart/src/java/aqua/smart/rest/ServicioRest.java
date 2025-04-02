
package aqua.smart.rest;

import aqua.smart.controller.ServicioController;
import aqua.smart.model.Servicio;
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

@Path("servicio")
public class ServicioRest {

    @Path("insertServicio")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertServicio(@FormParam("datosServicio") @DefaultValue("") String servicio) {
        try {
            Gson gson = new Gson();
            ServicioController sc = new ServicioController();
            Servicio s = gson.fromJson(servicio, Servicio.class);
            sc.insertServicio(s);
            String out = gson.toJson(s);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    @Path("getAllServicio")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllServicio(@QueryParam("id") @DefaultValue("0") int id){
        List<Servicio> lista=null;
        Gson gson = new Gson();
        String out=null;
        ServicioController sc=null;
        try{
            sc= new ServicioController();
            lista=sc.getAllServicio();
            out =gson.toJson(lista);
        }catch(Exception e){
            e.printStackTrace();
              out="""
                  {"result":"Error de servidor"}
                  """;      
        }
        return Response.ok(out).build();
        
    }
    
    @Path("updateServicio")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateServicio(@FormParam("datosServicio") @DefaultValue(" ") String datosServicio){
      String out=null;
      Servicio s= null;
      ServicioController sc=null;
      Gson gson =new Gson();
      System.out.println("Datos recibidos: " + datosServicio);
      try{
          sc=new ServicioController();
          s=gson.fromJson(datosServicio,Servicio.class);
          sc.update(s);
          System.out.println(datosServicio);
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
    
     @Path("deleteServicio")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteLectura(@FormParam("idServicio") int idServicio) {
        String out;
        ServicioController sc = new ServicioController();
        try {
            sc.delete(idServicio);
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
