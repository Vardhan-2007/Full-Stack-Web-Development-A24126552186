// Event listeners
let clicks = 0;
document.getElementById("clickBtn").addEventListener("click", () => {
  clicks++;
  document.getElementById("clickCount").textContent = `${clicks} click${clicks === 1 ? "" : "s"}`;
});

const hoverBox = document.getElementById("hoverBox");
hoverBox.addEventListener("mouseenter", () => {
  hoverBox.style.background = "#f7e3b5";
  hoverBox.textContent = "Mouse is inside";
});
hoverBox.addEventListener("mouseleave", () => {
  hoverBox.style.background = "#dde8f7";
  hoverBox.textContent = "Move the mouse over this box";
});

document.getElementById("typeBox").addEventListener("input", (e) => {
  document.getElementById("charCount").textContent = e.target.value.length;
});

// Fetch API: the same request written with .then() and with async/await
function loadUsersWithThen() {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });
}

async function loadUsers() {
  const list = document.getElementById("users");
  list.innerHTML = "<li>Loading...</li>";
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const users = await res.json();
    list.innerHTML = "";
    users.forEach(u => {
      const li = document.createElement("li");
      li.textContent = `${u.name} (${u.email}) - ${u.address.city}`;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = `<li class="error">Could not load users: ${err.message}</li>`;
  }
}

document.getElementById("loadBtn").addEventListener("click", loadUsers);
