const memberQuestions = [
  {
    "question_id": "q1",
    "type": "short",
    "text": "Imagine you are given a task with no clear instructions. What would you do first?",
    "marks": 4
  },
  {
    "question_id": "q2",
    "type": "short",
    "text": "When you get stuck, do you usually ask for help, search online, or try until you solve it?",
    "marks": 4
  },
  {
    "question_id": "q3",
    "type": "short",
    "text": "Do you see mistakes as failures or as opportunities to learn? Why?",
    "marks": 4
  },
  {
    "question_id": "q4",
    "type": "short",
    "text": "How do you stay positive when something doesn't go your way?",
    "marks": 4
  },
  {
    "question_id": "q5",
    "type": "short",
    "text": "If someone criticizes your work, how would you handle it?",
    "marks": 4
  },
  {
    "question_id": "q6",
    "type": "short",
    "text": "What was the last 'why/how' question you asked yourself?",
    "marks": 4
  },
  {
    "question_id": "q7",
    "type": "short",
    "text": "If you had the chance, which skill (outside your studies) would you love to explore?",
    "marks": 4
  },
  {
    "question_id": "q8",
    "type": "short",
    "text": "Do you prefer working alone first or directly learning with others?",
    "marks": 4
  },
  {
    "question_id": "q9",
    "type": "short",
    "text": "What kind of learning makes you more excited—structured (step-by-step) or exploring freely?",
    "marks": 4
  },
  {
    "question_id": "q10",
    "type": "short",
    "text": "What do you enjoy most about working in a team?",
    "marks": 4
  },
  {
    "question_id": "q11",
    "type": "short",
    "text": "If a teammate is struggling, how would you support them?",
    "marks": 4
  },
  {
    "question_id": "q12",
    "type": "short",
    "text": "Do you prefer small groups, large groups, or one-on-one collaboration? Why?",
    "marks": 4
  }
];

const mentorQuestions = [
  {
    "question_id": "q1",
    "type": "short",
    "text": "What is the difference between a primitive data type and a complex or reference data type?",
    "marks": 4
  },
  {
    "question_id": "q2",
    "type": "short",
    "text": "Provide an example of a primitive data type and a complex data type in a language you are familiar with.",
    "marks": 4
  },
  {
    "question_id": "q3",
    "type": "short",
    "text": "Explain the purpose of if-else statements, for loops, and while loops.",
    "marks": 4
  },
  {
    "question_id": "q4",
    "type": "short",
    "text": "When would you choose a for loop over a while loop, and vice-versa?",
    "marks": 4
  },
  {
    "question_id": "q5",
    "type": "short",
    "text": "What is a function, and why are they important in programming?",
    "marks": 4
  },
  {
    "question_id": "q6",
    "type": "short",
    "text": "Explain the difference between passing arguments by value and passing them by reference.",
    "marks": 4
  },
  {
    "question_id": "q7",
    "type": "short",
    "text": "Define what an algorithm is.",
    "marks": 4
  },
  {
    "question_id": "q8",
    "type": "short",
    "text": "What are the two key factors used to analyse an algorithm's efficiency?",
    "marks": 4
  },
  {
    "question_id": "q9",
    "type": "short",
    "text": "List and briefly explain the four pillars of OOP.",
    "marks": 4
  },
  {
    "question_id": "q10",
    "type": "short",
    "text": "Provide a real-world example for Polymorphism.",
    "marks": 4
  },
  {
    "question_id": "q11",
    "type": "short",
    "text": "What is a data structure?",
    "marks": 4
  },
  {
    "question_id": "q12",
    "type": "short",
    "text": "Explain the difference between an array and a linked list.",
    "marks": 4
  },
  {
    "question_id": "q13",
    "type": "short",
    "text": "When would you choose to use a hash map (or dictionary) over an array?",
    "marks": 4
  },
  {
    "question_id": "q14",
    "type": "short",
    "text": "What is recursion?",
    "marks": 4
  },
  {
    "question_id": "q15",
    "type": "short",
    "text": "Write a simple recursive function to calculate the factorial of a number.",
    "marks": 4
  },
  {
    "question_id": "q16",
    "type": "short",
    "text": "What are the potential risks of using recursion?",
    "marks": 4
  },
  {
    "question_id": "q17",
    "type": "short",
    "text": "How do you handle errors and exceptions in your code?",
    "marks": 4
  },
  {
    "question_id": "q18",
    "type": "short",
    "text": "Why is robust error handling critical for a program's reliability?",
    "marks": 4
  },
  {
    "question_id": "q19",
    "type": "short",
    "text": "How do you approach mentoring a new team member with less experience than you?",
    "marks": 4
  },
  {
    "question_id": "q20",
    "type": "short",
    "text": "Describe a situation where you had to explain a complex technical concept to a non-technical audience.",
    "marks": 4
  },
  {
    "question_id": "q21",
    "type": "short",
    "text": "Describe a time you took on a leadership role for a project. What challenges did you face, and how did you overcome them?",
    "marks": 4
  },
  {
    "question_id": "q22",
    "type": "short",
    "text": "How do you motivate a team to meet a tight deadline?",
    "marks": 4
  },
  {
    "question_id": "q23",
    "type": "short",
    "text": "Tell me about a time you had to make a difficult decision that impacted your team.",
    "marks": 4
  },
  {
    "question_id": "q24",
    "type": "short",
    "text": "Describe a challenging project you worked on. What was your role, and what was the outcome?",
    "marks": 4
  },
  {
    "question_id": "q25",
    "type": "short",
    "text": "Tell me about a time you failed at something. What did you learn from the experience?",
    "marks": 4
  },
  {
    "question_id": "q26",
    "type": "short",
    "text": "Give an example of a time you received constructive criticism. How did you react, and what changes did you make?",
    "marks": 4
  }
];

module.exports = { memberQuestions, mentorQuestions };