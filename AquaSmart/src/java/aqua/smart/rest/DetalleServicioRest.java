
package aqua.smart.rest;

import aqua.smart.controller.DetalleServicioController;
import aqua.smart.model.DetalleServicio;
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

@Path("detalle")
public class DetalleServicioRest extends Application{
    
    @Path("insertDetalle")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertDetalle(@FormParam("datosDetalle") @DefaultValue("") String detalle) {
        try {
            Gson gson = new Gson();
            DetalleServicioController sc = new DetalleServicioController();
            DetalleServicio s = gson.fromJson(detalle, DetalleServicio.class);
            sc.insertDetalleServicio(s);
            String out = gson.toJson(s);
            return Response.status(Response.Status.CREATED).entity(out).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }
    }
    @Path("getAllDetalle")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllDetalle(@QueryParam("id") @DefaultValue("0") int id){
        List<DetalleServicio> lista=null;
        Gson gson = new Gson();
        String out=null;
        DetalleServicioController sc=null;
        try{
            sc= new DetalleServicioController();
            lista=sc.getAllDetalleServicio();
            out =gson.toJson(lista);
        }catch(Exception e){
            e.printStackTrace();
              out="""
                  {"result":"Error de servidor"}
                  """;      
        }
        return Response.ok(out).build();
        
    }
    
    @Path("updateDetalle")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateDetalle(@FormParam("datosDetalle") @DefaultValue(" ") String detalle){
      String out=null;
      DetalleServicio s= null;
      DetalleServicioController sc=null;
      Gson gson =new Gson();
      System.out.println("Datos recibidos: " + detalle);
      try{
          sc=new DetalleServicioController();
          s=gson.fromJson(detalle,DetalleServicio.class);
          sc.updateDetalle(s);
          System.out.println(detalle);
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
    
     @Path("deleteDetalle")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteDetalle(@FormParam("idDetalle") int idDetalle) {
        String out;
        DetalleServicioController sc = new DetalleServicioController();
        try {
            sc.deleteDetalle(idDetalle);
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
