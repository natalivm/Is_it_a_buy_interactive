#!/usr/bin/env python3
"""Run every step of .github/workflows/checks.yml locally, before pushing.

    python3 tools/run_checks.py

Reads the workflow itself rather than restating its steps, so this cannot
drift from CI: a step added to checks.yml is run here on the next invocation
with nothing to update. Each `run:` block executes under `bash -euo pipefail`,
the same strictness Actions uses. Steps that only make sense on a runner
(pip installs of lint deps already present locally) are skipped by name.

Exit code is the number of failing steps, so `&&`-chaining works.
Needs pyyaml, which tools/lint_workflows.py (one of the steps) needs anyway.
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORKFLOW = ROOT / ".github" / "workflows" / "checks.yml"

SKIP = ("pip install",)


def steps() -> list[tuple[str, str]]:
    """(name, script) per run-step of every job, in file order."""
    import yaml  # noqa: PLC0415 — a hard dependency of lint_workflows.py too
    found = []
    for job in yaml.safe_load(WORKFLOW.read_text("utf-8")).get("jobs", {}).values():
        for s in job.get("steps", []):
            if "run" in s:
                found.append((s.get("name", "(unnamed)"), s["run"]))
    return found


def main() -> int:
    fails = 0
    for name, script in steps():
        if any(k in script for k in SKIP):
            print(f"skip  {name}")
            continue
        r = subprocess.run(["bash", "-euo", "pipefail", "-c", script],
                           capture_output=True, text=True, cwd=ROOT)
        ok = r.returncode == 0
        fails += not ok
        print(f"{'PASS' if ok else 'FAIL'}  {name}")
        if not ok:
            print((r.stdout + r.stderr).strip()[-1200:])
    print("all CI steps pass" if not fails else f"{fails} step(s) FAILED")
    return fails


if __name__ == "__main__":
    raise SystemExit(main())
