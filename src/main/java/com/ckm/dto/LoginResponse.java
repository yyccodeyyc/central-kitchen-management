package com.ckm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 登录响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;

    private String tokenType = "Bearer";

    private Long expiresIn; // 过期时间（秒）

    private UserDTO user;

    private LocalDateTime loginTime;

    // 刷新令牌（可选）
    private String refreshToken;

    // 双因子认证状态
    private boolean requiresTwoFactor;

    // 会话ID
    private String sessionId;

    public String getTokenType() {
        return tokenType;
    }
}
