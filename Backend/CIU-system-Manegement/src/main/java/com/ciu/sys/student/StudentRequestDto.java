package com.ciu.sys.student;

public record StudentRequestDto(
    String username,
    String password,
    String email,
    String phone) {

}
