package com.ciu.sys.Dto;

import java.sql.Date;

public record StudentResponse(
    String username,
    String email,
    String phone,
    String role,
    Boolean isActive,
    Date date) {

}
