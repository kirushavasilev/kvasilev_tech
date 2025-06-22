const WORDS_PER_MINUTE = 200; // Average reading speed

export function calculateReadTime(content) {
  // Remove all HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Remove special markdown characters
  const cleanText = text.replace(/[#*`_~\[\]]/g, '');
  
  // Count words (split by whitespace)
  const words = cleanText.trim().split(/\s+/).length;
  
  // Calculate read time in minutes
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  
  // Format the output
  if (minutes < 1) {
    return 'Less than a minute';
  } else if (minutes === 1) {
    return '1 minute';
  } else {
    return `${minutes} minutes`;
  }
} 