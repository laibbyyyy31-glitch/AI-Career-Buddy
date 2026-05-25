import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, FileText, Map, MessageSquare, ArrowRight, UserPlus, Cpu, Rocket } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import "../App.css";

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, desc, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className="feature-card fade-in"
      onClick={() => navigate(link)}
    >
      <div>
        <div className="feature-icon-wrapper">
          <Icon size={24} />
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{desc}</p>
      </div>
      <div className="feature-link">
        Explore <ArrowRight size={18} />
      </div>
    </div>
  );
};

// Step Card Component
const StepCard = ({ icon: Icon, number, title, desc }) => (
  <div className="step-card fade-in">
    <div className="step-icon-wrapper">
      <Icon size={32} />
      <span className="step-number">{number}</span>
    </div>
    <h4 className="step-title">{title}</h4>
    <p className="step-description">{desc}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-section">
      {/* Tagline */}
      <div className="hero-tagline">
        <h2>Expert Career Guidance for a Bright Future</h2>
      </div>

      {/* Hero Section */}
      <div className="hero-wrapper">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <div className="hero-badge">✨ AI-POWERED CAREER GUIDANCE</div>
          <h1 className="hero-title">
            Your Personal <span>Career Companion</span>
          </h1>
          <p className="hero-description">
            Navigate your career journey with confidence. Get personalized recommendations, expert resume feedback, tailored learning paths, and interview practice—all powered by AI.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-primary-large"
              onClick={() => navigate(currentUser ? '/resume' : '/signup')}
            >
              {currentUser ? 'Continue →' : 'Get Started Free →'}
            </button>
            <button 
              className="btn-secondary-large"
              onClick={scrollToFeatures}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            Everything You Need to <span>Succeed</span>
          </h2>
          <p className="section-subtitle">
            Comprehensive tools to help you make informed career decisions and achieve your professional goals.
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard 
            icon={Compass} 
            title="Career Recommendations" 
            desc="Personalized career path suggestions based on your unique skills and interests." 
            link="/career-paths" 
          />
          <FeatureCard 
            icon={FileText} 
            title="Resume Analysis" 
            desc="Detailed AI feedback on your resume skills, formatting, and industry alignment." 
            link="/resume" 
          />
          <FeatureCard 
            icon={Map} 
            title="Learning Roadmap" 
            desc="Step-by-step personalized learning milestones to reach your specific career goals." 
            link="/roadmap" 
          />
          <FeatureCard 
            icon={MessageSquare} 
            title="Interview Practice" 
            desc="AI-powered mock interviews with real-time feedback to boost your confidence." 
            link="/interview" 
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '60px' }}>
          How It <span style={{ color: '#ea580c' }}>Works</span>
        </h2>
        <div className="steps-container">
          <StepCard
            icon={UserPlus} 
            number="1" 
            title="Create Profile"
            desc="Sign up and build your professional profile by uploading your resume and listing your core technical and soft skills manually for better AI accuracy."
          />
          <StepCard
            icon={Cpu} 
            number="2" 
            title="AI Processing"
            desc="Our advanced AI algorithms analyze global market trends, skill demands, and job descriptions to provide you with the most relevant career insights."
          />
          <StepCard
            icon={Rocket} 
            number="3" 
            title="Achieve Goals"
            desc="Follow your tailored learning roadmap, refine your resume, and master your interviewing skills to systematically land your ideal professional role."
          />
        </div>
      </section>

      {/* ✅ CTA Section - Always Visible with Dynamic Button */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to Take the Next Step?</h2>
          <p className="cta-description">
            Unlock your full professional potential with personalized AI guidance. Join thousands of users who trust AI Career Buddy to navigate their career paths with clarity.
          </p>
          <button 
            className="btn-cta"
            onClick={() => currentUser ? navigate('/resume') : navigate('/signup')}
          >
            {currentUser ? 'Continue Your Journey' : 'Join Now — It\'s Free'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <div className="footer-logo-wrapper">
              <div className="footer-icon">
                <Compass size={18} color="white" />
              </div>
              <h3 className="footer-title">AI Career Buddy</h3>
            </div>
            <p className="footer-tagline">
              Building the future of career guidance with intelligent AI technology.
            </p>
          </div>
          
          <div className="footer-contact">
            contact@aicareerbuddy.com
          </div>
        </div>
        
        <div className="footer-bottom">
          © 2026 AI Career Buddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;