// Simple PDF text extractor - view text content from any PDF
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get PDF path from command line argument or use default
const pdfPath = process.argv[2] || 'Offer of Employment - Google Docs.pdf';
const fullPath = path.isAbsolute(pdfPath) ? pdfPath : path.join(__dirname, pdfPath);

if (!fs.existsSync(fullPath)) {
  console.error(`PDF file not found: ${fullPath}`);
  process.exit(1);
}

try {
  // Try to use pdf-parse/node for better compatibility
  const pdfParse = await import('pdf-parse/node');
  const dataBuffer = fs.readFileSync(fullPath);
  
  // pdf-parse/node exports a default function
  const parseFunction = pdfParse.default || pdfParse;
  
  const data = await parseFunction(dataBuffer);
  
  console.log('='.repeat(80));
  console.log(`PDF: ${path.basename(fullPath)}`);
  console.log(`Pages: ${data.numpages}`);
  console.log('='.repeat(80));
  console.log('\nEXTRACTED TEXT:\n');
  console.log(data.text);
  console.log('\n' + '='.repeat(80));
  
  // Also save to file
  const outputFile = path.join(__dirname, `extracted-${path.basename(fullPath, '.pdf')}.txt`);
  fs.writeFileSync(outputFile, data.text);
  console.log(`\nText also saved to: ${outputFile}`);
} catch (error) {
  console.error('Error extracting PDF:', error.message);
  console.error('\nTrying alternative method...');
  
  // Fallback: try the main pdf-parse module
  try {
    const pdfParseMain = await import('pdf-parse');
    const dataBuffer = fs.readFileSync(fullPath);
    const data = await pdfParseMain.default(dataBuffer);
    
    console.log('='.repeat(80));
    console.log(`PDF: ${path.basename(fullPath)}`);
    console.log(`Pages: ${data.numpages}`);
    console.log('='.repeat(80));
    console.log('\nEXTRACTED TEXT:\n');
    console.log(data.text);
    
    const outputFile = path.join(__dirname, `extracted-${path.basename(fullPath, '.pdf')}.txt`);
    fs.writeFileSync(outputFile, data.text);
    console.log(`\nText also saved to: ${outputFile}`);
  } catch (error2) {
    console.error('Failed with alternative method too:', error2.message);
    console.error('\nPlease check that pdf-parse is installed: npm install pdf-parse');
  }
}
