FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PDF processing
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python PDF libraries
RUN pip install --no-cache-dir \
    pymupdf \
    pdfplumber \
    PyPDF2 \
    pandas

COPY extract_pdf_data.py .

CMD ["python", "extract_pdf_data.py"]
