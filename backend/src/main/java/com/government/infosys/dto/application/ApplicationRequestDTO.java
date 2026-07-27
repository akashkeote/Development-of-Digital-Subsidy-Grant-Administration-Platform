package com.government.infosys.dto.application;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationRequestDTO {

    @NotBlank(message = "Scheme ID is required")
    private String schemeId;

    @NotBlank(message = "Scheme title is required")
    private String schemeTitle;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotBlank(message = "Applicant Aadhar is required")
    private String applicantAadhar;

    @NotBlank(message = "Applicant state is required")
    private String applicantState;

    @NotBlank(message = "Applicant income is required")
    private String applicantIncome;
}