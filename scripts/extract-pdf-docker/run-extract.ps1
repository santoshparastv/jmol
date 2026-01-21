# PowerShell script to run PDF extraction in Docker (Windows)

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$lwfPdf = Join-Path $projectRoot "LWF.pdf"
$esicPdf = Join-Path $projectRoot "ESIC State Wise.pdf"
$scriptsDir = Join-Path $projectRoot "scripts"

Write-Host "Building Docker image..."
docker build -t pdf-extractor $PSScriptRoot

Write-Host "`nRunning PDF extraction..."
docker run --rm `
  -v "${lwfPdf}:/data/LWF.pdf:ro" `
  -v "${esicPdf}:/data/ESIC State Wise.pdf:ro" `
  -v "${scriptsDir}:/data/scripts" `
  pdf-extractor

Write-Host "`nExtraction complete! Check scripts/lwf-extracted.json and scripts/esic-extracted.json"
