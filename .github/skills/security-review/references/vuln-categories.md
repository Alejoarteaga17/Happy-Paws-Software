# Vulnerability categories

Trace sources to sinks for:

- SQL/PostgREST/ORM injection, XSS, command injection, header/log injection, LDAP/XPath.
- Missing authentication, broken object-level authorization, privilege escalation,
  mass assignment, JWT/session/CSRF weaknesses, and missing rate limits.
- Sensitive data exposure, insecure deserialization, path traversal, XXE, and SSRF.
- Weak cryptography, hardcoded keys, predictable randomness, and invalid TLS validation.
- Race conditions, unsafe state transitions, integer issues, and business-logic bypasses.

For each candidate, verify exploitability and framework protections before reporting it.
