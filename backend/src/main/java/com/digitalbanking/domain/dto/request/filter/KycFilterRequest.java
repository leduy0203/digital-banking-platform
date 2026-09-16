package com.digitalbanking.domain.dto.request.filter;

import com.digitalbanking.domain.dto.request.PaginationRequest;
import com.digitalbanking.domain.enums.KycStatus;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KycFilterRequest extends PaginationRequest {

    private String keyword;

    private KycStatus status = KycStatus.PENDING;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;
}