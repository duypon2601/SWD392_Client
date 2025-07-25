import React, { useState } from 'react';
import { Card, Radio, Button, Progress, Typography, Space, Alert } from 'antd';
import './Quiz.css';

const { Title, Text } = Typography;

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is the purpose of the Model in the Model-View-Controller (MVC) architecture used in SAPUI5?",
      options: [
        "Handles user input and interactions",
        "Defines the UI layout and structure", 
        "Controls the navigation flow",
        "Manages the application data and business logic"
      ],
      correctAnswer: 3
    },
    {
      id: 2,
      question: "What is the primary advantage of using OData for data services?",
      options: [
        "Exclusivity to SAP systems",
        "Support for binary data",
        "Compatibility with XML-RPC",
        "Simplicity and ease of use"
      ],
      correctAnswer: 3
    },
    {
      id: 3,
      question: "What is the maximum number of selection screens that can be created in a single ABAP program?",
      options: [
        "Unlimited",
        "1",
        "100", 
        "10"
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      question: "What is the result of releasing a transport request?",
      options: [
        "The transport request is deleted",
        "The transport request is available for import into the target system",
        "None of the above",
        "The transport request is locked for editing"
      ],
      correctAnswer: 1
    },
    {
      id: 5,
      question: "What is the role of SAP Gateway in relation to OData?",
      options: [
        "SAP Gateway is an OData client.",
        "SAP Gateway is used for frontend rendering in OData applications.",
        "SAP Gateway allows access to SAP backend services using the OData protocol.",
        "SAP Gateway is an alternative to OData."
      ],
      correctAnswer: 2
    },
    {
      id: 6,
      question: "Which of the following statements about SAP GUI Easy Access is true?",
      options: [
        "It provides access to both SAP ERP and SAP S/4HANA systems.",
        "It can only be accessed from a specific web browser.",
        "It only supports a limited set of SAP transactions.",
        "It requires the installation of additional software on the client machine."
      ],
      correctAnswer: 0
    },
    {
      id: 7,
      question: "Which SAP technology facilitates the creation and consumption of OData services?",
      options: [
        "SAP HANA",
        "SAP Fiori",
        "SAP NetWeaver Gateway",
        "SAP ABAP"
      ],
      correctAnswer: 2
    },
    {
      id: 8,
      question: "Who is responsible for releasing their tasks in SAP ABAP?",
      options: [
        "None of the above",
        "End Users",
        "Developers",
        "Administrators"
      ],
      correctAnswer: 2
    },
    {
      id: 9,
      question: "What is the purpose of transaction code SE38 in SAP?",
      options: [
        "Perform a goods receipt",
        "Create a purchase requisition",
        "Display a sales order",
        "Maintain a program or report"
      ],
      correctAnswer: 3
    },
    {
      id: 10,
      question: "What is the data type of a variable that stores alphanumeric characters in ABAP?",
      options: [
        "None of the above",
        "C (character)",
        "I (integer)",
        "F (floating point)"
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswerSelect = (value) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: value
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="quiz-container">
        <Card className="quiz-card">
          <div className="quiz-results">
            <Title level={2}>Quiz Results</Title>
            <div className="score-display">
              <Progress
                type="circle"
                percent={percentage}
                format={() => `${score}/${questions.length}`}
                size={120}
                strokeColor={percentage >= 70 ? '#52c41a' : percentage >= 50 ? '#faad14' : '#f5222d'}
              />
            </div>
            <Title level={3}>Your Score: {score} out of {questions.length}</Title>
            <Text style={{ fontSize: '18px' }}>
              Percentage: {percentage}%
            </Text>
            
            <div className="results-breakdown">
              <Title level={4}>Answer Review:</Title>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <Card key={index} size="small" style={{ marginBottom: '10px' }}>
                    <Text strong>Q{index + 1}: </Text>
                    <Text>{question.question}</Text>
                    <br />
                    <Text type={isCorrect ? 'success' : 'danger'}>
                      Your answer: {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                    </Text>
                    <br />
                    <Text type="success">
                      Correct answer: {question.options[question.correctAnswer]}
                    </Text>
                  </Card>
                );
              })}
            </div>
            
            <Button type="primary" size="large" onClick={resetQuiz}>
              Retake Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <Card className="quiz-card">
        <div className="quiz-header">
          <Title level={2}>SAP Technology Quiz</Title>
          <Progress percent={Math.round(progress)} showInfo={false} />
          <Text>Question {currentQuestion + 1} of {questions.length}</Text>
        </div>

        <div className="question-section">
          <Title level={3}>Question {currentQuestion + 1}</Title>
          <Text className="question-text">{currentQ.question}</Text>
          
          <Radio.Group
            value={selectedAnswers[currentQuestion]}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            className="options-group"
          >
            <Space direction="vertical" size="middle">
              {currentQ.options.map((option, index) => (
                <Radio key={index} value={index} className="option-radio">
                  <span className="option-label">{String.fromCharCode(97 + index)}.</span>
                  <span className="option-text">{option}</span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <div className="navigation-buttons">
          <Button 
            onClick={goToPreviousQuestion} 
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button 
              type="primary" 
              onClick={submitQuiz}
              disabled={Object.keys(selectedAnswers).length < questions.length}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button 
              type="primary" 
              onClick={goToNextQuestion}
            >
              Next
            </Button>
          )}
        </div>

        {Object.keys(selectedAnswers).length < questions.length && (
          <Alert
            message={`Please answer all questions before submitting. (${Object.keys(selectedAnswers).length}/${questions.length} answered)`}
            type="info"
            showIcon
            style={{ marginTop: '20px' }}
          />
        )}
      </Card>
    </div>
  );
};

export default Quiz;