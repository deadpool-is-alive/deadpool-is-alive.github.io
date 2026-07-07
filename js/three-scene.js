import * as THREE from 'three';

export function initHeroScene(){
  const canvas = document.getElementById('hero-3d');
  
  if(!canvas) return;

  const scene = new THREE.Scene();
  
  const container = canvas.parentElement;

  let sizes = {width: container.clientWidth, height: container.clientHeight};

  const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(0, 0, 7);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const sceneGroup = new THREE.Group();

  scene.add(sceneGroup);

  // Central Icosahedron
  const icoGroup = new THREE.Group();
  sceneGroup.add(icoGroup);

  const icoGeo = new THREE.IcosahedronGeometry(1.3, 0);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0xff5e3a,
    emissive: 0xff5e3a,
    emissiveIntensity: 0.35,
    metalness: 0.7,
    roughness: 0.25,
    flatShading: true 
  });

  const ico = new THREE.Mesh(icoGeo, icoMat);

  icoGroup.add(ico);

  const wireGeo = new THREE.IcosahedronGeometry(1.65, 0);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xd4ff3a,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });

  const wire = new THREE.Mesh(wireGeo, wireMat);
  icoGroup.add(wire);

  const outerGeo = new THREE.DodecahedronGeometry(2.4, 0);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0xff9d6c,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  const outer = new THREE.Mesh(outerGeo, outerMat);
  icoGroup.add(outer);

  const orbiters = [];
  const orbitData = [
    { geo: new THREE.OctahedronGeometry(0.4, 0), color: 0xd4ff3a, radius: 2.6, speed: 0.3, offset: 0 },
    { geo: new THREE.TetrahedronGeometry(0.5, 0), color: 0xff9d6c, radius: 3.0, speed: 0.25, offset: Math.PI / 2 },
    { geo: new THREE.TorusKnotGeometry(0.3, 0.1, 64, 8), color: 0xd4ff3a, radius: 2.8, speed: 0.35, offset: Math.PI },
    { geo: new THREE.DodecahedronGeometry(0.35, 0), color: 0xff5e3a, radius: 3.2, speed: 0.2, offset: Math.PI * 1.5 }
  ];

  orbitData.forEach((data, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0.5,
      metalness: 0.6,
      roughness: 0.3,
      flatShading: true
    });

    const mesh = new THREE.Mesh(data.geo, mat);
    mesh.userData = {
      radius: Math.max(0.5, data.radius),
      speed: data.speed,
      offset: data.offset,
      yAmp: 0.4 + Math.random() * 0.4,
      yFreq: 0.5 + Math.random() * 0.5,
      rotSpeed: 0.3 + Math.random() * 0.5,
      index: i
    };
    sceneGroup.add(mesh);
    orbiters.push(mesh);
  });

  // Particle Field
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for(let i = 0; i < particleCount; i++){
    const r = 8 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i*3] = r * Math.sin(phi * Math.cos(theta));
    positions[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);

    const t = Math.random();
    if(t < 0.5){
      colors[i*3] = 1; colors[i*3+1]=0.37; colors[i*3+2] = 0.23;
    } else if(t < 0.85){
      colors[i*3] = 0.83; colors[i*3+1]=1; colors[i*3+2] = 0.23;
    } else{
      colors[i*3] = 1; colors[i*3+1] = 0.62; colors[i*3+2] = 0.42;
    }
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  
  const particleMat = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  sceneGroup.add(particles);


  //Lights

  scene.add(new THREE.AmbientLight(0xffffff, 0.15));
  const keyLight = new THREE.DirectionalLight(0xff5e3a, 1.5);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0xd4ff3a, 2, 15);
  fillLight.position.set(-5, -3, 3);
  scene.add(fillLight);
  const rimLight = new THREE.PointLight(0xff9d6c, 1, 12);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // Mouse Parallax

  const mouse = { x: 0, y: 0, tx: 0, ty: 0};
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / sizes.width ) * 2 - 1;
    mouse.ty = -(e.clientY / sizes.height) * 2 + 1;
  });

  // pause when out of view

  let isVisible = true;
  const heroSection = document.querySelector('section');
  if(heroSection){
    const observer = new IntersectionObserver((entries) =>{
      entries.forEach(entry => { isVisible = entry.isIntersecting; });
    });
    observer.observe(heroSection);
  }

  // Responsive scene positioning
  function updateScenePosition(){
    const w = window.innerWidth;
    if(w >= 1024){
      sceneGroup.position.x = 3.0;
      sceneGroup.position.y = 0;
      sceneGroup.scale.setScalar(1);
    } else if(w >= 768){
      sceneGroup.position.x = 1.8;
      sceneGroup.position.y = -0.3;
      sceneGroup.scale.setScalar(0.85);
    } else{
      sceneGroup.position.x = 0;
      sceneGroup.position.y = -0.8;
      sceneGroup.scale.setScalar(0.65);
    }
  }
  updateScenePosition();

  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    if(!isVisible) return;

    const elapsed = clock.getElapsedTime();

    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    ico.rotation.x = elapsed * 0.2;
    ico.rotation.y = elapsed * 0.3;
    wire.rotation.x = -elapsed * 0.15;
    wire.rotation.y = -elapsed * 0.25;
    outer.rotation.x = elapsed * 0.08;
    outer.rotation.y = -elapsed * 0.12;

    const pulse = 1 + Math.sin(elapsed * 1.5) * 0.04;
    wire.scale.setScalar(pulse);

    orbiters.forEach((o) => {
      const ud = o.userData;
      o.position.x = Math.cos(elapsed * ud.speed + ud.offset) * ud.radius;
      o.position.z = Math.sin(elapsed * ud.speed + ud.offset) * ud.radius;
      o.position.y = Math.sin(elapsed * ud.yFreq + ud.index) * ud.yAmp;
      o.rotation.x = elapsed * ud.rotSpeed;
      o.rotation.y = elapsed * ud.rotSpeed * 0.7;
    });

    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = elapsed * 0.01;

    camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.05;
    camera.lookAt(sceneGroup.position.x * 0.3, 0, 0);

    renderer.render(scene, camera);
  }

  animate();
  window.addEventListener('resize', () => {

    
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateScenePosition();
  });
}

initHeroScene();