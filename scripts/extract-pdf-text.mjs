import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to use pdf-parse if available
let pdfParse;
try {
  // pdf-parse uses CommonJS, so we need to use createRequire for ESM
  const { createRequire } = await import('module');
  const require = createRequire(import.meta.url);
  pdfParse = require('pdf-parse');
} catch (e) {
  console.error('pdf-parse not found. Installing...');
  console.error('Please run: npm install pdf-parse');
  process.exit(1);
}

/**
 * Extract text from PDF file
 */
async function extractPDFText(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error reading PDF ${pdfPath}:`, error.message);
    return null;
  }
}

/**
 * Parse LWF data from extracted text
 */
function parseLWFData(text) {
  const lwfData = {};
  
  // Common patterns to look for
  const statePatterns = [
    /Maharashtra[:\s]+(\d+)[/\s]+(\d+)/i,
    /Karnataka[:\s]+(\d+)[/\s]+(\d+)/i,
    /Gujarat[:\s]+(\d+)[/\s]+(\d+)/i,
    // Add more patterns as needed
  ];
  
  // Try to find state names and their LWF rates
  const lines = text.split('\n');
  let currentState = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for state names
    const stateMatch = line.match(/^([A-Z][a-z\s]+(?:Pradesh|Bengal|Nadu|Kerala|Pradesh|Pradesh|Pradesh)?)/);
    if (stateMatch) {
      currentState = stateMatch[1].trim();
    }
    
    // Look for LWF rates (Employee/Employer format)
    const rateMatch = line.match(/(\d+)[/\s]+(\d+)/);
    if (rateMatch && currentState) {
      const employee = parseInt(rateMatch[1]);
      const employer = parseInt(rateMatch[2]);
      if (employee > 0 || employer > 0) {
        lwfData[currentState] = { employee, employer };
      }
    }
  }
  
  return lwfData;
}

/**
 * Parse ESIC data from extracted text
 */
function parseESICData(text) {
  const esicData = {};
  
  const lines = text.split('\n');
  let currentState = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for state names
    const stateMatch = line.match(/^([A-Z][a-z\s]+(?:Pradesh|Bengal|Nadu|Kerala|Pradesh|Pradesh|Pradesh)?)/);
    if (stateMatch) {
      currentState = stateMatch[1].trim();
    }
    
    // Look for ESIC applicability keywords
    if (currentState) {
      const applicable = /(applicable|yes|mandatory|required)/i.test(line);
      const notApplicable = /(not applicable|no|n\/a|na)/i.test(line);
      
      if (applicable || notApplicable) {
        if (!esicData[currentState]) {
          esicData[currentState] = {
            applicable: applicable && !notApplicable,
            threshold: 21000 // Default threshold
          };
        }
      }
      
      // Look for threshold values
      const thresholdMatch = line.match(/(\d{4,6})/);
      if (thresholdMatch && currentState && esicData[currentState]) {
        const threshold = parseInt(thresholdMatch[1]);
        if (threshold >= 10000 && threshold <= 50000) {
          esicData[currentState].threshold = threshold;
        }
      }
    }
  }
  
  return esicData;
}

/**
 * Main extraction function
 */
async function main() {
  const projectRoot = path.join(__dirname, '..');
  const lwfPdfPath = path.join(projectRoot, 'LWF.pdf');
  const esicPdfPath = path.join(projectRoot, 'ESIC State Wise.pdf');
  
  console.log('PDF Text Extraction Script');
  console.log('==========================\n');
  
  // Extract LWF data
  if (fs.existsSync(lwfPdfPath)) {
    console.log('Extracting LWF data from LWF.pdf...');
    const lwfText = await extractPDFText(lwfPdfPath);
    
    if (lwfText) {
      console.log('\n--- LWF PDF Text (first 2000 chars) ---');
      console.log(lwfText.substring(0, 2000));
      console.log('\n--- Parsed LWF Data ---');
      const lwfData = parseLWFData(lwfText);
      console.log(JSON.stringify(lwfData, null, 2));
      
      // Save to file
      const outputPath = path.join(projectRoot, 'scripts', 'lwf-extracted.json');
      fs.writeFileSync(outputPath, JSON.stringify(lwfData, null, 2));
      console.log(`\nLWF data saved to: ${outputPath}`);
    }
  } else {
    console.log(`LWF.pdf not found at: ${lwfPdfPath}`);
  }
  
  // Extract ESIC data
  if (fs.existsSync(esicPdfPath)) {
    console.log('\n\nExtracting ESIC data from ESIC State Wise.pdf...');
    const esicText = await extractPDFText(esicPdfPath);
    
    if (esicText) {
      console.log('\n--- ESIC PDF Text (first 2000 chars) ---');
      console.log(esicText.substring(0, 2000));
      console.log('\n--- Parsed ESIC Data ---');
      const esicData = parseESICData(esicText);
      console.log(JSON.stringify(esicData, null, 2));
      
      // Save to file
      const outputPath = path.join(projectRoot, 'scripts', 'esic-extracted.json');
      fs.writeFileSync(outputPath, JSON.stringify(esicData, null, 2));
      console.log(`\nESIC data saved to: ${outputPath}`);
    }
  } else {
    console.log(`ESIC State Wise.pdf not found at: ${esicPdfPath}`);
  }
  
  console.log('\n\nNote: The parsing is basic. Please review the extracted data and manually verify/update if needed.');
}

// Run the script
main().catch(console.error);
