package com.digitalbanking.repository.specification;

import com.digitalbanking.domain.dto.request.filter.EmployeeAccountFilterRequest;
import com.digitalbanking.domain.entity.AccountEntity;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.UserEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class AccountSpecification {

    public static Specification<AccountEntity> filter(EmployeeAccountFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<AccountEntity, CustomerEntity> customerJoin = root.join("customer", JoinType.LEFT);
            Join<CustomerEntity, UserEntity> userJoin = customerJoin.join("user", JoinType.LEFT);

            if (filter != null) {
                if (StringUtils.hasText(filter.getKeyword())) {
                    String searchPattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";

                    Predicate accNumberLike = cb.like(cb.lower(root.get("accountNumber")), searchPattern);
                    Predicate cifLike = cb.like(cb.lower(customerJoin.get("customerCode")), searchPattern);
                    Predicate nameLike = cb.like(cb.lower(customerJoin.get("fullName")), searchPattern);
                    Predicate phoneLike = cb.like(cb.lower(userJoin.get("phoneNumber")), searchPattern);
                    Predicate emailLike = cb.like(cb.lower(userJoin.get("email")), searchPattern);

                    predicates.add(cb.or(accNumberLike, cifLike, nameLike, phoneLike, emailLike));
                }

                if (filter.getStatus() != null) {
                    predicates.add(cb.equal(root.get("status"), filter.getStatus()));
                }

                if (filter.getAccountType() != null) {
                    predicates.add(cb.equal(root.get("accountType"), filter.getAccountType()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
