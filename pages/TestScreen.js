import { View, Text, TextInput, Button } from "react-native"
import { styles } from "../styles"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { questionTestingStrength } from "../data"

var sample = require( '@stdlib/random-sample' )

const TestScreen = () => {

  const [questions, setQuestions] = useState()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [finished, setFinished] = useState(false)

  const cleanAnswer = (answer) => {
    return answer.replace(/[^\w\s\']|_/g, "").replace('\'', "").replace(/\s+/g, " ").trim().toLowerCase()
  }

  const chooseQuestions = async () => {
    const allQuestionKeys = await AsyncStorage.getAllKeys()
    const allQuestions = (await AsyncStorage.multiGet(allQuestionKeys)).map((data) => ({...JSON.parse(data[1])}))
    const keysToSample = allQuestionKeys.map((questionKey, index) => (
      Array(questionTestingStrength(allQuestions[index])).fill(questionKey)
    )).flat()
    console.log(keysToSample)
    const questionKeys = sample(keysToSample, {size: 5, replace: false})
    console.log(questionKeys)
    const response = await AsyncStorage.multiGet(questionKeys)
    const questionData = response.map((data) => (
      {number: data[0], ...JSON.parse(data[1])}
    ))
    setQuestions(questionData)
    setQuestionIndex(0)
  }

  const checkAnswer = async () => {
    if (cleanAnswer(answer) === cleanAnswer(questions[questionIndex].answer)) {
      setLastAnswerCorrect(true)
      await AsyncStorage.mergeItem(questions[questionIndex].number, JSON.stringify({
        ...questions[questionIndex],
        number: undefined,
        attempts: questions[questionIndex].attempts ? questions[questionIndex].attempts + 1 : 1,
        correctAttempts: questions[questionIndex].correctAttempts ? questions[questionIndex].correctAttempts +1 : 1,
        correctSinceLastIncorrect: questions[questionIndex].correctSinceLastIncorrect ? questions[questionIndex].correctSinceLastIncorrect + 1 : 1
      }))
    } else {
      setLastAnswerCorrect(false)
      await AsyncStorage.mergeItem(questions[questionIndex].number, JSON.stringify({
        ...questions[questionIndex],
        number: undefined,
        attempts: questions[questionIndex].attempts ? questions[questionIndex].attempts + 1 : 1,
        correctSinceLastIncorrect: 0
      }))
    }
  }

  const goToNextQuestion = () => {
    setAnswer('')
    setLastAnswerCorrect(null)
    if (questionIndex<4) {
      setQuestionIndex(questionIndex+1)
    } else {
      setFinished(true)
    }
  }

  const startQuiz = () => {
    chooseQuestions()
    setScore(0)
    setQuestionIndex(0)
    setFinished(false)
  }

  useEffect(() => {
    startQuiz()
  }, [])

  useEffect(() => {
    if (lastAnswerCorrect) {
      setScore(score + 1)
    }
  }, [lastAnswerCorrect])

  return (
    <View style={styles.container}>
      {!finished ?
      <>
        {lastAnswerCorrect == null ? 
        <>
          <Text style={styles.heading}>Question {questionIndex +1}</Text>
          <Text>Score: {score}/5</Text>
          {questions ? <Text>{questions[questionIndex].question}</Text> : null}
          <Text>Answer</Text>
          <TextInput value={answer} onChangeText={setAnswer} multiline style={styles.input}/>
          <Button onPress={checkAnswer} title='Check'/>
        </>
        :
          <>
            {lastAnswerCorrect ? <Text style={styles.heading}>✅ Correct</Text> : <Text style={styles.heading}>❌ Incorrect</Text>}
            <Text>Score: {score}/5</Text>
            <Text style={styles.question}>{questions[questionIndex].question}</Text>
            {!lastAnswerCorrect ?
              <>
                <Text>You said:</Text>
                <Text style={styles.answer}>{answer}</Text>
              </>
              : null
            }
            <Text>Answer:</Text>
            <Text style={styles.answer}>{questions[questionIndex].answer}</Text>
            <Button onPress={goToNextQuestion} title='👉 Next'/>
          </>
        }
      </>
    :
      <>
        <Text style={styles.heading}> You scored {score}/5</Text>
        <Button onPress={startQuiz} title='🔁 Try Again'/>
      </>
    }
      
    </View>
  )
}

export default TestScreen
