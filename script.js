const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open', !expanded);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('open');
    });
  });
}

const chatBody = document.getElementById('chatBody');
const chatOptions = document.getElementById('chatOptions');

if (chatBody && chatOptions) {
  const state = {
    projectType: '',
    propertyType: '',
    urgency: '',
    scope: '',
    finished: false,
  };

  const addMessage = (sender, message) => {
    const node = document.createElement('div');
    node.className = `message ${sender}`;
    node.innerHTML = `<p>${message}</p>`;
    chatBody.appendChild(node);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const estimateRange = () => {
    let base = 6000;

    if (state.projectType === 'Foundation repair') {
      base = 7500;
      if (state.propertyType === 'Slab foundation') base += 3500;
      if (state.propertyType === 'Pier-and-beam') base += 2500;
      if (state.scope === 'Moderate') base += 4500;
      if (state.scope === 'Major') base += 9000;
      if (state.urgency === 'Urgent') base += 2500;
    } else if (state.projectType === 'Construction work') {
      base = 18000;
      if (state.propertyType === 'Residential addition') base += 12000;
      if (state.propertyType === 'New build / major project') base += 25000;
      if (state.scope === 'Moderate') base += 7000;
      if (state.scope === 'Major') base += 18000;
      if (state.urgency === 'Urgent') base += 3000;
    } else {
      base = 9000;
      if (state.scope === 'Moderate') base += 5000;
      if (state.scope === 'Major') base += 12000;
      if (state.urgency === 'Urgent') base += 2500;
    }

    const low = Math.round(base * 0.85);
    const high = Math.round(base * 1.2);
    return `$${low.toLocaleString()} - $${high.toLocaleString()}`;
  };

  const showOptions = (items) => {
    chatOptions.innerHTML = '';
    items.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = item;
      button.addEventListener('click', () => {
        addMessage('user', item);

        if (!state.projectType) {
          state.projectType = item;
          addMessage('bot', 'Thanks. What type of property are you working with?');
          showOptions(['Slab foundation', 'Pier-and-beam', 'Residential addition', 'New build / major project']);
          return;
        }

        if (!state.propertyType) {
          state.propertyType = item;
          addMessage('bot', 'How severe is the issue or how large is the project?');
          showOptions(['Minor', 'Moderate', 'Major']);
          return;
        }

        if (!state.scope) {
          state.scope = item;
          addMessage('bot', 'How urgent is the timeline?');
          showOptions(['Flexible', 'Normal', 'Urgent']);
          return;
        }

        if (!state.urgency) {
          state.urgency = item;
          const range = estimateRange();
          addMessage('bot', `Based on your answers, a likely starting estimate is ${range}. This is a rough planning range, and Colton can confirm the exact scope after a project review or site visit.`);
          addMessage('bot', 'Would you like to send your project details to Colton for a detailed review?');
          showOptions(['Yes, contact Colton', 'No thanks']);
          state.finished = true;
          return;
        }

        if (state.finished && item === 'Yes, contact Colton') {
          window.location.href = 'contact.html';
          return;
        }

        if (state.finished && item === 'No thanks') {
          addMessage('bot', 'No problem. You can always start again or call 903-249-5512 for a direct conversation.');
          chatOptions.innerHTML = '';
        }
      });
      chatOptions.appendChild(button);
    });
  };

  showOptions(['Foundation repair', 'Construction work', 'Not sure yet']);
}



























































































































































































































