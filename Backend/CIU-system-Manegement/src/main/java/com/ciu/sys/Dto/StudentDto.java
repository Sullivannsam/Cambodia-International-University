package com.ciu.sys.Dto;

import java.sql.Date;

public record StudentDto(
    String username,
    String email,
    String password,
    String phone) {

}
