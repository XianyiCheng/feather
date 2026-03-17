#!/usr/bin/env python3
"""Parse all PDF files in the project to text files using pypdf."""

import sys
from pathlib import Path
from pypdf import PdfReader

REF_ROOT = Path(__file__).parent


def parse_pdf(pdf_path: Path) -> Path:
    """Convert a single PDF to a .txt file next to the original."""
    txt_path = pdf_path.with_suffix(".txt")
    try:
        reader = PdfReader(str(pdf_path))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        txt_path.write_text(text, encoding="utf-8")
        return txt_path
    except Exception as e:
        print(f"  FAILED: {e}", file=sys.stderr)
        return None


def main():
    pdfs = sorted(REF_ROOT.rglob("*.pdf"))
    if not pdfs:
        print("No PDF files found.")
        return

    print(f"Found {len(pdfs)} PDF file(s):\n")
    for pdf in pdfs:
        rel = pdf.relative_to(REF_ROOT)
        print(f"  Parsing: {rel}")
        txt_path = parse_pdf(pdf)
        if txt_path:
            size = txt_path.stat().st_size
            print(f"  -> {txt_path.relative_to(REF_ROOT)} ({size:,} bytes)")
        print()

    print("Done.")


if __name__ == "__main__":
    main()