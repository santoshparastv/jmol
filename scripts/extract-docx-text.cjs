const fs = require('fs');
const path = require('path');

// Use mammoth to extract text from .docx files
let mammoth;
try {
  mammoth = require('mammoth');
} catch (e) {
  console.error('mammoth library not found. Installing...');
  console.error('Please run: npm install mammoth');
  process.exit(1);
}

/**
 * Extract text from DOCX file
 */
async function extractDOCXText(docxPath) {
  try {
    const result = await mammoth.extractRawText({ path: docxPath });
    return result.value; // The extracted text
  } catch (error) {
    console.error(`Error reading DOCX ${docxPath}:`, error.message);
    return null;
  }
}

/**
 * Parse LWF data from extracted text
 */
function parseLWFData(text) {
  const lwfData = {};
  
  const lines = text.split('\n');
  const stateNames = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Haryana',
    'West Bengal', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana',
    'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar',
    'Odisha', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand',
    'Himachal Pradesh', 'Goa', 'Puducherry', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
  ];
  
  let currentState = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line contains a state name
    for (const state of stateNames) {
      if (line.includes(state) && !lwfData[state]) {
        currentState = state;
        break;
      }
    }
    
    // Look for LWF rates (patterns like "25/50", "10/20", "25 50", etc.)
    if (currentState) {
      // Pattern: number/number or number number or number,number
      const rateMatch = line.match(/(\d+)[\s/,]+(\d+)/);
      if (rateMatch) {
        const employee = parseInt(rateMatch[1]);
        const employer = parseInt(rateMatch[2]);
        // Reasonable range check
        if (employee >= 0 && employee <= 100 && employer >= 0 && employer <= 200) {
          if (!lwfData[currentState] || (employee > 0 || employer > 0)) {
            lwfData[currentState] = { employee, employer };
          }
        }
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
  const stateNames = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Haryana',
    'West Bengal', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana',
    'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar',
    'Odisha', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand',
    'Himachal Pradesh', 'Goa', 'Puducherry', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
  ];
  
  let currentState = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line contains a state name
    for (const state of stateNames) {
      if (line.includes(state) && !esicData[state]) {
        currentState = state;
        break;
      }
    }
    
    // Look for ESIC applicability keywords
    if (currentState) {
      const applicable = /(applicable|yes|mandatory|required|covered)/i.test(line);
      const notApplicable = /(not applicable|no|n\/a|na|not covered)/i.test(line);
      
      if (applicable || notApplicable) {
        if (!esicData[currentState]) {
          esicData[currentState] = {
            applicable: applicable && !notApplicable,
            threshold: 21000 // Default threshold
          };
        }
      }
      
      // Look for threshold values (like 21000, 15000, etc.)
      const thresholdMatch = line.match(/(\d{4,5})/);
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
  const lwfDocxPath = path.join(projectRoot, 'LWF.docx');
  const esicDocxPath = path.join(projectRoot, 'ESIC State Wise.docx');
  
  console.log('DOCX Text Extraction Script');
  console.log('============================\n');
  
  // Extract LWF data
  if (fs.existsSync(lwfDocxPath)) {
    console.log('Extracting LWF data from LWF.docx...');
    const lwfText = await extractDOCXText(lwfDocxPath);
    
    if (lwfText) {
      console.log(`\nExtracted ${lwfText.length} characters`);
      console.log('\n--- LWF DOCX Text (first 2000 chars) ---');
      console.log(lwfText.substring(0, 2000));
      console.log('\n--- Parsed LWF Data ---');
      const lwfData = parseLWFData(lwfText);
      console.log(JSON.stringify(lwfData, null, 2));
      
      // Save to file
      const outputPath = path.join(projectRoot, 'scripts', 'lwf-extracted.json');
      fs.writeFileSync(outputPath, JSON.stringify(lwfData, null, 2));
      console.log(`\nLWF data saved to: ${outputPath}`);
      
      // Also save full text
      const textPath = path.join(projectRoot, 'scripts', 'lwf-full-text.txt');
      fs.writeFileSync(textPath, lwfText);
      console.log(`Full text saved to: ${textPath}`);
    } else {
      console.log('Failed to extract text from LWF.docx');
    }
  } else {
    console.log(`LWF.docx not found at: ${lwfDocxPath}`);
  }
  
  // Extract ESIC data
  if (fs.existsSync(esicDocxPath)) {
    console.log('\n\nExtracting ESIC data from ESIC State Wise.docx...');
    const esicText = await extractDOCXText(esicDocxPath);
    
    if (esicText) {
      console.log(`\nExtracted ${esicText.length} characters`);
      console.log('\n--- ESIC DOCX Text (first 2000 chars) ---');
      console.log(esicText.substring(0, 2000));
      console.log('\n--- Parsed ESIC Data ---');
      const esicData = parseESICData(esicText);
      console.log(JSON.stringify(esicData, null, 2));
      
      // Save to file
      const outputPath = path.join(projectRoot, 'scripts', 'esic-extracted.json');
      fs.writeFileSync(outputPath, JSON.stringify(esicData, null, 2));
      console.log(`\nESIC data saved to: ${outputPath}`);
      
      // Also save full text
      const textPath = path.join(projectRoot, 'scripts', 'esic-full-text.txt');
      fs.writeFileSync(textPath, esicText);
      console.log(`Full text saved to: ${textPath}`);
    } else {
      console.log('Failed to extract text from ESIC State Wise.docx');
    }
  } else {
    console.log(`ESIC State Wise.docx not found at: ${esicDocxPath}`);
  }
  
  console.log('\n\nNote: The parsing is basic. Please review the extracted data and manually verify/update if needed.');
  console.log('You can check the full extracted text files to manually extract any missing data.');
}

// Run the script
main().catch(console.error);
