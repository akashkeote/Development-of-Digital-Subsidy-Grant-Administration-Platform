package com.government.infosys.dto;

import com.government.infosys.entity.CitizenProfile;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class CitizenProfileResponse {

    private Long id;
    private Long userId;

    private String fullName;
    private LocalDate dob;
    private String gender;
    private String aadhaarNo;
    private String panNo;

    private String email;
    private String mobile;

    private String addressLine1;
    private String addressLine2;

    private String district;
    private String taluk;
    private String village;

    private String bankAccountNo;
    private String ifscCode;

    private String pincode;
    private String state;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CitizenProfileResponse from(
            CitizenProfile profile) {

        return CitizenProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .fullName(profile.getFullName())
                .dob(profile.getDob())
                .gender(profile.getGender())
                .aadhaarNo(profile.getAadhaarNo())
                .panNo(profile.getPanNo())
                .email(profile.getEmail())
                .mobile(profile.getMobile())
                .addressLine1(profile.getAddressLine1())
                .addressLine2(profile.getAddressLine2())
                .district(profile.getDistrict())
                .taluk(profile.getTaluk())
                .village(profile.getVillage())
                .bankAccountNo(profile.getBankAccountNo())
                .ifscCode(profile.getIfscCode())
                .pincode(profile.getPincode())
                .state(profile.getState())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}