# 100 Enterprise Java Backend & Banking Architecture Interview Questions

This chapter presents **100 high-frequency, production-focused interview questions and detailed answers** designed specifically for Java Backend Engineers, Senior Developers, and Tech Leads interviewing at Banks, FinTechs, and Product Software Companies.

---

## Category 1: Core Java 21 Features & Concurrency (Q1 - Q10)

### Q1: Why did you choose Java 21 for this Digital Banking Platform?
**Answer**: Java 21 is a Long-Term Support (LTS) release that introduces Virtual Threads (Project Loom), Record Patterns, Pattern Matching for Switch, and Sequenced Collections. In a high-throughput banking platform, Virtual Threads allow handling thousands of concurrent HTTP REST requests per core with minimal OS thread overhead, significantly lowering memory footprints compared to traditional platform thread pools.

### Q2: How do Virtual Threads differ from traditional Java Platform Threads?
**Answer**: Platform Threads map 1:1 to OS kernel threads, costing around 1MB of stack memory each. Virtual Threads are lightweight instances managed by the JVM (m:n scheduling over carrier platform threads), costing only bytes to kilobytes. When a Virtual Thread performs I/O (e.g., blocking JDBC call or Redis lookup), the JVM unmounts it from the carrier thread, allowing other virtual threads to run.

### Q3: What is thread pinning in Virtual Threads and how do you avoid it in Spring Boot 3?
**Answer**: Thread pinning occurs when a Virtual Thread executes a synchronized block/method or native call, preventing the JVM from unmounting it from its carrier OS thread during blocking I/O. In Java 21 Spring Boot applications, we replace `synchronized` blocks with `ReentrantLock` or modern concurrency primitives.

### Q4: Why are Java 21 `record` types preferred for DTOs in this banking platform?
**Answer**: `record` classes are immutable data carriers that automatically generate getters, `equals()`, `hashCode()`, and `toString()`. Immutability prevents accidental state modification of transfer payloads and security contexts across application layers.

### Q5: Explain the difference between `CompletableFuture` and Virtual Threads for async execution.
**Answer**: `CompletableFuture` relies on callback chaining and reactive styles, making code harder to read and debug (lost stack traces). Virtual Threads allow developers to write simple, sequential blocking-style code that performs asynchronously under the hood without complex reactive streams.

### Q6: How do Sequenced Collections in Java 21 benefit ledger transaction processing?
**Answer**: `SequencedCollection`, `SequencedSet`, and `SequencedMap` provide unified methods (`getFirst()`, `getLast()`, `reversed()`) for ordered collections, making operations like fetching the latest transaction ledger entry deterministic and clean.

### Q7: What is the Memory Model guarantee of `volatile` in banking transaction flags?
**Answer**: `volatile` guarantees visibility (changes by one thread are immediately visible to others) and prevents instruction reordering. However, it does NOT guarantee atomicity for compound operations (e.g., `balance++`). For atomic balance mutations, atomic classes (`AtomicReference`) or database locks are required.

### Q8: Explain how ConcurrentHashMap works internally in Java 21.
**Answer**: It uses an array of HashBins with CAS (Compare-And-Swap) for node insertion and synchronized locks on individual bin heads during collisions, allowing concurrent reads without locking and highly fine-grained concurrent writes.

### Q9: How do you handle Uncaught Exceptions in Java Thread Pools?
**Answer**: By setting a custom `Thread.UncaughtExceptionHandler` or overriding `afterExecute()` in `ThreadPoolExecutor`. In Spring Boot, custom `AsyncUncaughtExceptionHandler` handles exceptions thrown by `@Async` methods.

### Q10: How does Garbge Collection tuning (e.g., ZGC / G1GC) impact banking latency?
**Answer**: Generational ZGC provides sub-millisecond max pause times regardless of heap size (from MBs to TBs), eliminating Stop-The-World pauses during peak trading or transfer hours.

---

## Category 2: Spring Boot 3 & Dependency Injection (Q11 - Q20)

### Q11: What is new in Spring Boot 3 compared to Spring Boot 2?
**Answer**: Spring Boot 3 requires Java 17+ (Java 21 supported), migrates from `javax.*` to `jakarta.*` packages, adopts Spring Framework 6, supports GraalVM Native Images, and introduces built-in Micrometer Observation APIs.

### Q12: How does Spring manage bean lifecycles?
**Answer**: Instantiation -> Property Population -> `BeanNameAware` / `BeanFactoryAware` -> Pre-initialization (`BeanPostProcessor`) -> `@PostConstruct` / `InitializingBean` -> Custom Init Method -> Ready for Use -> `@PreDestroy` / `DisposableBean` -> Destruction.

### Q13: What is the difference between `@Component`, `@Service`, `@Repository`, and `@Controller`?
**Answer**: They are all `@Component` specializations. `@Service` marks domain logic, `@Repository` adds automatic DB exception translation to Spring's `DataAccessException` hierarchy, and `@Controller` handles HTTP routing.

### Q14: Explain Constructor Injection vs Field Injection (`@Autowired`).
**Answer**: Constructor injection ensures required dependencies cannot be null, promotes immutability (`final` fields), simplifies unit testing without reflection, and detects circular dependencies at startup. Field injection is discouraged.

### Q15: How do you solve Circular Dependencies in Spring Boot 3?
**Answer**: Circular dependencies are disabled by default in Spring Boot 3. They should be resolved by refactoring common logic into a separate shared service or using `@Lazy` injection as a last resort.

### Q16: What is `@ConditionalOnProperty` used for in banking environments?
**Answer**: It conditionally registers Spring beans based on configuration properties (e.g., enabling mock payment gateways in local profiles while enabling real SWIFT gateways in production).

### Q17: How does Spring Boot Auto-Configuration work?
**Answer**: `@EnableAutoConfiguration` scans `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`, checking `@Conditional` annotations against classpath dependencies and properties to auto-register beans.

### Q18: What is the purpose of Spring Data JPA Repositories?
**Answer**: It abstracts data access code by providing generic CRUD methods (`JpaRepository`), automatic query generation from method names (`findByAccountNumber`), and support for custom JPQL/Native SQL queries.

### Q19: Explain the `@Value` annotation vs `@ConfigurationProperties`.
**Answer**: `@Value` injects individual primitive values. `@ConfigurationProperties` binds structured hierarchical property trees to strongly-typed Java objects with relaxed binding and Bean Validation support.

### Q20: How do you gracefully shut down a Spring Boot application?
**Answer**: Configure `server.shutdown=graceful` in `application.yml`. When SIGTERM is received, the HTTP server stops accepting new connections and waits for active requests to finish before destroying beans.

---

## Category 3: Spring Security 6 & Authentication (Q21 - Q30)

### Q21: How has Spring Security 6 changed configuration syntax?
**Answer**: Deprecated `WebSecurityConfigurerAdapter`. Configuration now uses functional lambda DSL with `SecurityFilterChain` beans (e.g., `http.authorizeHttpRequests(auth -> auth.requestMatchers(...).permitAll())`).

### Q22: Explain the structure of a JWT (JSON Web Token).
**Answer**: Three Base64Url-encoded parts separated by dots: **Header** (algorithm & token type), **Payload** (claims: sub, exp, roles, iat), and **Signature** (HMAC-SHA256 hash using secret key).

### Q23: Why store Refresh Tokens in HttpOnly Cookies instead of LocalStorage?
**Answer**: LocalStorage is accessible by any JavaScript code on the domain, exposing tokens to Cross-Site Scripting (XSS) attacks. `HttpOnly` cookies cannot be accessed via JavaScript, mitigating token theft.

### Q24: What is Token Rotation in Refresh Token strategies?
**Answer**: Every time a Refresh Token is used to issue a new Access Token, the old Refresh Token is invalidated and a brand new Refresh Token is returned, preventing replay attacks if a refresh token is leaked.

### Q25: How does Spring Security handle CORS?
**Answer**: Via `CorsConfigurationSource` bean defining allowed origins, HTTP methods, headers, and `allowCredentials(true)` for cookies.

### Q26: What is CSRF and why is it disabled for stateless JWT APIs?
**Answer**: CSRF exploits authenticated browser sessions. When APIs use `Authorization: Bearer` headers instead of ambient cookies for API authorization, CSRF protection can be disabled because browsers do not attach custom authorization headers automatically.

### Q27: How is Method Security implemented with `@PreAuthorize`?
**Answer**: Enabled via `@EnableMethodSecurity`. `@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")` uses Spring Expression Language (SpEL) to evaluate permissions before method execution.

### Q28: Explain how custom `OncePerRequestFilter` works in JWT verification.
**Answer**: It intercepts every incoming HTTP request exactly once, extracts the `Bearer` token from the `Authorization` header, validates signature and expiration, constructs an `Authentication` token, and populates `SecurityContextHolder.getContext()`.

### Q29: What is the role of `SecurityContextHolder`?
**Answer**: It stores details of the currently authenticated principal (user) in a `ThreadLocal` (or `InheritableThreadLocal` / context propagation wrapper for virtual threads).

### Q30: How do you implement Multi-Factor Authentication (MFA/OTP) in Spring Security?
**Answer**: After primary password authentication succeeds, issue a temporary, restricted token (`SCOPE_PRE_AUTH`) allowing access only to the `/auth/verify-otp` endpoint until valid OTP is submitted.

---

## Category 4: Database Transactions & Concurrency Control (Q31 - Q45)

### Q31: What are ACID properties in database management?
**Answer**:
- **Atomicity**: All operations in a transaction succeed or all rollback.
- **Consistency**: DB transitions from one valid state to another, obeying all constraints.
- **Isolation**: Concurrent transactions execute without interfering with each other.
- **Durability**: Committed data persists even after system crashes.

### Q32: What are ANSI SQL Transaction Isolation Levels?
**Answer**:
1. **Read Uncommitted**: Allows dirty reads.
2. **Read Committed**: Prevents dirty reads; allows non-repeatable reads (Default in PostgreSQL).
3. **Repeatable Read**: Prevents dirty and non-repeatable reads; allows phantom reads.
4. **Serializable**: Highest level; completely isolates concurrent transactions (emulates sequential execution).

### Q33: Define Dirty Read, Non-Repeatable Read, and Phantom Read.
**Answer**:
- **Dirty Read**: Reading uncommitted changes made by another transaction.
- **Non-Repeatable Read**: Re-reading a row within a transaction yields different column data due to another committed update.
- **Phantom Read**: Re-running a range query yields new "phantom" rows inserted by another committed transaction.

### Q34: How does Spring `@Transactional` work under the hood?
**Answer**: Spring creates a AOP proxy around the bean. The proxy starts a database transaction before method execution, binds the DB connection to the thread context, and commits upon completion or rolls back if an unhandled runtime exception is thrown.

### Q35: What causes `@Transactional` self-invocation issues?
**Answer**: Spring AOP proxies only intercept calls originating from *outside* the bean. Calling a `@Transactional` method internally from another method in the same class bypasses the proxy, disabling transaction management.

### Q36: What is the default rollback behavior of `@Transactional`?
**Answer**: Spring rolls back transactions automatically for `RuntimeException` and `Error`, but NOT for checked `Exception` unless explicitly specified using `@Transactional(rollbackFor = Exception.class)`.

### Q37: Differentiate between Optimistic Locking and Pessimistic Locking.
**Answer**:
- **Optimistic Locking**: Assumes low contention; uses a `@Version` column. Throws `OptimisticLockException` if version changes during update. No DB locks held.
- **Pessimistic Locking**: Assumes high contention; issues `SELECT FOR UPDATE`, locking the DB row(s) until transaction completes.

### Q38: When should you use Pessimistic Locking in Digital Banking?
**Answer**: During balance debits and credits on checking accounts where simultaneous requests could lead to race conditions or negative balances.

### Q39: How do you prevent Deadlocks when acquiring Pessimistic Locks on multiple accounts?
**Answer**: Always acquire locks on accounts in a deterministic, global order (e.g., sorting account numbers lexicographically before executing `SELECT FOR UPDATE`).

### Q40: What is an Idempotent API and why is it mandatory for transfers?
**Answer**: An operation is idempotent if making multiple identical requests yields the same system state as a single request. In banking, network retries must not execute duplicate debits.

### Q41: How is Idempotency implemented using Redis?
**Answer**: The client sends a unique `Idempotency-Key` header. The server performs an atomic `SETNX` (Set if Not Exists) in Redis. If key exists, return stored cached response; if not, execute transaction and cache result.

### Q42: What is the Propagation attribute in `@Transactional`?
**Answer**: Controls transaction scope: `REQUIRED` (joins existing or creates new), `REQUIRES_NEW` (suspends current, starts new), `MANDATORY` (must run inside existing), `SUPPORTS`, `NOT_SUPPORTED`, `NEVER`, `NESTED`.

### Q43: When would you use `Propagation.REQUIRES_NEW`?
**Answer**: When writing audit logs or notification records that must persist regardless of whether the main business transaction succeeds or rolls back.

### Q44: What is N+1 Select Problem in Hibernate and how do you fix it?
**Answer**: Occurs when fetching an entity with lazy associations results in 1 query for parent and N queries for children. Fixed using `JOIN FETCH` in JPQL, `@EntityGraph`, or DTO projections.

### Q45: Why avoid `@Data` on JPA Entities in Lombok?
**Answer**: `@Data` generates `equals()` and `hashCode()` using all fields, which triggers full evaluation of lazy-loaded collections and causes cyclic reference stack overflows.

---

## Category 5: Banking Domain & Ledger Accounting (Q46 - Q55)

### Q46: What is Double-Entry Ledger Bookkeeping?
**Answer**: An accounting system where every financial transaction requires equal and opposite entries: a Debit to one account and a Credit to another. The total sum of all debits must equal total credits ($\sum \text{Debits} = \sum \text{Credits}$).

### Q47: Explain Available Balance vs Ledger Balance.
**Answer**:
- **Ledger Balance**: Total actual money in the account.
- **Available Balance**: Money available for immediate withdrawal (`Available Balance = Ledger Balance - Frozen/On-Hold Amounts`).

### Q48: What is KYC (Know Your Customer) and how does it affect user status?
**Answer**: Regulatory compliance requirement to verify identity. Customers start in `PENDING_KYC` with low transaction limits until documents (National ID, address proof) are verified by employees.

### Q49: How do you calculate Daily Accrued Interest on Savings accounts?
**Answer**: $\text{Daily Interest} = \frac{\text{Principal} \times \text{Annual Interest Rate}}{\text{Days in Year (365/366)}}$. Accrued daily and posted monthly.

### Q50: How do bank daily transaction limits work?
**Answer**: The system aggregates total debits executed by a customer within the current calendar day (UTC/Local timezone) stored in Redis or DB and compares against their tier limit before authorizing new transfers.

### Q51: How do you handle Currency Precision in Java and PostgreSQL?
**Answer**: Always use `BigDecimal` in Java and `NUMERIC(18, 4)` in PostgreSQL. Never use `float` or `double` due to IEEE 754 binary floating-point rounding errors.

### Q52: What is a SWIFT Code vs IBAN?
**Answer**: **SWIFT/BIC** identifies a specific bank globally. **IBAN** (International Bank Account Number) identifies an individual customer account internationally.

### Q53: What is a Reversal Transaction?
**Answer**: Adjusting entry that undoes an erroneous or failed transaction by executing an exact opposite debit/credit entry without deleting historical records.

### Q54: Why are financial audit logs immutable?
**Answer**: Regulatory standards (SOX, PCI-DSS) dictate that transaction histories must never be updated or deleted (`UPDATE`/`DELETE` forbidden). Corrections require new compensating transactions.

### Q55: Explain the lifecycle of a Savings Deposit account.
**Answer**: `PENDING_FUNDING` -> `ACTIVE` -> `MATURED` (or `EARLY_CLOSED`).

---

## Category 6: Redis Caching & Distributed Lock (Q56 - Q65)

### Q56: What is Redis and why is it used in Digital Banking?
**Answer**: In-memory data structure store used as a high-speed cache, session repository, rate limiter, and distributed lock manager.

### Q57: What is Cache Penetration, Cache Avalanche, and Cache Stampede?
**Answer**:
- **Penetration**: Queries for non-existent keys bypass cache and hit DB. Solved with Bloom Filters or caching nulls.
- **Avalanche**: Many keys expire simultaneously, overwhelming DB. Solved with randomized TTL jitter.
- **Stampede (Thundering Herd)**: Multiple threads miss cache concurrently and run expensive DB queries. Solved with distributed locks.

### Q58: How does Redis eviction work when memory is full?
**Answer**: Configured via `maxmemory-policy` (e.g., `allkeys-lru`, `volatile-lru`, `noeviction`).

### Q59: How do you configure Redis Sentinel vs Redis Cluster?
**Answer**: **Sentinel** provides high availability and automatic failover for master-replica setups. **Cluster** provides horizontal sharding across multiple nodes.

### Q60: Explain Redlock algorithm for distributed locking.
**Answer**: Redlock acquires locks across $N$ independent Redis instances using quorum ($N/2 + 1$) consensus to guarantee lock validity even if single Redis nodes crash.

### Q61: What is Spring Cache Abstraction (`@Cacheable`, `@CacheEvict`)?
**Answer**: Annotations that intercept method execution: `@Cacheable` returns cached values if present; `@CacheEvict` removes entries when data mutates.

### Q62: How do you maintain Cache Consistency with PostgreSQL?
**Answer**: Cache-Aside pattern: Read from cache; on miss, read DB and populate cache. On write, mutate DB first, then evict cache entry (`@CacheEvict`).

### Q63: What Redis data structures are used in this project?
**Answer**: **Strings** (JWT/Tokens), **Hashes** (User Session), **Sorted Sets** (Leaderboards/Rate limiting), **Pub/Sub** (WebSockets).

### Q64: Explain Redis Rate Limiting using Sliding Window.
**Answer**: Uses Sorted Sets (`ZADD`) storing timestamps as score and member. Removes members older than window (`ZREMRANGEBYSCORE`), then checks `ZCARD` against limit.

### Q65: Why use Redis for STOMP WebSocket session tracking?
**Answer**: Tracks connected client session IDs across scaled application instances so notifications can be routed to the correct node hosting the WebSocket connection.

---

## Category 7: RabbitMQ & Real-Time WebSockets (Q66 - Q75)

### Q66: What is the difference between RabbitMQ and Apache Kafka?
**Answer**: RabbitMQ is a push-based message broker optimized for complex routing and task queues. Kafka is a pull-based distributed event streaming log optimized for high-throughput replayable streams.

### Q67: Explain RabbitMQ Exchange types: Direct, Fanout, Topic, Headers.
**Answer**:
- **Direct**: Routes based on exact routing key match.
- **Fanout**: Broadcasts message to all bound queues.
- **Topic**: Routes based on wildcard pattern matching (`banking.*.transfers`).
- **Headers**: Routes based on message header attributes.

### Q68: How do you handle message consumption failures in RabbitMQ?
**Answer**: Use Dead Letter Exchanges (DLX) and Dead Letter Queues (DLQ) with retry counts and exponential backoff to park unprocessable messages for inspection.

### Q69: What is Message Idempotency in RabbitMQ consumers?
**Answer**: Ensuring consumers can safely process duplicate messages by checking message unique IDs in DB/Redis before executing side effects.

### Q70: How do you ensure zero message loss in RabbitMQ?
**Answer**: Publisher confirms + Persistent messages (`delivery_mode=2`) + Durable queues + Consumer manual acknowledgments (`ACK`).

### Q71: What is STOMP protocol in WebSockets?
**Answer**: Simple Text Oriented Messaging Protocol; a frame-based messaging sub-protocol running over WebSockets providing publish/subscribe semantics (`SUBSCRIBE`, `SEND`, `MESSAGE`).

### Q72: How does WebSocket STOMP authentication work in Spring?
**Answer**: In the STOMP `CONNECT` frame, pass JWT token in headers. A custom `ChannelInterceptor` intercepting `CONNECT` validates JWT and populates WebSocket `StompHeaderAccessor` principal.

### Q73: What is SockJS fallback?
**Answer**: A browser JavaScript library that emulates WebSocket API using HTTP long-polling or streaming when native WebSockets are blocked by enterprise firewalls.

### Q74: Why decouple notifications from financial transaction execution?
**Answer**: Notification failures (e.g., slow SMTP or push gateway) must not cause financial database transactions to roll back or increase user wait latency.

### Q75: Explain Spring `@EventListener` vs RabbitMQ messaging.
**Answer**: `@EventListener` handles synchronous/asynchronous in-memory events within a single JVM. RabbitMQ broadcasts events across multiple distributed nodes or services.

---

## Category 8: Architecture & Design Patterns (Q76 - Q85)

### Q76: What is Modular Monolith Architecture?
**Answer**: An architectural pattern where application code is built as a single deployable unit, but organized internally into strictly bounded, loosely coupled modules with explicit interfaces.

### Q77: Why choose Modular Monolith over Microservices for this project?
**Answer**: Eliminates distributed transaction complexities (Saga/2PC), network latency, operational overhead of Kubernetes/Service Meshes, while maintaining clean code boundaries for future service extraction.

### Q78: Explain SOLID principles in Java context.
**Answer**:
- **S**: Single Responsibility Principle.
- **O**: Open/Closed Principle.
- **L**: Liskov Substitution Principle.
- **I**: Interface Segregation Principle.
- **D**: Dependency Inversion Principle.

### Q79: How does Hexagonal Architecture (Ports and Adapters) work?
**Answer**: Decouples domain logic (core) from external infrastructure (DB, HTTP REST, Messaging) using Interfaces (Ports) and Implementation classes (Adapters).

### Q80: What is the Builder Pattern and how does Lombok `@Builder` support it?
**Answer**: Creational pattern for constructing complex objects step-by-step. Lombok generates fluent builder methods, improving code readability.

### Q81: Explain the Factory Pattern in Payment Gateway integrations.
**Answer**: A `PaymentGatewayFactory` instantiates specific gateway implementations (`PayPalService`, `StripeService`, `SwiftService`) based on user choice at runtime.

### Q82: What is MapStruct and why use it over ModelMapper?
**Answer**: MapStruct generates type-safe bean mapping code at compile-time, providing high performance and zero reflection overhead compared to runtime mappers.

### Q83: Explain the Strategy Pattern in Fee Calculation.
**Answer**: Interface `FeeCalculationStrategy` implemented by `VIPCustomerFeeStrategy`, `StandardFeeStrategy`, allowing dynamic selection of fee algorithms at runtime.

### Q84: What is the Circuit Breaker Pattern (Resilience4j)?
**Answer**: Monitors external call failures. If failure threshold is crossed, circuit "opens", immediately returning fallback responses without calling failing downstream services.

### Q85: How do you enforce modular package isolation in Java 21?
**Answer**: Using Java Platform Module System (JPMS `module-info.java`) or ArchUnit static analysis unit tests.

---

## Category 9: Testing Strategy & DevOps (Q86 - Q92)

### Q86: What is Testcontainers and why is it superior to H2 in-memory DB?
**Answer**: Testcontainers spins up real Docker containers (PostgreSQL) during tests. Unlike H2, it supports exact PostgreSQL dialect syntax, native JSONB, constraints, and locking behaviors.

### Q87: How do you mock external dependencies in Spring Boot tests?
**Answer**: Using `@MockBean` (or `@MockitoBean` in Spring Boot 3.4+) to replace Spring beans with Mockito mocks in the application context.

### Q88: What is `@DataJpaTest`?
**Answer**: A slice annotation that configures only JPA repositories, entity manager, and SQL logging, ignoring REST controllers and web layers for fast DB testing.

### Q89: Explain `@WebMvcTest`.
**Answer**: Slices the web layer, configuring Spring MVC, Jackson mappers, and security filters without launching full HTTP server.

### Q90: What is Multi-Stage Docker Build?
**Answer**: Dockerfile strategy using multiple `FROM` statements: stage 1 compiles Java code with Maven; stage 2 copies compiled `.jar` into a tiny JRE image, minimizing container footprint and vulnerability surface.

### Q91: How does GitHub Actions workflow execute CI/CD?
**Answer**: Triggered on `git push`, checks out code, sets up JDK 21, executes `mvn clean verify`, builds Docker image, scans for security vulnerabilities, and pushes to Docker Registry.

### Q92: What is Zero-Downtime Deployment (Blue-Green / Rolling)?
**Answer**: Deployment strategy where new application instances are spun up and health-checked before traffic is switched from old instances, ensuring no user request drops.

---

## Category 10: Performance Tuning & Troubleshooting (Q93 - Q100)

### Q93: How do you diagnose high CPU usage in a Spring Boot application?
**Answer**: Capture thread dumps using `jcmd <pid> Thread.print` or `async-profiler`, analyze stack traces for CPU-bound loops or thread contention, and inspect GC pause times.

### Q94: How do you identify OutOfMemoryError (OOM) causes?
**Answer**: Enable `-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/logs/heapdump.hprof` and analyze the `.hprof` file using Eclipse MAT (Memory Analyzer Tool) to locate memory leaks.

### Q95: How do you tune HikariCP Connection Pool settings?
**Answer**: Set `maximum-pool-size` based on formula: $\text{Connections} = (\text{CPU Cores} \times 2) + \text{Effective Spindle Count}$. Enable `leak-detection-threshold=2000` to log unclosed connections.

### Q96: What is slow SQL query log and how do you optimize PostgreSQL queries?
**Answer**: Configure `log_min_duration_statement = 250ms` in PostgreSQL. Analyze slow queries using `EXPLAIN ANALYZE` to check for missing indexes or sequential table scans.

### Q97: How do you prevent Connection Leaks in Spring Data JPA?
**Answer**: Ensure all database streams are closed, avoid keeping transactions open during long third-party REST API calls, and use `@Transactional(readOnly = true)` for read methods.

### Q98: What is Structured Logging (SLF4J + Logback JSON)?
**Answer**: Logging outputs formatted as structured JSON (`{"timestamp":"...", "level":"INFO", "traceId":"...", "message":"..."}`) allowing Logstash/Fluentd to ingest logs directly into Elasticsearch/Grafana Loki.

### Q99: What are Distributed Tracing and MDC (Mapped Diagnostic Context)?
**Answer**: MDC attaches key-value metadata (e.g., `traceId`, `userId`) to the logging context per thread, allowing developers to trace a single request across log entries.

### Q100: How do you handle database migration failures in production with Flyway?
**Answer**: Flyway locks the `flyway_schema_history` table. If migration fails, inspect failure logs, fix SQL script, run `flyway repair` to clear failed state, and redeploy corrected migration.
