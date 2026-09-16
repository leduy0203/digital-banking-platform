package com.digitalbanking.service;

import com.digitalbanking.domain.dto.request.filter.CustomerFilterRequest;
import com.digitalbanking.domain.dto.response.CustomerDetailResponse;
import com.digitalbanking.domain.dto.response.CustomerResponse;
import com.digitalbanking.domain.dto.response.PageResponse;

public interface EmployeeCustomerService {

    PageResponse<CustomerResponse> getCustomers(CustomerFilterRequest filterRequest);

    CustomerDetailResponse getCustomerByCif(String cif);
}
