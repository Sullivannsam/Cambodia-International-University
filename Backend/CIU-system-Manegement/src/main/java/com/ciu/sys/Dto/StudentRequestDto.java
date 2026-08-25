package com.ciu.sys.Dto;

public record StudentRequestDto(
    String username,
    String password,
    String email,
    String phone) {

}
