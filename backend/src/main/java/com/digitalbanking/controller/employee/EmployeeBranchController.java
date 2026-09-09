package com.digitalbanking.controller.employee;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/employee/branches")
@RequiredArgsConstructor
@Slf4j(topic = "EMPLOYEE-BRANCH-CONTROLLER")
public class EmployeeBranchController {
}
