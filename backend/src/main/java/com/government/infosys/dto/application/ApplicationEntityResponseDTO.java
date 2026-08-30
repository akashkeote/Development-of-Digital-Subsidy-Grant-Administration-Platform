package com.government.infosys.dto.application;

import com.government.infosys.entity.Application;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApplicationEntityResponseDTO {

    private Long id;
    private String applicationNo;

    private Long citizenId;
    private String citizenName;

    private Long schemeId;
    private String schemeCode;
    private String schemeName;

    private Long currentStatusId;
    private String currentStatus;

    private Long approvalStatusId;
    private String approvalStatus;

    private String priority;
    private String remarks;

    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ApplicationEntityResponseDTO from(
            Application application) {

        return ApplicationEntityResponseDTO.builder()
                .id(application.getId())
                .applicationNo(application.getApplicationNo())

                .citizenId(application.getCitizen().getId())
                .citizenName(application.getCitizen().getFullName())

                .schemeId(application.getScheme().getId())
                .schemeCode(application.getScheme().getCode())
                .schemeName(application.getScheme().getName())

                .currentStatusId(
                        application.getCurrentStatus().getId()
                )
                .currentStatus(
                        application.getCurrentStatus().getCode()
                )

                .approvalStatusId(
                        application.getApprovalStatus().getId()
                )
                .approvalStatus(
                        application.getApprovalStatus().getCode()
                )

                .priority(application.getPriority())
                .remarks(application.getRemarks())

                .submittedAt(application.getSubmittedAt())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())

                .build();
    }
}