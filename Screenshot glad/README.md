# Screenshot Sentinel

A beginner-friendly academic project that screens an uploaded image for visual authenticity signals.

## Run the project

1. Open the `Screenshot glad ` folder.
2. Double-click `index.html`.
3. Drop a JPG, PNG, or WEBP image into the upload area.
4. Read the score and the four explainable signals.

No installation, server, or internet connection is required after the page loads. The Google Fonts link improves the visual design but the app still works if it is unavailable.

## What this prototype does

- Shows an image preview.
- Reads the local file type, file name, dimensions, and size.
- Calculates an explainable authenticity screening estimate.
- Presents a result as `Likely authentic`, `Needs review`, or `Suspicious`.
- Keeps the selected image in the browser; it does not upload the file anywhere.

## Important project limitation

This is a front-end prototype, not a forensic or AI truth detector. A screenshot can look real while still being edited, and browser-only metadata checks cannot prove where an image came from. For a final-year version, connect the interface to a Python backend with a trained image-forensics model and a database of known examples.

## How to explain it during your presentation

**Problem:** Edited screenshots and misleading images spread quickly through social media.

**Solution:** Screenshot Sentinel gives a fast first-pass screening report and shows the evidence behind the estimate instead of returning an unexplained yes/no answer.

**Future scope:** Add EXIF metadata analysis, error-level analysis, reverse-image search, a Python/FastAPI backend, and a machine-learning classifier trained on authentic and manipulated images.
