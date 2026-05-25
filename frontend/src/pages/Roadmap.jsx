import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowRight, CheckCircle, Clock, Target, Award, 
  BookOpen, Video, FileText, ChevronRight, Star,
  TrendingUp, Zap, PlayCircle, Download, Edit3, Save, X,
  Briefcase, Code2, BarChart3, Palette, Smartphone
} from 'lucide-react';

function Roadmap() {
  const navigate = useNavigate();
  const { resultData } = useData();
  const [completedSteps, setCompletedSteps] = useState([]);
  const [expandedStep, setExpandedStep] = useState(null);
  const [notes, setNotes] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [tempNote, setTempNote] = useState('');

  // Default roadmaps for different careers (agar resume analysis nahi hui)
  const defaultRoadmaps = {
    'Data Scientist': [
      { step: 'Python Programming', desc: 'Master Python basics and data structures', duration: '2-3 weeks', difficulty: 'Beginner',
        resources: [{ type: 'course', title: 'Python for Data Science', url: '#' }] },
      { step: 'Statistics & Mathematics', desc: 'Learn probability, statistics, and linear algebra', duration: '3-4 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'video', title: 'Statistics Fundamentals', url: '#' }] },
      { step: 'Machine Learning', desc: 'Study ML algorithms and scikit-learn', duration: '4-5 weeks', difficulty: 'Advanced',
        resources: [{ type: 'course', title: 'ML with Python', url: '#' }] },
      { step: 'Deep Learning', desc: 'Neural networks and TensorFlow/Keras', duration: '4-5 weeks', difficulty: 'Advanced',
        resources: [{ type: 'course', title: 'Deep Learning Specialization', url: '#' }] }
    ],
    'Web Developer': [
      { step: 'HTML & CSS', desc: 'Learn web structure and styling', duration: '2-3 weeks', difficulty: 'Beginner',
        resources: [{ type: 'course', title: 'HTML/CSS Basics', url: '#' }] },
      { step: 'JavaScript', desc: 'Master JavaScript programming', duration: '3-4 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'course', title: 'JavaScript Essentials', url: '#' }] },
      { step: 'React Framework', desc: 'Build modern UIs with React', duration: '3-4 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'course', title: 'React Complete Guide', url: '#' }] },
      { step: 'Backend Development', desc: 'Node.js, Express, and databases', duration: '4-5 weeks', difficulty: 'Advanced',
        resources: [{ type: 'course', title: 'Backend with Node.js', url: '#' }] }
    ],
    'Business Analyst': [
      { step: 'Business Fundamentals', desc: 'Understand business processes and analysis', duration: '2-3 weeks', difficulty: 'Beginner',
        resources: [{ type: 'article', title: 'BA Fundamentals', url: '#' }] },
      { step: 'Data Analysis Tools', desc: 'Excel, SQL, and visualization tools', duration: '3-4 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'course', title: 'SQL for Beginners', url: '#' }] },
      { step: 'Requirements Gathering', desc: 'Learn elicitation techniques', duration: '2-3 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'article', title: 'Requirements Guide', url: '#' }] },
      { step: 'Process Modeling', desc: 'BPMN, UML, and documentation', duration: '3-4 weeks', difficulty: 'Advanced',
        resources: [{ type: 'course', title: 'Process Modeling', url: '#' }] }
    ],
    'Graphic Designer': [
      { step: 'Design Fundamentals', desc: 'Color theory, typography, composition', duration: '2-3 weeks', difficulty: 'Beginner',
        resources: [{ type: 'course', title: 'Design Basics', url: '#' }] },
      { step: 'Adobe Photoshop', desc: 'Master photo editing and manipulation', duration: '3-4 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'course', title: 'Photoshop Complete', url: '#' }] },
      { step: 'Adobe Illustrator', desc: 'Vector graphics and illustration', duration: '3-4 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'course', title: 'Illustrator Masterclass', url: '#' }] },
      { step: 'UI/UX Design', desc: 'User interface and experience design', duration: '4-5 weeks', difficulty: 'Advanced',
        resources: [{ type: 'course', title: 'UI/UX Design', url: '#' }] }
    ],
    'Mobile Developer': [
      { step: 'Programming Basics', desc: 'Java/Kotlin for Android or Swift for iOS', duration: '3-4 weeks', difficulty: 'Beginner',
        resources: [{ type: 'course', title: 'Kotlin Basics', url: '#' }] },
      { step: 'Mobile UI Design', desc: 'Material Design and iOS guidelines', duration: '2-3 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'article', title: 'Mobile Design', url: '#' }] },
      { step: 'App Development', desc: 'Build native mobile applications', duration: '4-5 weeks', difficulty: 'Advanced',
        resources: [{ type: 'course', title: 'Android Development', url: '#' }] },
      { step: 'App Deployment', desc: 'Publish to Play Store/App Store', duration: '1-2 weeks', difficulty: 'Intermediate',
        resources: [{ type: 'article', title: 'Deployment Guide', url: '#' }] }
    ]
  };

  // Determine which roadmap to show
  const hasResumeData = resultData && resultData.roadmap && resultData.roadmap.length > 0;
  const careerName = resultData?.recommended_job || 'Data Scientist';
  const roadmapData = hasResumeData ? resultData.roadmap : (defaultRoadmaps[careerName] || defaultRoadmaps['Data Scientist']);

  // Enrich step data
  const enrichedRoadmap = roadmapData.map((step, index) => ({
    ...step,
    title: step.step || step.title || `Step ${index + 1}`,
    description: step.desc || step.description || 'Complete this milestone to progress.',
    duration: step.duration || ['1-2 weeks', '2-3 weeks', '3-4 weeks'][index % 3],
    difficulty: step.difficulty || ['Beginner', 'Intermediate', 'Advanced'][index % 3],
    resources: step.resources || [
      { type: 'video', title: 'Introductory Tutorial', url: '#' },
      { type: 'article', title: 'Official Documentation', url: '#' }
    ]
  }));

  const toggleStepComplete = (index) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(i => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const toggleExpand = (index) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const saveNote = (index) => {
    setNotes({ ...notes, [index]: tempNote });
    setEditingNote(null);
    setTempNote('');
  };

  const startEditNote = (index) => {
    setEditingNote(index);
    setTempNote(notes[index] || '');
  };

  const progress = Math.round((completedSteps.length / enrichedRoadmap.length) * 100);

  // Get career icon
  const getCareerIcon = () => {
    if (careerName.includes('Data')) return BarChart3;
    if (careerName.includes('Web') || careerName.includes('Developer')) return Code2;
    if (careerName.includes('Business')) return Briefcase;
    if (careerName.includes('Design')) return Palette;
    if (careerName.includes('Mobile')) return Smartphone;
    return Target;
  };

  const CareerIcon = getCareerIcon();

  return (
    <div className="roadmap-page">
      <div className="decorative-blob blob-1" />
      <div className="decorative-blob blob-2" />

      <div className="roadmap-container">
        
        {/* Header */}
        <div className="roadmap-header">
          <div className="header-content">
            <div className="career-badge">
              <CareerIcon size={24} color="#ea580c" />
              <span>{careerName}</span>
            </div>
            <h1 className="page-title">Your Learning Roadmap</h1>
            <p className="page-subtitle">
              {hasResumeData 
                ? `Follow this personalized path to master ${careerName}`
                : `Explore the learning path for ${careerName} - Complete resume analysis for personalized roadmap`
              }
            </p>
          </div>

          {/* Info Banner if no resume data */}
          {!hasResumeData && (
            <div className="info-banner">
              <div className="banner-icon">
                <Target size={24} color="#ea580c" />
              </div>
              <div className="banner-content">
                <strong>Default Roadmap</strong>
                <p>This is a general roadmap for {careerName}. Get personalized recommendations by completing resume analysis.</p>
              </div>
              <button className="btn-primary-small" onClick={() => navigate('/resume')}>
                Get Personalized
              </button>
            </div>
          )}

          {/* Progress Card */}
          <div className="progress-card">
            <div className="progress-info">
              <div>
                <div className="progress-percentage">{progress}%</div>
                <div className="progress-label">Completed</div>
              </div>
              <div className="progress-stats">
                <span>{completedSteps.length} of {enrichedRoadmap.length} steps</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Timeline Roadmap */}
        <div className="roadmap-timeline">
          {enrichedRoadmap.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isLocked = index > 0 && !completedSteps.includes(index - 1) && index !== 0;
            const isExpanded = expandedStep === index;
            const hasNote = notes[index];

            return (
              <div key={index} className="timeline-item">
                {index < enrichedRoadmap.length - 1 && (
                  <div className={`timeline-connector ${isCompleted ? 'completed' : ''}`} />
                )}
                
                <div className="timeline-node">
                  <div className={`node-dot ${isCompleted ? 'completed' : isLocked ? 'locked' : ''}`}>
                    {isCompleted ? <CheckCircle size={18} color="white" /> : index + 1}
                  </div>
                </div>

                <div 
                  className={`step-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => !isLocked && toggleExpand(index)}
                >
                  <div className="step-header">
                    <div className="step-info">
                      <div className="step-badges">
                        <span className={`badge difficulty-${step.difficulty.toLowerCase()}`}>
                          {step.difficulty}
                        </span>
                        <span className="badge time-badge">
                          <Clock size={12} /> {step.duration}
                        </span>
                      </div>
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                    </div>
                    
                    <div className="step-actions">
                      {!isLocked && (
                        <button 
                          className={`step-toggle ${isCompleted ? 'completed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepComplete(index);
                          }}
                        >
                          {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                        </button>
                      )}
                      <ChevronRight size={20} className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="step-details">
                      <div className="resources-section">
                        <h4 className="section-subtitle">Recommended Resources</h4>
                        <div className="resource-grid">
                          {step.resources.map((res, idx) => (
                            <a key={idx} href={res.url} className="resource-card" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                              <div className="resource-icon">
                                {res.type === 'video' ? <PlayCircle size={18} /> : 
                                 res.type === 'course' ? <BookOpen size={18} /> : <FileText size={18} />}
                              </div>
                              <div className="resource-info">
                                <span className="resource-type">{res.type}</span>
                                <span className="resource-title">{res.title}</span>
                              </div>
                              <ArrowRight size={14} />
                            </a>
                          ))}
                        </div>
                      </div>

                      <div className="notes-section">
                        <div className="notes-header">
                          <h4 className="section-subtitle">
                            <Edit3 size={16} /> My Notes
                          </h4>
                          {!editingNote && (
                            <button className="btn-text" onClick={(e) => { e.stopPropagation(); startEditNote(index); }}>
                              {hasNote ? 'Edit' : 'Add Note'}
                            </button>
                          )}
                        </div>
                        
                        {editingNote === index ? (
                          <div className="note-editor" onClick={(e) => e.stopPropagation()}>
                            <textarea
                              value={tempNote}
                              onChange={(e) => setTempNote(e.target.value)}
                              placeholder="Write your learning notes..."
                              className="note-textarea"
                            />
                            <div className="note-actions">
                              <button className="btn-text cancel" onClick={(e) => { e.stopPropagation(); setEditingNote(null); }}>
                                <X size={16} /> Cancel
                              </button>
                              <button className="btn-text save" onClick={(e) => { e.stopPropagation(); saveNote(index); }}>
                                <Save size={16} /> Save
                              </button>
                            </div>
                          </div>
                        ) : hasNote ? (
                          <div className="note-display" onClick={(e) => e.stopPropagation()}>
                            <p>{notes[index]}</p>
                          </div>
                        ) : (
                          <p className="no-note" onClick={(e) => { e.stopPropagation(); startEditNote(index); }}>
                            Click to add your learning notes...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Card */}
        {progress === 100 && (
          <div className="completion-card">
            <div className="completion-icon">
              <Star size={48} color="#fbbf24" />
            </div>
            <h2>Congratulations! 🎉</h2>
            <p>You've completed your learning roadmap! You're now ready to excel as a {careerName}.</p>
            <div className="completion-actions">
              <button className="btn-primary" onClick={() => navigate('/interview')}>
                Practice Interviews
                <ArrowRight size={18} />
              </button>
              <button className="btn-secondary" onClick={() => navigate('/career-paths')}>
                Explore More Paths
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="next-actions">
          <button className="btn-outline" onClick={() => navigate('/resume')}>
            <TrendingUp size={18} />
            {hasResumeData ? 'View Resume Score' : 'Get Personalized Roadmap'}
          </button>
          <button className="btn-primary" onClick={() => navigate('/interview')}>
            Start Interview Practice
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Roadmap;