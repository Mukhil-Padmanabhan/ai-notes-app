const Sentiment = require('sentiment');
const sentiment = new Sentiment();

class SentimentService {
    analyze(text) {
        const result = sentiment.analyze(text);
        const score = result.score;
    
        if (score > 1) return 'positive';
        if (score < -1) return 'negative';
        return 'neutral';
      }
  }
  
  module.exports = new SentimentService();
  