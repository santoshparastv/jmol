/**
 * Simple PDF text extraction script
 * 
 * This script attempts to extract text from PDFs using pdf-parse.
 * If the PDFs are image-based, you may need to use OCR or manually extract the data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try using pdf-parse/node which might work better
async function extractPDFText(pdfPath) {
  try {
    // Use dynamic import for ESM module
    const pdfParseModule = await import('pdf-parse/node');
    const PDFParse = pdfParseModule.default?.PDFParse || pdfParseModule.PDFParse;
    
    if (!PDFParse) {
      throw new Error('PDFParse class not found');
    }
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse(dataBuffer);
    
    // Wait for parsing to complete
    const result = await parser;
    
    // Try to extract text - the API might vary
    if (result?.text) {
      return result.text;
    }
    
    // Try accessing through doc
    if (result?.doc?.text) {
      return result.doc.text;
    }
    
    // Try getting pages and extracting text
    if (result?.pages) {
      let fullText = '';
      for (const page of result.pages) {
        if (page.text) fullText += page.text + '\n';
      }
      if (fullText) return fullText;
    }
    
    console.log('Available result properties:', Object.keys(result || {}));
    return null;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function main() {
  const projectRoot = path.join(__dirname, '..');
  const lwfPdfPath = path.join(projectRoot, 'LWF.pdf');
  const esicPdfPath = path.join(projectRoot, 'ESIC State Wise.pdf');
  
  console.log('PDF Text Extraction (Simple Version)');
  console.log('====================================\n');
  
  // Try LWF
  if (fs.existsSync(lwfPdfPath)) {
    console.log('Extracting from LWF.pdf...');
    const text = await extractPDFText(lwfPdfPath);
    if (text) {
      console.log(`\nExtracted ${text.length} characters`);
      console.log('\nFirst 2000 characters:');
      console.log(text.substring(0, 2000));
      
      // Save full text
      const outputPath = path.join(projectRoot, 'scripts', 'lwf-full-text.txt');
      fs.writeFileSync(outputPath, text);
      console.log(`\nFull text saved to: ${outputPath}`);
    } else {
      console.log('Could not extract text. The PDF may be image-based.');
      console.log('Please manually extract data from LWF.pdf');
    }
  }
  
  // Try ESIC
  if (fs.existsSync(esicPdfPath)) {
    console.log('\n\nExtracting from ESIC State Wise.pdf...');
    const text = await extractPDFText(esicPdfPath);
    if (text) {
      console.log(`\nExtracted ${text.length} characters`);
      console.log('\nFirst 2000 characters:');
      console.log(text.substring(0, 2000));
      
      // Save full text
      const outputPath = path.join(projectRoot, 'scripts', 'esic-full-text.txt');
      fs.writeFileSync(outputPath, text);
      console.log(`\nFull text saved to: ${outputPath}`);
    } else {
      console.log('Could not extract text. The PDF may be image-based.');
      console.log('Please manually extract data from ESIC State Wise.pdf');
    }
  }
}

main().catch(console.error);
