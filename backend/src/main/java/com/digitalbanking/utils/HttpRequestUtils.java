package com.digitalbanking.utils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class HttpRequestUtils {

    private static final String DEFAULT_IP = "0.0.0.0";
    private static final String UNKNOWN = "UNKNOWN";

    private static final String[] IP_HEADERS = {
            "X-Forwarded-For",    // Nginx, AWS ALB, API Gateway
            "CF-Connecting-IP",  // Cloudflare
            "X-Real-IP"          // Standard Reverse Proxy fallback
    };

    /**
     * Extracts the real client IP address from the request header, handling reverse proxies,
     * load balancers, and Cloudflare configurations.
     *
     * @return the extracted client IP address, or "0.0.0.0" if request is null
     */
    public static String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return DEFAULT_IP;
        }

        for (String header : IP_HEADERS) {
            String ipAddress = request.getHeader(header);
            if (StringUtils.hasText(ipAddress) && !UNKNOWN.equalsIgnoreCase(ipAddress)) {
                return ipAddress.split(",")[0].trim();
            }
        }

        return request.getRemoteAddr();
    }

    /**
     * Extracts the User-Agent header from the incoming request.
     *
     * @param request the incoming {@link HttpServletRequest}
     * @return the client User-Agent header value, or "UNKNOWN" if missing/null
     */
    public static String getUserAgent(HttpServletRequest request) {
        if (request == null) {
            return UNKNOWN;
        }
        String userAgent = request.getHeader("User-Agent");
        return StringUtils.hasText(userAgent) ? userAgent.trim() : UNKNOWN;
    }
}