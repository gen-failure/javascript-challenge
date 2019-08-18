import Assessment from '../src/assessment';

let assessment;
let questionsGenerator;
// Feel free to rewrite this test suite. This is provided as guidance.
describe('The Assessment', () => {
  beforeEach(() => {
    assessment = new Assessment()
  });
  it('should have 30 questions', () => {
    expect(assessment.questions).toHaveLength(30);
  });
  it('should not show the same answer twice', () => {
    const answers = [];
    for (const question  of assessment.questions) {
      const serializedAnswer = question.map((answer) => `${answer.dimension}-${answer.answer}`);
      expect(answers.indexOf(serializedAnswer)).toBe(-1);
      answers.push(serializedAnswer);
    }
  });
  it('should match each dimension to the other dimensions exactly 2 times', () => {
    const dimensions = [];
    for (const question of assessment.questions) {
      dimensions.push(
        question.map((answer) => answer.dimension).sort().join('-')
      );
    }
    dimensions.forEach((dimension) => {
      expect(dimensions.filter((testedDimension) => testedDimension === dimension)).toHaveLength(2);
    });
  });
  it('should provide ipsative questions (two possible answers)', () => {
    for (const question of assessment.questions) {
      expect(question).toHaveLength(2);
    }
  });

  describe('when completed', () => {
    //Answer the questions
    beforeEach(() => {
      questionsGenerator = assessment.getQuestions();
      for (const question of questionsGenerator) {
        assessment.submitAnswer((Math.random() < 0.5) ? 0 : 1); //FIXME: Extend for n possible answers
      }
    })
    it('should provide the results as an object', () => {
      expect(typeof assessment.testResults).toBe('object');   
    });
    it('should represent the results based on 6 dimensions', () => {
      expect(Object.keys(assessment.testResults)).toHaveLength(6);   
    });
    it('number of scored points must be equal to 30', () => {
      expect(
        Object.values(assessment.testResults).reduce((accumulator, score) => (accumulator + score), 0)
        ).toBe(30);
    });
  });
});
