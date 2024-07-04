function getDaysAgoAsReadableString(date) {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return (diff / (1000 * 60 * 60 * 24));
    return 'Yesterday';
  } else {
    return `${days} days ago`;
  }
}

export default getDaysAgoAsReadableString;