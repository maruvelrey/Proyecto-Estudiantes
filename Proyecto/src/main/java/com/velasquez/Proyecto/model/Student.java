package com.velasquez.Proyecto.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@lombok.ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
    private String numeroTelefono;
    private String idioma;
}
