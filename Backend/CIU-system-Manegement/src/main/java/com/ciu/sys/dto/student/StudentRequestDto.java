package com.ciu.sys.dto.student;

public record StudentRequestDto(
    String username,
    String password,
    String email,
    String phone) {

}
