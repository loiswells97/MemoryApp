import { Button, Text, TextInput, View} from 'react-native'
import { styles } from '../styles'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NewQuestionScreen = ({navigation}) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const saveQuestion = async () => {
    try {
      const questionNumber = (await AsyncStorage.getAllKeys()).length + 1 || 1
      await AsyncStorage.setItem(`Q${questionNumber}`, JSON.stringify({question, answer, attempts: 0, correctAttempts: 0, correctSinceLastIncorrect: 0}))
      setQuestion('')
      setAnswer('')
      navigation.navigate('📜 List')
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  // useEffect(() => {
  //   const clearStorage = async () => {
  //     console.log('clearing storage')
  //     const keys = await AsyncStorage.getAllKeys()
  //     await AsyncStorage.multiRemove(keys)
  //   }
  //   clearStorage()
  // })
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a new question</Text>
      <Text>Question</Text>
      <TextInput value={question} onChangeText={setQuestion} multiline style={styles.input}/>
      <Text>Answer</Text>
      <TextInput value={answer} onChangeText={setAnswer} multiline style={styles.input}/>
      <Button onPress={saveQuestion} title='Save'/>
    </View>
  )
}

export default NewQuestionScreen
