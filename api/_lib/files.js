export const MAX_FILE_BYTES = 4 * 1024 * 1024;   // per page, under the request-body cap
export const MAX_FILES = 10;

export const MIME = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  pdf: ['application/pdf'],
};

/** Put a file in Blob storage if it's configured. Returns a URL, or null. */
export async function storeBlob(dataBase64, fileName, mimeType, userId) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { put } = await import('@vercel/blob');
    const safe = (fileName || 'upload').replace(/[^\w.\-]+/g, '_').slice(0, 80);
    const blob = await put(`uploads/${userId}/${Date.now()}-${safe}`, Buffer.from(dataBase64, 'base64'), {
      access: 'public',
      contentType: mimeType,
      addRandomSuffix: true,
    });
    return blob.url;
  } catch (err) {
    // Storage is a nicety — losing it shouldn't lose the upload.
    console.error('Blob upload failed, keeping the bytes inline instead:', err);
    return null;
  }
}

/** Remove stored files for an upload. Best effort. */
export async function deleteBlobs(files) {
  const urls = (files || []).map((f) => f.url).filter(Boolean);
  if (!urls.length || !process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const { del } = await import('@vercel/blob');
    await del(urls);
  } catch (err) {
    console.error('Could not delete stored files', err);
  }
}

/** Exact byte length of base64 content, accounting for '=' padding. */
export function base64Bytes(b64) {
  if (!b64) return 0;
  const pad = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.floor((b64.length * 3) / 4) - pad;
}
