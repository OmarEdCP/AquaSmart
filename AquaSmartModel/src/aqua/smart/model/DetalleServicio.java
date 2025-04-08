
package aqua.smart.model;

import java.sql.Timestamp;

public class DetalleServicio {
    private int idDetalle;
    private String descripcion;
    private Timestamp fecha;
    private int estatus;
    private Cliente cliente;
    private Lectura lectura;
    private Servicio servicio;
    private Ticket ticket;

    public DetalleServicio() {
    }

    public DetalleServicio(int idDetalle, String descripcion, Timestamp fecha, int estatus, Cliente cliente, Lectura lectura, Servicio servicio, Ticket ticket) {
        this.idDetalle = idDetalle;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.estatus = estatus;
        this.cliente = cliente;
        this.lectura = lectura;
        this.servicio = servicio;
        this.ticket = ticket;
    }

    public int getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(int idDetalle) {
        this.idDetalle = idDetalle;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public int getEstatus() {
        return estatus;
    }

    public void setEstatus(int estatus) {
        this.estatus = estatus;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Lectura getLectura() {
        return lectura;
    }

    public void setLectura(Lectura lectura) {
        this.lectura = lectura;
    }

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }
    
    
}
