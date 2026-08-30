package com.government.infosys.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateCitizenProfileRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Aadhaar number is required")
    private String aadhaarNo;

    private String panNo;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Mobile number is required")
    private String mobile;

    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "District is required")
    private String district;

    private String taluk;

    private String village;

    @NotBlank(message = "Bank account number is required")
    private String bankAccountNo;

    @NotBlank(message = "IFSC code is required")
    private String ifscCode;

    private String address;

    private String pincode;

    private String state;
}