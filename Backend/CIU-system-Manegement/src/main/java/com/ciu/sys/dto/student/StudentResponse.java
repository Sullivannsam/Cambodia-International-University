package com.ciu.sys.dto.student;

import java.sql.Date;

public record StudentResponse(
    String username,
    String email,
    String phone,
    String role,
    Boolean isActive,
    Date date) {

}
