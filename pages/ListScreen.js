import { View, Text, ScrollView } from "react-native"
import { styles } from "../styles"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { questionTestingStrength } from "../data"

const ListScreen = () => {
  const [questions, setQuestions] = useState([])

  const loadQuestions = async () => {
    try {
      const questionKeys = (await AsyncStorage.getAllKeys()).sort((a, b) => {
        return a.match(/\d+/) - b.match(/\d+/);
      })
      const response = await AsyncStorage.multiGet(questionKeys)
      const questionData = response.map((data) => (
        {number: data[0], ...JSON.parse(data[1])}
      ))
      setQuestions(questionData)
    } catch (e) {
      // loading error
      console.log(e)
    }
  }

  useEffect( () => {
    loadQuestions()
  })

  // const correctQuestion = async () => {
  //   await AsyncStorage.mergeItem("Q8", JSON.stringify({
  //     question: "What are the decrees of God?",
  //     answer: "The decrees of God are His eternal purpose, according to the counsel of His will, whereby, for His own glory, He has foreordained whatsoever comes to pass.",
  //     attempts: 0,
  //     correctAttempts: 0,
  //     correctSinceLastIncorrect: 0
  // }))}

  // correctQuestion()
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>Your Questions</Text>
      {questions.map((questionObject, i) => (
        <View style={styles.questionAndAnswer} key={i}>
          <Text style={styles.question}>{questionObject.number}: {questionObject.question}</Text>
          <Text style={styles.answer}>{questionObject.answer}</Text>
          <Text>Attempts: {questionObject.attempts || 0} Correct: {questionObject.correctAttempts || 0} Correct since last incorrect: {questionObject.correctSinceLastIncorrect || 0}</Text>
          <Text>Strength: {questionTestingStrength(questionObject)}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

export default ListScreen
