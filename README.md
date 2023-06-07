# MemoryApp

The Memory App is a React Native application designed to help users learn the answers to a list of questions word-for-word.

The app consists of a home page with links to the other main pages in the app, which are the List, New Question and Test pages.

The List page shows a scrollable list of all the questions and answers added into the app by the user, along with stats for each question. These stats include:
- Attempts: The number of times the user has attemped to answer the question on the Test page
- Correct: The number of times the user has correctly answered the question
- Correct Since Last Incorrect: The number of times the user has answered the question correctly sine the last time they answered incorrectly
- Strength: A metric between 1 and 10 representing how well the user knows the answer to the quesion, with 1 being fully known and 10 being fully unknown. This metric is calculated by: `round((2-({correct}/{attempts})^2)(5-min(4, {Correct since last incorrect}))`

The New Question page allows the user add a new question to the question set. 

The Test page presents the user with 5 randomly-selected questions from the question set, with the probability of a question being chosen weighted according to its Strength. Each question's metrics are updated after the answer is submitted based on whether the user answered correctly or incorrectly.
