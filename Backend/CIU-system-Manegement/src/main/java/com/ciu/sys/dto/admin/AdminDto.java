package com.ciu.sys.dto.admin;

public record AdminDto(
    String username,
    String password,
    String email,
    String role) {
}
