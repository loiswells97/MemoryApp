import { Button, Text, View } from "react-native"
import { styles } from "../styles"

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to the Memory App!</Text>
      <Text style={styles.emoji}>🧠</Text>
      <Button style={styles.button} title='List questions' onPress={() => navigation.navigate('📜 List Tab')}/>
      <Button style={styles.button} title='New question' onPress={() => navigation.navigate('➕ New Tab')}/>
      <Button style={styles.button} title='Test yourself' onPress={() => navigation.navigate('✅ Test Tab')}/>
    </View>
  )
}

export default HomeScreen
