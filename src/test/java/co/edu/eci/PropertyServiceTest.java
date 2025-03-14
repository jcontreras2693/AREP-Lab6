package co.edu.eci;

import co.edu.eci.model.Property;
import co.edu.eci.repository.PropertyRepository;
import co.edu.eci.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @InjectMocks
    private PropertyService propertyService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllProperties() {
        // Arrange
        Property property1 = new Property();
        property1.setId(1L);
        property1.setAddress("Calle 123");
        property1.setPrice(100000.0);
        property1.setSize(120.0);
        property1.setDescription("Casa grande");

        Property property2 = new Property();
        property2.setId(2L);
        property2.setAddress("Avenida 456");
        property2.setPrice(200000.0);
        property2.setSize(150.0);
        property2.setDescription("Apartamento moderno");

        List<Property> properties = Arrays.asList(property1, property2);

        when(propertyRepository.findAll()).thenReturn(properties);

        // Act
        List<Property> result = propertyService.getAllProperties();

        // Assert
        assertEquals(2, result.size());
        verify(propertyRepository, times(1)).findAll();
    }

    @Test
    void getPropertyById() {
        // Arrange
        Property property = new Property();
        property.setId(1L);
        property.setAddress("Calle 123");
        property.setPrice(100000.0);
        property.setSize(120.0);
        property.setDescription("Casa grande");

        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));

        // Act
        Property result = propertyService.getPropertyById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Calle 123", result.getAddress());
        verify(propertyRepository, times(1)).findById(1L);
    }

    @Test
    void getPropertyById_NotFound() {
        // Arrange
        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Property result = propertyService.getPropertyById(1L);

        // Assert
        assertNull(result);
        verify(propertyRepository, times(1)).findById(1L);
    }

    @Test
    void createProperty() {
        // Arrange
        Property property = new Property();
        property.setId(1L);
        property.setAddress("Calle 123");
        property.setPrice(100000.0);
        property.setSize(120.0);
        property.setDescription("Casa grande");

        when(propertyRepository.save(property)).thenReturn(property);

        // Act
        Property result = propertyService.createProperty(property);

        // Assert
        assertNotNull(result);
        assertEquals("Casa grande", result.getDescription());
        verify(propertyRepository, times(1)).save(property);
    }

    @Test
    void updateProperty() {
        // Arrange
        Property existingProperty = new Property();
        existingProperty.setId(1L);
        existingProperty.setAddress("Calle 123");
        existingProperty.setPrice(100000.0);
        existingProperty.setSize(120.0);
        existingProperty.setDescription("Casa grande");

        Property updatedProperty = new Property();
        updatedProperty.setAddress("Avenida 456");
        updatedProperty.setPrice(200000.0);
        updatedProperty.setSize(150.0);
        updatedProperty.setDescription("Apartamento moderno");

        when(propertyRepository.findById(1L)).thenReturn(Optional.of(existingProperty));
        when(propertyRepository.save(existingProperty)).thenReturn(existingProperty);

        // Act
        Property result = propertyService.updateProperty(1L, updatedProperty);

        // Assert
        assertNotNull(result);
        assertEquals("Avenida 456", result.getAddress());
        assertEquals(200000.0, result.getPrice());
        verify(propertyRepository, times(1)).findById(1L);
        verify(propertyRepository, times(1)).save(existingProperty);
    }

    @Test
    void updateProperty_NotFound() {
        // Arrange
        Property updatedProperty = new Property();
        updatedProperty.setAddress("Avenida 456");
        updatedProperty.setPrice(200000.0);
        updatedProperty.setSize(150.0);
        updatedProperty.setDescription("Apartamento moderno");

        when(propertyRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Property result = propertyService.updateProperty(1L, updatedProperty);

        // Assert
        assertNull(result);
        verify(propertyRepository, times(1)).findById(1L);
        verify(propertyRepository, never()).save(any());
    }

    @Test
    void deleteProperty() {
        // Arrange
        doNothing().when(propertyRepository).deleteById(1L);

        // Act
        propertyService.deleteProperty(1L);

        // Assert
        verify(propertyRepository, times(1)).deleteById(1L);
    }
}