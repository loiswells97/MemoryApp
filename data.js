export const questionTestingStrength = (question) => {
  const historyFactor = question.attempts && question.correctAttempts && (question.attempts > 0) ? (2-(question.correctAttempts/question.attempts)**3) : 2
  const recentFactor = 5 - Math.min(4, question.correctSinceLastIncorrect || 0)
  return Math.round(historyFactor*recentFactor)
}
