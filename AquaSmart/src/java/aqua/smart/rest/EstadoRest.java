package aqua.smart.rest;

import aqua.smart.controller.EstadoController;
import aqua.smart.model.Estado;
import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("estado")
public class EstadoRest extends Application {

    @Path("getAllEstado")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllEstado() {
        Gson gson = new Gson();
        try {
            EstadoController cs = new EstadoController();
            List<Estado> lista = cs.getAllEstado();
            return Response.ok(gson.toJson(lista)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error de servidor\"}")
                    .build();
        }
    }

    @Path("insertEstado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response insertEstado(@FormParam("datosEstado") @DefaultValue("") String datosEstado) {
        if (datosEstado == null || datosEstado.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"El campo datosEstado no puede estar vacío\"}")
                    .build();
        }

        try {
            Gson gson = new Gson();
            Estado estado = gson.fromJson(datosEstado, Estado.class);
            EstadoController ec = new EstadoController();
            ec.insertEstado(estado);
            return Response.status(Response.Status.CREATED).entity(gson.toJson(estado)).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error al insertar el estado\"}")
                    .build();
        }
    }

    @Path("updateEstado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateEstado(@FormParam("datosEstado") @DefaultValue("") String datosEstado) {
        if (datosEstado == null || datosEstado.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"El campo datosEstado no puede estar vacío\"}")
                    .build();
        }

        try {
            Gson gson = new Gson();
            Estado estado = gson.fromJson(datosEstado, Estado.class);
            EstadoController ec = new EstadoController();
            ec.updateEstado(estado);
            return Response.ok("{\"result\":\"Estado actualizado correctamente\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Error al actualizar el estado\"}")
                    .build();
        }
    }

    @Path("deleteEstado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteEstado(@FormParam("idEstado") int idEstado) {
        if (idEstado <= 0) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"ID inválido\"}")
                    .build();
        }

        EstadoController ec = new EstadoController();
        ec.deleteEstado(idEstado);
        return Response.ok("{\"result\":\"Estado eliminado correctamente\"}").build();
    }
}
