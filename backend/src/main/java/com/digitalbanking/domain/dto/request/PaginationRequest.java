package com.digitalbanking.domain.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

@Getter
@Setter
public class PaginationRequest {

    private int page = 0;
    private int size = 10;
    private String sortBy;
    private String sortDir;

    public Pageable toPageable() {
        return toPageable("createdAt");
    }

    public Pageable toPageable(String defaultSortBy) {
        return toPageable(defaultSortBy, Sort.Direction.DESC);
    }

    public Pageable toPageable(String defaultSortBy, Sort.Direction defaultDirection) {
        String property = StringUtils.hasText(this.sortBy) ? this.sortBy : defaultSortBy;

        Sort.Direction direction = StringUtils.hasText(this.sortDir)
                ? Sort.Direction.fromOptionalString(this.sortDir).orElse(defaultDirection)
                : defaultDirection;

        return PageRequest.of(
                Math.max(this.page, 0),
                Math.max(this.size, 1),
                Sort.by(direction, property)
        );
    }
}