const DETAILS_PAGES = [
  "patienthistory.html",
  "reference-management.html",
  "center-management.html",
  "package-management.html",
];

function loadNavigation() {
  loadNavigationCSS();

  if (location.protocol === "file:") {
    insertNavigation(getNavHTML());
    return;
  }

  fetch("nav.html")
    .then((response) => response.text())
    .then((data) => insertNavigation(data))
    .catch(() => insertNavigation(getNavHTML()));
}

function handleLogout() {
  sessionStorage.removeItem("loggedInUser");

  if (window.app && window.app.showInfo) {
    window.app.showInfo("Logged out successfully");
  }

  window.location.href = "index.html";
}

function loadNavigationCSS() {
  if (!document.querySelector('link[href="nav.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "nav.css";
    document.head.appendChild(link);
  }
}

function insertNavigation(html) {
  const existingHeader = document.querySelector("header.clinic-nav");
  if (existingHeader) {
    existingHeader.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML("afterbegin", html);
  }
  highlightActiveNav();
  restrictAdminNav();
}

function highlightActiveNav() {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".clinic-nav__link").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    if (href && href === page) {
      link.classList.add("active");
    }
  });

  if (DETAILS_PAGES.includes(page)) {
    const detailsToggle = document.querySelector(".clinic-nav__dropdown-toggle");
    if (detailsToggle) {
      detailsToggle.classList.add("active");
    }
  }
}

function restrictAdminNav() {
  try {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (!loggedInUser) return;

    const userData = JSON.parse(loggedInUser);
    if (userData.role !== "admin") {
      const adminItem = document.querySelector(".clinic-nav__item--admin");
      if (adminItem) {
        adminItem.style.display = "none";
      }
    }
  } catch (error) {
    console.warn("Error applying admin nav restriction:", error);
  }
}

function getNavHTML() {
  return `<header class="clinic-nav">
    <div class="clinic-nav__container">
        <a href="dashboard.html" class="clinic-nav__brand">
            <img src="SUWA SAHANA MADICAL CLINIC LOGO 2.png" alt="SUWA SAHANA MADICAL CLINIC Logo" class="clinic-nav__logo">
            <div class="clinic-nav__titles">
                <span class="clinic-nav__name">SUWA SAHANA</span>
                <span class="clinic-nav__subtitle">MEDICAL CLINIC</span>
            </div>
        </a>
        <nav class="clinic-nav__menu" aria-label="Main navigation">
            <ul class="clinic-nav__list">
                <li class="clinic-nav__item">
                    <a href="billing.html" class="clinic-nav__link">
                        <i class="fas fa-sack-dollar"></i>
                        <span>Billing</span>
                    </a>
                </li>
                <li class="clinic-nav__item">
                    <a href="reportEntry.html" class="clinic-nav__link">
                        <i class="fas fa-file-lines"></i>
                        <span>Report Entry</span>
                    </a>
                </li>
                <li class="clinic-nav__item">
                    <a href="test-management.html" class="clinic-nav__link">
                        <i class="fas fa-pen-to-square"></i>
                        <span>Test Data</span>
                    </a>
                </li>
                <li class="clinic-nav__item">
                    <a href="reports-management.html" class="clinic-nav__link">
                        <i class="fas fa-clipboard-list"></i>
                        <span>Reports</span>
                    </a>
                </li>
                <li class="clinic-nav__item clinic-nav__item--dropdown dropdown">
                    <a href="#" class="clinic-nav__link clinic-nav__dropdown-toggle dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-users"></i>
                        <span>Details</span>
                    </a>
                    <ul class="dropdown-menu clinic-nav__dropdown">
                        <li><a class="dropdown-item" href="patientHistory.html"><i class="fas fa-user-plus me-2"></i>Patient History</a></li>
                        <li><a class="dropdown-item" href="reference-management.html"><i class="fas fa-user-md me-2"></i>Reference Details</a></li>
                        <li><a class="dropdown-item" href="center-management.html"><i class="fas fa-building me-2"></i>Center Details</a></li>
                        <li><a class="dropdown-item" href="package-management.html"><i class="fas fa-boxes me-2"></i>Package Management</a></li>
                    </ul>
                </li>
                <li class="clinic-nav__item clinic-nav__item--admin">
                    <a href="admin-users.html" class="clinic-nav__link">
                        <i class="fas fa-user-cog"></i>
                        <span>Admin</span>
                    </a>
                </li>
            </ul>
        </nav>
        <button type="button" class="clinic-nav__logout" onclick="handleLogout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
        </button>
    </div>
</header>`;
}

document.addEventListener("DOMContentLoaded", loadNavigation);
