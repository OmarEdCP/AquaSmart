
package aqua.smart.model;

import java.sql.Timestamp;

public class Ticket {
    private int idTicket;
    private Timestamp fecha;
    private Double total;
    private Double subtotal;
    private int estatus;
    private Cliente cliente;
    private Empleado empleado;
    private Tarjeta numTarjeta;

    public Ticket() {
    }

    public Ticket(int idTicket, Timestamp fecha, Double total, Double subtotal, int estatus, Cliente cliente, Empleado empleado, Tarjeta numTarjeta) {
        this.idTicket = idTicket;
        this.fecha = fecha;
        this.total = total;
        this.subtotal = subtotal;
        this.estatus = estatus;
        this.cliente = cliente;
        this.empleado = empleado;
        this.numTarjeta = numTarjeta;
    }

    public int getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(int idTicket) {
        this.idTicket = idTicket;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
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

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Tarjeta getNumTarjeta() {
        return numTarjeta;
    }

    public void setNumTarjeta(Tarjeta numTarjeta) {
        this.numTarjeta = numTarjeta;
    }

    
    
}
