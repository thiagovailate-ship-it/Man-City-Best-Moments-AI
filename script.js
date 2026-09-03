const topbar = document.querySelector('.topbar');
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const cursorGlow = document.getElementById('cursorGlow');

window.addEventListener('scroll', () => topbar.classList.toggle('scrolled', window.scrollY > 35));
menuBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
document.querySelectorAll('#navMenu a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

document.addEventListener('mousemove', e => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: .13 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function animateNumber(el, target, duration = 900) {
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      animateNumber(entry.target, Number(entry.target.dataset.target), 1200);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

const players = {
  haaland: {
    name: 'Erling Haaland', era: '2022/23 • TRÍPLICE COROA', number: '9',
    bio: 'Uma primeira temporada absurda: potência, velocidade e um recorde atrás do outro.',
    stats: [['53','Jogos'],['52','Gols'],['9','Assistências'],['36','Gols na PL']], bar: '96%'
  },
  debruyne: {
    name: 'Kevin De Bruyne', era: '2022/23 • MAESTRO DA ERA DE OURO', number: '17',
    bio: 'O cérebro criativo do City. Visão de jogo, cruzamentos e passes decisivos que alimentaram a máquina ofensiva de Guardiola.',
    stats: [['49','Jogos*'],['10','Gols*'],['28','Assistências'],['16','Assist. na PL']], bar: '91%'
  },
  cherki: {
    name: 'Rayan Cherki', era: '2025/26 • NOVA GERAÇÃO', number: '10',
    bio: 'Cherki não fazia parte da Tríplice de 2022/23. Ele representa a nova geração criativa do clube e teve uma estreia de alto impacto em Manchester.',
    stats: [['52','Jogos'],['10','Gols'],['16','Assistências'],['26','Partic. em gols']], bar: '84%'
  }
};

const playerName = document.getElementById('playerName');
const playerEra = document.getElementById('playerEra');
const playerBio = document.getElementById('playerBio');
const shirtNumber = document.getElementById('shirtNumber');
const playerStats = document.getElementById('playerStats');
const playerBar = document.getElementById('playerBar');

function renderPlayer(key) {
  const p = players[key];
  playerName.textContent = p.name;
  playerEra.textContent = p.era;
  playerBio.textContent = p.bio;
  shirtNumber.textContent = p.number;
  playerBar.style.width = p.bar;
  playerStats.innerHTML = p.stats.map(([n,label]) => `<div><strong data-target="${n}">0</strong><span>${label}</span></div>`).join('');
  playerStats.querySelectorAll('strong').forEach((el,i) => setTimeout(() => animateNumber(el, Number(el.dataset.target), 650), i * 70));
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderPlayer(tab.dataset.player);
  });
});

setTimeout(() => renderPlayer('haaland'), 700);
