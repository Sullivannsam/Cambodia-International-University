package com.ciu.sys.Dto;

public record AdminDto(
    String username,
    String password,
    String email,
    String role) {
}
