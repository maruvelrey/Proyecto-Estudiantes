package com.velasquez.Proyecto.model;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class StudentTest {

    @Test
    public void testSetAndGetValues() {
        Student s = new Student();
        s.setId(1L);
        s.setNombre("Montse");
        s.setApellido("Recinos");
        s.setCorreo("montse@test.com");
        s.setNumeroTelefono("1234567890");
        s.setIdioma("español");

        assertThat(s.getId()).isEqualTo(1L);
        assertThat(s.getNombre()).isEqualTo("Montse");
        assertThat(s.getApellido()).isEqualTo("Recinos");
        assertThat(s.getCorreo()).isEqualTo("montse@test.com");
        assertThat(s.getNumeroTelefono()).isEqualTo("1234567890");
        assertThat(s.getIdioma()).isEqualTo("español");
    }

    @Test
    public void testToString() {
        Student s = new Student( null, "Mariana","Velásquez", "mariana@test.com", "1234567890", "Español");
        String esperado = "Student(id=null, nombre=Mariana, apellido=Velásquez, correo=mariana@test.com, numeroTelefono=1234567890, idioma=Español)";
        String obtenido = s.toString();
        assertEquals( esperado, obtenido );
    }
}