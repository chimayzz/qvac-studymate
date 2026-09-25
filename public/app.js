function displayQuestion(answer) {
  const lines = answer
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  let question = "";
  let choices = [];
  let correctAnswer = "";

  for (const line of lines) {
    if (line.startsWith("Question:")) {
      question = line.replace("Question:", "").trim();
    }

    const choiceMatch = line.match(/^([A-D])\.\s*(.+)$/);

    if (choiceMatch) {
      choices.push({
        letter: choiceMatch[1],
        text: choiceMatch[2]
      });
    }

    if (line.startsWith("Answer:")) {
      correctAnswer = line.replace("Answer:", "").trim();
    }
  }

  if (!question) {
    result.innerHTML = `
      <div class="quiz-output">
        <pre>${escapeHtml(answer)}</pre>
      </div>
    `;
    return;
  }

  result.innerHTML = `
    <div class="quiz-output">

      <div class="quiz-question">
        ${escapeHtml(question)}
      </div>

      <div class="quiz-choices">
        ${choices.map(choice => `
          <div class="quiz-choice">
            <span class="choice-letter">
              ${escapeHtml(choice.letter)}
            </span>

            <span>
              ${escapeHtml(choice.text)}
            </span>
          </div>
        `).join("")}
      </div>

      <div class="quiz-answer">
        <span>✓</span>
        <div>
          <small>Correct Answer</small>
          <strong>${escapeHtml(correctAnswer)}</strong>
        </div>
      </div>

      <div class="quiz-powered">
        ✦ Generated locally with QVAC
      </div>

    </div>
  `;
}