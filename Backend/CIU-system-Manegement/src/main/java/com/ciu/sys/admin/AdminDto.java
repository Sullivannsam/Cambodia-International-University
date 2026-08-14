package com.ciu.sys.admin;

public record AdminDto(
    String username,
    String password,
    String email,
    String role) {
}
