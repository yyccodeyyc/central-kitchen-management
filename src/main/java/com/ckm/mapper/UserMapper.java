package com.ckm.mapper;

import com.ckm.dto.UserDTO;
import com.ckm.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * 用户实体映射器
 * 使用MapStruct进行实体和DTO之间的转换
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    /**
     * User实体转换为UserDTO
     */
    @Mapping(source = "role.name", target = "role")
    UserDTO toDTO(User user);

    /**
     * UserDTO转换为User实体
     */
    @Mapping(target = "role", expression = "java(User.UserRole.valueOf(userDTO.getRole()))")
    User toEntity(UserDTO userDTO);

    /**
     * User列表转换为UserDTO列表
     */
    List<UserDTO> toDTOList(List<User> users);

    /**
     * UserDTO列表转换为User列表
     */
    List<User> toEntityList(List<UserDTO> userDTOs);
}
