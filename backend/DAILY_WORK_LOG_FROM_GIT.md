# DAILY_WORK_LOG_FROM_GIT (generated)

Generated from git commit history (last 30 days) in repository: D:\Digital Banking Platforms\backend

Command used:
```
cd "D:\Digital Banking Platforms\backend"
git log --since='30 days ago' --date=short --pretty=format:'%ad %h %s'
```

---

## 2026-09-03
- Tóm tắt: Bổ sung kiểm tra token truy cập và xử lý lỗi xác thực.
- Commit liên quan:
  - 76af397 — feat(security): enforce access token validation, handle authentication errors with ProblemDetail via OAuth2 DSL
- Ghi chú: Cần test luồng xác thực/401 và hiển thị ProblemDetail.

## 2026-08-31
- Tóm tắt: Thêm endpoint lấy profile khách hàng sử dụng SecurityUtils.
- Commit liên quan:
  - 1c8a7c8 — feat(customer): implement get customer profile endpoint via SecurityUtils
- Ghi chú: Kiểm tra quyền truy cập và dữ liệu trả về.

## 2026-08-25
- Tóm tắt: Cập nhật cơ chế refresh token: refactor và thêm API refresh token với hashing và rotation.
- Commit liên quan:
  - 5266157 — refactor(auth): enforce strict session expiration on refresh token rotation
  - 6822c8b — feat(auth): implement refresh token API with SHA-256 hashing and token rotation mechanism
- Ghi chú: Đảm bảo backward compatibility và test kỹ việc rotate/blacklist token.

## 2026-08-24
- Tóm tắt: Implement đăng ký người dùng và flow đăng nhập JWT.
- Commit liên quan:
  - 1067589 — feat(auth): implement user registration and JWT login flow
- Ghi chú: Chú ý validation input và confirm password flow.

## 2026-08-23
- Tóm tắt: Thiết lập Resource Server với JWT RS256 cho Spring Security.
- Commit liên quan:
  - 6c77cc4 — feat(security): setup Spring Security OAuth2 Resource Server with JWT RS256
- Ghi chú: Kiểm tra public key config và verify signature.

## 2026-08-22
- Tóm tắt: Thêm các entity cốt lõi, enums, repositories và khởi tạo Flyway V1 migration.
- Commit liên quan:
  - 8fd1018 — feat(domain): add core entities, enums, repositories and V1 db schema
  - 5a8bc2e — feat(db): initialize database schema with flyway V1 migration
- Ghi chú: Kiểm tra migration và mapping entity -> table.

## 2026-08-21
- Tóm tắt: Thiết lập lớp nền tảng, exception handling và cấu hình database.
- Commit liên quan:
  - ea0c87b — feat(core): setup base layer, exception handling, and database config
- Ghi chú: Xem lại GlobalExceptionHandler và mapping lỗi.

## 2026-08-20
- Tóm tắt: Dọn dẹp repo, loại bỏ `application.yaml` khỏi tracking và cập nhật `.gitignore`.
- Commit liên quan:
  - 20d8309 — chore: remove application.yaml from git tracking and update gitignore
- Ghi chú: Đảm bảo file cấu hình local vẫn an toàn và không bị commit.

---

Ghi chú chung:
- File này được sinh tự động từ git commit messages. Bạn có thể chỉnh sửa từng mục, thêm thời gian ước tính hoặc liên kết PR/issue cụ thể.
- Nếu muốn tôi tự động append các commit mới mỗi ngày, tôi có thể tạo script PowerShell để cập nhật file này định kỳ.

## 2026-09-04

### 1) Files đã chỉnh sửa (theo `git status`)

| File | Trạng thái / Ghi chú |
| --- | --- |
| `src/main/java/com/digitalbanking/controller/AuthController.java` | modified — thêm endpoint gửi/verify OTP |
| `src/main/java/com/digitalbanking/domain/dto/request/SendOtpRequest.java` | modified |
| `src/main/java/com/digitalbanking/domain/dto/request/VerifyOtpRequest.java` | modified |
| `src/main/java/com/digitalbanking/domain/entity/OtpCodeEntity.java` | modified |
| `src/main/java/com/digitalbanking/exception/ErrorCode.java` | modified |
| `src/main/java/com/digitalbanking/repository/OtpCodeRepository.java` | modified |
| `src/main/java/com/digitalbanking/service/EmailService.java` | modified |
| `src/main/java/com/digitalbanking/service/OtpService.java` | modified |
| `src/main/java/com/digitalbanking/service/impl/EmailServiceImpl.java` | modified — basic email send hook |
| `src/main/java/com/digitalbanking/service/impl/OtpServiceImpl.java` | modified — create & verify logic (initial) |

### 2) Tóm tắt công việc (Done / Pending)

| Công việc | Trạng thái | Ghi chú |
| --- | --- | --- |
| Thiết kế DTOs cho `send` và `verify` OTP | Done | Payload đã sẵn sàng |
| Tạo / cập nhật `OtpCodeEntity` và `OtpCodeRepository` | Done | Lưu OTP vào DB (chưa hash) |
| Thêm endpoint gửi/verify OTP trong `AuthController` | Done | Endpoint cơ bản hoạt động |
| Hook gửi email trong `EmailServiceImpl` | Done (basic) | Cần kiểm tra template & provider |
| Logic tạo và verify OTP trong `OtpServiceImpl` | Done (initial) | Cần hoàn thiện edge-cases |
| Thiết lập expiry (TTL) cho OTP & cleanup | Pending | Cần migration hoặc scheduled job |
| Rate-limiting cho gửi/verify OTP | Pending | Throttle resend + giới hạn thử |
| Hash OTP khi lưu | Pending | Khuyến nghị: hash (HMAC/SHA256) trước lưu |
| Unit / Integration tests cho OTP flow | Pending | Viết JUnit + MockMvc tests |
| Tích hợp OTP vào luồng nghiệp vụ (vd: chuyển tiền) | Pending | Cần cập nhật service/transaction flow |
| Cập nhật OpenAPI / tài liệu API | Pending | Thêm endpoint docs và ví dụ |
| SMS provider dự phòng | Optional / Pending | Nếu cần gửi SMS ngoài email |

