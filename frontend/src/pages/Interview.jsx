import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Mic, Video, MessageSquare, Clock, CheckCircle, 
  Play, Pause, RotateCcw, ChevronRight, Star,
  Target, TrendingUp, Award, Sparkles, Send,
  Volume2, VolumeX, Loader2, ThumbsUp, ThumbsDown,
  Code2  // ✅ Added Code2 icon here
} from 'lucide-react';

function Interview() {
  const navigate = useNavigate();
  const { resultData } = useData();
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const timerRef = useRef(null);

  // Interview questions database
  const interviewQuestions = {
    technical: [
      {
        question: "Explain the difference between REST and GraphQL APIs.",
        category: "Technical",
        difficulty: "Intermediate",
        idealAnswer: "REST uses multiple endpoints while GraphQL uses a single endpoint. GraphQL allows clients to request exactly what they need, reducing over-fetching. REST is more cacheable and simpler for basic CRUD operations."
      },
      {
        question: "What is the difference between SQL and NoSQL databases?",
        category: "Technical",
        difficulty: "Beginner",
        idealAnswer: "SQL databases are relational, table-based with predefined schemas (MySQL, PostgreSQL). NoSQL databases are non-relational, document/key-value based with dynamic schemas (MongoDB, Redis). SQL is better for complex queries, NoSQL for scalability and flexibility."
      },
      {
        question: "Explain the concept of closures in JavaScript.",
        category: "Technical",
        difficulty: "Advanced",
        idealAnswer: "A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created and are useful for data privacy, event handlers, and callbacks."
      }
    ],
    behavioral: [
      {
        question: "Tell me about a time you faced a challenging problem at work and how you solved it.",
        category: "Behavioral",
        difficulty: "Common",
        idealAnswer: "Use STAR method: Situation (describe context), Task (your responsibility), Action (steps you took), Result (outcome and learnings). Focus on problem-solving skills and impact."
      },
      {
        question: "Describe a situation where you had to work with a difficult team member.",
        category: "Behavioral",
        difficulty: "Common",
        idealAnswer: "Focus on communication, empathy, and professionalism. Explain how you addressed the issue constructively, maintained productivity, and what you learned about teamwork."
      }
    ],
    situational: [
      {
        question: "If you had multiple high-priority deadlines, how would you manage your time?",
        category: "Situational",
        difficulty: "Common",
        idealAnswer: "Discuss prioritization frameworks (Eisenhower Matrix), communication with stakeholders, breaking down tasks, and knowing when to ask for help or negotiate deadlines."
      }
    ]
  };

  const modes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      icon: Code2,
      description: 'Practice coding and technical concepts',
      color: '#3b82f6',
      questions: interviewQuestions.technical.length
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      icon: MessageSquare,
      description: 'HR and personality-based questions',
      color: '#22c55e',
      questions: interviewQuestions.behavioral.length
    },
    {
      id: 'situational',
      title: 'Situational Interview',
      icon: Target,
      description: 'Scenario-based problem solving',
      color: '#f59e0b',
      questions: interviewQuestions.situational.length
    }
  ];

  const startInterview = (mode) => {
    setSelectedMode(mode);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowFeedback(false);
    setTimeLeft(180);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setIsRecording(true);
      startTimer();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    stopTimer();
    generateFeedback();
  };

  const generateFeedback = () => {
    const currentQ = getCurrentQuestions()[currentQuestion];
    setFeedback({
      score: Math.floor(Math.random() * 30) + 70,
      strengths: ['Good structure', 'Clear examples', 'Confident delivery'],
      improvements: ['Add more technical details', 'Speak slower', 'Use STAR method']
    });
    setShowFeedback(true);
  };

  const getCurrentQuestions = () => {
    if (!selectedMode) return [];
    return interviewQuestions[selectedMode.id] || [];
  };

  const nextQuestion = () => {
    if (currentQuestion < getCurrentQuestions().length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setFeedback(null);
      setUserAnswer('');
      setTimeLeft(180);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetInterview = () => {
    setSelectedMode(null);
    setCurrentQuestion(0);
    setIsRecording(false);
    setShowFeedback(false);
    setFeedback(null);
    stopTimer();
  };

  // Mode Selection Screen
  if (!selectedMode) {
    return (
      <div className="interview-page">
        <div className="decorative-blob blob-1" />
        <div className="decorative-blob blob-2" />

        <div className="interview-container">
          <div className="interview-header">
            <div className="header-icon">
              <Video size={32} color="#ea580c" />
            </div>
            <h1 className="page-title">Interview Practice</h1>
            <p className="page-subtitle">
              Master your interviews with AI-powered mock sessions
            </p>
          </div>

          <div className="modes-grid">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div 
                  key={mode.id} 
                  className="mode-card"
                  onClick={() => startInterview(mode)}
                  style={{ '--mode-color': mode.color }}
                >
                  <div className="mode-icon-wrapper">
                    <Icon size={40} />
                  </div>
                  <h3 className="mode-title">{mode.title}</h3>
                  <p className="mode-description">{mode.description}</p>
                  <div className="mode-stats">
                    <span className="stat-badge">
                      <MessageSquare size={14} />
                      {mode.questions} Questions
                    </span>
                  </div>
                  <button className="mode-start-btn">
                    Start Practice
                    <ChevronRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="features-highlight">
            <div className="highlight-card">
              <Mic size={24} color="#ea580c" />
              <h4>Voice Recording</h4>
              <p>Practice speaking your answers aloud</p>
            </div>
            <div className="highlight-card">
              <Sparkles size={24} color="#ea580c" />
              <h4>AI Feedback</h4>
              <p>Get instant personalized feedback</p>
            </div>
            <div className="highlight-card">
              <Clock size={24} color="#ea580c" />
              <h4>Time Management</h4>
              <p>Learn to answer within time limits</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Session Screen
  const currentQ = getCurrentQuestions()[currentQuestion];
  const progress = ((currentQuestion + 1) / getCurrentQuestions().length) * 100;

  return (
    <div className="interview-page">
      <div className="interview-session">
        
        {/* Header */}
        <div className="session-header">
          <div className="session-info">
            <h2 className="session-title">{selectedMode.title}</h2>
            <div className="session-progress">
              <div className="progress-bar-small">
                <div className="progress-fill-small" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-text">
                Question {currentQuestion + 1} of {getCurrentQuestions().length}
              </span>
            </div>
          </div>
          <button className="btn-exit" onClick={resetInterview}>
            <RotateCcw size={18} />
            Exit
          </button>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <span className={`difficulty-badge diff-${currentQ.difficulty.toLowerCase()}`}>
              {currentQ.difficulty}
            </span>
            <span className="category-badge">{currentQ.category}</span>
          </div>
          <h3 className="question-text">{currentQ.question}</h3>
          
          {/* Timer */}
          <div className={`timer-display ${timeLeft < 30 ? 'urgent' : ''}`}>
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Answer Section */}
        {!showFeedback ? (
          <div className="answer-section">
            <div className="answer-input-wrapper">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here or use voice recording..."
                className="answer-textarea"
                disabled={isRecording}
              />
              
              <div className="recording-controls">
                <button 
                  className={`btn-record ${isRecording ? 'recording' : ''}`}
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <Pause size={20} />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={20} />
                      Start Recording
                    </>
                  )}
                </button>
                
                {isRecording && (
                  <div className="recording-indicator">
                    <div className="pulse-dot" />
                    <span>Recording...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-submit"
                onClick={stopRecording}
                disabled={!userAnswer && !isRecording}
              >
                Submit Answer
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Section */
          <div className="feedback-section">
            <div className="feedback-header">
              <div className="feedback-icon">
                <Star size={32} color="#fbbf24" />
              </div>
              <h3>AI Feedback</h3>
            </div>

            <div className="feedback-score">
              <div className="score-circle">
                <span className="score-number">{feedback?.score}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>

            <div className="feedback-content">
              <div className="feedback-section-item">
                <h4 className="feedback-title">
                  <ThumbsUp size={18} color="#22c55e" />
                  Strengths
                </h4>
                <ul className="feedback-list positive">
                  {feedback?.strengths.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="feedback-section-item">
                <h4 className="feedback-title">
                  <ThumbsDown size={18} color="#f59e0b" />
                  Areas to Improve
                </h4>
                <ul className="feedback-list improvements">
                  {feedback?.improvements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="ideal-answer">
                <h4 className="feedback-title">
                  <Award size={18} color="#ea580c" />
                  Ideal Answer Points
                </h4>
                <p className="ideal-text">{currentQ.idealAnswer}</p>
              </div>
            </div>

            <div className="feedback-actions">
              <button className="btn-next" onClick={nextQuestion}>
                {currentQuestion < getCurrentQuestions().length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    Complete Interview
                    <CheckCircle size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Interview;