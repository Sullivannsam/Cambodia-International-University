package com.ciu.sys.dto.enrollment;

public record EntrollDto(

    String firstNameEN,
    String lastNameEN,
    String firstNameKH,
    String lastNameKH,
    int age,
    String birthDate,
    String placeOfBirth,
    String sex,
    String nationality,
    String phone,
    String email,
    String startDate,
    String major,
    String year,
    String degree)

{
}
