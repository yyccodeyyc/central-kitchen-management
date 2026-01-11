package com.ckm.controller;

import com.ckm.dto.LoginRequest;
import com.ckm.dto.LoginResponse;
import com.ckm.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 * 处理用户登录、登出等认证相关操作
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "用户认证相关API")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "验证用户凭据并返回JWT令牌")
    public ResponseEntity<LoginResponse> login(@Validated @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getUsername());

        LoginResponse response = authService.authenticate(loginRequest);

        log.info("Login successful for user: {}", loginRequest.getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "清除用户会话")
    public ResponseEntity<String> logout() {
        authService.logout();
        return ResponseEntity.ok("登出成功");
    }

    /**
     * 验证令牌有效性
     */
    @GetMapping("/validate")
    @Operation(summary = "验证令牌", description = "验证当前JWT令牌是否有效")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("令牌有效");
    }

    /**
     * 刷新令牌 (可选实现)
     */
    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌", description = "使用刷新令牌获取新的访问令牌")
    public ResponseEntity<String> refreshToken(@RequestParam String refreshToken) {
        String newToken = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(newToken);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息", description = "获取当前登录用户的信息")
    public ResponseEntity<?> getCurrentUser() {
        try {
            var user = authService.getCurrentUser();
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("用户未登录");
        }
    }

    // ==================== 传统页面支持 ====================

    /**
     * 登录页面 (保持向后兼容)
     */
    @GetMapping("/login-page")
    @Operation(summary = "登录页面", description = "返回登录页面视图")
    public String loginPage() {
        return "login";
    }
}
