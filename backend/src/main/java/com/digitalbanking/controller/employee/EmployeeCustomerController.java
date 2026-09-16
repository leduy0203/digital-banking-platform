package com.digitalbanking.controller.employee;

import com.digitalbanking.domain.dto.request.filter.CustomerFilterRequest;
import com.digitalbanking.domain.dto.response.ApiResponse;
import com.digitalbanking.domain.dto.response.CustomerDetailResponse;
import com.digitalbanking.domain.dto.response.CustomerResponse;
import com.digitalbanking.domain.dto.response.PageResponse;
import com.digitalbanking.service.EmployeeCustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/employee/customers")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-CUSTOMER-CONTROLLER")
public class EmployeeCustomerController {

    private final EmployeeCustomerService employeeCustomerService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    public ApiResponse<PageResponse<CustomerResponse>> getCustomers(
            @Valid CustomerFilterRequest filterRequest
    ) {
        log.info("Employee querying customers with filter: {}", filterRequest);

        PageResponse<CustomerResponse> response = employeeCustomerService.getCustomers(filterRequest);

        return ApiResponse.ok("Customer list retrieved successfully", response);
    }

    @GetMapping("/{cif}")
    @PreAuthorize("hasAnyRole('TELLER', 'ADMIN')")
    public ApiResponse<CustomerDetailResponse> getCustomerDetail(
            @PathVariable String cif
    ) {
        log.info("Employee requesting customer detail for CIF: {}", cif);

        CustomerDetailResponse response = employeeCustomerService.getCustomerByCif(cif);

        return ApiResponse.ok("Customer detail retrieved successfully", response);
    }
}
