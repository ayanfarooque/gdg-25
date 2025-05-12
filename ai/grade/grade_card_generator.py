import json
import os
from typing import Dict, List, Tuple
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

class GradeCardGenerator:
    def __init__(self):
        self.comments = {
            'positive': [
                "is showing remarkable progress in",
                "has demonstrated excellent understanding of",
                "is consistently performing well in",
                "has shown significant improvement in",
            ],
            'needs_improvement': [
                "should focus more on",
                "needs to improve in",
                "could benefit from additional practice in",
                "has room for improvement in",
            ],
            'general': [
                "is a dedicated student who always gives their best",
                "shows great potential and is eager to learn",
                "demonstrates strong work ethic and commitment",
                "is a valuable member of the class",
            ]
        }

    def _calculate_grade(self, score: float) -> str:
        """Calculate letter grade based on score"""
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        else:
            return 'D'

    def analyze_subject_performance(self, subjects: List[Dict]) -> Tuple[str, List[str], List[str]]:
        """
        Analyze subject performance and return overall grade, strengths, and areas for improvement
        """
        scores = [float(sub['score'].strip('%')) for sub in subjects]
        avg_score = sum(scores) / len(scores)

        # Determine overall grade
        overall_grade = self._calculate_grade(avg_score)

        # Find strengths (top 2 subjects)
        sorted_subjects = sorted(subjects, key=lambda x: float(x['score'].strip('%')), reverse=True)
        strengths = [sub['name'] for sub in sorted_subjects[:2]]

        # Find areas for improvement (bottom subject)
        areas_for_improvement = [sorted_subjects[-1]['name']]

        return overall_grade, strengths, areas_for_improvement

    def generate_comments(self, student_data: Dict) -> Dict:
        """
        Generate personalized comments for a student
        """
        # Analyze performance
        overall_grade, strengths, areas_for_improvement = self.analyze_subject_performance(student_data['subjects'])

        # Generate comments
        comments = []
        
        # Add positive comments about strengths
        for strength in strengths:
            comments.append(f"{random.choice(self.comments['positive'])} {strength}")

        # Add comments about areas for improvement
        for area in areas_for_improvement:
            comments.append(f"{random.choice(self.comments['needs_improvement'])} {area}")

        # Add a general comment
        comments.append(random.choice(self.comments['general']))

        # Combine comments into a paragraph
        teacher_comments = " ".join(comments) + "."

        return {
            'overall_grade': overall_grade,
            'teacher_comments': teacher_comments,
            'strengths': strengths,
            'areas_for_improvement': areas_for_improvement
        }

    def generate_grade_card(self, student_data: Dict) -> Dict:
        """
        Generate complete grade card with personalized comments
        """
        # Generate comments
        comments_data = self.generate_comments(student_data)

        # Calculate attendance based on average score
        avg_score = sum([float(sub['score'].strip('%')) for sub in student_data['subjects']]) / len(student_data['subjects'])
        attendance = f"{min(95, int(avg_score * 1.1))}%"  # Slightly higher than average score

        # Add grades to subjects
        subjects_with_grades = []
        for subject in student_data['subjects']:
            subject_copy = subject.copy()
            subject_copy['grade'] = self._calculate_grade(float(subject['score'].strip('%')))
            subjects_with_grades.append(subject_copy)

        return {
            'student': student_data['student'],
            'subjects': subjects_with_grades,
            'overall_grade': comments_data['overall_grade'],
            'attendance': attendance,
            'teacher_comments': comments_data['teacher_comments'],
            'generated_on': self._get_current_date(),
            'strengths': comments_data['strengths'],
            'areas_for_improvement': comments_data['areas_for_improvement']
        }

    def save_grade_card(self, grade_card: Dict, filename: str = None) -> str:
        """
        Save grade card to JSON file
        """
        if filename is None:
            student_name = grade_card['student']['name'].lower().replace(' ', '_')
            filename = f"{student_name}_grade_card.json"
        
        output_dir = "generated_grade_cards"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        filepath = os.path.join(output_dir, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(grade_card, f, ensure_ascii=False, indent=2)
            print(f"Grade card saved successfully to {filepath}")
            return filepath
        except Exception as e:
            raise Exception(f"Error saving JSON file: {str(e)}")

    def _get_current_date(self) -> str:
        """Get current date in formatted string"""
        from datetime import datetime
        return datetime.now().strftime("%B %d, %Y")

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the grade card generator
generator = GradeCardGenerator()

@app.route('/api/grade-card/generate', methods=['POST'])
def generate_grade_card():
    """Generate a grade card from student data"""
    try:
        # Get student data from request
        student_data = request.json
        
        if not student_data:
            return jsonify({
                'success': False,
                'message': 'No student data provided'
            }), 400
        
        # Generate grade card
        grade_card = generator.generate_grade_card(student_data)
        
        # Optionally save the grade card
        if request.args.get('save', 'false').lower() == 'true':
            filepath = generator.save_grade_card(grade_card)
            grade_card['saved_path'] = filepath
        
        return jsonify({
            'success': True,
            'data': grade_card
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/grade-card/students', methods=['GET'])
def get_students():
    """Get sample student data"""
    try:
        # Sample student data
        students = [
            {"id": 1, "name": "John Doe", "grade": "9", "avatar": "JD", "avgScore": 85},
            {"id": 2, "name": "Jane Smith", "grade": "9", "avatar": "JS", "avgScore": 92},
            {"id": 3, "name": "Alex Johnson", "grade": "9", "avatar": "AJ", "avgScore": 78},
            {"id": 4, "name": "Maria Garcia", "grade": "10", "avatar": "MG", "avgScore": 88},
            {"id": 5, "name": "David Chen", "grade": "10", "avatar": "DC", "avgScore": 95}
        ]
        
        return jsonify({
            'success': True,
            'data': {
                'students': students
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/grade-card/subjects/<int:student_id>', methods=['GET'])
def get_student_subjects(student_id):
    """Get subject data for a specific student"""
    try:
        # Sample subject data based on student ID
        # In a real app, this would come from a database
        subjects_by_student = {
            1: [
                {"name": "Mathematics", "score": "88%", "trend": "up"},
                {"name": "Science", "score": "85%", "trend": "up"},
                {"name": "English", "score": "92%", "trend": "stable"},
                {"name": "History", "score": "78%", "trend": "down"}
            ],
            2: [
                {"name": "Mathematics", "score": "95%", "trend": "up"},
                {"name": "Science", "score": "90%", "trend": "stable"},
                {"name": "English", "score": "96%", "trend": "up"},
                {"name": "History", "score": "87%", "trend": "up"}
            ],
            3: [
                {"name": "Mathematics", "score": "72%", "trend": "down"},
                {"name": "Science", "score": "75%", "trend": "stable"},
                {"name": "English", "score": "85%", "trend": "up"},
                {"name": "History", "score": "80%", "trend": "stable"}
            ],
            4: [
                {"name": "Mathematics", "score": "88%", "trend": "stable"},
                {"name": "Science", "score": "92%", "trend": "up"},
                {"name": "English", "score": "85%", "trend": "down"},
                {"name": "History", "score": "89%", "trend": "up"}
            ],
            5: [
                {"name": "Mathematics", "score": "98%", "trend": "up"},
                {"name": "Science", "score": "96%", "trend": "up"},
                {"name": "English", "score": "94%", "trend": "stable"},
                {"name": "History", "score": "92%", "trend": "up"}
            ]
        }
        
        if student_id not in subjects_by_student:
            return jsonify({
                'success': False,
                'message': f'Student with ID {student_id} not found'
            }), 404
            
        return jsonify({
            'success': True,
            'data': {
                'subjects': subjects_by_student[student_id]
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Run the app if this file is executed directly
if __name__ == "__main__":
    print("Starting Flask server for Grade Card Generator API...")
    print("API endpoints available at: http://127.0.0.1:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
