package com.ckm.repository;

import com.ckm.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 基础查询方法
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // 角色相关查询
    List<User> findByRole(User.UserRole role);
    Page<User> findByRole(User.UserRole role, Pageable pageable);
    long countByRole(User.UserRole role);

    // 状态相关查询
    List<User> findByEnabled(boolean enabled);
    Page<User> findByEnabled(boolean enabled, Pageable pageable);
    long countByEnabled(boolean enabled);

    // 复合条件查询
    List<User> findByRoleAndEnabled(User.UserRole role, boolean enabled);
    Page<User> findByRoleAndEnabled(User.UserRole role, boolean enabled, Pageable pageable);

    // 时间范围查询
    List<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    Page<User> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    // 模糊搜索
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByUsernameOrEmail(@Param("keyword") String keyword);

    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchByUsernameOrEmail(@Param("keyword") String keyword, Pageable pageable);

    // 统计查询
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate")
    long countUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countUsersByRole();

    // 自定义查询 - 查找活跃管理员
    @Query("SELECT u FROM User u WHERE u.role = 'ADMIN' AND u.enabled = true")
    List<User> findActiveAdmins();

    // 自定义查询 - 查找最近创建的用户
    @Query("SELECT u FROM User u WHERE u.createdAt >= :since ORDER BY u.createdAt DESC")
    List<User> findRecentlyCreatedUsers(@Param("since") LocalDateTime since);

    @Query("SELECT u FROM User u WHERE u.createdAt >= :since ORDER BY u.createdAt DESC")
    Page<User> findRecentlyCreatedUsers(@Param("since") LocalDateTime since, Pageable pageable);
}
