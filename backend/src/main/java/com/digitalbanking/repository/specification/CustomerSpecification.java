package com.digitalbanking.repository.specification;

import com.digitalbanking.domain.dto.request.filter.CustomerFilterRequest;
import com.digitalbanking.domain.entity.CustomerEntity;
import com.digitalbanking.domain.entity.KycDocumentEntity;
import com.digitalbanking.domain.entity.UserEntity;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CustomerSpecification {

    public static Specification<CustomerEntity> filter(CustomerFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<CustomerEntity, UserEntity> userJoin = root.join("user", JoinType.INNER);

            if (StringUtils.hasText(filter.getKeyword())) {
                String searchPattern = "%" + filter.getKeyword().trim().toLowerCase() + "%";

                Predicate nameLike = cb.like(cb.lower(root.get("fullName")), searchPattern);
                Predicate codeLike = cb.like(cb.lower(root.get("customerCode")), searchPattern);
                Predicate nationalIdLike = cb.like(cb.lower(root.get("nationalId")), searchPattern);
                Predicate emailLike = cb.like(cb.lower(userJoin.get("email")), searchPattern);
                Predicate phoneLike = cb.like(cb.lower(userJoin.get("phoneNumber")), searchPattern);

                predicates.add(cb.or(nameLike, codeLike, nationalIdLike, emailLike, phoneLike));
            }

            if (filter.getStatus() != null) {
                predicates.add(cb.equal(userJoin.get("status"), filter.getStatus()));
            }

            if (filter.getKycStatus() != null) {
                Subquery<UUID> kycSubquery = query.subquery(UUID.class);
                Root<KycDocumentEntity> kycRoot = kycSubquery.from(KycDocumentEntity.class);
                kycSubquery.select(kycRoot.get("customer").get("id"))
                        .where(
                                cb.equal(kycRoot.get("customer").get("id"), root.get("id")),
                                cb.equal(kycRoot.get("status"), filter.getKycStatus())
                        );
                predicates.add(cb.exists(kycSubquery));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
