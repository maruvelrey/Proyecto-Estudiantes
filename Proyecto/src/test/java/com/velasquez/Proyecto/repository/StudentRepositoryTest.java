package com.velasquez.Proyecto.repository;

import com.velasquez.Proyecto.model.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

class StudentRepositoryTest {

    private SRepository repo;

    @BeforeEach
    void before() {
        repo = new StudentRepository();
    }

    @Test
    @DisplayName("Debe guardar un estudiante correctamente")
    public void testGuardar() {
        Student s = new Student(null,"Mariana","Velásquez","mari@test.com","1234567890","Español");
        Student guardado = repo.save( s );

        assertNotNull( guardado.getId() );
        assertEquals( "Mariana", guardado.getNombre() );
        assertTrue( repo.existsById(guardado.getId()) );
    }

    @Test
    @DisplayName("Debe obtener estudiante por ID")
    public void testFindById() {
        Student s = repo.save( new Student(null,"Amelia","Recinos","ame@test.com","1234567890","Inglés") );
        Optional< Student > encontrado = repo.findById( s.getId() );

        assertTrue( encontrado.isPresent() );
        assertEquals("Amelia", encontrado.get().getNombre() );
    }

    @Test
    @DisplayName("Debe eliminar estudiante por ID")
    public void testEliminar() {
        Student s = repo.save( new Student(null,"Franco","Colapinto","franco@test.com","1234567890","Francés") );
        Long id = s.getId();
        repo.deleteById( id );
        assertFalse( repo.existsById( id ) );
    }

    @Test
    @DisplayName("Debe encontrar estudiante por correo")
    public void testFindByCorreo() {
        repo.save( new Student(null,"Max","Verstappen","max@test.com","1234567890","Inglés") );
        Optional< Student > encontrado = repo.findByCorreo("max@test.com");

        assertTrue( encontrado.isPresent() );
        assertEquals("Max", encontrado.get().getNombre());
    }

    @Test
    @DisplayName("Debe listar todos los estudiantes")
    public void testFindAll() {
        repo.save( new Student(null,"Montse","Recinos","montse@test.com","1234567890","Español") );
        repo.save( new Student(null,"María","García","maria@test.com","1234567890","Inglés") );
        List< Student > lista = repo.findAll();

        assertNotNull( lista );
        assertTrue( lista.size() >= 2 );
    }

    @Test
    public void testToString() {
        Student s = new Student( null, "Mariana","Velásquez", "mariana@test.com", "1234567890", "Español");
        String esperado = "Student(id=null, nombre=Mariana, apellido=Velásquez, correo=mariana@test.com, numeroTelefono=1234567890, idioma=Español)";
        String obtenido = s.toString();
        assertEquals( esperado, obtenido );
    }

    @Test
    public void testReciclarId() {
        StudentRepository repo = new StudentRepository();

        Student s1 = new Student( null, "Mariana","Velásquez", "mariana@test.com", "1234567890", "Español");
        Student s2 = new Student( null, "Perlita","Ostorga", "perlita@test.com", "0987654321", "Español");
        Student s3 = new Student( null, "Victoria","García", "vicky@test.com", "1029384756", "Español");

        assertEquals(null,s1.getId());
        assertEquals(null,s2.getId());
        assertEquals(null,s3.getId());

        repo.deleteById(null);

        Student nuevo = repo.save(new Student( null, "Nohemi","Monroy", "nohe@test.com", "5674321678", "Inglés"));

        assertEquals(1L, nuevo.getId(), "El ID 2 debería reutilizarse");
        assertFalse( repo.existsById(null));
        assertFalse( repo.existsById(null));
    }
}