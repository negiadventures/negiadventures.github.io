---
layout: blog-post
title: "AI Tutor - Built with AI Assistance"
description: "How I built an AI-powered document-to-quiz generator using Claude Code and Qwen."
date: 2024-01-12
tags:
  - AI-Assisted
  - Education
  - Python
  - NLP
image: /images/blog/ai-tutor.png
---

# AI Tutor - Built with AI Assistance

## Overview
AI Tutor is an intelligent study tool that converts documents (PDFs, textbooks, lecture notes) into chapter-level quizzes with adaptive difficulty. The system uses AI to extract key concepts and generate relevant questions, helping students learn more effectively.

## The Goal
Create a tool that:
1. Reads educational documents
2. Extracts key concepts and facts
3. Generates quiz questions at different difficulty levels
4. Provides explanations for answers
5. Tracks progress over time

## AI Tools Used
- **Claude Code**: Document parsing, question generation logic, quiz engine
- **Qwen**: NLP concepts, embedding strategies, answer validation

## How AI Helped

### Document Parsing

#### PDF Text Extraction
Claude helped implement robust PDF parsing:

```python
import fitz  # PyMuPDF
from typing import List, Dict

class DocumentParser:
    def __init__(self, filepath: str):
        self.doc = fitz.open(filepath)
        self.text_blocks: List[Dict] = []

    def extract_text(self) -> str:
        full_text = []
        for page_num in range(len(self.doc)):
            page = self.doc[page_num]
            blocks = page.get_text("dict")["blocks"]

            for block in blocks:
                if "lines" in block:
                    for line in block["lines"]:
                        for span in line["spans"]:
                            full_text.append(span["text"])
        return " ".join(full_text)

    def extract_chapters(self) -> List[Dict]:
        """Extract chapter boundaries and content."""
        chapters = []
        current_chapter = {
            "title": "Introduction",
            "content": "",
            "start_page": 0
        }

        for page_num, page in enumerate(self.doc):
            text = page.get_text()
            lines = text.split("\n")

            for line in lines:
                # Detect chapter headings (uppercase, short lines)
                if self._is_chapter_heading(line):
                    if current_chapter["content"].strip():
                        chapters.append(current_chapter)
                    current_chapter = {
                        "title": line.strip(),
                        "content": "",
                        "start_page": page_num
                    }
                else:
                    current_chapter["content"] += line + "\n"

        if current_chapter["content"].strip():
            chapters.append(current_chapter)

        return chapters

    def _is_chapter_heading(self, line: str) -> bool:
        """Heuristic to detect chapter headings."""
        line = line.strip()
        if not line:
            return False
        if len(line) < 100:
            return line.isupper() or line[0].isupper() and line.endswith(".")
        return False
```

### Question Generation

#### Quiz Generator Class
AI designed a flexible quiz generation system:

```python
from enum import Enum
from dataclasses import dataclass
from typing import List, Optional

class Difficulty(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

@dataclass
class Question:
    text: str
    options: List[str]
    correct_answer: int
    explanation: str
    difficulty: Difficulty
    topic: str

@dataclass
class Quiz:
    title: str
    questions: List[Question]
    total_score: int = 0

class QuizGenerator:
    def __init__(self, document_text: str):
        self.document_text = document_text
        self.chunks = self._chunk_text()
        self.questions: List[Question] = []

    def _chunk_text(self, chunk_size: int = 500) -> List[str]:
        """Split document into manageable chunks for processing."""
        words = self.document_text.split()
        chunks = []
        for i in range(0, len(words), chunk_size):
            chunks.append(" ".join(words[i:i + chunk_size]))
        return chunks

    def generate_questions(
        self,
        num_questions: int = 10,
        difficulty: Difficulty = Difficulty.MEDIUM
    ) -> Quiz:
        """Generate quiz questions from document content."""
        questions = []

        for chunk in self.chunks[:num_questions]:
            question = self._generate_question_from_chunk(chunk, difficulty)
            if question:
                questions.append(question)

        return Quiz(
            title="Document Quiz",
            questions=questions,
            total_score=len(questions)
        )

    def _generate_question_from_chunk(
        self,
        chunk: str,
        difficulty: Difficulty
    ) -> Optional[Question]:
        """Generate a single question from a text chunk."""
        # Parse key concepts from chunk
        concepts = self._extract_concepts(chunk)

        if not concepts:
            return None

        # Select concept based on difficulty
        if difficulty == Difficulty.EASY:
            topic = concepts[0]  # Most obvious concept
        elif difficulty == Difficulty.MEDIUM:
            topic = concepts[len(concepts) // 2]
        else:
            topic = concepts[-1]  # Most nuanced concept

        # Generate question, options, and explanation
        return Question(
            text=self._formulate_question(topic, chunk),
            options=self._generate_options(topic, chunk),
            correct_answer=0,  # Would be determined by AI
            explanation=self._generate_explanation(topic, chunk),
            difficulty=difficulty,
            topic=topic
        )

    def _extract_concepts(self, text: str) -> List[str]:
        """Extract key concepts from text."""
        # Simple heuristic: extract nouns and noun phrases
        # In production, this would use NLP libraries
        import re
        nouns = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        return list(set(nouns))[:10]

    def _formulate_question(self, topic: str, context: str) -> str:
        """Create a question about the given topic."""
        templates = [
            f"What is {topic}?",
            f"Explain the concept of {topic}.",
            f"How does {topic} work?",
            f"What are the key characteristics of {topic}?"
        ]
        return templates[hash(topic) % len(templates)]

    def _generate_options(self, topic: str, context: str) -> List[str]:
        """Generate multiple choice options."""
        # In production, use AI to generate plausible distractors
        return [
            "Correct answer about " + topic,
            "Plausible distractor 1",
            "Plausible distractor 2",
            "Plausible distractor 3"
        ]

    def _generate_explanation(self, topic: str, context: str) -> str:
        """Generate explanation for the correct answer."""
        return f"{topic} is a key concept in this document. " \
               f"It relates to the surrounding context and is important for understanding."
```

### Quiz Engine

#### Interactive Quiz Runner
AI helped build the quiz execution engine:

```python
from datetime import datetime
from typing import Tuple

class QuizRunner:
    def __init__(self, quiz: Quiz):
        self.quiz = quiz
        self.current_question = 0
        self.score = 0
        self.answers: List[Tuple[int, int, float]] = []  # (q_idx, answer, time)
        self.start_time = datetime.now()

    def get_current_question(self) -> Question:
        return self.quiz.questions[self.current_question]

    def submit_answer(self, answer_idx: int) -> bool:
        question = self.quiz.questions[self.current_question]
        is_correct = answer_idx == question.correct_answer

        if is_correct:
            self.score += self._calculate_points(question)

        self.answers.append((
            self.current_question,
            answer_idx,
            (datetime.now() - self.start_time).total_seconds()
        ))

        self.current_question += 1
        return is_correct

    def _calculate_points(self, question: Question) -> int:
        """Calculate points based on difficulty and time."""
        base_points = {
            Difficulty.EASY: 10,
            Difficulty.MEDIUM: 20,
            Difficulty.HARD: 30
        }

        # Time bonus (faster = more points)
        time_bonus = max(0, 10 - self.answers[-1][2])

        return base_points[question.difficulty] + time_bonus

    def get_results(self) -> Dict:
        """Generate quiz results."""
        total_questions = len(self.quiz.questions)
        return {
            "score": self.score,
            "max_score": sum(
                self._calculate_points(q) for q in self.quiz.questions
            ),
            "accuracy": self.score / max(1, self._calculate_total_points()),
            "time_taken": (datetime.now() - self.start_time).total_seconds(),
            "questions_correct": sum(
                1 for a in self.answers if a[1] == self.quiz.questions[a[0]].correct_answer
            ),
            "total_questions": total_questions
        }

    def _calculate_total_points(self) -> int:
        return sum(
            self._calculate_points(q) for q in self.quiz.questions
        )
```

## The Process

### Prompting Strategy

**Effective approach:**
1. Define data models first (Question, Quiz, Difficulty)
2. Build parsing layer
3. Implement question generation
4. Create quiz runner
5. Add results tracking

**Example prompt:**
```
I need a Python class structure for a quiz system.
It should have:
1. Question dataclass with text, options, correct_answer, explanation
2. Quiz class that contains multiple questions
3. Difficulty enum (easy, medium, hard)
4. Methods to calculate score based on difficulty

Start with the dataclasses and enums.
```

### Human Decisions
- Question difficulty calibration
- Scoring system design
- User interface choices
- What constitutes a "good" question

### Iteration Cycle
1. Define data model
2. Generate parsing code
3. Test with sample documents
4. Refine question generation
5. Add more features

## Challenges

### What AI Couldn't Help With
- **Semantic understanding**: AI couldn't truly understand document content
- **Question quality**: Human review needed for accurate questions
- **Educational value**: Pedagogical decisions required human expertise

### Unexpected Issues
- PDF formatting varies widely across documents
- Some documents have poor OCR quality
- Handling images and formulas in PDFs

## Results

### Quantitative
- **Development time**: 3 days with AI vs estimated 5-7 days without
- **Document support**: Works with various PDF formats
- **Question generation**: Can generate 50+ questions per document

### Qualitative
- Clean, modular Python code
- Well-documented parsing logic
- Extensible quiz system

## Key Learnings

1. **AI helps with structure** - Data models and class design
2. **Human oversight needed** - Question accuracy requires review
3. **Modular design is key** - Separate parsing, generation, and execution
4. **Type hints help** - Catch errors early with static analysis
5. **Testing is crucial** - Validate with real documents

## Code Samples

### Example Prompt
```
I need a Python dataclass for a quiz question.
It should include:
- Question text
- Multiple choice options (list of strings)
- Index of correct answer
- Explanation for why it's correct
- Difficulty level enum
- Topic/category tag
```

### Resulting Code
```python
from dataclasses import dataclass
from enum import Enum
from typing import List

class Difficulty(Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

@dataclass
class Question:
    text: str
    options: List[str]
    correct_answer: int
    explanation: str
    difficulty: Difficulty
    topic: str

    def __post_init__(self):
        if not (0 <= self.correct_answer < len(self.options)):
            raise ValueError("correct_answer must be a valid index")
```

## Next Steps
- Integrate with actual LLM for better question generation
- Add spaced repetition for review
- Track user progress over time
- Support multiple document formats (Word, Markdown)

---

*This project was built with AI pair programming assistance using Claude Code and Qwen.*
