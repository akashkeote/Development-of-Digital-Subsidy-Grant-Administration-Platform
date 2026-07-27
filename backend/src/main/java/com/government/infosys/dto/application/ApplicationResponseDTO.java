package com.government.infosys.dto.application;

import lombok.Data;

@Data
public class ApplicationResponseDTO {

    private String id;

    private String schemeId;

    private String schemeTitle;

    private String applicantName;

    private String applicantAadhar;

    private String applicantState;

    private String applicantIncome;

    private String status;

    private String submittedAt;
}