package com.ckm.service;

import com.ckm.dto.LoginRequest;
import com.ckm.dto.LoginResponse;
import com.ckm.dto.UserDTO;
import com.ckm.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 认证服务
 * 处理用户登录、JWT令牌生成和管理
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Value("${ckm.security.jwt.secret}")
    private String jwtSecret;

    @Value("${ckm.security.jwt.expiration:86400000}")
    private long jwtExpiration; // 默认24小时

    /**
     * 用户登录认证
     */
    public LoginResponse authenticate(LoginRequest loginRequest) {
        try {
            log.info("User login attempt: {}", loginRequest.getUsername());

            // Spring Security认证
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 获取用户信息
            User user = userService.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在"));

            if (!user.isEnabled()) {
                throw new BusinessException("用户已被禁用");
            }

            // 生成JWT令牌
            String token = generateToken(user);
            String sessionId = generateSessionId();

            // 构建响应
            LoginResponse response = LoginResponse.builder()
                .token(token)
                .expiresIn(jwtExpiration / 1000) // 转换为秒
                .user(userService.findById(user.getId()).orElse(null))
                .loginTime(LocalDateTime.now())
                .sessionId(sessionId)
                .requiresTwoFactor(false) // 可扩展为双因子认证
                .build();

            log.info("User login successful: {}", loginRequest.getUsername());
            return response;

        } catch (AuthenticationException e) {
            log.warn("User login failed: {} - {}", loginRequest.getUsername(), e.getMessage());
            throw new BusinessException("用户名或密码错误");
        }
    }

    /**
     * 生成JWT令牌
     */
    private String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole().name());
        claims.put("sessionId", generateSessionId());

        return Jwts.builder()
            .setClaims(claims)
            .setSubject(user.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    /**
     * 从令牌中提取用户名
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * 从令牌中提取用户ID
     */
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    /**
     * 验证令牌
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * 检查令牌是否过期
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * 提取过期时间
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * 提取声明
     */
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 提取所有声明
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    /**
     * 获取签名密钥
     */
    private Key getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 生成会话ID
     */
    private String generateSessionId() {
        return UUID.randomUUID().toString();
    }

    /**
     * UserDetailsService实现
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + username));

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRole().name())
            .disabled(!user.isEnabled())
            .build();
    }

    /**
     * 获取当前登录用户
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("用户未登录");
        }

        String username = authentication.getName();
        return userService.findByUsername(username)
            .orElseThrow(() -> new BusinessException("用户不存在"));
    }

    /**
     * 刷新令牌（可选实现）
     */
    public String refreshToken(String refreshToken) {
        // 这里可以实现刷新令牌逻辑
        // 暂时返回空字符串
        return "";
    }

    /**
     * 用户登出
     */
    public void logout() {
        SecurityContextHolder.clearContext();
        log.info("User logged out");
    }
}
