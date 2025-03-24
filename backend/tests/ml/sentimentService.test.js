const sentimentService = require('../../ml/sentimentService');

describe('SentimentService', () => {
  it('should return positive for positive text', () => {
    const result = sentimentService.analyze('I am feeling very happy and excited today!');
    expect(result).toBe('positive');
  });

  it('should return negative for negative text', () => {
    const result = sentimentService.analyze('This is terrible and awful.');
    expect(result).toBe('negative');
  });

  it('should return neutral for neutral text', () => {
    const result = sentimentService.analyze('The book is on the table.');
    expect(result).toBe('neutral');
  });
});
