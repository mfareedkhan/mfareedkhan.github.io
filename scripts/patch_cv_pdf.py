#!/usr/bin/env python3
"""Apply the approved November 2026 Visiting Lecturer update to the site CV PDF.

The source PDF is kept as the original in the repository. This deterministic
build-time patch adds the new Riphah appointment, preserves the existing MTO
entry, and refreshes the footer date on every page.
"""
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "assets" / "pdf" / "muhammad_fareed_cv.pdf"
OUTPUT_PATH = PDF_PATH.with_name(PDF_PATH.stem + ".updated.pdf")

DARK = (0x34 / 255, 0x3A / 255, 0x40 / 255)
HEADING = (0x13 / 255, 0x1A / 255, 0x28 / 255)
LINK = (0x1C / 255, 0x45 / 255, 0x87 / 255)
GREY = (0x99 / 255, 0x99 / 255, 0x99 / 255)


def font_resources(page):
    """Return existing embedded Roboto resource names and font buffers."""
    resources = {}
    buffers = {}
    for item in page.get_fonts(full=True):
        xref, _ext, _kind, basefont, resource_name, _encoding, _refer = item
        name = basefont or ""
        if "Roboto-Regular" in name:
            key = "regular"
        elif "Roboto-Bold" in name:
            key = "bold"
        elif "Roboto-Italic" in name:
            key = "italic"
        else:
            continue
        extracted = page.parent.extract_font(xref)
        if extracted and extracted[3]:
            resources[key] = resource_name
            buffers[key] = extracted[3]
    missing = {"regular", "bold", "italic"} - resources.keys()
    if missing:
        raise RuntimeError(f"Required embedded Roboto font resources missing: {sorted(missing)}")
    return resources, buffers


def update_professional_experience(doc):
    page = doc[1]
    if "Visiting Lecturer" in page.get_text():
        print("Professional Experience already contains the Visiting Lecturer role; skipping insertion.")
        return

    resources, buffers = font_resources(page)
    regular = fitz.Font(fontbuffer=buffers["regular"])
    bold = fitz.Font(fontbuffer=buffers["bold"])

    # Replace only the original Professional Experience block. The Teaching
    # Experience section below it remains untouched and in its original place.
    page.add_redact_annot(fitz.Rect(35, 595, 560, 672.8), fill=(1, 1, 1), cross_out=False)
    page.apply_redactions(images=0, graphics=1)

    page.insert_text((40, 610.9237), "Professional", fontname=resources["bold"], fontsize=12, color=HEADING)
    page.insert_text((110.9395, 610.9237), "Experience", fontname=resources["regular"], fontsize=12, color=HEADING)
    page.draw_line((40, 618.5), (555, 618.5), color=HEADING, width=0.7, overlay=True)

    # Visiting Lecturer — Computer Vision, Riphah International University.
    page.insert_text((40.2511, 632.0156), "Nov 2026 - Present", fontname=resources["italic"], fontsize=8, color=GREY)
    x = 113.0
    role = "Visiting Lecturer — Computer Vision"
    page.insert_text((x, 632.0156), role, fontname=resources["bold"], fontsize=9, color=DARK)
    x += bold.text_length(role, fontsize=9)
    page.insert_text((x, 632.0156), " at ", fontname=resources["regular"], fontsize=9, color=DARK)
    x += regular.text_length(" at ", fontsize=9)
    institution = "Riphah International University, Lahore Campus."
    institution_width = regular.text_length(institution, fontsize=9)
    if x + institution_width > 555:
        raise RuntimeError("Visiting Lecturer institution line exceeds the available width.")
    page.insert_text((x, 632.0156), institution, fontname=resources["regular"], fontsize=9, color=LINK)
    page.insert_link({
        "kind": fitz.LINK_URI,
        "from": fitz.Rect(x, 621.5, x + institution_width, 634.0),
        "uri": "https://riphah.edu.pk/",
    })
    page.draw_circle((132.5, 642.6), 1.65, color=DARK, fill=DARK, overlay=True)
    page.insert_text(
        (146.5, 645.7),
        "Teaching Computer Vision to BS-AI undergraduate students.",
        fontname=resources["regular"], fontsize=9, color=DARK,
    )

    # Existing MTO role, shifted down slightly and condensed to one line so
    # the original Teaching Experience section remains on the same page.
    page.insert_text((40.2511, 656.0), "Sep 2026 - Present", fontname=resources["italic"], fontsize=8, color=GREY)
    x = 113.0
    prefix = "Working as a "
    page.insert_text((x, 656.0), prefix, fontname=resources["regular"], fontsize=9, color=DARK)
    x += regular.text_length(prefix, fontsize=9)
    role = "Management Trainee Officer — AI/ML"
    page.insert_text((x, 656.0), role, fontname=resources["bold"], fontsize=9, color=DARK)
    x += bold.text_length(role, fontsize=9)
    page.insert_text((x, 656.0), " at ", fontname=resources["regular"], fontsize=9, color=DARK)
    x += regular.text_length(" at ", fontsize=9)
    institution = "Excellence Delivered (ExD)"
    institution_width = regular.text_length(institution, fontsize=9)
    page.insert_text((x, 656.0), institution, fontname=resources["regular"], fontsize=9, color=LINK)
    page.insert_text((x + institution_width, 656.0), ", Lahore.", fontname=resources["regular"], fontsize=9, color=DARK)
    page.insert_link({
        "kind": fitz.LINK_URI,
        "from": fitz.Rect(x, 645.5, x + institution_width, 657.8),
        "uri": "https://www.exdnow.com/enterprise-ai-solutions/",
    })
    page.draw_circle((132.5, 665.9), 1.65, color=DARK, fill=DARK, overlay=True)
    bullet = "Backend AI engineering for CONCORD.AI: API/LLM integration in role-based document workflows."
    if regular.text_length(bullet, fontsize=9) > 406:
        raise RuntimeError("MTO description exceeds the available width.")
    page.insert_text((146.5, 669.0), bullet, fontname=resources["regular"], fontsize=9, color=DARK)


def update_footer_dates(doc):
    for page in doc:
        if "November, 2026" in page.get_text():
            continue
        resources, _buffers = font_resources(page)
        page.add_redact_annot(fitz.Rect(480, 814, 550, 826), fill=(1, 1, 1), cross_out=False)
        page.apply_redactions(images=0, graphics=0)
        page.insert_text(
            (486.5685, 823.0), "November, 2026",
            fontname=resources["regular"], fontsize=8, color=GREY,
        )


def main():
    if not PDF_PATH.exists():
        raise FileNotFoundError(PDF_PATH)
    doc = fitz.open(PDF_PATH)
    if len(doc) != 3:
        raise RuntimeError(f"Expected the existing 3-page CV PDF, found {len(doc)} pages.")
    update_professional_experience(doc)
    update_footer_dates(doc)
    metadata = doc.metadata
    metadata["title"] = "Muhammad Fareed - Curriculum Vitae"
    doc.set_metadata(metadata)
    doc.save(OUTPUT_PATH, garbage=4, deflate=True, clean=True)
    doc.close()

    # Validate the generated artifact before replacing the deployed source copy.
    check = fitz.open(OUTPUT_PATH)
    if len(check) != 3:
        raise RuntimeError("The updated CV PDF no longer has three pages.")
    page2_text = check[1].get_text()
    required = [
        "Visiting Lecturer", "Computer Vision", "Riphah International University",
        "Management Trainee Officer", "role-based document workflows",
    ]
    missing = [phrase for phrase in required if phrase not in page2_text]
    if missing:
        raise RuntimeError(f"Updated CV PDF is missing expected text: {missing}")
    if any("November, 2026" not in page.get_text() for page in check):
        raise RuntimeError("The CV footer date was not updated on every page.")
    check.close()
    OUTPUT_PATH.replace(PDF_PATH)
    print(f"Updated CV PDF: {PDF_PATH}")


if __name__ == "__main__":
    main()
