import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  Upload, FileText, Loader2, CheckCircle, AlertCircle, 
  ArrowRight, TrendingUp, MessageSquare, Award, Zap,
  Target, Briefcase, Star, ChevronRight, Sparkles
} from 'lucide-react';
// ✅ Resume.css import line remove kar di

function Resume() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // ✅ File input reference for custom click handling
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  const { setResultData } = useData();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setSelectedFile(file);
      setError('');
      setAnalysisResult(null);
    } else {
      setError('Please upload a valid PDF or TXT file.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Pehle CV select karein! 📄');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const result = {
          score: data.score,
          feedback: data.feedback || [],
          recommended_job: data.recommended_job || 'General Professional',
          roadmap: data.roadmap || [],
          skills: data.skills || []
        };
        
        setAnalysisResult(result);
        setResultData(result);
      } else {
        setError(data.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Backend server check karein! `python app.py` run ho raha hai?');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 180 }) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;
    
    const getColor = () => {
      if (percentage >= 80) return '#22c55e';
      if (percentage >= 60) return '#3b82f6';
      if (percentage >= 40) return '#f59e0b';
      return '#ef4444';
    };

    return (
      <div className="circular-progress" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#f1f5f9" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="url(#scoreGradient)" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="progress-text">
          <div className="progress-score">{percentage}%</div>
          <div className="progress-label">ATS Score</div>
        </div>
      </div>
    );
  };

  return (
    <div className="resume-page">
      {/* ✅ Hide native file input globally */}
      <style>{`
        input[type="file"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          position: absolute !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      <div className="decorative-blob blob-1" />
      <div className="decorative-blob blob-2" />

      <div className="resume-container">
        
        {/* Upload Section */}
        {!analysisResult && (
          <div className="upload-card">
            {/* Animated Icon */}
            <div className="floating-icon">
              <FileText size={42} color="white" />
            </div>
            
            <h1 className="page-title">Resume Analysis</h1>
            <p className="page-subtitle">
              Get AI-powered insights, ATS score, and personalized career recommendations
            </p>

            {/* ✅ Hidden Native Input - Completely Hidden */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.txt" 
              onChange={handleFileChange} 
              className="hidden-file-input"
            />

            {/* ✅ Clickable Upload Zone - Icon + Text */}
            <div 
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon-wrapper">
                <Upload size={28} color="#ea580c" />
              </div>
              <span className="upload-text">
                {selectedFile ? selectedFile.name : 'Drop your resume here or click to browse'}
              </span>
              <span className="upload-hint">Supports: PDF, TXT (Max 10MB)</span>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className={`btn-primary ${(!selectedFile || loading) ? 'disabled' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Start AI Analysis
                </>
              )}
            </button>

            {/* Features Grid */}
            <div className="features-grid">
              {[
                { icon: Target, title: 'ATS Score', desc: 'Check resume compatibility', color: '#3b82f6' },
                { icon: Award, title: 'Career Match', desc: 'Find best career paths', color: '#ea580c' },
                { icon: Zap, title: 'AI Feedback', desc: 'Get improvement suggestions', color: '#f59e0b' }
              ].map((feature, idx) => (
                <div key={idx} className="feature-card" style={{ '--feature-color': feature.color }}>
                  <div className="feature-icon-wrapper">
                    <feature.icon size={26} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisResult && (
          <div className="results-section">
            
            {/* Success Banner */}
            <div className="success-banner">
              <div className="success-icon">
                <CheckCircle size={24} color="white" />
              </div>
              <h2 className="success-title">Analysis Complete!</h2>
            </div>

            {/* Score & Career Grid */}
            <div className="results-grid">
              {/* Score Card */}
              <div className="score-card">
                <div className="card-accent" />
                <CircularProgress percentage={analysisResult.score} size={200} />
                <div className="score-info">
                  <h3 className={`score-status ${analysisResult.score >= 70 ? 'excellent' : analysisResult.score >= 50 ? 'good' : 'needs-work'}`}>
                    {analysisResult.score >= 70 ? 'Excellent Resume!' : 
                     analysisResult.score >= 50 ? 'Good Start' : 'Needs Work'}
                  </h3>
                  <p className="score-description">
                    {analysisResult.score >= 70 ? 'Your resume is well-optimized for ATS systems.' : 
                     analysisResult.score >= 50 ? 'Your resume has potential but needs improvements.' : 
                     'Your resume needs significant improvements to pass ATS.'}
                  </p>
                </div>
              </div>

              {/* Career Path Card */}
              <div className="career-card">
                <div className="card-accent" />
                <div className="career-header">
                  <div className="career-icon-wrapper">
                    <Briefcase size={30} color="white" />
                  </div>
                  <div>
                    <h3 className="career-label">Recommended Career</h3>
                    <div className="career-name">{analysisResult.recommended_job}</div>
                  </div>
                </div>
                <div className="career-description-box">
                  <p>Based on your skills and experience, this career path aligns perfectly with your profile.</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {analysisResult.skills && analysisResult.skills.length > 0 && (
              <div className="skills-section">
                <h3 className="section-title">
                  <div className="section-icon-wrapper">
                    <Star size={18} color="white" />
                  </div>
                  Detected Skills
                </h3>
                <div className="skills-tags">
                  {analysisResult.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            {analysisResult.feedback && analysisResult.feedback.length > 0 && (
              <div className="feedback-section">
                <h3 className="section-title">
                  <div className="section-icon-wrapper">
                    <MessageSquare size={18} color="white" />
                  </div>
                  AI Recommendations
                </h3>
                <div className="feedback-list">
                  {analysisResult.feedback.map((item, idx) => (
                    <div key={idx} className="feedback-item">
                      <div className="feedback-icon-wrapper">
                        <TrendingUp size={16} color="white" />
                      </div>
                      <p className="feedback-text">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate('/roadmap')}>
                View Learning Roadmap
                <ArrowRight size={18} />
              </button>
              
              <button className="btn-secondary" onClick={resetAnalysis}>
                <Upload size={18} />
                Analyze Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Resume;