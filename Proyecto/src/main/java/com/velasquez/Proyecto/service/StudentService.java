package com.velasquez.Proyecto.service;

import com.velasquez.Proyecto.model.Student;
import com.velasquez.Proyecto.repository.SRepository;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@ToString
@Service
@RequiredArgsConstructor
public class StudentService implements SService {

    private final SRepository repo;

    @Override
    public List<Student> getAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Student> getById( Long id ) {
        return repo.findById( id );
    }

    @Override
    public Student save( Student s ) {
        boolean correoExistente = repo.findAll().stream().anyMatch(e -> e.getCorreo().equalsIgnoreCase(s.getCorreo()));

        if ( correoExistente ) {
            throw new IllegalArgumentException( "El estudiante con este correo ya está registrado");
        }
        return repo.save( s );
    }

    @Override
    public Student update( Long id, Student s ) {
        if (!repo.existsById( id )) {
            throw new IllegalArgumentException("No existe estudiante con ID" + id);
        }
        s.setId( id );
        return repo.save( s );
    }

    @Override
    public void delete( Long id ) {
        if (!repo.existsById( id )) {
            throw new IllegalArgumentException("No existe estudiante con ID" + id);
        }
        repo.deleteById( id );
    }

}