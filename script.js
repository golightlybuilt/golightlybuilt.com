const setupNavigation = () => {
  const toggles = document.querySelectorAll(".nav-toggle, .menu-toggle");

  toggles.forEach((toggle) => {
    const targetSelector = toggle.getAttribute("aria-controls");
    const nav = targetSelector ? document.getElementById(targetSelector) : null;
    const fallbackNav = document.querySelector(".main-nav, .site-nav");
    const target = nav || fallbackNav;

    if (!target) return;

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      toggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
      target.classList.toggle("is-open", !isExpanded);
    });

    target.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      target.classList.remove("is-open");
    });
  });
};

const setCurrentYear = () => {
  const yearElement = document.querySelector("#current-year") || document.querySelector("[data-year]");
  if (!yearElement) return;
  yearElement.textContent = new Date().getFullYear();
};

const openMailto = (subject, body) => {
  const mailto = `mailto:Golightlybuilt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
};

const setupContactForms = () => {
  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const values = Object.fromEntries(formData.entries());
      const subject = `Project inquiry: ${values.projectType || "General question"}`;
      const body = [
        `Name: ${values.name || "Not provided"}`,
        `Phone: ${values.phone || "Not provided"}`,
        `Email: ${values.email || "Not provided"}`,
        `Project type: ${values.projectType || "Not provided"}`,
        "",
        "Project details:",
        values.details || "Not provided",
      ].join("\n");

      openMailto(subject, body);
    });
  });
};

const setupQuoteAssistant = () => {
  const messageBox = document.querySelector("[data-chat-messages]");
  const choiceBox = document.querySelector("[data-chat-choices]");
  const leadForm = document.querySelector("[data-lead-form]");
  const leadStatus = document.querySelector("[data-lead-status]");
  const resetButton = document.querySelector("[data-chat-reset]");

  if (!messageBox || !choiceBox) return;

  const addMessage = (text, user = false) => {
    const message = document.createElement("div");
    message.className = `chat-message ${user ? "user" : ""}`.trim();

    const bubble = document.createElement("p");
    bubble.textContent = text;
    message.appendChild(bubble);
    messageBox.appendChild(message);
    messageBox.scrollTop = messageBox.scrollHeight;
  };

  const renderChoices = (options) => {
    choiceBox.innerHTML = "";
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-choice";
      button.textContent = option;
      button.addEventListener("click", () => {
        addMessage(option, true);
        choiceBox.innerHTML = "";
        addMessage("Thanks. We’ll prepare your project inquiry form next.");

        if (leadForm) {
          leadForm.hidden = false;
          let hiddenType = leadForm.querySelector("input[name='projectType']");
          if (!hiddenType) {
            hiddenType = document.createElement("input");
            hiddenType.type = "hidden";
            hiddenType.name = "projectType";
            leadForm.appendChild(hiddenType);
          }
          hiddenType.value = option;
        }
      });
      choiceBox.appendChild(button);
    });
  };

  const startOver = () => {
    messageBox.innerHTML = "";
    choiceBox.innerHTML = "";
    if (leadForm) {
      leadForm.reset();
      leadForm.hidden = true;
    }
    if (leadStatus) leadStatus.textContent = "";
    addMessage("Tell us what kind of work you need.");
    renderChoices(["Foundation repair", "Construction", "Both", "Not sure yet"]);
  };

  if (resetButton) resetButton.addEventListener("click", startOver);
  startOver();

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(leadForm);
      const values = Object.fromEntries(formData.entries());

      const body = [
        `Project type: ${values.projectType || "Not provided"}`,
        `Name: ${values.name || "Not provided"}`,
        `Phone: ${values.phone || "Not provided"}`,
        `Email: ${values.email || "Not provided"}`,
        `Location: ${values.location || "Not provided"}`,
        "",
        "Project details:",
        values.details || "Not provided",
      ].join("\n");

      if (leadStatus) {
        leadStatus.textContent = "Opening an email draft for you to review and send...";
      }

      openMailto(`Project inquiry: ${values.projectType || "General question"}`, body);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setCurrentYear();
  setupContactForms();
  setupQuoteAssistant();
});