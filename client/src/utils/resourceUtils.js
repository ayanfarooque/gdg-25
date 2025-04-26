// Utility functions for resources

// Gets icon based on file type
export const getFileIcon = (type) => {
  const icons = {
    document: "file-text",
    video: "film",
    audio: "music",
    image: "image",
    archive: "file-archive",
    spreadsheet: "file-excel",
    presentation: "file-powerpoint",
    pdf: "file-pdf",
    code: "file-code",
    other: "file"
  };
  return icons[type] || icons.other;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration (for video/audio)
export const formatDuration = (seconds) => {
  if (!seconds) return '';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let result = '';
  if (hrs > 0) {
    result += `${hrs}:${mins < 10 ? '0' : ''}`;
  }
  result += `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  
  return result;
};

// Get badge color based on file type
export const getTypeBadgeColor = (type) => {
  const colors = {
    document: "bg-blue-100 text-blue-800",
    video: "bg-red-100 text-red-800",
    audio: "bg-purple-100 text-purple-800",
    image: "bg-green-100 text-green-800",
    archive: "bg-yellow-100 text-yellow-800",
    spreadsheet: "bg-emerald-100 text-emerald-800",
    presentation: "bg-orange-100 text-orange-800",
    pdf: "bg-pink-100 text-pink-800",
    code: "bg-indigo-100 text-indigo-800",
    other: "bg-gray-100 text-gray-800"
  };
  return colors[type] || colors.other;
};