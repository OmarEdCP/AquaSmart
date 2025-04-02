
package aqua.smart.model;

public class Cargo {
    
private int idCargo;
private String nombreCargo;
private String descripcion;

    public Cargo() {
    }

    public Cargo(int idCargo, String nombreCargo, String descripcion) {
        this.idCargo = idCargo;
        this.nombreCargo = nombreCargo;
        this.descripcion = descripcion;
    }

    public int getIdCargo() {
        return idCargo;
    }

    public void setIdCargo(int idCargo) {
        this.idCargo = idCargo;
    }

    public String getNombreCargo() {
        return nombreCargo;
    }

    public void setNombreCargo(String nombreCargo) {
        this.nombreCargo = nombreCargo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }


}
