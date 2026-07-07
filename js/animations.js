// Reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const duration = 1800;
      const start = performance.now();

      function update(now){
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current;
        if(progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
});

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// Skills rendering and filtering
const skillsData = [
  { name: 'C++', icon: 'fa-solid fa-code', cat: 'lang' },
  { name: 'C#', icon: 'fa-solid fa-hashtag', cat: 'lang' },
  { name: 'Python', icon: 'fa-brands fa-python', cat: 'lang' },
  { name: 'TypeScript', icon: 'fa-solid fa-code', cat: 'lang' },
  { name: 'JavaScript', icon: 'fa-brands fa-js', cat: 'lang' },
  { name: 'GLSL', icon: 'fa-solid fa-microchip', cat: 'lang' },
  { name: 'Java', icon: 'fa-brands fa-java', cat: 'lang' },
  
  { name: 'Unity', icon: 'fa-solid fa-cube', cat: 'game' },
  { name: 'Unreal Engine', icon: 'fa-solid fa-mountain', cat: 'game' },
  { name: 'Blender', icon: 'fa-solid fa-cubes', cat: 'game' },
  { name: 'Aseprite', icon: 'fa-solid fa-palette', cat: 'game' },
  { name: 'Shader Graph', icon: 'fa-solid fa-wand-magic-sparkles', cat: 'game' },

  { name: 'Machine Learning', icon: 'fa-solid fa-microchip', cat: 'ml'},
  { name: 'Arificial Intelligence', icon: 'fa-solid fa-robot', cat: 'ml'},
  
  { name: 'React', icon: 'fa-brands fa-react', cat: 'web' },
  { name: 'Three.js', icon: 'fa-solid fa-cube', cat: 'web' },
  { name: 'Node.js', icon: 'fa-brands fa-node-js', cat: 'web' },
  { name: 'WebGL', icon: 'fa-solid fa-globe', cat: 'web' },
  { name: 'Tailwind', icon: 'fa-solid fa-wind', cat: 'web' },
  { name: 'Next.js', icon: 'fa-solid fa-triangle', cat: 'web' },

  
  { name: 'Git', icon: 'fa-brands fa-git-alt', cat: 'tools' },
  { name: 'Docker', icon: 'fa-brands fa-docker', cat: 'tools' },
  { name: 'Kubernetes', icon: 'fa fa-dharmachakra', cat: 'tools'},
  { name: 'Linux', icon: 'fa-brands fa-linux', cat: 'tools' },
  { name: 'Figma', icon: 'fa-brands fa-figma', cat: 'tools' },
  { name: 'Vim', icon: 'fa-solid fa-terminal', cat: 'tools' },
  { name: 'CI/CD', icon: 'fa-solid fa-infinity', cat: 'tools' }
];

const skillsGrid = document.getElementById('skillsGrid');

function renderSkills(filter = 'all'){
  if(!skillsGrid) return;
  
  skillsGrid.innerHTML = '';
  const filtered = filter === 'all' ? skillsData : skillsData.filter(s => s.cat === filter);
  filtered.forEach((skill) => {
    const el = document.createElement('div');
    el.className = 'skill-tag';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.innerHTML = `<i class="${skill.icon}"></i><span>${skill.name}</span>`;
    skillsGrid.appendChild(el);
    requestAnimationFrame( () => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s, transform 0.4s';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 30);
    });
  });
}

renderSkills();

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkills(btn.dataset.tab);
  });
});