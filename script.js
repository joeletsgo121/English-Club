const rooms = [
  {
    id: 1,
    title: "English",
    language: "English",
    level: "Any Level",
    topic: "Free Conversation",
    owner: "Joe",
    members: ["J", "R", "K"],
    count: 8,
    active: true
  },
  {
    id: 2,
    title: "English Speaking",
    language: "English",
    level: "Beginner",
    topic: "Daily Conversation",
    owner: "Rahim",
    members: ["R", "J", "H"],
    count: 5,
    active: true
  },
  {
    id: 3,
    title: "IELTS Practice",
    language: "English",
    level: "Intermediate",
    topic: "IELTS Speaking",
    owner: "Karim",
    members: ["K", "T"],
    count: 4,
    active: true
  },
  {
    id: 4,
    title: "বাংলা থেকে English",
    language: "Bengali",
    level: "Any Level",
    topic: "English Conversation",
    owner: "Hasan",
    members: ["H", "J", "R"],
    count: 7,
    active: true
  },
  {
    id: 5,
    title: "Hindi Conversation",
    language: "Hindi",
    level: "Any Level",
    topic: "Daily Talk",
    owner: "Amit",
    members: ["A", "S"],
    count: 3,
    active: false
  },
  {
    id: 6,
    title: "Urdu English Club",
    language: "Urdu",
    level: "Intermediate",
    topic: "Speaking Practice",
    owner: "Ali",
    members: ["A", "N", "M"],
    count: 6,
    active: true
  }
];

const roomGrid = document.getElementById("roomGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const resultText = document.getElementById("resultText");
const allCount = document.getElementById("allCount");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");

let selectedLanguage = "All";
let sortMode = "active";

allCount.textContent = rooms.length;

function renderRooms() {
  const search = searchInput.value.trim().toLowerCase();

  let filtered = rooms.filter(room => {
    const matchesLanguage =
      selectedLanguage === "All" || room.language === selectedLanguage;

    const searchable = [
      room.title,
      room.language,
      room.level,
      room.topic,
      room.owner
    ].join(" ").toLowerCase();

    return matchesLanguage && searchable.includes(search);
  });

  if (sortMode === "active") {
    filtered.sort((a, b) => Number(b.active) - Number(a.active));
  } else {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  roomGrid.innerHTML = "";

  filtered.forEach(room => {
    const card = document.createElement("article");
    card.className = "room-card";

    const members = room.members.map((member, index) => `
      <span class="member ${index < 2 ? "online" : ""}" title="Member ${member}">
        ${member}
      </span>
    `).join("");

    card.innerHTML = `
      <div class="room-top">
        <div class="room-title-wrap">
          <div class="room-avatar">👤</div>
          <div>
            <h3 class="room-title">
              ${escapeHTML(room.title)}
              <span class="room-level">${escapeHTML(room.level)}</span>
            </h3>
            <div style="color:#7f929d;font-size:11px;margin-top:3px">
              ${escapeHTML(room.topic)}
            </div>
          </div>
        </div>
        <button class="room-settings" title="Room settings">⚙</button>
      </div>

      <div class="room-info">
        <div>
          <div style="margin-bottom:6px">
            <span style="color:${room.active ? "#38cf7c" : "#7b878e"}">
              ● ${room.active ? "Active now" : "Inactive"}
            </span>
            · ${room.count} people
          </div>
          <div class="members">${members}</div>
        </div>

        <button class="join-btn" data-room="${room.id}">
          Join Room
        </button>
      </div>
    `;

    roomGrid.appendChild(card);
  });

  resultText.textContent = `${filtered.length} room${filtered.length === 1 ? "" : "s"} found`;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll(".filter[data-language]").forEach(button => {
  button.addEventListener("click", () => {
    selectedLanguage = button.dataset.language;

    document.querySelectorAll(".filter[data-language]").forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });

    renderRooms();
  });
});

searchInput.addEventListener("input", renderRooms);

document.getElementById("searchBtn").addEventListener("click", renderRooms);

document.getElementById("expandBtn").addEventListener("click", () => {
  document.getElementById("filters").classList.toggle("expanded");
  document.getElementById("expandBtn").textContent =
    document.getElementById("filters").classList.contains("expanded")
      ? "⌃ Collapse"
      : "⌄ Expand";
});

document.getElementById("sortBtn").addEventListener("click", () => {
  sortMode = sortMode === "active" ? "name" : "active";
  document.getElementById("sortBtn").textContent =
    sortMode === "active" ? "Sort: Active ▾" : "Sort: Name ▾";
  renderRooms();
});

roomGrid.addEventListener("click", event => {
  const button = event.target.closest(".join-btn");
  if (!button) return;

  const room = rooms.find(item => item.id === Number(button.dataset.room));
  if (!room) return;

  openModal(
    `Join ${room.title}`,
    `
      <p class="modal-text">
        You are about to join the <strong>${escapeHTML(room.title)}</strong>
        practice room.<br><br>
        Topic: ${escapeHTML(room.topic)}<br>
        Level: ${escapeHTML(room.level)}<br>
        Members: ${room.count}
      </p>
      <button class="modal-submit" id="confirmJoin">Join Practice Room</button>
    `
  );

  document.getElementById("confirmJoin").addEventListener("click", () => {
    closeModal();
    alert(`Demo: You joined the "${room.title}" room.`);
  });
});

document.getElementById("createRoomBtn").addEventListener("click", () => {
  openModal(
    "Create a new group",
    `
      <form id="createRoomForm">
        <div class="form-group">
          <label for="roomName">Group name</label>
          <input id="roomName" required placeholder="e.g. English Conversation">
        </div>

        <div class="form-group">
          <label for="roomLanguage">Language</label>
          <select id="roomLanguage">
            <option>English</option>
            <option>Bengali</option>
            <option>Hindi</option>
            <option>Urdu</option>
            <option>Arabic</option>
            <option>German</option>
          </select>
        </div>

        <div class="form-group">
          <label for="roomLevel">Level</label>
          <select id="roomLevel">
            <option>Any Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div class="form-group">
          <label for="roomTopic">Topic</label>
          <input id="roomTopic" placeholder="e.g. Daily conversation">
        </div>

        <button class="modal-submit" type="submit">Create Group</button>
      </form>
    `
  );

  document.getElementById("createRoomForm").addEventListener("submit", event => {
    event.preventDefault();

    const newRoom = {
      id: Date.now(),
      title: document.getElementById("roomName").value,
      language: document.getElementById("roomLanguage").value,
      level: document.getElementById("roomLevel").value,
      topic: document.getElementById("roomTopic").value || "Free Conversation",
      owner: "You",
      members: ["Y"],
      count: 1,
      active: true
    };

    rooms.unshift(newRoom);
    allCount.textContent = rooms.length;
    selectedLanguage = "All";

    document.querySelectorAll(".filter[data-language]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.language === "All");
    });

    closeModal();
    renderRooms();
  });
});

document.getElementById("supportBtn").addEventListener("click", () => {
  openModal(
    "Support English Club",
    `<p class="modal-text">
      If this community helps you practice English, you can support the project.
      In the future, this button can be connected to your preferred payment method.
    </p>
    <button class="modal-submit" onclick="closeModal()">Thank You ❤️</button>`
  );
});

document.querySelectorAll("[data-modal]").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.modal;

    const content = {
      privacy: `
        <p class="modal-text">
          English Club respects your privacy. This demo page does not collect or
          store personal information. When you build the real version, you can
          add a proper privacy policy covering accounts, messages and room data.
        </p>`,
      contact: `
        <p class="modal-text">
          Have a suggestion or found a problem?<br><br>
          Email: <strong>hello@example.com</strong><br>
          Replace this address with your real contact address later.
        </p>`,
      about: `
        <p class="modal-text">
          <strong>English Club</strong> is a community project for people who
          want to practice English with friends, improve speaking confidence,
          learn vocabulary and communicate regularly.
        </p>`
    };

    openModal(
      type === "privacy" ? "Privacy Policy" :
      type === "contact" ? "Contact Us" : "About Us",
      content[type]
    );
  });
});

document.getElementById("loginBtn").addEventListener("click", () => {
  openModal(
    "Login",
    `
      <form id="loginForm">
        <div class="form-group">
          <label>Email</label>
          <input type="email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" required placeholder="••••••••">
        </div>
        <button class="modal-submit">Login</button>
      </form>
    `
  );
});

document.getElementById("registerBtn").addEventListener("click", () => {
  openModal(
    "Create your account",
    `
      <form id="registerForm">
        <div class="form-group">
          <label>Your name</label>
          <input required placeholder="Joe">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" required placeholder="Create a password">
        </div>
        <button class="modal-submit">Create Account</button>
      </form>
    `
  );
});

document.getElementById("settingsBtn").addEventListener("click", () => {
  openModal(
    "Search settings",
    `
      <p class="modal-text">
        Search currently checks room name, language, level, topic and owner.
        Later you can connect this to a real database for live search.
      </p>`
  );
});

function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modalBackdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

renderRooms();
