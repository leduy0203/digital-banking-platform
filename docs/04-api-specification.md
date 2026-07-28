# REST API Specification - Digital Banking Platform

## 13. REST API Specification

All REST APIs conform to standard HTTP methods, return JSON payloads wrapped in an enterprise unified envelope (`ApiResponse<T>`), and handle errors following **RFC 7807 Problem Details** standard format.

### 13.1 Standard API Envelope Structure

#### Success Response Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "code": "SUCCESS_200",
  "message": "Operation completed successfully.",
  "data": { ... },
  "timestamp": "2026-07-27T23:00:00Z"
}
```

#### RFC 7807 Error Response Envelope (`400 Bad Request`, `422 Unprocessable Entity`, `500 Server Error`)
```json
{
  "type": "https://api.digitalbank.com/errors/INSUFFICIENT_BALANCE",
  "title": "Insufficient Balance",
  "status": 422,
  "detail": "Source account 8880123456 has available balance of 450.00 USD, which is less than requested transfer amount 500.00 USD plus fee 1.50 USD.",
  "instance": "/api/v1/transfers",
  "errorCode": "TX_INSUFFICIENT_FUNDS",
  "timestamp": "2026-07-27T23:00:00Z"
}
```

---

## 13.2 Core API Endpoints Catalog

### 1. Authentication Endpoints

#### POST `/api/v1/auth/login`
- **Description**: Authenticate user credentials and issue JWT Access Token in JSON response & Refresh Token in `HttpOnly` cookie.
- **Authentication**: None (Public Endpoint).
- **Request Body**:
```json
{
  "email": "customer@digitalbank.com",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "code": "AUTH_SUCCESS",
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresInSeconds": 900,
    "user": {
      "id": 1001,
      "email": "customer@digitalbank.com",
      "roles": ["ROLE_CUSTOMER"]
    }
  },
  "timestamp": "2026-07-27T23:00:00Z"
}
```

---

### 2. Account Endpoints

#### GET `/api/v1/accounts`
- **Description**: Fetch all accounts associated with the authenticated customer.
- **Authentication**: Bearer JWT (`ROLE_CUSTOMER`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "code": "ACCOUNT_LIST_RETRIEVED",
  "message": "Accounts retrieved successfully.",
  "data": [
    {
      "id": 5001,
      "accountNumber": "8880123456",
      "accountType": "CHECKING",
      "balance": 12550.75,
      "frozenAmount": 0.00,
      "availableBalance": 12550.75,
      "currency": "USD",
      "status": "ACTIVE"
    },
    {
      "id": 5002,
      "accountNumber": "8880987654",
      "accountType": "SAVINGS",
      "balance": 50000.00,
      "frozenAmount": 0.00,
      "availableBalance": 50000.00,
      "currency": "USD",
      "status": "ACTIVE"
    }
  ],
  "timestamp": "2026-07-27T23:00:00Z"
}
```

---

### 3. Transfer Endpoints

#### POST `/api/v1/transfers`
- **Description**: Initiate internal money transfer between accounts.
- **Authentication**: Bearer JWT (`ROLE_CUSTOMER`).
- **Headers Required**:
  - `Content-Type`: `application/json`
  - `Idempotency-Key`: `e4a3b8d1-6c2f-4a89-911e-87c1f0a2d3b4` (UUID v4)
- **Request Body**:
```json
{
  "sourceAccountNumber": "8880123456",
  "targetAccountNumber": "8880987654",
  "amount": 250.00,
  "currency": "USD",
  "description": "Monthly savings transfer"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "code": "TRANSFER_SUCCESS",
  "message": "Transfer executed successfully.",
  "data": {
    "transactionReference": "TXN-20260727-889102",
    "sourceAccountNumber": "8880123456",
    "targetAccountNumber": "8880987654",
    "amount": 250.00,
    "fee": 0.00,
    "status": "COMPLETED",
    "executedAt": "2026-07-27T23:00:05Z"
  },
  "timestamp": "2026-07-27T23:00:05Z"
}
```

- **Response `202 Accepted` (Requires OTP)**:
```json
{
  "success": true,
  "code": "OTP_REQUIRED",
  "message": "Transaction exceeds $1,000 threshold. OTP sent to your registered email/phone.",
  "data": {
    "transactionReference": "TXN-20260727-991204",
    "status": "PENDING_OTP",
    "otpExpiresInSeconds": 300
  },
  "timestamp": "2026-07-27T23:00:05Z"
}
```

---

### 4. Admin Management Endpoints

#### GET `/api/v1/admin/transactions`
- **Description**: Paginated transaction history audit search for bank compliance officers.
- **Authentication**: Bearer JWT (`ROLE_ADMIN`, `ROLE_EMPLOYEE`).
- **Query Parameters**: `page=0&size=20&startDate=2026-07-01&status=COMPLETED`
- **Response `200 OK`**:
```json
{
  "success": true,
  "code": "ADMIN_TX_PAGE_RETRIEVED",
  "message": "Transaction logs retrieved.",
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 20,
    "totalElements": 1420,
    "totalPages": 71,
    "last": false
  },
  "timestamp": "2026-07-27T23:00:00Z"
}
```
