package com.ciu.sys.Dto;

import java.util.List;

public record StudentRecordResponse(
    Long id,
    String username,
    String email,
    String fullName,
    String phone,
    String gender,
    String birthDate,
    String birthPlace,
    String address,
    String major,
    String cardCode,
    int year,
    int semester,
    String photoUrl,
    List<InvoiceResponse> invoices) {

}