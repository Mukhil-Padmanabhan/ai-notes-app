export const getSentimentEmoji = (sentiment) => sentiment;

export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'positive':
    case 'happy':
      return 'text-green-600';
    case 'negative':
    case 'angry':
    case 'cry':
      return 'text-red-600';
    case 'neutral':
      return 'text-gray-600';
    case 'surprised':
      return 'text-yellow-600';
    case 'fear':
      return 'text-purple-600';
    default:
      return 'text-blue-600';
  }
};
