import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Compass, Code2, BarChart3, Palette, Smartphone, 
  ArrowRight, Upload, CheckCircle2, Brain, Sparkles, 
  RefreshCw, GraduationCap, Award, Target, Users, 
  Lightbulb, Zap, TrendingUp, Briefcase, Building2,
  ChevronLeft, Plus, X, Loader2, Star, Eye
} from 'lucide-react';

// Education Options
const EDUCATION_OPTIONS = [
  { label: 'High School', sublabel: 'Diploma or equivalent', value: 'high_school' },
  { label: "Associate Degree", sublabel: '2-year college degree', value: 'associate' },
  { label: "Bachelor's Degree", sublabel: '4-year university degree', value: 'bachelor' },
  { label: "Master's Degree", sublabel: 'Graduate-level education', value: 'master' },
  { label: 'Doctorate (PhD)', sublabel: 'Highest academic qualification', value: 'phd' }
];

// Industry Options
const INDUSTRY_OPTIONS = [
  { label: 'Technology', icon: Code2 },
  { label: 'Healthcare', icon: Briefcase },
  { label: 'Finance', icon: TrendingUp },
  { label: 'Education', icon: GraduationCap },
  { label: 'Arts', icon: Palette },
  { label: 'Engineering', icon: Zap },
  { label: 'Business', icon: Building2 },
  { label: 'Science', icon: Award }
];

// Personality Traits
const PERSONALITY_OPTIONS = [
  { label: 'Analytical', icon: Brain },
  { label: 'Creative', icon: Palette },
  { label: 'Leadership', icon: Users },
  { label: 'Detail-Oriented', icon: Target },
  { label: 'Communication', icon: Lightbulb },
  { label: 'Problem-Solving', icon: Zap }
];

// Career Options for Results
const CAREER_OPTIONS = [
  { id: 'Data Scientist', icon: BarChart3, desc: 'Analyze complex data and build ML models', demand: 'High' },
  { id: 'Web Developer', icon: Code2, desc: 'Build modern, responsive web applications', demand: 'High' },
  { id: 'Business Analyst', icon: Compass, desc: 'Bridge business needs with tech solutions', demand: 'Medium' },
  { id: 'Graphic Designer', icon: Palette, desc: 'Create beautiful visual designs', demand: 'Medium' },
  { id: 'Mobile Developer', icon: Smartphone, desc: 'Develop native & cross-platform apps', demand: 'High' }
];

// Simple AI recommendation logic
const getRecommendations = (answers) => {
  const { education, skills, industries, personality, goals } = answers;
  let scores = {};
  
  CAREER_OPTIONS.forEach(c => scores[c.id] = 0);
  
  // Skills matching
  if (skills && skills.length > 0) {
    const skillStr = skills.join(' ').toLowerCase();
    if (skillStr.includes('data') || skillStr.includes('python') || skillStr.includes('sql')) {
      scores['Data Scientist'] += 3;
    }
    if (skillStr.includes('html') || skillStr.includes('css') || skillStr.includes('javascript') || skillStr.includes('react')) {
      scores['Web Developer'] += 3;
    }
    if (skillStr.includes('design') || skillStr.includes('adobe') || skillStr.includes('figma')) {
      scores['Graphic Designer'] += 3;
    }
    if (skillStr.includes('management') || skillStr.includes('strategy')) {
      scores['Business Analyst'] += 3;
    }
    if (skillStr.includes('mobile') || skillStr.includes('app') || skillStr.includes('flutter')) {
      scores['Mobile Developer'] += 3;
    }
  }
  
  // Industry matching
  if (industries.includes('Technology')) {
    scores['Web Developer'] += 2;
    scores['Data Scientist'] += 2;
    scores['Mobile Developer'] += 2;
  }
  if (industries.includes('Business')) {
    scores['Business Analyst'] += 3;
  }
  if (industries.includes('Arts')) {
    scores['Graphic Designer'] += 3;
  }
  
  // Personality matching
  if (personality.includes('Analytical')) {
    scores['Data Scientist'] += 2;
    scores['Business Analyst'] += 2;
  }
  if (personality.includes('Creative')) {
    scores['Graphic Designer'] += 3;
  }
  if (personality.includes('Problem-Solving')) {
    scores['Web Developer'] += 2;
    scores['Data Scientist'] += 1;
  }
  
  // Education bonus
  if (education === 'phd' || education === 'master') {
    scores['Data Scientist'] += 1;
    scores['Business Analyst'] += 1;
  }
  
  // Sort and return top 2
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 2).map(([id, score]) => {
    const career = CAREER_OPTIONS.find(c => c.id === id);
    return { ...career, matchScore: Math.min(98, 60 + score * 10) };
  });
};

function CareerPath() {
  const navigate = useNavigate();
  const { resultData, setResultData } = useData();
  
  // Quiz State
  const [currentStep, setCurrentStep] = useState(0); // 0=Intro, 1-7=Steps
  const [answers, setAnswers] = useState({
    education: '',
    skills: [],
    industries: [],
    personality: [],
    goals: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const skillsInputRef = useRef(null);

  // Add skill tag
  const addSkill = () => {
    const newSkill = skillInput.trim();
    if (newSkill && !answers.skills.includes(newSkill)) {
      setAnswers(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    }
    setSkillInput('');
    skillsInputRef.current?.focus();
  };

  // Handle skill input key press
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setAnswers(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Toggle industry
  const toggleIndustry = (industry) => {
    setAnswers(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  // Toggle personality
  const togglePersonality = (trait) => {
    setAnswers(prev => ({
      ...prev,
      personality: prev.personality.includes(trait)
        ? prev.personality.filter(p => p !== trait)
        : [...prev.personality, trait]
    }));
  };

  // Go to next step
  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else {
      generateResults();
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Generate career recommendations
  const generateResults = () => {
    setIsProcessing(true);
    // Simulate AI processing time
    setTimeout(() => {
      const recommendations = getRecommendations(answers);
      setResults(recommendations);
      
      // If we have a top recommendation, set it in context for roadmap
      if (recommendations.length > 0) {
        const topCareer = recommendations[0];
        setResultData({
          recommended_job: topCareer.id,
          score: topCareer.matchScore,
          feedback: ['Great profile! Your skills match well with this career path.'],
          roadmap: getRoadmapForCareer(topCareer.id)
        });
      }
      
      setIsProcessing(false);
      setCurrentStep(8); // Results page
    }, 3000);
  };

  // Get roadmap for career
  const getRoadmapForCareer = (careerId) => {
    const roadmaps = {
      'Data Scientist': [
        { step: 'Math & Statistics', desc: 'Learn Linear Algebra, Calculus, and Probability.' },
        { step: 'Python Programming', desc: 'Master Python, Pandas, NumPy, and Scikit-Learn.' },
        { step: 'Machine Learning', desc: 'Study ML algorithms, Deep Learning, and TensorFlow.' }
      ],
      'Web Developer': [
        { step: 'Frontend Basics', desc: 'Learn HTML, CSS, JavaScript, and React.' },
        { step: 'Backend Development', desc: 'Study Node.js, Express, and databases.' },
        { step: 'Full Stack Projects', desc: 'Build real-world projects and deploy them.' }
      ],
      'Business Analyst': [
        { step: 'Business Fundamentals', desc: 'Learn business analysis concepts and frameworks.' },
        { step: 'Data Analysis Tools', desc: 'Master Excel, SQL, and visualization tools.' },
        { step: 'Communication Skills', desc: 'Develop presentation and stakeholder management.' }
      ],
      'Graphic Designer': [
        { step: 'Design Fundamentals', desc: 'Learn color theory, typography, and composition.' },
        { step: 'Adobe Creative Suite', desc: 'Master Photoshop, Illustrator, and InDesign.' },
        { step: 'Portfolio Building', desc: 'Create a strong portfolio showcasing your work.' }
      ],
      'Mobile Developer': [
        { step: 'Platform Basics', desc: 'Learn Swift for iOS or Kotlin for Android.' },
        { step: 'Cross-Platform Frameworks', desc: 'Study React Native or Flutter.' },
        { step: 'App Deployment', desc: 'Publish apps to App Store and Play Store.' }
      ]
    };
    return roadmaps[careerId] || roadmaps['Web Developer'];
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!answers.education;
      case 2: return answers.skills.length > 0;
      case 3: return answers.industries.length > 0;
      case 4: return answers.personality.length > 0;
      case 5: return answers.goals.length >= 10;
      default: return true;
    }
  };

  // Progress percentage
  const progressPercent = Math.min(100, ((currentStep - 1) / 7) * 100);

  // Render Intro Screen
  if (currentStep === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-card quiz-intro-card">
          <div className="quiz-icon-circle">
            <Sparkles size={40} />
          </div>
          <h1 className="quiz-title">AI Career Quiz</h1>
          <p className="quiz-subtitle">
            Answer 7 quick questions and our AI will generate personalized career paths with learning roadmaps tailored to your background.
          </p>
          
          <div className="quiz-features">
            <div className="quiz-feature-item">
              <div className="quiz-feature-icon"><Brain size={20} /></div>
              <div className="quiz-feature-text">
                <span className="quiz-feature-label">7 Steps</span>
                <span className="quiz-feature-desc">Quick & focused</span>
              </div>
            </div>
            <div className="quiz-feature-item">
              <div className="quiz-feature-icon"><Sparkles size={20} /></div>
              <div className="quiz-feature-text">
                <span className="quiz-feature-label">AI-Powered</span>
                <span className="quiz-feature-desc">Real-time analysis</span>
              </div>
            </div>
            <div className="quiz-feature-item">
              <div className="quiz-feature-icon"><Compass size={20} /></div>
              <div className="quiz-feature-text">
                <span className="quiz-feature-label">5 Paths</span>
                <span className="quiz-feature-desc">Custom to you</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-primary-quiz"
            onClick={() => setCurrentStep(1)}
          >
            Begin Career Assessment
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Render Results Page
  if (currentStep === 8) {
    return (
      <div className="quiz-container">
        <div className="quiz-card quiz-results-card">
          <div className="quiz-results-header">
            <div>
              <h2 className="quiz-results-title">Your Career Recommendations</h2>
              <p className="quiz-results-subtitle">Based on your profile — {results.length} paths identified</p>
            </div>
            <button 
              className="btn-retake-quiz"
              onClick={() => {
                setCurrentStep(0);
                setAnswers({ education: '', skills: [], industries: [], personality: [], goals: '' });
                setResults([]);
              }}
            >
              <RefreshCw size={16} />
              Retake Quiz
            </button>
          </div>

          {results.map((career, idx) => (
            <div key={career.id} className="career-result-card">
              <div className="career-result-header">
                <div className="career-result-icon">
                  <career.icon size={24} />
                </div>
                <div className="career-result-info">
                  <h3 className="career-result-name">{career.id}</h3>
                  <div className="career-result-tags">
                    <span className="career-demand-tag">
                      <TrendingUp size={12} />
                      {career.demand} demand
                    </span>
                    <span className="career-match-tag">
                      <Star size={12} />
                      {career.matchScore}% match
                    </span>
                  </div>
                </div>
              </div>
              <p className="career-result-desc">{career.desc}</p>
              <button 
                className="btn-view-roadmap"
                onClick={() => navigate('/roadmap')}
              >
                <Eye size={16} />
                View Learning Roadmap
              </button>
            </div>
          ))}

          <button 
            className="btn-primary-quiz"
            onClick={() => navigate('/resume')}
            style={{ marginTop: '30px' }}
          >
            <Upload size={18} />
            Upload Resume for Detailed Analysis
          </button>
        </div>
      </div>
    );
  }

  // Render Processing Screen
  if (isProcessing) {
    return (
      <div className="quiz-container">
        <div className="quiz-card quiz-processing-card">
          <div className="processing-spinner">
            <Loader2 size={48} className="spin-animation" />
          </div>
          <h2 className="quiz-processing-title">Analyzing your profile...</h2>
          <p className="quiz-processing-subtitle">
            Our AI is reviewing your answers and matching you with the best career paths. This may take a moment.
          </p>
          <div className="processing-badge">
            <Loader2 size={16} className="spin-animation" />
            Processing with AI...
          </div>
        </div>
      </div>
    );
  }

  // Render Quiz Steps
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Progress Bar */}
        <div className="quiz-progress-section">
          <div className="quiz-progress-dots">
            {[1, 2, 3, 4, 5, 6, 7].map(step => (
              <div 
                key={step} 
                className={`quiz-dot ${step <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>
          <span className="quiz-step-label">
            Step {currentStep} of 7
          </span>
        </div>

        {/* Step Content */}
        <div className="quiz-step-content">
          
          {/* Step 1: Education */}
          {currentStep === 1 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Education Background</h2>
              <p className="quiz-step-subtitle">
                Your education helps us tailor role requirements and learning paths.
              </p>
              <div className="quiz-options-grid">
                {EDUCATION_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`quiz-option-card ${answers.education === opt.value ? 'selected' : ''}`}
                    onClick={() => setAnswers(prev => ({ ...prev, education: opt.value }))}
                  >
                    <div className="quiz-option-label">{opt.label}</div>
                    <div className="quiz-option-sublabel">{opt.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {currentStep === 2 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Your Skills</h2>
              <p className="quiz-step-subtitle">
                List your technical and soft skills. Press Enter or comma to add each one.
              </p>
              
              <div className="skills-input-container">
                <div className="skills-input-wrapper">
                  <input
                    ref={skillsInputRef}
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="e.g. Python, Project Management, Data Analysis"
                    className="skills-input"
                  />
                  <button 
                    className="btn-add-skill"
                    onClick={addSkill}
                    disabled={!skillInput.trim()}
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
                
                {answers.skills.length === 0 ? (
                  <p className="skills-empty-text">No skills added yet. Add at least one to continue.</p>
                ) : (
                  <div className="skills-tags">
                    {answers.skills.map(skill => (
                      <span key={skill} className="skill-tag">
                        {skill}
                        <button 
                          className="skill-tag-remove"
                          onClick={() => removeSkill(skill)}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Industry Interests */}
          {currentStep === 3 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Industry Interests</h2>
              <p className="quiz-step-subtitle">
                Which industries excite you? Select all that apply.
              </p>
              <div className="quiz-checkbox-grid">
                {INDUSTRY_OPTIONS.map(industry => {
                  const Icon = industry.icon;
                  const isSelected = answers.industries.includes(industry.label);
                  return (
                    <button
                      key={industry.label}
                      className={`quiz-checkbox-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleIndustry(industry.label)}
                    >
                      <div className={`quiz-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <CheckCircle2 size={16} />}
                      </div>
                      <Icon size={18} />
                      <span>{industry.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Personality */}
          {currentStep === 4 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Your Personality</h2>
              <p className="quiz-step-subtitle">
                How would you describe your working style? Select all that resonate.
              </p>
              <div className="quiz-personality-grid">
                {PERSONALITY_OPTIONS.map(trait => {
                  const Icon = trait.icon;
                  const isSelected = answers.personality.includes(trait.label);
                  return (
                    <button
                      key={trait.label}
                      className={`quiz-personality-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => togglePersonality(trait.label)}
                    >
                      <div className="personality-icon-wrapper">
                        <Icon size={22} />
                      </div>
                      <span className="personality-label">{trait.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Career Goals */}
          {currentStep === 5 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Career Goals</h2>
              <p className="quiz-step-subtitle">
                Describe your short and long-term career aspirations in your own words.
              </p>
              <p className="quiz-textarea-label">What do you want to achieve in your career?</p>
              <textarea
                value={answers.goals}
                onChange={(e) => setAnswers(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="e.g. I want to transition into data science within 2 years, eventually leading a research team at a tech company..."
                className="quiz-textarea"
                rows={5}
              />
              <p className={`quiz-char-count ${answers.goals.length >= 10 ? 'valid' : ''}`}>
                {answers.goals.length >= 10 ? '✓ Looks good!' : `${Math.max(0, 10 - answers.goals.length)} more characters needed`}
              </p>
            </div>
          )}

          {/* Step 6: Review Profile */}
          {currentStep === 6 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Review Your Profile</h2>
              <p className="quiz-step-subtitle">
                Everything look good? Submit to generate your personalized career paths.
              </p>
              
              <div className="review-section">
                <div className="review-item">
                  <span className="review-label">EDUCATION</span>
                  <span className="review-value">
                    {EDUCATION_OPTIONS.find(e => e.value === answers.education)?.label || 'Not selected'}
                  </span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">CAREER GOALS</span>
                  <span className="review-value">{answers.goals || 'Not provided'}</span>
                </div>
                
                <div className="review-item">
                  <span className="review-label">SKILLS</span>
                  <div className="review-tags">
                    {answers.skills.length > 0 
                      ? answers.skills.map(s => <span key={s} className="review-tag">{s}</span>)
                      : <span className="review-value">None added</span>
                    }
                  </div>
                </div>
                
                <div className="review-item">
                  <span className="review-label">INDUSTRY INTERESTS</span>
                  <div className="review-tags">
                    {answers.industries.length > 0 
                      ? answers.industries.map(i => <span key={i} className="review-tag">{i}</span>)
                      : <span className="review-value">None selected</span>
                    }
                  </div>
                </div>
                
                <div className="review-item">
                  <span className="review-label">PERSONALITY TRAITS</span>
                  <div className="review-tags">
                    {answers.personality.length > 0 
                      ? answers.personality.map(p => <span key={p} className="review-tag">{p}</span>)
                      : <span className="review-value">None selected</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Generating (this step is skipped, goes to processing) */}
          {currentStep === 7 && (
            <div className="quiz-step">
              <h2 className="quiz-step-title">Ready to Generate?</h2>
              <p className="quiz-step-subtitle">
                Click the button below to let our AI analyze your profile and generate personalized career recommendations.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="quiz-navigation">
          <button 
            className="btn-back"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft size={18} />
            Back
          </button>
          
          <button 
            className={`btn-continue ${!isStepValid() ? 'disabled' : ''}`}
            onClick={currentStep === 6 ? () => setCurrentStep(7) : nextStep}
            disabled={!isStepValid() && currentStep < 6}
          >
            {currentStep === 6 ? (
              <>
                <Sparkles size={18} />
                Generate My Career Paths
              </>
            ) : currentStep === 7 ? (
              <>
                <Sparkles size={18} />
                Get Recommendations
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CareerPath;