package com.digitalbanking.repository.specification;

import com.digitalbanking.domain.dto.request.EmployeeFilterRequest;
import com.digitalbanking.domain.entity.EmployeeEntity;
import com.digitalbanking.domain.entity.UserEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class EmployeeSpecification {

    public static Specification<EmployeeEntity> filter(EmployeeFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<EmployeeEntity, UserEntity> userJoin = root.join("user", JoinType.INNER);

            if (StringUtils.hasText(filter.getKeyword())) {
                String searchPattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";

                Predicate nameLike = cb.like(cb.lower(root.get("fullName")), searchPattern);
                Predicate codeLike = cb.like(cb.lower(root.get("employeeCode")), searchPattern);
                Predicate emailLike = cb.like(cb.lower(userJoin.get("email")), searchPattern);
                Predicate phoneLike = cb.like(cb.lower(userJoin.get("phoneNumber")), searchPattern);

                predicates.add(cb.or(nameLike, codeLike, emailLike, phoneLike));
            }

            if (filter.getDepartment() != null) {
                predicates.add(cb.equal(root.get("department"), filter.getDepartment()));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(userJoin.get("status"), filter.getStatus()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}