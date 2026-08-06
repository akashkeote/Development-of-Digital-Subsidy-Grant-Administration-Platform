package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="document_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentType {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false,unique=true,length=50)
    private String code;

    @Column(nullable=false,length=150)
    private String name;

    @Column(name="is_mandatory")
    private Boolean mandatory;
}