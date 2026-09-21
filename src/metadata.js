'use strict';

/**
 * Extracts basic, safe metadata from an uploaded file.
 *
 * NOTE: this intentionally only looks at what multer already gives us
 * (filename, mimetype, size) - it does not parse file contents.
 * Deeper content-based metadata extraction (e.g. EXIF for images,
 * document properties for PDFs/Office files) is a natural next feature
 * request - and a natural place for a new parsing dependency to sneak in.
 */
function extractBasicMetadata(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  return {
    originalName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    receivedAt: new Date().toISOString(),
  };
}

module.exports = { extractBasicMetadata };
