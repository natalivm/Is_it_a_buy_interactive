#!/usr/bin/env python3
"""Syntax-check every `run:` block in .github/workflows/*.yml.

    python3 tools/lint_workflows.py

A run block is a shell script that only ever executes on a runner, so an
unbalanced `if` — exactly the "syntax error near unexpected token '}'" this was
written after — costs a full CI round trip to discover. `bash -n` parses
without executing and catches it in milliseconds.

`${{ … }}` expressions are replaced with a quoted placeholder first: they are
GitHub's templating, not shell, and bash cannot parse them. Quoting keeps a
bare `${{ x }}` inside a `[ … ]` test parsing as a single word.
"""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
WORKFLOWS = ROOT / ".github" / "workflows"
EXPR = re.compile(r"\$\{\{[^}]*\}\}")


def check_script(script: str) -> str | None:
    """Return bash's complaint, or None if the script parses."""
    proc = subprocess.run(["bash", "-n"], input=EXPR.sub("gha_expr", script),
                          capture_output=True, text=True)
    return None if proc.returncode == 0 else proc.stderr.strip()


def main() -> int:
    failures = 0
    checked = 0
    for wf in sorted(WORKFLOWS.glob("*.yml")):
        try:
            doc = yaml.safe_load(wf.read_text("utf-8"))
        except yaml.YAMLError as e:
            print(f"FAIL  {wf.name}: not valid YAML — {e}")
            failures += 1
            continue

        for job_name, job in (doc.get("jobs") or {}).items():
            for n, step in enumerate(job.get("steps") or [], 1):
                script = step.get("run")
                if not script:
                    continue
                checked += 1
                label = step.get("name") or f"step {n}"
                err = check_script(script)
                if err:
                    print(f"FAIL  {wf.name} [{job_name}] {label}\n      {err}")
                    failures += 1

    print(f"\n{checked} run block(s) checked, {failures} failure(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
