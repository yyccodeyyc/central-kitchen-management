package com.ckm.service;

import com.ckm.dto.UserDTO;
import com.ckm.entity.User;
import com.ckm.mapper.UserMapper;
import com.ckm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // ==================== 基础CRUD操作 ====================

    /**
     * 获取所有用户 - 使用DTO返回
     */
    @Cacheable(value = "user", key = "'all'")
    public List<UserDTO> findAllUsers() {
        log.debug("Fetching all users from database");
        List<User> users = userRepository.findAll();
        return userMapper.toDTOList(users);
    }

    /**
     * 根据ID查找用户 - 使用缓存
     */
    @Cacheable(value = "user", key = "#id")
    public Optional<UserDTO> findById(Long id) {
        log.debug("Fetching user by id: {}", id);
        return userRepository.findById(id)
                .map(userMapper::toDTO);
    }

    /**
     * 根据用户名查找用户 - 使用缓存
     */
    @Cacheable(value = "user", key = "'username:' + #username")
    public Optional<UserDTO> findByUsername(String username) {
        log.debug("Fetching user by username: {}", username);
        return userRepository.findByUsername(username)
                .map(userMapper::toDTO);
    }

    /**
     * 分页查询用户
     */
    @Cacheable(value = "user", key = "'page:' + #pageable.pageNumber + ':' + #pageable.pageSize")
    public Page<UserDTO> findAllUsers(Pageable pageable) {
        log.debug("Fetching users with pagination: page={}, size={}",
                 pageable.getPageNumber(), pageable.getPageSize());
        Page<User> userPage = userRepository.findAll(pageable);
        return userPage.map(userMapper::toDTO);
    }

    // ==================== 增删改操作 ====================

    /**
     * 保存用户 - 清除相关缓存
     */
    @Caching(evict = {
        @CacheEvict(value = "user", key = "'all'"),
        @CacheEvict(value = "user", key = "'page:*'"),
        @CacheEvict(value = "user", key = "#user.id"),
        @CacheEvict(value = "user", key = "'username:' + #user.username")
    })
    public UserDTO saveUser(User user) {
        log.debug("Saving user: {}", user.getUsername());

        // 加密密码 - 检查是否已经是加密密码
        if (user.getPassword() != null && !isEncodedPassword(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    /**
     * 创建新用户
     */
    @Caching(evict = {
        @CacheEvict(value = "user", key = "'all'"),
        @CacheEvict(value = "user", key = "'page:*'")
    })
    public UserDTO createUser(String username, String password, String email, User.UserRole role) {
        log.info("Creating new user: {}", username);

        if (existsByUsername(username)) {
            throw new BusinessException("用户名已存在: " + username);
        }
        if (existsByEmail(email)) {
            throw new BusinessException("邮箱已被使用: " + email);
        }

        User user = new User(username, password, email, role);
        return saveUser(user);
    }

    /**
     * 删除用户 - 清除缓存
     */
    @Caching(evict = {
        @CacheEvict(value = "user", key = "'all'"),
        @CacheEvict(value = "user", key = "'page:*'"),
        @CacheEvict(value = "user", key = "#id"),
        @CacheEvict(value = "user", key = "'username:*'", allEntries = true)
    })
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);

        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("用户不存在: " + id);
        }

        userRepository.deleteById(id);
    }

    /**
     * 批量删除用户
     */
    @Caching(evict = {
        @CacheEvict(value = "user", allEntries = true)
    })
    public void deleteUsers(List<Long> ids) {
        log.info("Batch deleting users: {}", ids);
        userRepository.deleteByIds(ids);
    }

    private boolean isEncodedPassword(String password) {
        return password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$");
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> findByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public long getTotalUsers() {
        return userRepository.count();
    }
}
