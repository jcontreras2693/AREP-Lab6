package co.edu.eci;

import co.edu.eci.controller.PropertyController;
import co.edu.eci.model.Property;
import co.edu.eci.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PropertyControllerTest {

    @Mock
    private PropertyService propertyService;

    @InjectMocks
    private PropertyController propertyController;

    private Property property;
    private Property property2;
    private Property propertyDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        property = new Property();
        property.setId(1L);
        property.setAddress("Calle 123");
        property.setPrice(200000000);
        property.setSize(150);
        property.setDescription("Casa en Bogotá");

        property2 = new Property();
        property2.setId(2L);
        property2.setAddress("Carrera 456");
        property2.setPrice(150000000);
        property2.setSize(120);
        property2.setDescription("Apartamento en Medellín");

        propertyDetails = new Property();
        propertyDetails.setAddress("Calle 456");
        propertyDetails.setPrice(250000000);
        propertyDetails.setSize(200);
        propertyDetails.setDescription("Casa amplia en Bogotá");
    }

    @Test
    void testGetAllProperties() {
        List<Property> properties = Arrays.asList(property, property2);

        when(propertyService.getAllProperties()).thenReturn(properties);

        List<Property> result = propertyController.getAllProperties();

        assertEquals(2, result.size());
        assertEquals("Calle 123", result.get(0).getAddress());
        assertEquals("Carrera 456", result.get(1).getAddress());
        verify(propertyService, times(1)).getAllProperties();
    }



    @Test
    void testGetPropertyById() {
        when(propertyService.getPropertyById(1L)).thenReturn(property);

        Property result = propertyController.getPropertyById(1L);

        assertNotNull(result);
        assertEquals("Calle 123", result.getAddress());
        assertEquals(200000000, result.getPrice());
        verify(propertyService, times(1)).getPropertyById(1L);
    }

    @Test
    void testCreateProperty() {
        Property property = new Property();
        property.setId(1L);
        property.setAddress("Calle 123");
        property.setPrice(200000000);
        property.setSize(150);
        property.setDescription("Casa en Bogotá");

        when(propertyService.createProperty(property)).thenReturn(property);

        ResponseEntity<Property> response = propertyController.createProperty(property);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Calle 123", response.getBody().getAddress());
        verify(propertyService, times(1)).createProperty(property);
    }

    @Test
    void testUpdateProperty() {
        Property updatedProperty = new Property();
        updatedProperty.setId(1L);
        updatedProperty.setAddress("Calle 456");
        updatedProperty.setPrice(250000000);
        updatedProperty.setSize(200);
        updatedProperty.setDescription("Casa amplia en Bogotá");

        when(propertyService.updateProperty(1L, propertyDetails)).thenReturn(updatedProperty);

        ResponseEntity<Property> response = propertyController.updateProperty(1L, propertyDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Calle 456", response.getBody().getAddress());
        assertEquals(250000000, response.getBody().getPrice());
        verify(propertyService, times(1)).updateProperty(1L, propertyDetails);
    }

    @Test
    void testUpdateProperty_NotFound() {
        doThrow(new RuntimeException("Property not found")).when(propertyService).updateProperty(1L, propertyDetails);

        ResponseEntity<Property> response = propertyController.updateProperty(1L, propertyDetails);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(propertyService, times(1)).updateProperty(1L, propertyDetails);
    }

    @Test
    void testDeleteProperty() {
        doNothing().when(propertyService).deleteProperty(1L);

        ResponseEntity<Void> response = propertyController.deleteProperty(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(propertyService, times(1)).deleteProperty(1L);
    }

    @Test
    void testDeleteProperty_NotFound() {
        doThrow(new RuntimeException("Property not found")).when(propertyService).deleteProperty(1L);

        ResponseEntity<Void> response = propertyController.deleteProperty(1L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(propertyService, times(1)).deleteProperty(1L);
    }
}