package com.ciu.sys.Dto;

public record UserDto(
    String username,
    String email,
    String address,
    String role,
    boolean isActive,
    String createAt,
    String phone) {

}
