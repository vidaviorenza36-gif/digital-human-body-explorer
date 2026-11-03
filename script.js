/* ===== 1. Menu navigasi (HP) ===== */
const nav = document.getElementById("nav");
const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.querySelectorAll("a").forEach(link =>
  link.addEventListener("click", () => nav.classList.remove("open"))
);

/* ===== 2. Animasi muncul saat scroll ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ===== 3. Menu aktif sesuai bagian yang dilihat ===== */
const navLinks = document.querySelectorAll("nav a");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    }
  });
}, { rootMargin: "-40% 0px -50% 0px" });
document.querySelectorAll("main section").forEach(s => sectionObserver.observe(s));

/* ===== 4. Tab gerak sadar / refleks ===== */
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".flow-panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

/* ===== 5. Kuis interaktif ===== */
const questions = [
  {
    q: "Bagian otak yang mengatur keseimbangan dan koordinasi gerak adalah ...",
    options: ["Otak besar", "Otak kecil", "Batang otak", "Sumsum lanjutan"],
    answer: 1,
    explain: "Otak kecil mengatur keseimbangan tubuh dan koordinasi gerakan."
  },
  {
    q: "Sumsum tulang belakang berperan sebagai pusat ...",
    options: ["Ingatan", "Penglihatan", "Gerak refleks", "Pencernaan"],
    answer: 2,
    explain: "Sumsum tulang belakang mengatur gerak refleks tanpa menunggu perintah otak."
  },
  {
    q: "Saraf yang membawa rangsangan dari reseptor ke pusat saraf disebut saraf ...",
    options: ["Motorik", "Sensorik", "Kranial", "Otonom"],
    answer: 1,
    explain: "Saraf sensorik membawa informasi dari indra menuju otak atau sumsum tulang belakang."
  },
  {
    q: "Sendi pada siku dan lutut termasuk jenis sendi ...",
    options: ["Peluru", "Putar", "Pelana", "Engsel"],
    answer: 3,
    explain: "Sendi engsel hanya bergerak satu arah, seperti engsel pintu."
  },
  {
    q: "Otot yang bekerja di luar kehendak dan terdapat pada dinding usus adalah otot ...",
    options: ["Polos", "Lurik", "Rangka", "Biseps"],
    answer: 0,
    explain: "Otot polos bekerja tanpa disadari, misalnya di lambung dan usus."
  },
  {
    q: "Urutan jalur gerak refleks yang benar adalah ...",
    options: [
      "Rangsang → otak → saraf motorik → otot",
      "Rangsang → saraf sensorik → sumsum tulang belakang → saraf motorik → otot",
      "Rangsang → otot → saraf sensorik → otak",
      "Rangsang → saraf motorik → sumsum tulang belakang → saraf sensorik"
    ],
    answer: 1,
    explain: "Pada refleks, impuls diolah di sumsum tulang belakang sehingga jalurnya lebih pendek dan cepat."
  }
];

const quizBox = document.getElementById("quiz");
const resultBox = document.getElementById("result");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const counterEl = document.getElementById("counter");
const barEl = document.getElementById("bar");
const nextBtn = document.getElementById("nextBtn");

let current = 0;
let score = 0;

function showQuestion() {
  const item = questions[current];
  questionEl.textContent = item.q;
  counterEl.textContent = `Pertanyaan ${current + 1} dari ${questions.length}`;
  barEl.style.width = `${(current / questions.length) * 100}%`;
  feedbackEl.textContent = "";
  nextBtn.hidden = true;
  optionsEl.innerHTML = "";

  item.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => checkAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const item = questions[current];
  const buttons = optionsEl.querySelectorAll(".option");
  buttons.forEach(b => (b.disabled = true));
  buttons[item.answer].classList.add("correct");

  if (selected === item.answer) {
    score++;
    feedbackEl.textContent = "✅ Benar! " + item.explain;
  } else {
    buttons[selected].classList.add("wrong");
    feedbackEl.textContent = "❌ Salah. " + item.explain;
  }

  nextBtn.textContent = current === questions.length - 1 ? "Lihat Skor →" : "Lanjut →";
  nextBtn.hidden = false;
}

function showResult() {
  quizBox.hidden = true;
  resultBox.hidden = false;
  resultBox.classList.add("show");
  const percent = Math.round((score / questions.length) * 100);
  document.getElementById("score").textContent = `${score} / ${questions.length} (${percent}%)`;

  let msg = "Ayo belajar lagi, kamu pasti bisa! 💪";
  if (percent >= 80) msg = "Hebat! Pemahamanmu sangat baik! 🌟";
  else if (percent >= 50) msg = "Bagus! Sedikit lagi menjadi sempurna. 👍";
  document.getElementById("message").textContent = msg;
}

nextBtn.addEventListener("click", () => {
  current++;
  if (current < questions.length) showQuestion();
  else showResult();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  current = 0;
  score = 0;
  resultBox.hidden = true;
  quizBox.hidden = false;
  showQuestion();
});

showQuestion();