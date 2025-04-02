
package aqua.smart.model;

public class Ciudad {
private int idCiudad;
private String nombre;
private Estado estado;

    public Ciudad() {
    }

    public Ciudad(int idCiudad, String nombre, Estado estado) {
        this.idCiudad = idCiudad;
        this.nombre = nombre;
        this.estado = estado;
    }

    public int getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(int idCiudad) {
        this.idCiudad = idCiudad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }


}
