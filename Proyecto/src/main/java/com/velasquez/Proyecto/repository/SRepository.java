package com.velasquez.Proyecto.repository;

import com.velasquez.Proyecto.model.Student;
import java.util.List;
import java.util.Optional;

public interface SRepository {
    List< Student > findAll();
    Optional< Student > findById( Long id );
    Optional< Student > findByCorreo( String correo );
    Student save( Student s );
    void deleteById( Long id );
    boolean existsById( Long id);
}
