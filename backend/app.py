from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF

app = Flask(__name__)
# CORS enable karna zaroori hai taake Frontend (Port 5173) Backend (Port 5000) se baat kar sakay
CORS(app)

# --- DATABASE SECTION ---
JOBS_DATABASE = {
    "Data Scientist": ["python", "machine learning", "data analysis", "sql", "statistics"],
    "Web Developer": ["react", "javascript", "html", "css", "node.js", "flask"],
    "Business Analyst": ["management", "business administration", "communication", "excel", "planning"],
    "Graphic Designer": ["photoshop", "illustrator", "design", "creative", "ui/ux"],
    "Mobile Developer": ["kotlin", "java", "swift", "react native", "android"]
}

ROADMAPS = {
    "Data Scientist": [
        {"step": "Mathematics & Stats", "desc": "Focus on Linear Algebra, Calculus, and Probability."},
        {"step": "Advanced Python", "desc": "Master libraries like Pandas, NumPy, and Scikit-Learn."},
        {"step": "Deep Learning", "desc": "Explore Neural Networks and Frameworks like TensorFlow or PyTorch."}
    ],
    "Web Developer": [
        {"step": "Frontend Mastery", "desc": "Master React hooks, State Management, and Responsive Design."},
        {"step": "Backend Development", "desc": "Learn Database indexing and API optimization (Node/Python)."},
        {"step": "Cloud & DevOps", "desc": "Learn Docker and deploy apps on AWS or Vercel."}
    ],
    "Business Analyst": [
        {"step": "Data Visualization", "desc": "Learn to create dashboards in Tableau or Power BI."},
        {"step": "Business Strategy", "study": "Study Market Research and Financial Modeling."},
        {"step": "Technical Writing", "desc": "Master Documentation (BRDs, FRDs, and User Stories)."}
    ],
    "Graphic Designer": [
        {"step": "Creative Tools", "desc": "Master Advanced Photoshop techniques and Vector Illustration."},
        {"step": "Brand Identity", "desc": "Learn Logo design and Visual storytelling."},
        {"step": "UI Design", "study": "Study User Interface principles and Figma prototyping."}
    ],
    "Mobile Developer": [
        {"step": "Native Development", "desc": "Master Kotlin for Android or Swift for iOS."},
        {"step": "Cross-Platform", "desc": "Learn Flutter or React Native for multi-platform apps."},
        {"step": "Architecture", "desc": "Understand MVVM architecture and local database (Room/CoreData)."}
    ],
    "General Professional": [
        {"step": "Skill Identification", "desc": "Identify your core interests and pick a technical niche."},
        {"step": "Foundational Learning", "desc": "Start with basic certifications in your chosen field."},
        {"step": "Practical Projects", "desc": "Build 2-3 small projects to showcase your abilities."}
    ]
}

# --- LOGIC FUNCTIONS ---
def calculate_resume_score(text, found_skills):
    score = 0
    feedback = []
    text_lower = text.lower()

    if len(text) > 800: score += 20
    elif len(text) > 300: score += 10
    else: feedback.append("Increase content depth; your resume appears too brief.")

    if any(key in text_lower for key in ['@', 'phone', 'contact', 'email', 'linkedin']): score += 25
    else: feedback.append("Missing contact details (Email, Phone, or LinkedIn).")

    if 'education' in text_lower or 'university' in text_lower: score += 20
    else: feedback.append("Add a clear 'Education' section.")

    if any(key in text_lower for key in ['experience', 'work', 'internship', 'projects']): score += 20
    else: feedback.append("Include a section for 'Work Experience' or 'Projects'.")

    if len(found_skills) >= 3: score += 15
    elif len(found_skills) > 0:
        score += 5
        feedback.append("List more industry-specific technical skills.")
    else: feedback.append("No relevant technical skills were detected.")

    return score, feedback

# --- API ENDPOINTS ---

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    text = ""
    
    try:
        if file.filename.endswith('.pdf'):
            doc = fitz.open(stream=file.read(), filetype="pdf")
            for page in doc:
                text += page.get_text()
        else:
            text = file.read().decode('utf-8')
    except Exception as e:
        return jsonify({"error": f"File processing failed: {str(e)}"}), 500

    found_skills = []
    text_lower = text.lower()
    for job, skills in JOBS_DATABASE.items():
        for skill in skills:
            if skill in text_lower:
                found_skills.append(skill)
    
    found_skills = list(set(found_skills))
    score, feedback = calculate_resume_score(text, found_skills)
    
    recommended_job = "General Professional"
    max_match = 0
    for job, skills in JOBS_DATABASE.items():
        match_count = sum(1 for s in skills if s in text_lower)
        if match_count > max_match:
            max_match = match_count
            recommended_job = job

    return jsonify({
        "score": score,
        "feedback": feedback,
        "recommended_job": recommended_job,
        "roadmap": ROADMAPS.get(recommended_job, ROADMAPS["General Professional"])
    })

@app.route('/evaluate_answer', methods=['POST'])
def evaluate_answer():
    data = request.json
    user_answer = data.get('answer', '').lower()
    words = user_answer.split()
    
    if len(words) < 5:
        feedback = "Your answer is too short. Try to explain with examples."
        score = 40
    elif len(words) < 15:
        feedback = "Good start, but you can add more technical keywords."
        score = 65
    else:
        feedback = "Excellent! You explained the concept well."
        score = 90

    return jsonify({
        "feedback": feedback,
        "score": score
    })

if __name__ == '__main__':
    # App port 5000 par chalay gi
    app.run(debug=True, port=5000)