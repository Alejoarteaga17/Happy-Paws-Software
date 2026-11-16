---
name: security-review
description: "AI-powered codebase security scanner for tracing data flows and finding injection, authentication, authorization, secrets, dependency, and business-logic vulnerabilities."
argument-hint: "Optional path or scope to scan, for example back/src/ or the entire repository."
user-invocable: true
---

# Security Review

Perform a researcher-style security audit. Trace data across files and frameworks instead
of relying only on pattern matching. Nothing is changed automatically.

## When to use

Use this skill for requests to scan code, find vulnerabilities, check SQL injection, XSS,
command injection, secrets, dependencies, authentication, authorization, or insecure input.

## Required workflow

Follow these steps in order:

1. **Resolve scope.** Scan the requested path; otherwise scan the repository root. Identify
   languages and frameworks from dependency manifests. Read the relevant language patterns.
2. **Audit dependencies first.** Review manifests and lockfiles for known CVEs, deprecated
   cryptography, and suspicious packages.
3. **Scan secrets and exposure.** Check env files, CI, Docker, IaC, logs, comments, and
   configuration for credentials, tokens, private keys, and database URLs.
4. **Deep scan vulnerabilities.** Cover injection, XSS, command execution, authentication,
   access control/BOLA/IDOR, mass assignment, CSRF, sensitive data, deserialization,
   path traversal, SSRF, cryptography, race conditions, rate limiting, and predictable IDs.
5. **Trace data flows across files.** Follow HTTP parameters, headers, body, and uploads to
   database, shell, HTML, file, log, and network sinks.
6. **Self-verify every finding.** Re-read the code, check upstream framework protections,
   discard false positives, and assign final severity and confidence.
7. **Report findings.** Use [references/report-format.md](references/report-format.md).
8. **Propose patches only.** For CRITICAL and HIGH findings show before/after code and
   explain the fix. Explicitly state: **"Review each patch before applying. Nothing has
   been changed yet."**

## Severity

| Severity | Meaning |
|---|---|
| 🔴 CRITICAL | Immediate exploitation risk or likely data breach |
| 🟠 HIGH | Serious exploitable vulnerability or privilege escalation |
| 🟡 MEDIUM | Exploitable with conditions or chaining |
| 🔵 LOW | Best-practice issue with low direct impact |
| ⚪ INFO | Security-relevant observation, not a vulnerability |

## Output rules

- Always start with a findings summary table including counts by severity.
- Group findings by category, not by file.
- Include absolute file path, line number, vulnerable snippet, impact, remediation, and
  confidence (High/Medium/Low) for each finding.
- If clean, state "No vulnerabilities found" and list what was scanned.
- Do not apply patches, commit files, or hide findings.

## References

- [vuln-categories.md](references/vuln-categories.md)
- [secret-patterns.md](references/secret-patterns.md)
- [language-patterns.md](references/language-patterns.md)
- [vulnerable-packages.md](references/vulnerable-packages.md)
- [report-format.md](references/report-format.md)
