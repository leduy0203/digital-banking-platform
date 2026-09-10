package com.digitalbanking.domain.dto.request;

import com.digitalbanking.domain.enums.KycStatus;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycFilterRequest {

    private String keyword;

    @Builder.Default
    private KycStatus status = KycStatus.PENDING;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;

    @Builder.Default
    private String sortBy = "submittedAt";

    @Builder.Default
    private String sortDir = "ASC";
}