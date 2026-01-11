package test.java.com.ckm;

import com.ckm.entity.User;
import com.ckm.repository.UserRepository;
import com.ckm.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("testuser", "password123", "test@example.com", User.UserRole.ADMIN);
    }

    @Test
    void shouldCreateUserSuccessfully() {
        // Given
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User createdUser = userService.createUser("testuser", "password123", "test@example.com", User.UserRole.ADMIN);

        // Then
        assertThat(createdUser).isNotNull();
        assertThat(createdUser.getUsername()).isEqualTo("testuser");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldFindUsersByRole() {
        // Given
        List<User> adminUsers = Arrays.asList(testUser);
        when(userRepository.findByRole(User.UserRole.ADMIN)).thenReturn(adminUsers);

        // When
        List<User> result = userService.findByRole(User.UserRole.ADMIN);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("testuser");
        verify(userRepository).findByRole(User.UserRole.ADMIN);
    }

    @Test
    void shouldNotEncodeAlreadyEncodedPassword() {
        // Given
        User userWithEncodedPassword = new User("testuser", "$2a$10$alreadyEncoded", "test@example.com", User.UserRole.ADMIN);
        when(userRepository.save(any(User.class))).thenReturn(userWithEncodedPassword);

        // When
        User savedUser = userService.saveUser(userWithEncodedPassword);

        // Then
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository).save(userWithEncodedPassword);
    }

    @Test
    void shouldEncodePlainPassword() {
        // Given
        when(passwordEncoder.encode("plainPassword")).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        testUser.setPassword("plainPassword");
        userService.saveUser(testUser);

        // Then
        verify(passwordEncoder).encode("plainPassword");
    }

    @Test
    void shouldReturnTotalUsersCount() {
        // Given
        when(userRepository.count()).thenReturn(5L);

        // When
        long count = userService.getTotalUsers();

        // Then
        assertThat(count).isEqualTo(5L);
        verify(userRepository).count();
    }
}
