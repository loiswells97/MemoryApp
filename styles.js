import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  scrollContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    flexGrow: 1,
    overflow: 'scroll'
  },
  heading: {
    paddingTop: '10%',
    fontSize: 36,
    fontWeight: 'bold'
  },
  emoji: {
    fontSize: 256
  },
  input: {
    height: 100,
    borderColor: 'lightgrey',
    borderWidth: 1,
    width: '90%',
  },
  questionAndAnswer: {
    padding: 15,
    width: '100%'
  },
  question: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  answer: {
    marginBottom: 10
  }
});
