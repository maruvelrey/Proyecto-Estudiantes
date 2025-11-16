package com.velasquez.Proyecto.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.velasquez.Proyecto.model.Student;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;


    @Test
    @DisplayName("POST /students")
    public void testCrearEstudiante() throws Exception {
        Student s = new Student( null, "Mariana","Velásquez", "mariana@test.com", "1234567890", "Español");
        String json = mapper.writeValueAsString( s );
        String response = mockMvc.perform(post("/students")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(json))
                       .andExpect(status().isOk())
                       .andExpect(jsonPath("$.id", notNullValue()))
                       .andReturn()
                       .getResponse()
                       .getContentAsString();
        Student creado = mapper.readValue( response, Student.class );

        assertEquals( "Mariana", creado.getNombre() );
    }

    @Test
    @DisplayName("GET /students -> debe volver lista vacía o con datos")
    public void testLista() throws Exception {
        String response = mockMvc.perform(get("/students"))
                        .andExpect(status().isOk())
                        .andReturn()
                        .getResponse()
                        .getContentAsString();

        assertNotNull( response );
        assertTrue( response.contains("[") || response.contains("]") );
    }

    @Test
    @DisplayName("DELETE /students")
    public void testEliminarEstudiante() throws Exception {
        Student s = new Student(null, "Amelia","Recinos", "amelia@test.com", "3333333333", "Inglés");
        String json = mapper.writeValueAsString( s );
        String respuesta = mockMvc.perform(post("/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                        .andReturn().getResponse().getContentAsString();
        Student creado = mapper.readValue( respuesta, Student.class );

        mockMvc.perform(delete("/students/" + creado.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("éxito")));
    }

    @Test
    public void testToString() {
        Student s = new Student( null, "Mariana","Velásquez", "mariana@test.com", "1234567890", "Español");
        String esperado = "Student(id=null, nombre=Mariana, apellido=Velásquez, correo=mariana@test.com, numeroTelefono=1234567890, idioma=Español)";
        String obtenido = s.toString();
        assertEquals( esperado, obtenido );
    }
}