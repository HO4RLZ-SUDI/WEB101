// --- Load Rounds ---
async function loadRounds() {
  const container = document.getElementById('rounds-grid');
  try {
    const res = await fetch('data/rounds.json');
    const rounds = await res.json();
    container.innerHTML = rounds
      .map(r => `<div class="round-card"><div class="icon">${r.icon}</div><h3>${r.title}</h3><p>${r.description}</p></div>`)
      .join('');
  } catch (e) {
    container.innerHTML = '<p class="fallback">ไม่สามารถโหลดข้อมูลรอบการรับสมัครได้</p>';
  }
}

// --- Load News ---
async function loadNews() {
  const container = document.getElementById('news-grid');
  try {
    const res = await fetch('data/news.json');
    const news = await res.json();
    container.innerHTML = news
      .map(n => `
        <div class="news-card">
          <img loading="lazy" decoding="async" src="${n.image}" alt="${n.alt}">
          <div class="news-card-content">
            <span class="tag">${n.tag}</span>
            <h3>${n.title}</h3>
            <p class="date">${n.date}</p>
            <p>${n.description}</p>
            <a href="${n.link}">อ่านเพิ่มเติม &raquo;</a>
          </div>
        </div>`)
      .join('');
  } catch (e) {
    container.innerHTML = '<p class="fallback">ไม่สามารถโหลดข่าวสารได้</p>';
  }
}

// --- Load FAQ ---
async function loadFAQ() {
  const container = document.getElementById('faq-container');
  try {
    const res = await fetch('data/faq.json');
    const faqs = await res.json();
    container.innerHTML = faqs
      .map(f => `
        <div class="faq-item">
          <div class="faq-question">
            <span>${f.question}</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="faq-answer">
            <p>${f.answer}</p>
          </div>
        </div>`)
      .join('');
    attachFaqListeners();
  } catch (e) {
    container.innerHTML = '<p class="fallback">ไม่สามารถโหลดคำถามที่พบบ่อยได้</p>';
  }
}

function attachFaqListeners() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('active')) {
          other.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });
}

// --- Countdown with Timeline ---
let milestones = [];
let currentIndex = -1;
let countdownInterval;

async function initTimelineCountdown() {
  const labelEl = document.getElementById('countdown-label');
  const timerEl = document.getElementById('countdown-timer');
  try {
    const res = await fetch('data/timeline.json');
    const data = await res.json();
    milestones = (data.milestones || [])
      .map(m => ({ ...m, date: new Date(m.date) }))
      .sort((a, b) => a.date - b.date);
    currentIndex = getNextIndex();
    if (currentIndex === -1) {
      showOpenMessage();
      return;
    }
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    injectEventJsonLd(milestones[currentIndex]);
  } catch (e) {
    labelEl.textContent = 'ไม่สามารถโหลดข้อมูลการนับถอยหลังได้';
    timerEl.innerHTML = '';
  }
}

function getNextIndex() {
  const now = new Date();
  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i].date > now) return i;
  }
  return -1;
}

function updateCountdown() {
  if (currentIndex === -1) {
    showOpenMessage();
    return;
  }
  const labelEl = document.getElementById('countdown-label');
  const timerEl = document.getElementById('countdown-timer');
  const event = milestones[currentIndex];
  const now = new Date();
  const gap = event.date - now;
  if (gap <= 0) {
    currentIndex = getNextIndex();
    if (currentIndex === -1) {
      showOpenMessage();
      return;
    }
    injectEventJsonLd(milestones[currentIndex]);
    return;
  }
  labelEl.textContent = `เหลือเวลาอีก... ก่อน${event.label}`;
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const textDay = Math.floor(gap / day);
  const textHour = Math.floor((gap % day) / hour);
  const textMinute = Math.floor((gap % hour) / minute);
  const textSecond = Math.floor((gap % minute) / second);
  document.getElementById('days').innerText = textDay.toString().padStart(2, '0');
  document.getElementById('hours').innerText = textHour.toString().padStart(2, '0');
  document.getElementById('minutes').innerText = textMinute.toString().padStart(2, '0');
  document.getElementById('seconds').innerText = textSecond.toString().padStart(2, '0');
}

function showOpenMessage() {
  const labelEl = document.getElementById('countdown-label');
  labelEl.textContent = 'เปิดรับสมัครแล้ว!';
  document.getElementById('countdown-timer').innerHTML = '<h3 style="color:white;width:100%;">เปิดรับสมัครแล้ว!</h3>';
  clearInterval(countdownInterval);
  const jsonld = document.getElementById('event-jsonld');
  if (jsonld) jsonld.textContent = '';
}

function injectEventJsonLd(event) {
  const script = document.getElementById('event-jsonld');
  if (!script) return;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `TCAS: ${event.label}`,
    startDate: event.date.toISOString(),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: "https://www.mytcas.com/"
    }
  };
  script.textContent = JSON.stringify(jsonld);
}

// --- Init ---
loadRounds();
loadNews();
loadFAQ();
initTimelineCountdown();
