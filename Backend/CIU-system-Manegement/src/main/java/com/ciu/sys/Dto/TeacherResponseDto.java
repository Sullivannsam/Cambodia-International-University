package com.ciu.sys.teacher;

import java.sql.Date;

public record TeacherResponseDto(
    Long id,
    String username,
    String email,
    String phone,
    String role,
    Boolean isActive,
    Date date) {

}
