const assistantDialog = document.createElement("dialog");
assistantDialog.className = "project-agent";
assistantDialog.setAttribute("aria-labelledby", "agent-title");
assistantDialog.innerHTML = `
  <div class="agent-header">
    <div><p>COLTON GOLIGHTLY CONSTRUCTION</p><h2 id="agent-title">Project assistant</h2></div>
    <button class="agent-close" type="button" aria-label="Close project assistant">×</button>
  </div>
  <div class="agent-body">
    <p class="agent-note">Share a few project details to prepare an estimate or visit request. Colton confirms pricing and appointment availability personally.</p>
    <form class="agent-form">
      <label>What can we help with?
        <select name="projectType" required><option value="">Choose a project type</option><option>Foundation repair</option><option>Construction</option><option>Both</option><option>Not sure yet</option></select>
      </label>
      <label>Your name<input name="name" autocomplete="name" required></label>
      <label>Best phone number<input name="phone" type="tel" autocomplete="tel" required></label>
      <label>Project location in Lamar County<input name="location" autocomplete="address-level2" required></label>
      <label>Tell us about the project<textarea name="details" required></textarea></label>
      <label>Preferred date or time for a visit (optional)<input name="visitTime" placeholder="For example, weekday mornings"></label>
      <button class="agent-submit" type="submit">Prepare email request</button>
    </form>
    <div class="agent-result" role="status" aria-live="polite" hidden></div>
  </div>`;
document.body.append(assistantDialog);

const assistantForm = assistantDialog.querySelector(".agent-form");
const assistantResult = assistantDialog.querySelector(".agent-result");

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-agent-open]");
  if (!trigger) return;
  event.preventDefault();
  assistantDialog.showModal();
});

assistantDialog.querySelector(".agent-close").addEventListener("click", () => assistantDialog.close());
assistantDialog.addEventListener("click", (event) => {
  if (event.target === assistantDialog) assistantDialog.close();
});
assistantDialog.addEventListener("close", () => {
  assistantForm.reset();
  assistantForm.hidden = false;
  assistantResult.hidden = true;
  assistantResult.replaceChildren();
});

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const details = Object.fromEntries(new FormData(assistantForm));
  const body = [
    `Project type: ${details.projectType}`,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Location: ${details.location}`,
    `Preferred visit time: ${details.visitTime || "Not specified"}`,
    "",
    "Project details:",
    details.details,
  ].join("\n");
  const mailto = `mailto:Golightlybuilt@gmail.com?subject=${encodeURIComponent(`Project inquiry: ${details.projectType}`)}&body=${encodeURIComponent(body)}`;

  assistantForm.hidden = true;
  assistantResult.innerHTML = `<h3>Email request ready</h3><p>Review and send the draft to Colton. This is a request only; a visit is not booked and no price is confirmed until Colton replies.</p><a href="${mailto}">Open project request email</a>`;
  assistantResult.hidden = false;
});