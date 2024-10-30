from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from blueprints.riskmodel.model import model_bp
from flask import Blueprint
import pdfplumber
import re
import os
import gensim
import json
from gensim.utils import simple_preprocess
import numpy as np
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, train_test_split, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score, f1_score
from sklearn.preprocessing import LabelEncoder
from nltk.util import ngrams
from textblob import TextBlob
from pdfminer.high_level import extract_text
from werkzeug.utils import secure_filename

model_bp = Blueprint('model', __name__)
# Uncomment below comments if you are running this code for the first time
# Download necessary NLTK data
# nltk.download('stopwords')
# nltk.download('wordnet')

class Risk:
    def __init__(self, risk, risk_level):
        self.risk = risk
        self.risk_level = risk_level

file_name = '../data/updated_data.json'
risks = []

with open(file_name, encoding='utf-8') as file:
    data = json.load(file)
    for risk in data:
        risks.append(Risk(risk['risk'], risk['risk_level']))

# Preprocessing
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    # Tokenize and clean text
    tokens = simple_preprocess(text, deacc=True, min_len=2)
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return tokens

# Generate bi-grams and tri-grams
def generate_ngrams(tokens, n=2):
    return list(ngrams(tokens, n))

# Vectorization using Word2Vec
tokens = [preprocess_text(risk.risk) for risk in risks]
bi_grams = [generate_ngrams(token_list, 2) for token_list in tokens]  # Use bi-grams

model = gensim.models.Word2Vec(
    window=5,
    min_count=4,
    vector_size=300,
    workers=4
)

combined_tokens = [token + bi_gram for token, bi_gram in zip(tokens, bi_grams)]
model.build_vocab(combined_tokens)
model.train(combined_tokens, total_examples=model.corpus_count, epochs=model.epochs)

# Adding sentiment analysis feature
def sentiment_score(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

texts = [risk.risk for risk in risks]
labels = [risk.risk_level for risk in risks]

# Convert text to vectors
def text_to_vector(text):
    words = simple_preprocess(text, deacc=True, min_len=2)
    bi_grams = generate_ngrams(words, 2)
    word_vectors = [model.wv[word] for word in words if word in model.wv]
    bi_gram_vectors = [model.wv[' '.join(bi_gram)] for bi_gram in bi_grams if ' '.join(bi_gram) in model.wv]
    sentiment = sentiment_score(text)  
    if word_vectors:
        combined_vectors = np.sum(word_vectors + bi_gram_vectors, axis=0)
        return np.append(combined_vectors, sentiment)
    else:
        return np.append(np.zeros(model.vector_size), sentiment)

texts_vector = np.array([text_to_vector(text) for text in texts])
labels_vector = np.array(labels)

# Model Training and Evaluation
skf = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
accuracy_scores = []
f1_scores = []

clf = RandomForestClassifier(n_estimators=100, max_depth=None, min_samples_split=2)  # Improved model depth

## Incorporate and omit the headings. - DONE
## Apply gird search CV for atmost models, and across all playable params - KNN, SVM, Decision Tree etc. - DONE

for train_index, test_index in skf.split(texts_vector, labels_vector):
    texts_train, texts_test = texts_vector[train_index], texts_vector[test_index]
    labels_train, labels_test = labels_vector[train_index], labels_vector[test_index]
    clf.fit(texts_train, labels_train)
    risk_pred = clf.predict(texts_test)
    
    accuracy = accuracy_score(labels_test, risk_pred)
    accuracy_scores.append(accuracy)
    
    # Evaluate F1 Score
    f1 = f1_score(labels_test, risk_pred, average=None, labels=["HIGH", "MEDIUM", "LOW"], zero_division=0)
    f1_scores.append(f1)

# Display final results
High= list(filter(lambda x: x.risk_level == "HIGH", risks))
Med= list(filter(lambda x: x.risk_level == "MEDIUM", risks))
Low= list(filter(lambda x: x.risk_level == "LOW", risks))
print(len(High))
print(len(Med))
print(len(Low))
print("Accuracy scores:", accuracy_scores)
print("Average accuracy:", np.mean(accuracy_scores))
print("std", np.std(accuracy_scores))
print("F1 Scores by class:", np.mean(f1_scores, axis=0))

# Risk classification function
def classify_risk(text):
    vector = text_to_vector(text)
    if np.all(vector == 0):
        return "NO_RISK"
    else:
        return clf.predict(vector.reshape(1, -1))[0]

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite.db'
db.init_app(app)

CORS(app)

FILE_UPLOAD_FOLDER = '../data'
app.config['FILE_UPLOAD_FOLDER'] = FILE_UPLOAD_FOLDER
                    
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/uploadFile", methods=["POST"])
def upload():
    if 'pdf' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['pdf']
    
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['FILE_UPLOAD_FOLDER'], filename)
        file.save(filepath)

    if filepath:
        try:
            text = extract_text(filepath)
            paragraphs = text.split("\n\n")  
            risky_sentences = []

            for sentence in paragraphs:
                if not sentence.isupper():
                 risk_level = classify_risk(sentence)    
                 result = sentence.replace("\n", "")                    
                 if (risk_level != "NO_RISK"):  
                    risky_sentences.append({
                        "statement": result,
                        "risk_level": risk_level
                    })

            return jsonify({
                "success": True,
                "risks": risky_sentences,
                "paragraphs": paragraphs
            }), 200

        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Error processing the file"}), 500

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