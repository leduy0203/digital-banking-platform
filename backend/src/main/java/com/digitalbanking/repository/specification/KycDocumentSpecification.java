package com.digitalbanking.repository.specification;

import com.digitalbanking.domain.dto.request.KycFilterRequest;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.KycDocumentEntity;
import com.digitalbanking.domain.entity.UserEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;


public class KycDocumentSpecification {

    public static Specification<KycDocumentEntity> filter(KycFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus()));
            }

            if (StringUtils.hasText(filter.getKeyword())) {
                String searchPattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";
                Join<KycDocumentEntity, CustomerEntity> customer = root.join("customer", JoinType.LEFT);
                Join<CustomerEntity, UserEntity> user = customer.join("user", JoinType.LEFT);

                Predicate nameLike = cb.like(cb.lower(customer.get("fullName")), searchPattern);
                Predicate codeLike = cb.like(cb.lower(customer.get("customerCode")), searchPattern);
                Predicate nationalIdLike = cb.like(cb.lower(customer.get("nationalId")), searchPattern);
                Predicate emailLike = cb.like(cb.lower(user.get("email")), searchPattern);
                Predicate phoneLike = cb.like(cb.lower(user.get("phoneNumber")), searchPattern);

                predicates.add(cb.or(nameLike, codeLike, nationalIdLike, emailLike, phoneLike));
            }

            if (filter.getFromDate() != null) {
                Instant startInstant = filter.getFromDate().atStartOfDay(ZoneId.systemDefault()).toInstant();
                predicates.add(cb.greaterThanOrEqualTo(root.get("submittedAt"), startInstant));
            }
            if (filter.getToDate() != null) {
                Instant endInstant = filter.getToDate().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
                predicates.add(cb.lessThan(root.get("submittedAt"), endInstant));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
