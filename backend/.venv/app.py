from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pdfplumber
import re
from models import db, PromptModel 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite.db'
db.init_app(app)

CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/uploadFile", methods=["POST"])
def upload():
    if 'pdf' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['pdf']
    
    if file:
        try:
            with pdfplumber.open(file) as opened_file:
                text = ""
                for page in opened_file.pages:
                    text += page.extract_text() or ""

                formatted_text = format_extracted_text(text)
            return jsonify({"success": True, "text": formatted_text}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Error processing the file"}), 500
    
def format_extracted_text(text):
    sections = re.split(r'\n(?=[A-Z])', text)  

    formatted_sections = []
    for section in sections:
        lines = section.strip().split('\n')
        if lines:
            title = lines[0]
            content = "\n".join(lines[1:])
            formatted_sections.append({"title": title, "content": content})

    return formatted_sections

@app.route('/save/prompts/<int:id>', methods=["POST"])
def save(id):
    data = request.get_json()

    prompt_name = data.get('prompt_name')
    promptq = data.get('promptq')

    if not prompt_name or not promptq:
        return jsonify({
            'success': False,
            'message': 'Prompt name and prompt question are required.'
        }), 400
    
    existing_prompt = PromptModel.query.filter_by(prompt_id=id).first() 
    if existing_prompt:
        return jsonify({
            'success': False,
            'message': 'Prompt with this ID already exists. Try again.'
        }), 400
    
    new_prompt = PromptModel(prompt_id=id, prompt_name=prompt_name, promptq=promptq)
    db.session.add(new_prompt)  
    db.session.commit() 

    return jsonify({
        'success': True,
        'message': 'Prompt saved successfully!',
        'data': {
            'prompt_id': new_prompt.prompt_id,
            'prompt_name': new_prompt.prompt_name,
            'promptq': new_prompt.promptq
        }
    }), 201

if __name__ == '__main__':
    with app.app_context(): 
        db.create_all()
    app.run(debug=True)