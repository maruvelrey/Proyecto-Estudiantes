package com.velasquez.Proyecto.service;

import com.velasquez.Proyecto.model.Student;
import java.util.List;
import java.util.Optional;

public interface SService {
    List< Student > getAll();
    Optional< Student > getById( Long id );
    Student save( Student s );
    Student update( Long id, Student s );
    void delete( Long id );
}
