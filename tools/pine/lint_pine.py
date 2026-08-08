#!/usr/bin/env python3
"""A static check for supply-demand.pine, because nothing here can compile it.

TradingView reports ONE error per round trip, and the round trip is a human
pasting a file into a browser. That is a terrible loop to debug a signature
change in — a renamed parameter and a call site left at the old arity cost two
of them. This catches the classes of mistake that loop is worst at:

  1. ARITY. Every call to a user-defined function must pass as many arguments as
     the definition takes. This is the one that bit: drawLeg() grew an
     `array<bool> sHi` parameter and its two call sites still passed the old 11,
     so `tag` landed in `sHi` and Pine reported a type error two arguments away
     from the actual mistake.
  2. DECLARATION ORDER. Pine has no forward declarations; a function must appear
     before it is called.
  3. RESERVED WORDS as identifiers — `to` is the range keyword in `for i = a to
     b`, and using it as a parameter name produces "Syntax error at input
     \"int\"", pointing a token earlier than the cause.
  4. UNGUARDED ARRAY SWEEPS. `for k = 0 to array.size(x) - 1` counts DOWNWARDS
     when the array is empty (from > to), so it runs with k = 0 then k = -1 and
     throws at runtime instead of skipping.

It is a linter, not a parser: it knows nothing about types, and a clean run does
not mean the script compiles. It means these four mistakes are not in it.

    python3 tools/pine/lint_pine.py [file]
"""
import re
import sys
from pathlib import Path

RESERVED = {
    "and", "or", "not", "if", "else", "for", "to", "by", "while", "switch",
    "var", "varip", "true", "false", "na", "continue", "break", "import",
    "export", "as", "type", "enum", "method", "series", "simple", "const",
    "input", "int", "float", "bool", "string", "color", "line", "label", "box",
    "table", "array", "matrix", "map", "close", "open", "high", "low",
    "volume", "time",
}
# Namespaces whose `name(` looks like a call but never is a user function.
NAMESPACED = re.compile(r'(?:\.|\w)$')


def split_args(text):
    """Top-level comma split, respecting (), [] and quotes."""
    out, depth, cur, quote = [], 0, "", None
    for ch in text:
        if quote:
            cur += ch
            if ch == quote:
                quote = None
            continue
        if ch in "\"'":
            quote, cur = ch, cur + ch
        elif ch in "([":
            depth += 1
            cur += ch
        elif ch in ")]":
            depth -= 1
            cur += ch
        elif ch == "," and depth == 0:
            out.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


def strip_comments(src):
    """Blank out // comments, leaving string literals alone."""
    out, quote, i = [], None, 0
    while i < len(src):
        ch = src[i]
        if quote:
            out.append(ch)
            if ch == quote:
                quote = None
            i += 1
            continue
        if ch in "\"'":
            quote = ch
            out.append(ch)
        elif ch == "/" and i + 1 < len(src) and src[i + 1] == "/":
            while i < len(src) and src[i] != "\n":
                i += 1
            continue
        else:
            out.append(ch)
        i += 1
    return "".join(out)


def main():
    path = Path(sys.argv[1] if len(sys.argv) > 1
                else Path(__file__).with_name("supply-demand.pine"))
    raw = path.read_text(encoding="utf-8")
    code = strip_comments(raw)
    problems = []

    def line_of(pos):
        return code.count("\n", 0, pos) + 1

    # ── 1. definitions: name, arity, where
    defs = {}
    for m in re.finditer(r'(?m)^([A-Za-z_]\w*)\s*\(', code):
        name, start = m.group(1), m.end()
        depth, i = 1, start
        while i < len(code) and depth:
            depth += code[i] == "("
            depth -= code[i] == ")"
            i += 1
        rest = code[i:i + 40]
        if not re.match(r'\s*=>', rest):
            continue
        params = split_args(code[start:i - 1])
        defs[name] = {"n": len(params), "line": line_of(m.start()),
                      "pos": m.start(),
                      "params": [p.split()[-1] for p in params if p]}

    # ── 3. reserved words as parameter names
    for name, d in defs.items():
        for p in d["params"]:
            if p in RESERVED:
                problems.append(
                    f"line {d['line']}: {name}() has a parameter named '{p}', "
                    f"which is a Pine keyword")
        if name in RESERVED:
            problems.append(f"line {d['line']}: function named '{name}' is a keyword")

    # ── 1./2. call sites
    for name, d in defs.items():
        for m in re.finditer(r'\b' + re.escape(name) + r'\s*\(', code):
            if m.start() == d["pos"]:
                continue
            if m.start() and NAMESPACED.search(code[max(0, m.start() - 1)]):
                continue          # foo.name( — a method, not this function
            start = m.end()
            depth, i = 1, start
            while i < len(code) and depth:
                depth += code[i] == "("
                depth -= code[i] == ")"
                i += 1
            args = split_args(code[start:i - 1])
            ln = line_of(m.start())
            if len(args) != d["n"]:
                problems.append(
                    f"line {ln}: {name}() called with {len(args)} argument(s), "
                    f"defined at line {d['line']} with {d['n']}")
            if m.start() < d["pos"]:
                problems.append(
                    f"line {ln}: {name}() called before it is defined "
                    f"(line {d['line']}) — Pine has no forward declarations")

    # ── 1b. user-defined types: Type.new() must pass one value per field
    types = {}
    for m in re.finditer(r'(?m)^type\s+(\w+)\s*$', code):
        name, i = m.group(1), m.end()
        fields = 0
        for ln in code[i:].split("\n")[1:]:
            if not ln.strip():
                break
            if not ln.startswith((" ", "\t")):
                break
            fields += 1
        types[name] = {"n": fields, "line": line_of(m.start())}
    for name, t in types.items():
        for m in re.finditer(r'\b' + re.escape(name) + r'\.new\s*\(', code):
            start = m.end()
            depth, i = 1, start
            while i < len(code) and depth:
                depth += code[i] == "("
                depth -= code[i] == ")"
                i += 1
            args = split_args(code[start:i - 1])
            if args and len(args) != t["n"]:
                problems.append(
                    f"line {line_of(m.start())}: {name}.new() passes "
                    f"{len(args)} value(s), but the type has {t['n']} field(s) "
                    f"(declared line {t['line']})")

    # ── 4. unguarded array sweeps
    for m in re.finditer(r'for\s+(\w+)\s*=\s*0\s+to\s+array\.size\(([^)]+)\)\s*-\s*1', code):
        ln = line_of(m.start())
        window = code[max(0, m.start() - 400):m.start()]
        arr = re.escape(m.group(2).strip())
        if not re.search(r'array\.size\(\s*' + arr + r'\s*\)\s*>\s*0', window):
            problems.append(
                f"line {ln}: `for {m.group(1)} = 0 to array.size({m.group(2)}) - 1` "
                f"has no `array.size(...) > 0` guard above it — Pine counts "
                f"downwards from 0 to -1 on an empty array")

    for p in problems:
        print("  " + p)
    print(f"\n{len(problems)} problem(s) · {len(defs)} function(s) checked")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
