```javascript
// ===============================
// SUPABASE CONFIGURATION
// ===============================
const SUPABASE_URL = "https://dubqyawbaoexjgbyyxye.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qq5gKzEu3r99r77Vq6JtrA_mFShSJuZ";
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

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

// ===============================
// ROOM FUNCTIONS
// ===============================

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

  resultText.textContent =
    `${filtered.length} room${filtered.length === 1 ? "" : "s"} found`;

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

// ===============================
// FILTERS
// ===============================

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
    sortMode === "active"
      ? "Sort: Active ▾"
      : "Sort: Name ▾";

  renderRooms();
});

// ===============================
// JOIN ROOM
// ===============================

roomGrid.addEventListener("click", event => {
  const button = event.target.closest(".join-btn");
  if (!button) return;

  const room = rooms.find(
    item => item.id === Number(button.dataset.room)
  );

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

      <button class="modal-submit" id="confirmJoin">
        Join Practice Room
      </button>
    `
  );

  document.getElementById("confirmJoin").addEventListener("click", () => {
    closeModal();
    alert(`Demo: You joined the "${room.title}" room.`);
  });
});

// ===============================
// CREATE ROOM
// ===============================

document.getElementById("createRoomBtn").addEventListener("click", () => {
  openModal(
    "Create a new group",
    `
      <form id="createRoomForm">

        <div class="form-group">
          <label for="roomName">Group name</label>
          <input
            id="roomName"
            required
            placeholder="e.g. English Conversation"
          >
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

          <input
            id="roomTopic"
            placeholder="e.g. Daily conversation"
          >
        </div>

        <button class="modal-submit" type="submit">
          Create Group
        </button>

      </form>
    `
  );

  document
    .getElementById("createRoomForm")
    .addEventListener("submit", event => {

      event.preventDefault();

      const newRoom = {
        id: Date.now(),
        title: document.getElementById("roomName").value,
        language: document.getElementById("roomLanguage").value,
        level: document.getElementById("roomLevel").value,
        topic:
          document.getElementById("roomTopic").value ||
          "Free Conversation",
        owner: "You",
        members: ["Y"],
        count: 1,
        active: true
      };

      rooms.unshift(newRoom);

      allCount.textContent = rooms.length;
      selectedLanguage = "All";

      document
        .querySelectorAll(".filter[data-language]")
        .forEach(btn => {
          btn.classList.toggle(
            "active",
            btn.dataset.language === "All"
          );
        });

      closeModal();
      renderRooms();
    });
});

// ===============================
// SUPPORT
// ===============================

document.getElementById("supportBtn").addEventListener("click", () => {
  openModal(
    "Support English Club",
    `
      <p class="modal-text">
        If this community helps you practice English, you can support the project.
        In the future, this button can be connected to your preferred payment method.
      </p>

      <button
        class="modal-submit"
        onclick="closeModal()"
      >
        Thank You ❤️
      </button>
    `
  );
});

// ===============================
// PRIVACY / CONTACT / ABOUT
// ===============================

document.querySelectorAll("[data-modal]").forEach(button => {

  button.addEventListener("click", () => {

    const type = button.dataset.modal;

    const content = {

      privacy: `
        <p class="modal-text">
          English Club respects your privacy. This demo page does not collect or
          store personal information. When you build the real version, you can
          add a proper privacy policy covering accounts, messages and room data.
        </p>
      `,

      contact: `
        <p class="modal-text">
          Have a suggestion or found a problem?<br><br>
          Email: <strong>hello@example.com</strong><br>
          Replace this address with your real contact address later.
        </p>
      `,

      about: `
        <p class="modal-text">
          <strong>English Club</strong> is a community project for people who
          want to practice English with friends, improve speaking confidence,
          learn vocabulary and communicate regularly.
        </p>
      `
    };

    openModal(
      type === "privacy"
        ? "Privacy Policy"
        : type === "contact"
        ? "Contact Us"
        : "About Us",
      content[type]
    );
  });
});

// ===============================
// LOGIN
// ===============================

document.getElementById("loginBtn").addEventListener("click", () => {

  openModal(
    "Login",
    `
      <form id="loginForm">

        <div class="form-group">
          <label>Email</label>

          <input
            id="loginEmail"
            type="email"
            required
            placeholder="you@example.com"
          >
        </div>

        <div class="form-group">
          <label>Password</label>

          <input
            id="loginPassword"
            type="password"
            required
            placeholder="••••••••"
          >
        </div>

        <button class="modal-submit" type="submit">
          Login
        </button>

        <p
          id="loginMessage"
          style="margin-top:12px;font-size:13px;"
        ></p>

      </form>
    `
  );

  document
    .getElementById("loginForm")
    .addEventListener("submit", async event => {

      event.preventDefault();

      const email =
        document.getElementById("loginEmail").value.trim();

      const password =
        document.getElementById("loginPassword").value;

      const message =
        document.getElementById("loginMessage");

      message.textContent = "Logging in...";

      const { error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) {
        message.textContent = error.message;
        return;
      }

      closeModal();
      await updateAuthUI();
    });
});

// ===============================
// REGISTER
// ===============================

document.getElementById("registerBtn").addEventListener("click", () => {

  openModal(
    "Create your account",
    `
      <form id="registerForm">

        <div class="form-group">
          <label>Your name</label>

          <input
            id="registerName"
            required
            placeholder="Joe"
          >
        </div>

        <div class="form-group">
          <label>Email</label>

          <input
            id="registerEmail"
            type="email"
            required
            placeholder="you@example.com"
          >
        </div>

        <div class="form-group">
          <label>Password</label>

          <input
            id="registerPassword"
            type="password"
            minlength="6"
            required
            placeholder="Create a password"
          >
        </div>

        <button class="modal-submit" type="submit">
          Create Account
        </button>

        <p
          id="registerMessage"
          style="margin-top:12px;font-size:13px;"
        ></p>

      </form>
    `
  );

  document
    .getElementById("registerForm")
    .addEventListener("submit", async event => {

      event.preventDefault();

      const name =
        document.getElementById("registerName").value.trim();

      const email =
        document.getElementById("registerEmail").value.trim();

      const password =
        document.getElementById("registerPassword").value;

      const message =
        document.getElementById("registerMessage");

      message.textContent = "Creating your account...";

      const { data, error } =
        await supabaseClient.auth.signUp({

          email,
          password,

          options: {
            data: {
              full_name: name
            },

            emailRedirectTo:
              "https://joeletsgo121.github.io/English-Club/"
          }
        });

      if (error) {
        message.textContent = error.message;
        return;
      }

      if (data.session) {

        closeModal();
        await updateAuthUI();

      } else {

        message.textContent =
          "Account created! Please check your email to confirm your account.";

      }
    });
});

// ===============================
// SEARCH SETTINGS
// ===============================

document.getElementById("settingsBtn").addEventListener("click", () => {

  openModal(
    "Search settings",
    `
      <p class="modal-text">
        Search currently checks room name, language, level, topic and owner.
        Later you can connect this to a real database for live search.
      </p>
    `
  );
});

// ===============================
// MODAL
// ===============================

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

document
  .getElementById("modalClose")
  .addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", event => {

  if (event.target === modalBackdrop) {
    closeModal();
  }

});

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }

});

// ===============================
// LOAD PROFILE
// ===============================

async function loadProfile(userId) {

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {

    console.error("Profile loading error:", error);
    return null;

  }

  return data;
}

// ===============================
// EDIT PROFILE
// ===============================

async function openEditProfile(user) {

  const profile = await loadProfile(user.id);

  if (!profile) {

    alert("Profile could not be loaded.");
    return;

  }

  openModal(
    "Edit Profile",
    `
      <form id="editProfileForm">

        <div class="form-group">
          <label for="editFullName">Full Name</label>

          <input
            id="editFullName"
            type="text"
            value="${escapeHTML(profile.full_name || "")}"
            required
          >
        </div>

        <div class="form-group">
          <label for="editEmail">Email</label>

          <input
            id="editEmail"
            type="email"
            value="${escapeHTML(profile.email || user.email || "")}"
            disabled
          >
        </div>

        <div class="form-group">
          <label for="editEnglishLevel">
            English Level
          </label>

          <select id="editEnglishLevel">

            <option value="">
              Select your level
            </option>

            <option
              value="Beginner"
              ${profile.english_level === "Beginner" ? "selected" : ""}
            >
              Beginner
            </option>

            <option
              value="Intermediate"
              ${profile.english_level === "Intermediate" ? "selected" : ""}
            >
              Intermediate
            </option>

            <option
              value="Advanced"
              ${profile.english_level === "Advanced" ? "selected" : ""}
            >
              Advanced
            </option>

          </select>
        </div>

        <div class="form-group">
          <label for="editCountry">Country</label>

          <input
            id="editCountry"
            type="text"
            value="${escapeHTML(profile.country || "")}"
            placeholder="Bangladesh"
          >
        </div>

        <button
          class="modal-submit"
          type="submit"
        >
          Save Changes
        </button>

        <p
          id="editProfileMessage"
          style="margin-top:12px;font-size:13px;"
        ></p>

      </form>
    `
  );

  document
    .getElementById("editProfileForm")
    .addEventListener("submit", async event => {

      event.preventDefault();

      const message =
        document.getElementById("editProfileMessage");

      message.textContent = "Saving...";

      const fullName =
        document.getElementById("editFullName").value.trim();

      const englishLevel =
        document.getElementById("editEnglishLevel").value;

      const country =
        document.getElementById("editCountry").value.trim();

      const { error } = await supabaseClient
        .from("profiles")
        .update({
          full_name: fullName,
          english_level: englishLevel || null,
          country: country || null
        })
        .eq("id", user.id);

      if (error) {

        console.error("Profile update error:", error);

        message.textContent =
          "Update failed: " + error.message;

        return;

      }

      message.textContent = "Profile updated successfully!";

      setTimeout(async () => {

        closeModal();
        await updateAuthUI();

      }, 800);

    });
}

// ===============================
// AUTH UI
// ===============================

async function updateAuthUI() {

  const loginBtn =
    document.getElementById("loginBtn");

  const registerBtn =
    document.getElementById("registerBtn");

  if (!loginBtn || !registerBtn) return;

  const { data, error } =
    await supabaseClient.auth.getSession();

  if (error) {

    console.error(
      "Could not get session:",
      error
    );

    return;
  }

  const session = data.session;

  if (session) {

    const user = session.user;

    const profile =
      await loadProfile(user.id);

    const name =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User";

    loginBtn.textContent =
      `👤 ${name}`;

    registerBtn.textContent =
      "Logout";

    loginBtn.onclick = async () => {

      const latestProfile =
        await loadProfile(user.id);

      const latestName =
        latestProfile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User";

      openModal(
        "My Account",
        `
          <div class="modal-text">

            <h3>
              👤 ${escapeHTML(latestName)}
            </h3>

            <p style="margin-top:10px;">
              ${escapeHTML(user.email || "")}
            </p>

            <p style="margin-top:10px;">
              Welcome to English Club!
            </p>

              loginBtn.onclick = () => {
  openModal("My Account", `
    <div class="modal-text">
      <h3>👤 ${escapeHTML(name)}</h3>
      <p style="margin-top:10px;">${escapeHTML(user.email || "")}</p>
      <p style="margin-top:10px;">Welcome to English Club!</p>

      <button class="modal-submit" id="editProfileBtn" style="margin-top:15px;">
        Edit Profile
      </button>
    </div>
  `);
};

            <button
              class="modal-submit"
              id="editProfileBtn"
              style="margin-top:15px;"
            >
              Edit Profile
            </button>

          </div>
        `
      );

      document
        .getElementById("editProfileBtn")
        .addEventListener("click", () => {

          openEditProfile(user);

        });

    };

    registerBtn.onclick = async () => {

      await supabaseClient.auth.signOut();

      location.reload();

    };

  } else {

    loginBtn.textContent = "Login";
    registerBtn.textContent = "Register";

  }
}

// ===============================
// AUTH STATE
// ===============================

supabaseClient.auth.onAuthStateChange(() => {
  updateAuthUI();
});

// ===============================
// INITIAL LOAD
// ===============================

updateAuthUI();
renderRooms();
```
