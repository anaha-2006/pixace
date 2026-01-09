document.getElementById("generateBtn").addEventListener("click", generate);
document.getElementById("revealBtn").addEventListener("click", toggleAnswers);

// Initialize score and streak
let score = parseInt(localStorage.getItem('score')) || 0;
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastUseDate = localStorage.getItem('lastUseDate') || null;

updateDisplay();

function updateDisplay() {
  document.getElementById('score').innerText = score;
  document.getElementById('streak').innerText = streak;
}

function toggleAnswers() {
  const container = document.getElementById("answersContainer");
  const btn = document.getElementById("revealBtn");
  if (container.classList.contains("answers-hidden")) {
    container.classList.remove("answers-hidden");
    container.classList.add("answers-visible");
    btn.innerText = "🙈 Hide Answers";
  } else {
    container.classList.remove("answers-visible");
    container.classList.add("answers-hidden");
    btn.innerText = "🔍 Reveal Answers";
  }
}

async function generate() {
  const logic = document.getElementById("logicInput").value;
  const lang = document.getElementById("language").value;

  if (!logic.trim()) {
    alert("Please enter your logic!");
    return;
  }

  document.getElementById("explanation").innerText = "Thinking in Malayalam...";
  document.getElementById("code").innerText = "Generating code...";
  document.getElementById("viva").innerText = "Preparing viva questions...";

  // 🔥 GEMINI PROMPT
  const prompt = `
You are Script-Sense AI, a KTU programming tutor.

1. First explain the logic in Malayalam.
2. Then write the code in ${lang}.
3. Then generate 3 viva-voce questions with their answers.

Student logic:
${logic}

Respond strictly in this format:
EXPLANATION:
CODE:
VIVA:
ANSWERS:
`;

  // 🔴 REPLACE WITH YOUR GEMINI API KEY
  const API_KEY = "api";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;

  // 🧠 SPLIT RESPONSE
  const explanation = text.split("CODE:")[0].replace("EXPLANATION:", "");
  const code = text.split("CODE:")[1].split("VIVA:")[0];
  const viva = text.split("VIVA:")[1].split("ANSWERS:")[0];
  const answers = text.split("ANSWERS:")[1];

  document.getElementById("explanation").innerText = explanation.trim();
  document.getElementById("code").innerText = code.trim();
  document.getElementById("viva").innerText = viva.trim();
  document.getElementById("answers").innerText = answers.trim();

  // Show reveal button
  document.getElementById("revealBtn").style.display = "block";

  // Update score and streak
  updateScoreAndStreak();

  // 🔥 SAVE TO FIREBASE (later step)
}

function updateScoreAndStreak() {
  score += 1;
  const today = new Date().toDateString();
  if (lastUseDate === null) {
    streak = 1;
  } else {
    const lastDate = new Date(lastUseDate);
    const diffTime = new Date(today).getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
    // If same day, don't change streak
  }
  lastUseDate = today;
  localStorage.setItem('score', score);
  localStorage.setItem('streak', streak);
  localStorage.setItem('lastUseDate', lastUseDate);
  updateDisplay();
}

