const fs = require('fs');
const path = require('path');

// Use pdf-parse with CommonJS
let PDFParse;
try {
  const pdfParseModule = require('pdf-parse');
  // PDFParse is a class that needs to be instantiated
  PDFParse = pdfParseModule.PDFParse;
  
  if (!PDFParse) {
    console.error('Could not find PDFParse class. Available keys:', Object.keys(pdfParseModule));
    throw new Error('PDFParse class not found');
  }
} catch (e) {
  console.error('Error loading pdf-parse:', e.message);
  console.error('Please ensure pdf-parse is installed: npm install pdf-parse');
  process.exit(1);
}

/**
 * Extract text from PDF file
 */
async function extractPDFText(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // PDFParse is a class, instantiate it with the buffer
    const parser = new PDFParse(dataBuffer);
    
    // The parser instance should be awaitable or have a method to get text
    const result = await parser;
    
    // The PDFParse library v2.4.5 returns a result with doc property
    // We need to extract text from the document structure
    if (result && result.doc) {
      // The doc might have a method to get text or pages
      // Try to access pages if available
      if (result.doc.pages && Array.isArray(result.doc.pages)) {
        let fullText = '';
        for (const page of result.doc.pages) {
          if (page.text) {
            fullText += page.text + '\n';
          } else if (page.content) {
            fullText += extractTextFromContent(page.content) + '\n';
          }
        }
        if (fullText.trim()) {
          return fullText;
        }
      }
      
      // Try to get text directly from doc
      if (result.doc.text) {
        return result.doc.text;
      }
    }
    
    // Try direct text property on result
    if (result && result.text) {
      return result.text;
    }
    
    // Try to get text from the parser instance
    if (parser && parser.text) {
      return parser.text;
    }
    
    // If we can't extract text, the PDF might be image-based
    // Return null so the script can continue and show instructions
    console.warn('Warning: Could not extract text from PDF. It may be image-based.');
    console.warn('You may need to use OCR or manually extract the data.');
    return null;
  } catch (error) {
    console.error(`Error reading PDF ${pdfPath}:`, error.message);
    console.error('Stack:', error.stack);
    return null;
  }
}

/**
 * Extract text from PDF content array
 */
function extractTextFromContent(content) {
  let text = '';
  for (const item of content) {
    if (typeof item === 'string') {
      text += item;
    } else if (item && typeof item === 'object') {
      if (item.text) {
        text += item.text;
      } else if (item.content) {
        text += extractTextFromContent(item.content);
      }
    }
  }
  return text;
}

/**
 * Parse LWF data from extracted text
 */
function parseLWFData(text) {
  const lwfData = {};
  
  const lines = text.split('\n');
  let currentState = null;
  
  // Common state names
  const stateNames = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Haryana',
    'West Bengal', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana',
    'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar',
    'Odisha', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand',
    'Himachal Pradesh', 'Goa', 'Puducherry', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
  ];
  
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
      // Pattern: number/number or number number
      const rateMatch = line.match(/(\d+)[\s/]+(\d+)/);
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
  let currentState = null;
  
  const stateNames = [
    'Maharashtra', 'Karnataka', 'Gujarat', 'Delhi', 'Haryana',
    'West Bengal', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Telangana',
    'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar',
    'Odisha', 'Assam', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand',
    'Himachal Pradesh', 'Goa', 'Puducherry', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
  ];
  
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
  const lwfPdfPath = path.join(projectRoot, 'LWF.pdf');
  const esicPdfPath = path.join(projectRoot, 'ESIC State Wise.pdf');
  
  console.log('PDF Text Extraction Script');
  console.log('==========================\n');
  
  // Extract LWF data
  if (fs.existsSync(lwfPdfPath)) {
    console.log('Extracting LWF data from LWF.pdf...');
    const lwfText = await extractPDFText(lwfPdfPath);
    
    if (lwfText) {
      console.log('\n--- LWF PDF Text (first 3000 chars) ---');
      console.log(lwfText.substring(0, 3000));
      console.log('\n--- Parsed LWF Data ---');
      const lwfData = parseLWFData(lwfText);
      console.log(JSON.stringify(lwfData, null, 2));
      
      // Save to file
      const outputPath = path.join(projectRoot, 'scripts', 'lwf-extracted.json');
      fs.writeFileSync(outputPath, JSON.stringify(lwfData, null, 2));
      console.log(`\nLWF data saved to: ${outputPath}`);
    } else {
      console.log('Failed to extract text from LWF.pdf');
    }
  } else {
    console.log(`LWF.pdf not found at: ${lwfPdfPath}`);
  }
  
  // Extract ESIC data
  if (fs.existsSync(esicPdfPath)) {
    console.log('\n\nExtracting ESIC data from ESIC State Wise.pdf...');
    const esicText = await extractPDFText(esicPdfPath);
    
    if (esicText) {
      console.log('\n--- ESIC PDF Text (first 3000 chars) ---');
      console.log(esicText.substring(0, 3000));
      console.log('\n--- Parsed ESIC Data ---');
      const esicData = parseESICData(esicText);
      console.log(JSON.stringify(esicData, null, 2));
      
      // Save to file
      const outputPath = path.join(projectRoot, 'scripts', 'esic-extracted.json');
      fs.writeFileSync(outputPath, JSON.stringify(esicData, null, 2));
      console.log(`\nESIC data saved to: ${outputPath}`);
    } else {
      console.log('Failed to extract text from ESIC State Wise.pdf');
    }
  } else {
    console.log(`ESIC State Wise.pdf not found at: ${esicPdfPath}`);
  }
  
  console.log('\n\nNote: The parsing is basic. Please review the extracted data and manually verify/update if needed.');
  console.log('You can also check the full extracted text in the output above to manually extract data.');
}

// Run the script
main().catch(console.error);
