package com.ciu.sys.teacher;

public record TeacherRequestDto(
    String username,
    String email,
    String password,
    String phone) {

}
