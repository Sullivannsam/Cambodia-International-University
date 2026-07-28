package com.ciu.sys.dto.teacher;

public record TeacherRequestDto(
    String username,
    String email,
    String password,
    String phone) {

}
