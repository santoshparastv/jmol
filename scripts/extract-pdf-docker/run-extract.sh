#!/bin/bash
# Script to run PDF extraction in Docker

# Build the Docker image
docker build -t pdf-extractor .

# Run the container with PDF files mounted
docker run --rm \
  -v "$(pwd)/../../LWF.pdf:/data/LWF.pdf:ro" \
  -v "$(pwd)/../../ESIC State Wise.pdf:/data/ESIC State Wise.pdf:ro" \
  -v "$(pwd)/../../scripts:/data/scripts" \
  pdf-extractor
