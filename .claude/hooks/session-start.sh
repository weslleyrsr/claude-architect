#!/bin/bash
# SessionStart hook — loads student context when Claude Code session opens

if [ -f "progress/student.json" ]; then
  echo "STUDENT_CONTEXT: $(cat progress/student.json)"
  echo "Hint to Claude: Student context loaded. Greet the student by name, show their progress dashboard, and offer to continue from where they left off. Use the /study command flow."
else
  echo "Hint to Claude: No student profile found. Welcome the student warmly, explain this is the Claude Certified Architect – Foundations exam prep experience, and suggest running /study to get started with enrollment."
fi
