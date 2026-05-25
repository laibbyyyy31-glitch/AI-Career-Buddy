import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react'; // ✅ Eye icons import kiye hain

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // ✅ Password show/hide ke liye state
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName
      });

      navigate('/'); // Home page par bhej dein
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <UserPlus size={32} color="#ea580c" />
        </div>
        <h2 style={styles.title}>Get <span style={{color: '#ea580c'}}>Started</span></h2>
        <p style={styles.subtitle}>Join AI Career Buddy and boost your growth</p>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSignup} style={styles.form}>
          
          {/* Full Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              required 
              style={styles.input} 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required 
              style={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>

          {/* Password with Show/Hide Toggle */}
          <div style={{...styles.inputGroup, position: 'relative'}}>
            <label style={styles.label}>Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="At least 6 characters" 
              required 
              style={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            {/* ✅ Eye Icon Button */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '15px', bottom: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={20} color="#94a3b8" /> : <Eye size={20} color="#94a3b8" />}
            </button>
          </div>

          {/* Confirm Password with Show/Hide Toggle */}
          <div style={{...styles.inputGroup, position: 'relative'}}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter password" 
              required 
              style={styles.input} 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? (
              <span style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
                <Loader2 className="animate-spin" size={20} /> Creating Account...
              </span>
            ) : "Create Free Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff8f0', padding: '20px' },
  card: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', textAlign: 'center', width: '100%', maxWidth: '450px', border: '1px solid #f1f5f9' },
  iconCircle: { width: '60px', height: '60px', backgroundColor: '#fff7ed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#1f2937', marginBottom: '8px' },
  subtitle: { color: '#64748b', marginBottom: '30px', fontSize: '0.95rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#374151' },
  input: { padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', transition: '0.2s', backgroundColor: '#f8fafc', width: '100%', boxSizing: 'border-box' },
  button: { padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#ea580c', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '1rem', marginTop: '10px', boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)', transition: '0.3s' },
  error: { color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', border: '1px solid #fee2e2' },
  footerText: { marginTop: '25px', color: '#64748b', fontSize: '0.9rem' },
  link: { color: '#ea580c', fontWeight: '700', textDecoration: 'none' }
};

export default Signup;