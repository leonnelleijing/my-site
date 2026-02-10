---
slug: springboot-testing-guide
title: Spring Boot Testing Guide
tags: [backend, testing]
---

# Spring Boot Testing Guide

Testing is a critical part of Spring Boot development. This guide covers the essential testing strategies and best practices.

## Types of Tests

### 1. Unit Tests
Unit tests focus on testing individual components in isolation.

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void testFindUserById() {
        // Arrange
        User user = new User(1L, "John Doe");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Act
        User result = userService.findUserById(1L);
        
        // Assert
        assertEquals("John Doe", result.getName());
        verify(userRepository, times(1)).findById(1L);
    }
}
```

### 2. Integration Tests
Integration tests verify that multiple components work together correctly.

```java
@SpringBootTest
@ActiveProfiles("test")
class UserControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testGetUserEndpoint() {
        // Arrange
        User user = new User(null, "Jane Doe");
        userRepository.save(user);
        
        // Act
        ResponseEntity<User> response = restTemplate.getForEntity(
            "/api/users/{id}", User.class, user.getId()
        );
        
        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Jane Doe", response.getBody().getName());
    }
}
```

### 3. Slice Tests
Slice tests focus on testing a specific layer without loading the entire application context.

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    void testGetUser() throws Exception {
        User user = new User(1L, "Test User");
        when(userService.findUserById(1L)).thenReturn(user);
        
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Test User"));
    }
}
```

## Testing Annotations

| Annotation | Purpose |
|-----------|---------|
| `@SpringBootTest` | Loads the full application context |
| `@WebMvcTest` | Tests only the MVC layer |
| `@DataJpaTest` | Tests JPA repositories |
| `@MockBean` | Creates a mock bean in the context |
| `@Mock` | Creates a mock object (Mockito) |
| `@InjectMocks` | Injects mock objects into the tested class |
| `@ActiveProfiles` | Activates specific profiles for testing |

## Best Practices

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Use Meaningful Test Names**: Names should describe what is being tested
3. **Keep Tests Isolated**: Each test should be independent
4. **Mock External Dependencies**: Don't rely on external services
5. **Test Edge Cases**: Include tests for error scenarios
6. **Use Test Fixtures**: Reuse common test data setup

## Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run tests with coverage
mvn test jacoco:report
```

## Conclusion

Effective testing in Spring Boot ensures code quality and reliability. By combining unit tests, integration tests, and slice tests, you can build a robust testing strategy for your applications.

