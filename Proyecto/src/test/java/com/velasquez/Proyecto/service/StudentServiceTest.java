package com.velasquez.Proyecto.service;

import com.velasquez.Proyecto.model.Student;
import com.velasquez.Proyecto.repository.SRepository;
import com.velasquez.Proyecto.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class StudentServiceTest {

    private SService service;
    private SRepository repo;

    @BeforeEach
    public void before() {
        repo = new StudentRepository();
        service = new StudentService( repo );
    }

    @Test
    @DisplayName("Debe agregar un nuevo estudiante correctamente")
    public void testAgregarEstudiante() {
        Student s = new Student(null,"Mariana","Velásquez","mariana@test.com","1234567890","Español");
        Student guardado = service.save( s );

        assertNotNull( guardado.getId() );
        assertEquals( "Mariana", guardado.getNombre() );
        assertTrue( service.getAll().size() > 0 );
    }

    @Test
    @DisplayName("Debe evitar agregar estudiantes con correos duplicados")
    public void testCorreoDuplicado() {
        Student s1 = new Student(null, "Mariana","Velásquez","mari@test.com","1234567890","Español");
        Student s2 = new Student(null, "Pedro","Perez","mari@test.com","9876543210","Inglés");

        service.save( s1 );
        Exception e = assertThrows( IllegalArgumentException.class, () -> service.save( s2 ));
        assertEquals("El estudiante con este correo ya está registrado",e.getMessage() );
    }

    @Test
    @DisplayName("Debe obtener un estudiante por ID")
    public void testObtenerPorId() {
        Student s = service.save(new Student(null, "Franco","Colapinto","fran@test.com","1112223333","Francés"));
        Optional< Student > encontrado = service.getById(s.getId());

        assertTrue( encontrado.isPresent() );
        assertEquals("Franco", encontrado.get().getNombre() );
    }

    @Test
    @DisplayName("Debe actualizar un estudiante existente")
    public void testActualizar() {
        Student s = service.save(new Student(null, "Amelia","Reyes","amelia@test.com","1112223333","Español"));
        Student modificado = new Student(null, "Ana Amelia","Reyes","amelia@test.com","1112223333","Francés");
        Student actualizado = service.update( s.getId(), modificado);

        assertEquals("Ana Amelia", actualizado.getNombre() );
        assertEquals("Francés", actualizado.getIdioma() );
    }


    @Test
    @DisplayName("Debe eliminar un estudiante por ID")
    public void testEliminarEstudiante() {
        Student s = service.save(new Student(null, "Max","Verstappen","max@test.com","3333333333","Inglés"));
        service.delete(s.getId());;

        List< Student > lista = service.getAll();
        assertTrue( lista.isEmpty() );
    }

    @Test
    public void testToString() {
        Student s = new Student( null, "Mariana","Velásquez", "mariana@test.com", "1234567890", "Español");
        String esperado = "Student(id=null, nombre=Mariana, apellido=Velásquez, correo=mariana@test.com, numeroTelefono=1234567890, idioma=Español)";
        String obtenido = s.toString();
        assertEquals( esperado, obtenido );
    }
}
