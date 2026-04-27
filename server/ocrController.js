const Tesseract = require('tesseract.js');
const vision = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');

// Google Vision Client (Initializes only if credentials exist)
let visionClient;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  visionClient = new vision.ImageAnnotatorClient();
}

/**
 * Parses raw text from OCR to extract structured medicine data
 * @param {string} text - Raw text from OCR
 * @returns {Array} List of structured medicine objects
 */
const parsePrescriptionText = (text) => {
  const lines = text.split('\n');
  const medicines = [];

  // Regex patterns
  const dosageRegex = /(\d+\s*(?:mg|g|ml|mcg|unit|tab|cap))/i;
  const frequencyRegex = /(\d+-\d+-\d+|\d+\s*times?\s*daily|BID|TID|QID|QD|OD)/i;
  const timingRegex = /(Morning|Afternoon|Evening|Night|Bedtime|Before\s*Breakfast|After\s*Breakfast|Before\s*Dinner|After\s*Dinner)/i;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.length < 3) return;

    // Check if line contains a dosage (likely a medicine line)
    const dosageMatch = trimmedLine.match(dosageRegex);
    if (dosageMatch) {
      // Basic extraction: Name is usually before dosage
      const namePart = trimmedLine.split(dosageMatch[0])[0].replace(/Rx:?|[\*\-]/gi, '').trim();
      
      const frequencyMatch = trimmedLine.match(frequencyRegex);
      const timingMatch = trimmedLine.match(timingRegex);

      medicines.push({
        name: namePart || 'Unknown Medicine',
        dosage: dosageMatch[0],
        frequency: frequencyMatch ? frequencyMatch[0] : 'As directed',
        timing: timingMatch ? timingMatch[0] : 'Unspecified'
      });
    }
  });

  // If no dosage found, try a simpler name extraction for any line that looks like a title
  if (medicines.length === 0) {
    lines.slice(0, 5).forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 5 && !trimmed.includes(':') && /^[A-Z]/.test(trimmed)) {
        medicines.push({
          name: trimmed,
          dosage: 'N/A',
          frequency: 'As directed',
          timing: 'Unspecified'
        });
      }
    });
  }

  return medicines;
};

/**
 * Main controller function to handle OCR processing
 */
const processPrescription = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const imagePath = req.file.path;
  let extractedText = '';

  try {
    if (visionClient) {
      console.log('Using Google Vision API...');
      const [result] = await visionClient.textDetection(imagePath);
      extractedText = result.fullTextAnnotation ? result.fullTextAnnotation.text : '';
    } else {
      console.log('Using Tesseract.js fallback...');
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
      extractedText = text;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(422).json({ 
        message: 'Could not extract text. Image might be too blurry or contains no text.',
        error: 'OCR_EMPTY_RESULT'
      });
    }

    const structuredData = parsePrescriptionText(extractedText);

    // Clean up temporary file
    fs.unlinkSync(imagePath);

    res.json({
      status: 'success',
      rawText: extractedText,
      data: structuredData
    });

  } catch (error) {
    console.error('OCR Error:', error);
    // Cleanup on error
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    
    res.status(500).json({ 
      message: 'Failed to process image', 
      error: error.message 
    });
  }
};

module.exports = {
  processPrescription,
  parsePrescriptionText
};

