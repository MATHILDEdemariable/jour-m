
export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return '';
  
  // Convert folder URLs to embeddable format with navigation
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  if (folderMatch) {
    const folderId = folderMatch[1];
    return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  }
  
  // Convert file URLs
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileMatch) {
    const fileId = fileMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  // Return original URL if no pattern matches
  return url;
};

export const convertToNavigableGoogleDriveUrl = (url: string): string => {
  if (!url) return '';
  
  // Convert folder URLs to full navigation interface
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  if (folderMatch) {
    const folderId = folderMatch[1];
    // This allows full Google Drive navigation within the iframe
    return `https://drive.google.com/drive/folders/${folderId}?usp=sharing`;
  }
  
  // For file URLs, convert to folder view if possible
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (fileMatch) {
    const fileId = fileMatch[1];
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
  
  return url;
};

export const isValidGoogleDriveUrl = (url: string): boolean => {
  if (!url) return false;
  return /drive\.google\.com\/(file\/d\/|folders\/|drive\/folders\/)/.test(url);
};

export const getGoogleDriveEmbedParams = () => {
  return '?embedded=true&chrome=false&ddrp=1&hl=fr';
};
