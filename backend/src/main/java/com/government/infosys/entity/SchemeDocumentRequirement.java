package com.government.infosys.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="scheme_document_requirements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchemeDocumentRequirement {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="scheme_id")
    private Scheme scheme;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="document_type_id")
    private DocumentType documentType;

    @Column(name="is_required")
    private Boolean required;
}
