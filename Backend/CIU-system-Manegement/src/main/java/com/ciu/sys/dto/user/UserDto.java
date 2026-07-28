package com.ciu.sys.dto.user;

public record UserDto(
    String username,
    String email,
    String address,
    String role,
    boolean isActive,
    String createAt,
    String phone) {

}
