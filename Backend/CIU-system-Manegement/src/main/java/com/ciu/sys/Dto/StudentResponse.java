package com.ciu.sys.Dto;

import java.sql.Date;
import java.util.Map;

public record StudentResponse(
    Long id,
    String username,
    String email,
    String phone,
    String role,
    Boolean isActive,
    Date date,
    String major,
    String address,
    String cardCode,
    String photoUrl,
    Map<String, Object> classes) {

}
