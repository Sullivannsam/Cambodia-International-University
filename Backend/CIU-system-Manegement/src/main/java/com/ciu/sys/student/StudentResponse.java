package com.ciu.sys.student;

import java.sql.Date;

public record StudentResponse(
    Long id,
    String username,
    String email,
    String phone,
    String role,
    Boolean isActive,
    Date date) {

}
