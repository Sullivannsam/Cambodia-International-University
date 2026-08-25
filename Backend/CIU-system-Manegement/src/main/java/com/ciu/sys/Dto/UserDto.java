package com.ciu.sys.user;

public record UserDto(
    Long id,
    String username,
    String email,
    String address,
    String role,
    boolean isActive,
    String createAt,
    String phone,
    String course,
    boolean suspended,
    String suspendedMessage) {

}
