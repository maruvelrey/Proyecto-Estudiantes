package com.velasquez.Proyecto.repository;

import com.velasquez.Proyecto.model.Student;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@lombok.ToString
@Repository
public class StudentRepository implements SRepository {

    private final List<Student> lista = new ArrayList<>();

    private Long getNextId() {
        long id = 1L;

        while (existsById(id)) {
            id++;
        }

        return id;
    }


    @Override
    public Student save(Student s) {

        if (s.getId() == null) {
            s.setId(getNextId());
        }

        lista.removeIf(e -> e.getId().equals(s.getId()));

        lista.add(s);
        return s;
    }


    @Override
    public List<Student> findAll() {
        return lista;
    }


    @Override
    public Optional<Student> findById(Long id) {
        return lista.stream().filter(e -> e.getId().equals(id)).findFirst();
    }


    @Override
    public void deleteById(Long id) {
        lista.removeIf(e -> e.getId().equals(id));
    }


    @Override
    public boolean existsById(Long id) {
        return lista.stream().anyMatch(e -> e.getId().equals(id));
    }

    @Override
    public Optional<Student> findByCorreo(String correo) {
        return lista.stream()
                .filter(e -> e.getCorreo().equalsIgnoreCase(correo))
                .findFirst();
    }
}
