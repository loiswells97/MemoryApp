import { View, Text, TextInput, Button } from "react-native"
import { styles } from "../styles"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { questionTestingStrength } from "../data"

var sample = require( '@stdlib/random-sample' )

const TestScreen = () => {

  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const cleanAnswer = (answer) => {
    return answer.replace(/[^\w\s\']|_/g, "").replace('\'', "").replace(/\s+/g, " ").trim().toLowerCase()
  }

  const chooseQuestions = async (quizType) => {
    const allQuestionKeys = (await AsyncStorage.getAllKeys()).sort((a, b) => {
      return a.match(/\d+/) - b.match(/\d+/);
    })

    let questionKeys

    if (quizType === "full") {
      questionKeys = allQuestionKeys
    } else if (quizType === "random") {
      const allQuestions = (await AsyncStorage.multiGet(allQuestionKeys)).map((data) => ({...JSON.parse(data[1])}))
      const keysToSample = allQuestionKeys.map((questionKey, index) => (
        Array(questionTestingStrength(allQuestions[index])).fill(questionKey)
      )).flat()
      questionKeys = sample(keysToSample, {size: 10, replace: false})
    }
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
    if (questionIndex<questions.length-1) {
      setQuestionIndex(questionIndex+1)
    } else {
      setFinished(true)
    }
  }

  const startQuiz = (quizType) => {
    chooseQuestions(quizType)
    setScore(0)
    setQuestionIndex(0)
    setStarted(true)
    setFinished(false)
  }

  // useEffect(() => {
  //   startQuiz()
  // }, [])

  useEffect(() => {
    if (lastAnswerCorrect) {
      setScore(score + 1)
    }
  }, [lastAnswerCorrect])

  return (
    <View style={styles.container}>
      {!started ?
        <>
          <Text style={styles.heading}>Time for a test 📝</Text>
          <Text>Choose type of test:</Text>
          <Button onPress={() => startQuiz("full")} title="Full run through"/>
          <Button onPress={() => startQuiz("random")} title="Random selection"/>
        </>
      :
      !finished ?
      <>
        {lastAnswerCorrect == null ? 
        <>
          <Text style={styles.heading}>Question {questionIndex +1}</Text>
          {questions.length > 0 ?
          <>
            <Text>Score: {score}/{questions.length}</Text>
            <Text>{questions[questionIndex].question}</Text>
          </> : null}
          <Text>Answer</Text>
          <TextInput value={answer} onChangeText={setAnswer} multiline style={styles.input}/>
          <Button onPress={checkAnswer} title='Check'/>
        </>
        :
          <>
            {lastAnswerCorrect ? <Text style={styles.heading}>✅ Correct</Text> : <Text style={styles.heading}>❌ Incorrect</Text>}
            <Text>Score: {score}/{questions.length}</Text>
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
        <Text style={styles.heading}> You scored {score}/{questions.length}</Text>
        <Button onPress={() => setStarted(false)} title='🔁 Restart'/>
      </>
    }
      
    </View>
  )
}

export default TestScreen
