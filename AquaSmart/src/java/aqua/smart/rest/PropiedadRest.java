/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aqua.smart.rest;

import aqua.smart.controller.PropiedadController;
import aqua.smart.model.Propiedad;
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

@Path("propiedad")
public class PropiedadRest {

    @Path("insertPropiedad")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertPropiedad(@FormParam("datosPropiedad") @DefaultValue(" ") String propiedad) {
        try {
            Gson gson = new Gson();
            PropiedadController pc = new PropiedadController();
            Propiedad pro = gson.fromJson(propiedad, Propiedad.class);
            pc.insertPropiedad(pro);
            String out = gson.toJson(pro);
            return Response.status(Response.Status.CREATED).entity(out).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error en el servidor\"}")
                    .build();
        }

    }
    
       @Path("getAllPropiedad")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPropiedad(@QueryParam("id") @DefaultValue("0") int id){
        List<Propiedad> lista=null;
        Gson gson = new Gson();
        String out=null;
        PropiedadController pc=null;
        try{
            pc= new PropiedadController();
            lista=pc.getAllPropiedad();
            out =gson.toJson(lista);
        }catch(Exception e){
            e.printStackTrace();
              out="""
                  {"result":"Error de servidor"}
                  """;      
        }
        return Response.ok(out).build();
        
    }
    
    
       @Path("updatePropiedad")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateServicio(@FormParam("datosPropiedad") @DefaultValue(" ") String datosPropiedad){
      String out=null;
      Propiedad p= null;
      PropiedadController pc=null;
      Gson gson =new Gson();
      try{
          pc=new PropiedadController();
          p=gson.fromJson(datosPropiedad,Propiedad.class);
          pc.update(p);
          System.out.println(datosPropiedad);
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
    @Path("deletePropiedad")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteLectura(@FormParam("idPropiedad") int idPropiedad) {
        String out;
        PropiedadController pc = new PropiedadController();
        try {
            pc.delete(idPropiedad);
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
