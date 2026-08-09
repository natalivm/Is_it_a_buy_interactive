#!/usr/bin/env python3
"""Guard the half of a deck no other check reads: its PROSE.

    python3 tools/check_decks.py

Every existing guard — the card audit in refresh.py, the board guard and the
order guard in checks.yml — reads a NUMBER or an ENUM. The ТУТ rung's price,
the ladder's top-down order, a rung's res/sup tag, the deck's stop against the
card's stop, `exchange` against the venue set. Not one of them reads a
sentence. So a deck's four slides can describe the opposite trade and every
check still passes.

That is not hypothetical. On 2026-08-09 four decks were found narrating a
trade their card no longer carried, and all four were audit-clean:

  glw   headline '$144 taken — the short is over' and a rung captioned
        '✅ Лінія перевороту ВЗЯТА — шорт мертвий', on a LIVE SHORT. The rung
        passed because it was correctly priced, correctly tagged and correctly
        ordered — the audit had nothing to object to.
  amd   a five-slide 'PLAN · LONG WATCH' on a short card.
  pltr  still narrating a pre-market earnings gap from a session five days
        gone, with no short entry zone in the ladder at all.
  asml  narrating a different session and an SMH gate that had since cleared.

The drift has a direction: prose is always OLDER and more resolved-sounding
than the numbers, because refresh tooling touches numbers and `--fix-rungs`
even repairs the ТУТ rung automatically. Nobody rewrites a sentence unless
they mean to.

Two checks, both deliberately narrow so they do not cry wolf:

1. SESSION. Every dd.mm in a deck's prose must be the session its own ТУТ rung
   names, or be allowlisted. The ТУТ rung is the right anchor because it is
   already audited against the card's price, so this check cannot disagree
   with the audit — it extends it into the prose.

   Deliberate history is normal and stays legal via a per-deck opt-out:

       <!-- allow-dates: 06.08, 31.07 -->

   Naming them is the point: an allowlisted date is a decision someone made,
   a bare one is drift.

2. SIDE. The PLAN slide's eyebrow must not name the side the card is NOT on.
   A short card whose plan slide reads 'PLAN · LONG WATCH' is the exact GLW/AMD
   failure, and it is one string comparison away from being impossible.

   Only the PLAN eyebrow is checked, not the body. Body prose legitimately
   discusses both sides — a short card explains what would flip it long, and a
   card that has just reversed says so loudly ('БІК ПЕРЕВЕРНУТО: ШОРТ → ЛОНГ').
   Widening this to the body would flag correct decks, and a guard that flags
   correct work gets switched off.

Exit code is the number of findings, so `&&`-chaining works.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# A dd.mm is only a DATE when a date cue precedes it and no % follows. Without
# both tests this fires on ordinary numbers: the first cut used a bare
# \d{2}\.\d{2} and reported 41 of 42 decks stale; adding the month bound still
# left `+13.11%`, `Stoch 15.06`, `(−10.05%)` and a `22.14 / 19.12 / 13.24`
# percentage list reading as sessions. A guard that cries wolf gets switched
# off, so it is deliberately biased toward missing a date over inventing one.
CUE = r"(?:закритт\w*|сесі\w*|премаркет\w*|від|на|за|після|бар\w*|CLOSE|AH|📅|🕐|🌙)"
DATE = re.compile(rf"{CUE}[^\d\n]{{0,12}}(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])(?![\d.]|\s*%)",
                  re.I | re.U)
ALLOW = re.compile(r"<!--\s*allow-dates:\s*([^>]*?)\s*-->", re.I)
RUNGS = re.compile(r"data-rungs='(.*?)'", re.S)
PLAN_EYEBROW = re.compile(
    r'data-label="[^"]*"[^>]*>\s*<div class="eyebrow[^"]*">\s*(PLAN[^<]*)</div>', re.I)

SIDE_WORDS = {"long": ("ЛОНГ", "LONG"), "short": ("ШОРТ", "SHORT")}


def stocks() -> list[dict]:
    raw = subprocess.run(["node", str(ROOT / "tools" / "dump.js"),
                          str(ROOT / "data.js"), "STOCKS"],
                         capture_output=True, text=True, check=True).stdout
    data = json.loads(raw)
    return data["STOCKS"] if isinstance(data, dict) else data


def main() -> int:
    findings: list[str] = []
    for s in stocks():
        story = s.get("story") or ""
        if not story.startswith("stories/"):
            continue
        path = ROOT / story
        if not path.exists():
            continue  # refresh.py already fails a missing story file
        html = path.read_text("utf-8")
        sym = s["symbol"]

        prose = re.sub(r"data-(?:rungs|lv)='[^']*'", "", html, flags=re.S)
        prose = re.sub(r"<[^>]+>", " ", prose)

        # ── 1 · session ────────────────────────────────────────────────────
        m = RUNGS.search(html)
        now = None
        if m:
            try:
                now = next((r for r in json.loads(m.group(1)) if r[0] == "now"), None)
            except json.JSONDecodeError:
                now = None  # the audit reports unparseable ladders already
        if now:
            anchor = DATE.search(now[2])
            anchor = f"{anchor.group(1)}.{anchor.group(2)}" if anchor else None
            # Pull dd.mm tokens out of the comment rather than splitting on
            # commas: the comment is allowed to explain itself, and
            # "06.08 — sessions this deck references on purpose" must parse to
            # {"06.08"}, not to one long string that matches nothing.
            allowed = set()
            for a in ALLOW.findall(html):
                allowed |= set(re.findall(r"\b\d{2}\.\d{2}\b", a))
            if anchor:
                seen = {f"{d}.{mo}" for d, mo in DATE.findall(prose)}
                for d in sorted(seen - {anchor} - allowed):
                    findings.append(
                        f"  {sym}: deck prose names session {d} but its ТУТ rung is "
                        f"{anchor} — refresh the prose, or add "
                        f"`<!-- allow-dates: {d} -->` if the reference is deliberate")

        # ── 2 · side ───────────────────────────────────────────────────────
        side = s.get("side")
        wrong = SIDE_WORDS.get("short" if side == "long" else "long", ())
        right = SIDE_WORDS.get(side, ())
        for eyebrow in PLAN_EYEBROW.findall(html):
            up = eyebrow.upper()
            # Naming the other side is fine when this side is named too — STX's
            # 'ШОРТ ЗНЯТО · ЛОНГ ЛИШЕ НА ВІДКАТІ' is a correct long plan that
            # says what it replaced. The failure is naming ONLY the other side,
            # which is what 'PLAN · LONG WATCH' on a short card did.
            if any(w in up for w in wrong) and not any(w in up for w in right):
                findings.append(
                    f"  {sym}: the PLAN slide reads '{eyebrow.strip()[:48]}' on a "
                    f"{side} card and never names {side} — the deck is describing "
                    f"the other trade")

    print("=" * 78)
    print("DECK PROSE — the half no other check reads")
    print("=" * 78)
    for f in findings:
        print(f)
    print()
    print(f"{len(findings)} finding(s).")
    return len(findings)


if __name__ == "__main__":
    sys.exit(min(main(), 250))
