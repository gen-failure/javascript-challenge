import dimensions from './dimensions';
import { shuffle } from 'lodash';
class Assessment {
  constructor() {
    this.questions = [];
    this.results = {};
    this.currentQuestion = 0;
    this.generateNewTest();
  }

  generateNewTest() { 
    const usedAnswers = {};
    const chooseRandomAnswer = (dimensionIndex) => {
      const { answers } = dimensions[dimensionIndex];
      if (!usedAnswers[dimensionIndex]) usedAnswers[dimensionIndex] = [];
      // The following line should never happen, it's just for implementation complexity
      // if (answers.length === usedAnswers[dimensionIndex].length) throw Error('out of options');
      const randomizedAnswers = shuffle(Array.from(answers.keys()));
      for (const randomizedAnswerIndex in randomizedAnswers) {
        if (usedAnswers[dimensionIndex].indexOf(randomizedAnswers[randomizedAnswerIndex]) === -1) {
          return randomizedAnswers[randomizedAnswerIndex];
        }
      }
      /* Alternative way how to solve the problem
        const answerIndex = Math.floor(Math.random() * answers.length);
        if (usedAnswers[dimensionIndex].indexOf(answerIndex) !== -1) {
          return chooseRandomAnswer(dimensionIndex) //Hope to have more luck next time
        }
        this.usedAnswers[dimensionIndex].push(answerIndex);
        return answerIndex;
      */
    }
    for (const dimensionIndex1 in dimensions) {
      for (const dimensionIndex2 in dimensions) {
        if (dimensionIndex1 !== dimensionIndex2) {
          this.questions.push(
            [
              {dimension: dimensionIndex1, answer: chooseRandomAnswer(dimensionIndex1)},
              {dimension: dimensionIndex2, answer: chooseRandomAnswer(dimensionIndex2)},
            ]
          );
        }
      }
    }
    this.questions = shuffle(this.questions);
    this.currentQuestion = 0;
    for (const dimensionIndex in dimensions) {
      this.results[dimensionIndex] = 0;
    }
  }

  // Might be even easier witholut generator
  * getQuestions() {
   for (const question of this.questions) {
     const questionObject = {
      msg: "Pick the answer that describes you best:",
      options: question.map((answer) => dimensions[answer.dimension].answers[answer.answer])
     };
     yield questionObject;
     this.currentQuestion++;
   }
  }

  submitAnswer(answerIndex) {
    this.results[this.questions[this.currentQuestion][answerIndex].dimension] += 1;
  }

  get testResults() {
    const testResults = {}
    Object.keys(this.results).map((dimensionIndex) => {
      testResults[dimensions[dimensionIndex].name] = this.results[dimensionIndex]
    });
    return testResults;
  }
}

export default Assessment;
