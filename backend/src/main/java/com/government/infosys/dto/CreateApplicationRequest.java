package com.government.infosys.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateApplicationRequest {

    @NotNull(message = "Citizen ID is required")
    private Long citizenId;

    @NotNull(message = "Scheme ID is required")
    private Long schemeId;

    @Size(max = 20, message = "Priority cannot exceed 20 characters")
    private String priority;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;
}