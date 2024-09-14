# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PromptModel(db.Model):
    __tablename__ = 'prompts'
    prompt_id = db.Column(db.String, primary_key=True)
    prompt_name = db.Column(db.String, nullable=False)
    promptq = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<Prompt {self.prompt_name}>"