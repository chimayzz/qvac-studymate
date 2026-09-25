const topicInput = document.getElementById("topic");
const generateButton = document.getElementById("generateButton");
const result = document.getElementById("result");
const statusBadge = document.getElementById("statusBadge");

const suggestions = document.querySelectorAll(".suggestion");

// ================================
// Topic suggestion buttons
// ================================

suggestions.forEach((button) => {
  button.addEventListener("click", () => {
    topicInput.value = button.dataset.topic;
    topicInput.focus();
  });
});


// ================================
// Escape HTML
// ================================

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}


// ================================
// Generate study question
// ================================

async function generateQuestion() {
  const topic = topicInput.value.trim();

  if (!topic) {
    topicInput.focus();
    statusBadge.textContent = "Enter a topic";
    return;
  }

  generateButton.disabled = true;
  generateButton.querySelector("span").textContent =
    "Generating with QVAC...";

  statusBadge.textContent = "Thinking...";

  result.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">✦</div>

      <h4>QVAC is creating your question...</h4>

      <p>
        The model is running locally through the QVAC SDK.
      </p>
    </div>
  `;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        topic
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to generate question."
      );
    }

    displayQuestion(data.answer);

    statusBadge.textContent = "Generated";
  } catch (error) {
    console.error(error);

    statusBadge.textContent = "Error";

    result.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">!</div>

        <h4>Something went wrong.</h4>

        <p>
          ${escapeHtml(error.message)}
        </p>
      </div>
    `;
  } finally {
    generateButton.disabled = false;

    generateButton.querySelector("span").textContent =
      "Generate Question";
  }
}


// ================================
// Display QVAC output
// ================================

function displayQuestion(answer) {
  result.innerHTML = `
    <div class="quiz-output">
      <pre>${escapeHtml(answer)}</pre>
    </div>
  `;
}


// ================================
// Generate button
// ================================

generateButton.addEventListener(
  "click",
  generateQuestion
);


// ================================
// Press Enter to generate
// ================================

topicInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    generateQuestion();
  }
});