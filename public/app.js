const topicInput = document.getElementById("topic");
const generateButton = document.getElementById("generateButton");
const result = document.getElementById("result");
const statusBadge = document.getElementById("statusBadge");
const suggestions = document.querySelectorAll(".suggestion");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

  result.innerHTML = `
    <div class="quiz-output">
      ${
        question
          ? `<div class="quiz-question">${escapeHtml(question)}</div>`
          : `<pre>${escapeHtml(answer)}</pre>`
      }

      ${
        choices.length
          ? `
            <div class="quiz-choices">
              ${choices.map(choice => `
                <div class="quiz-choice">
                  <span class="choice-letter">${escapeHtml(choice.letter)}</span>
                  <span>${escapeHtml(choice.text)}</span>
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

      ${
        correctAnswer
          ? `
            <div class="quiz-answer">
              <span>✓</span>
              <div>
                <small>Correct Answer</small>
                <strong>${escapeHtml(correctAnswer)}</strong>
              </div>
            </div>
          `
          : ""
      }

      <div class="quiz-powered">
        ✦ Generated locally with QVAC
      </div>
    </div>
  `;
}

async function generateQuestion() {
  const topic = topicInput.value.trim();

  if (!topic) {
    topicInput.focus();
    statusBadge.textContent = "Enter a topic";
    return;
  }

  generateButton.disabled = true;
  generateButton.querySelector("span").textContent = "Generating...";
  statusBadge.textContent = "Generating";

  result.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">✦</div>
      <h4>Creating your question...</h4>
      <p>QVAC is generating it locally on your device.</p>
    </div>
  `;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topic })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Generation failed.");
    }

    displayQuestion(data.answer);
    statusBadge.textContent = "Ready";
  } catch (error) {
    console.error(error);

    result.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">!</div>
        <h4>Something went wrong.</h4>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;

    statusBadge.textContent = "Error";
  } finally {
    generateButton.disabled = false;
    generateButton.querySelector("span").textContent = "Generate Question";
  }
}

suggestions.forEach(button => {
  button.addEventListener("click", () => {
    topicInput.value = button.dataset.topic;
    topicInput.focus();
    statusBadge.textContent = "Ready";
  });
});

generateButton.addEventListener("click", generateQuestion);

topicInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    generateQuestion();
  }
});
