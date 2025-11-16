package com.velasquez.Proyecto.controller;

import com.velasquez.Proyecto.model.Student;
import com.velasquez.Proyecto.service.SService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@lombok.ToString
@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/students")
public class StudentController {

    private final SService service;

    @GetMapping
    public List< Student > getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity< Object > getById(@PathVariable Long id) {
        return service.getById( id ).<ResponseEntity< Object >>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(404).body(Map.of("error", "Estudiante no encontrado")));
    }

    @PostMapping
    public ResponseEntity< Object > createStudent(@RequestBody Student s) {
        try {
            Student saved = service.save( s );
            return ResponseEntity.ok( saved );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity< Object > updateStudent(@PathVariable Long id, @RequestBody Student s) {
        try {
            Student updated = service.update( id, s );
            return ResponseEntity.ok( updated );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity< Object > deleteStudent(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(Map.of("message", "Estudiante eliminado con éxito"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}