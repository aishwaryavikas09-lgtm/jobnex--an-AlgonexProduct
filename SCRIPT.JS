// =========================================
// JOBNEX — Frontend Logic
// Connects to FastAPI backend on port 8000
// =========================================

const API_BASE = "http://127.0.0.1:8000";

// ---- Character counters ----
document.getElementById("resume-input").addEventListener("input", function () {
  document.getElementById("resume-count").textContent = `${this.value.length} characters`;
});
document.getElementById("job-input").addEventListener("input", function () {
  document.getElementById("job-count").textContent = `${this.value.length} characters`;
});

// =========================================
// ANALYZE
// =========================================
async function analyze() {
  const resume = document.getElementById("resume-input").value.trim();
  const job    = document.getElementById("job-input").value.trim();
  const btn    = document.getElementById("analyze-btn");
  const errBox = document.getElementById("error-box");
  const errMsg = document.getElementById("error-message");

  // Hide previous errors
  errBox.style.display = "none";

  // Validation
  if (!resume) { showError("Please paste your resume text."); return; }
  if (!job)    { showError("Please paste the job description."); return; }

  // Loading state
  btn.classList.add("loading");
  document.getElementById("btn-text").textContent = "Analyzing...";
  btn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, job_description: job })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    showResults(data);

  } catch (err) {
    if (err.message.includes("fetch") || err.message.includes("Failed")) {
      showError("Cannot connect to backend. Make sure uvicorn is running on port 8000.");
    } else {
      showError(err.message);
    }
  } finally {
    btn.classList.remove("loading");
    document.getElementById("btn-text").textContent = "Analyze Now";
    btn.disabled = false;
  }
}

// =========================================
// SHOW RESULTS
// =========================================
function showResults(data) {
  // Hide analyzer, show results
  document.getElementById("results-section").style.display = "block";
  document.getElementById("results-section").scrollIntoView({ behavior: "smooth" });

  // Result ID badge
  if (data.id) {
    document.getElementById("result-id-badge").textContent = `Result #${data.id}`;
  }

  const matched   = data.matched_skills   || [];
  const unmatched = data.unmatched_skills || [];
  const total     = matched.length + unmatched.length;
  const score     = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  // Animate score ring
  animateScore(score);

  // Score label & desc
  const { label, desc } = getScoreInfo(score);
  document.getElementById("score-label").textContent = label;
  document.getElementById("score-desc").textContent  = desc;

  // Matched skills
  document.getElementById("matched-count").textContent = matched.length;
  const matchedEl = document.getElementById("matched-skills");
  matchedEl.innerHTML = matched.length
    ? matched.map((s, i) =>
        `<span class="skill-tag skill-tag-green" style="animation-delay:${i*0.05}s">✓ ${capitalize(s)}</span>`
      ).join("")
    : `<span style="color:var(--text-3);font-size:0.85rem">No matching skills found</span>`;

  // Unmatched skills
  document.getElementById("unmatched-count").textContent = unmatched.length;
  const unmatchedEl = document.getElementById("unmatched-skills");
  unmatchedEl.innerHTML = unmatched.length
    ? unmatched.map((s, i) =>
        `<span class="skill-tag skill-tag-red" style="animation-delay:${i*0.05}s">✗ ${capitalize(s)}</span>`
      ).join("")
    : `<span style="color:var(--green);font-size:0.85rem">All skills matched! 🎉</span>`;

  // Suggestions
  const suggestions = data.suggestions || [];
  const suggestEl   = document.getElementById("suggestions-list");
  suggestEl.innerHTML = suggestions.length
    ? suggestions.map((s, i) =>
        `<li class="suggestion-item" style="animation-delay:${i*0.06}s">
           <span class="suggestion-bullet">●</span>
           <span>${s}</span>
         </li>`
      ).join("")
    : `<li class="suggestion-item"><span class="suggestion-bullet">●</span><span>Great job! Your resume matches the job well.</span></li>`;
}

// =========================================
// SCORE ANIMATION
// =========================================
function animateScore(score) {
  const fill      = document.getElementById("score-ring-fill");
  const numEl     = document.getElementById("score-number");
  const circumference = 314; // 2 * π * 50

  // Inject SVG gradient once
  let svg = document.getElementById("score-svg");
  if (!svg.querySelector("defs")) {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#22d3ee"/>
      </linearGradient>`;
    svg.prepend(defs);
  }

  const offset = circumference - (score / 100) * circumference;
  fill.style.strokeDashoffset = offset;

  // Count-up animation
  let current = 0;
  const step  = score / 50;
  const timer = setInterval(() => {
    current = Math.min(current + step, score);
    numEl.textContent = `${Math.round(current)}%`;
    if (current >= score) clearInterval(timer);
  }, 20);
}

function getScoreInfo(score) {
  if (score >= 80) return { label: "Excellent Match! 🎉", desc: "Your resume is a strong match for this job. You have most of the required skills." };
  if (score >= 60) return { label: "Good Match ✅",       desc: "Your resume matches well. A few more skills could make you an even stronger candidate." };
  if (score >= 40) return { label: "Moderate Match ⚠️",   desc: "You have some relevant skills, but there are gaps to address before applying." };
  return           { label: "Low Match ❌",               desc: "Your resume doesn't closely match this role. Consider upskilling or targeting a different position." };
}

// =========================================
// HISTORY
// =========================================
async function loadHistory() {
  const listEl  = document.getElementById("history-list");
  const emptyEl = document.getElementById("history-empty");

  listEl.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-3)">Loading history...</div>`;

  try {
    const res  = await fetch(`${API_BASE}/api/history`);
    if (!res.ok) throw new Error("Failed to load history");
    const data = await res.json();

    if (!data.length) {
      listEl.innerHTML = "";
      emptyEl.style.display = "block";
      listEl.appendChild(emptyEl);
      return;
    }

    emptyEl.style.display = "none";
    listEl.innerHTML = data.map((r, i) => {
      const matched   = r.matched_skills   ? r.matched_skills.split(",").filter(Boolean)   : [];
      const unmatched = r.unmatched_skills ? r.unmatched_skills.split(",").filter(Boolean) : [];
      const total     = matched.length + unmatched.length;
      const score     = total > 0 ? Math.round((matched.length / total) * 100) : 0;
      const scoreClass = score >= 70 ? "score-high" : score >= 40 ? "score-medium" : "score-low";
      const date       = r.created_at ? new Date(r.created_at).toLocaleString() : "—";

      return `
        <div class="history-card" style="animation-delay:${i*0.05}s">
          <div class="history-id">#${r.id}</div>
          <div class="history-skills">
            ${matched.map(s => `<span class="skill-tag skill-tag-green">${capitalize(s.trim())}</span>`).join("")}
            ${unmatched.map(s => `<span class="skill-tag skill-tag-red">${capitalize(s.trim())}</span>`).join("")}
          </div>
          <div class="history-meta">
            <div class="history-date">${date}</div>
            <div class="history-score ${scoreClass}">${score}% Match</div>
          </div>
        </div>`;
    }).join("");

  } catch (err) {
    listEl.innerHTML = `
      <div class="error-box">
        <span class="error-icon">⚠️</span>
        <span>Could not load history: ${err.message}</span>
      </div>`;
  }
}

// =========================================
// UTILITIES
// =========================================
function showError(msg) {
  const errBox = document.getElementById("error-box");
  document.getElementById("error-message").textContent = msg;
  errBox.style.display = "flex";
  errBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function analyzeAgain() {
  document.getElementById("results-section").style.display = "none";
  document.getElementById("analyzer").scrollIntoView({ behavior: "smooth" });
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// Load history on page load
window.addEventListener("DOMContentLoaded", loadHistory);
