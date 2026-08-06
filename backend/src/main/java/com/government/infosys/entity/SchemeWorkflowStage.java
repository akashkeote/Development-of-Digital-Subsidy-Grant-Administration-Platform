package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="scheme_workflow_stages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchemeWorkflowStage {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="scheme_id")
    private Subsidy scheme;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="workflow_stage_id")
    private WorkflowStage workflowStage;

    @Column(name="stage_order")
    private Integer stageOrder;
}