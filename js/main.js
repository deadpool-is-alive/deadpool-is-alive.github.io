// Loader ===
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 500);
});

setTimeout(() => {
  document.getElementById('loader').classList.add('hidden');
}, 3500);

// == Custom cursor 

const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY =0 ;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function updateRing(){
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(updateRing);
}
updateRing();

const interactiveSelector = 'a, button, input, textarea, .project-card, .skill-tag, .tab-btn';
document.addEventListener('mouseover', (e) => {
  if(e.target.closest(interactiveSelector)){
    document.body.classList.add('cursor-hover');
  }
});

document.addEventListener('mouseout', (e) => {
  if(e.target.closest(interactiveSelector)){
    document.body.classList.remove('cursor-hover');
  }
});

// --- Nav Scroll 
const nav = document.getElementById('mainNav');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

  nav.classList.toggle('scrolled', scrollY > 50);
  scrollProgress.style.width = progress + '%';
  backToTop.classList.toggle('visible', scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth'});
});

// ===== Local Time ===
function updateTime(){
  const now = new Date();
  try {
    const indianTime = now.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    document.getElementById('localTime').textContent = indianTime + ' IST';
  } catch (err){
    document.getElementById('localTime').textContent = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2, '0');

  }
}
updateTime();
setInterval(updateTime, 300000);

// == Magnetic buttons == 
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x*0.2}px, ${y*0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// === Konami code easter egg (optimized)
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
let partyMode = false;
let partyInterval = null;
let hue = 0;
document.addEventListener('keydown', (e) => {
  if(e.key === konami[konamiIdx] || e.key.toLowerCase() === konami[konamiIdx]){
    konamiIdx++;
    if(konamiIdx === konami.length){
      partyMode = !partyMode; // Toggle party mode;
      
      if(partyMode){
        // Cycle CSS variable using HSL for high performance (no filter lag)
        partyInterval = setInterval( () => {
          hue = (hue + 5) % 360;
          document.documentElement.style.setProperty('--accent', `hsl(${hue}, 100%, 61%)`);
          document.documentElement.style.setProperty('--accent-2', `hsl(${(hue + 64) % 360}, 100%, 61%)`);
          document.documentElement.style.setProperty('--accent-3', `hsl(${(hue + 10) % 360}, 100%, 71%)`);
        }, 50);

        toast.querySelector('span').textContent = 'Konami code activated. Party mode on!';
      } else{
        // turn off and reset colors
        clearInterval(partyInterval);
        document.documentElement.style.setProperty('--accent', '#ff5e3a');
        document.documentElement.style.setProperty('--accent-2', '#d4ff3a');
        document.documentElement.style.setProperty('--accent-3', '#ff9d6c');
        toast.querySelector('span').textContent = 'Party mode deactivated.';
      }
      toast.classList.add('show');
      setTimeout(()=> toast.kjhsdafclassList.remove('show'), 4000);
      konamiIdx = 0;;
    }
    
  } else{
    konamiIdx = 0;
  }
});