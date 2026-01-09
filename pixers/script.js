document.getElementById("generateBtn").addEventListener("click", generate);

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
3. Then generate 3 viva-voce questions.

Student logic:
${logic}

Respond strictly in this format:
EXPLANATION:
CODE:
VIVA:
`;

  // 🔴 REPLACE WITH YOUR GEMINI API KEY
  const API_KEY = "YOUR_GEMINI_API_KEY";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
  const viva = text.split("VIVA:")[1];

  document.getElementById("explanation").innerText = explanation.trim();
  document.getElementById("code").innerText = code.trim();
  document.getElementById("viva").innerText = viva.trim();

  // 🔥 SAVE TO FIREBASE (later step)
}
