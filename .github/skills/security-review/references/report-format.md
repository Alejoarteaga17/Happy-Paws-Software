# Security report format

Start with:

| Severity | Count |
|---|---:|
| 🔴 CRITICAL | 0 |
| 🟠 HIGH | 0 |
| 🟡 MEDIUM | 0 |
| 🔵 LOW | 0 |
| ⚪ INFO | 0 |

Then group finding cards by category. Each card must include:

- Severity, confidence, absolute file and line.
- Vulnerable snippet and source-to-sink data flow.
- Exploit impact and concrete remediation.
- A patch proposal for CRITICAL/HIGH only, without applying it.

Finish with dependency audit, secrets scan, scope, limitations, and the required statement:
**"Review each patch before applying. Nothing has been changed yet."**
