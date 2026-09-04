package com.ciu.sys.Dto;

public record InvoiceResponse(
    Long id,
    double amount,
    double paid,
    String status,
    String dueDate) {

}