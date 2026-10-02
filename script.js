document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CINEMATIC LOADER SEQUENCE
  // ==========================================
  const loader = document.getElementById('cinematic-loader');
  const loaderBarFill = document.getElementById('loaderBarFill');

  if (loaderBarFill) {
    setTimeout(() => loaderBarFill.style.width = '100%', 100);
  }

  setTimeout(() => {
    if (loader) loader.classList.add('is-hidden');
  }, 1300);


  // ==========================================
  // 2. THREE.JS 3D WEBGL ENGINE SETUP
  // ==========================================
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xF8FAFC, 0.0016);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 80);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x2563EB, 1.2);
  dirLight.position.set(50, 80, 100);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0x60A5FA, 1.5, 300);
  pointLight.position.set(-40, -20, 50);
  scene.add(pointLight);


  // ==========================================
  // 3. 3D SPATIAL GEOMETRY OBJECTS
  // ==========================================

  // A) Hero Spatial Polyhedron (Z = 0)
  const heroGroup = new THREE.Group();
  heroGroup.position.set(28, 0, 0);

  const polyGeo = new THREE.IcosahedronGeometry(24, 1);
  const polyMatWire = new THREE.MeshBasicMaterial({
    color: 0x2563EB,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });
  const polyMeshWire = new THREE.Mesh(polyGeo, polyMatWire);
  heroGroup.add(polyMeshWire);

  const polyInnerGeo = new THREE.IcosahedronGeometry(16, 0);
  const polyInnerMat = new THREE.MeshStandardMaterial({
    color: 0xEFF6FF,
    metalness: 0.1,
    roughness: 0.3,
    transparent: true,
    opacity: 0.6
  });
  const polyInnerMesh = new THREE.Mesh(polyInnerGeo, polyInnerMat);
  heroGroup.add(polyInnerMesh);

  scene.add(heroGroup);

  // B) Atmosphere Floating Particle System
  const particleCount = 350;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 350;
    particlePos[i + 1] = (Math.random() - 0.5) * 350;
    particlePos[i + 2] = -Math.random() * 1000;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 2.5,
    color: 0x2563EB,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // C) Interactive Labour Link 3D Network Visualization (Z = -600)
  const networkGroup = new THREE.Group();
  networkGroup.position.set(0, -10, -600);

  // Central Hub Node
  const hubGeo = new THREE.SphereGeometry(6, 32, 32);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x2563EB, metalness: 0.3, roughness: 0.2 });
  const hubMesh = new THREE.Mesh(hubGeo, hubMat);
  networkGroup.add(hubMesh);

  // Satellite Nodes (Workers & Employers)
  const nodePositions = [
    [-35, 20, 0], [-40, -15, 10], [-30, -30, -10],
    [35, 25, 5], [40, -10, -15], [30, -28, 10]
  ];
  
  const nodes = [];
  const lineMat = new THREE.LineBasicMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.4 });

  nodePositions.forEach(pos => {
    const nodeGeo = new THREE.SphereGeometry(3, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x60A5FA });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.set(...pos);
    networkGroup.add(nodeMesh);
    nodes.push(nodeMesh);

    // Line from Hub to Node
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(...pos)
    ]);
    const line = new THREE.Line(lineGeo, lineMat);
    networkGroup.add(line);
  });

  scene.add(networkGroup);


  // ==========================================
  // 4. MOUSE PARALLAX & CAMERA INTERPOLATION
  // ==========================================
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let targetCameraZ = 80;
  let currentCameraZ = 80;

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // Mouse lerp smoothing
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Smooth camera target
    currentCameraZ += (targetCameraZ - currentCameraZ) * 0.08;
    camera.position.z = currentCameraZ;
    camera.position.x = mouseX * 12;
    camera.position.y = -mouseY * 8;
    camera.lookAt(0, 0, currentCameraZ - 80);

    // Rotate Hero Polyhedron
    if (heroGroup) {
      heroGroup.rotation.x += 0.005;
      heroGroup.rotation.y += 0.008;
    }

    // Rotate Labour Link 3D Network
    if (networkGroup) {
      networkGroup.rotation.y += 0.004;
    }

    renderer.render(scene, camera);
  }

  animate();


  // ==========================================
  // 5. GSAP SCROLLTRIGGER BINDING
  // ==========================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        // Camera moves deep through 3D Z-space
        targetCameraZ = 80 - progress * 1050;
      }
    });

    // 3D Parallax Tilt for Cards
    const cards = document.querySelectorAll('.spatial-card, .timeline-item, .skill-category-card, .cert-card, .contact-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateZ(12px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  // ==========================================
  // 6. FLOATING 3D SPATIAL NAVIGATION & ACTIVE SECTIONS
  // ==========================================
  const spatialNavItems = document.querySelectorAll('.spatial-nav-item');
  const sections = document.querySelectorAll('.spatial-section');

  spatialNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function updateActiveSpatialNav() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        spatialNavItems.forEach(item => {
          if (item.getAttribute('data-section') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });

    // Update Top Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      const scrollProgress = document.getElementById('scrollProgress');
      if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    }
  }

  window.addEventListener('scroll', updateActiveSpatialNav, { passive: true });
  updateActiveSpatialNav();


  // ==========================================
  // 7. CUSTOM MAGNETIC PHYSICS CURSOR
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let dotX = window.innerWidth / 2;
    let dotY = window.innerHeight / 2;
    let ringX = dotX;
    let ringY = dotY;

    window.addEventListener('mousemove', (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
    });

    function renderCursor() {
      ringX += (dotX - ringX) * 0.18;
      ringY += (dotY - ringY) * 0.18;

      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveTargets = document.querySelectorAll('a, button, .skill-pill, .cert-card, .contact-card');
    interactiveTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('is-hovering'));
    });
  }


  // ==========================================
  // 8. CERTIFICATE LIGHTBOX MODAL
  // ==========================================
  const certCards = document.querySelectorAll('.cert-card');
  const certModal = document.getElementById('certModal');
  const modalImg = document.getElementById('modalImg');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img') || card.querySelector('img')?.src;
      if (imgSrc && certModal && modalImg) {
        modalImg.src = imgSrc;
        certModal.classList.add('is-active');
      }
    });
  });

  if (modalCloseBtn && certModal) {
    modalCloseBtn.addEventListener('click', () => certModal.classList.remove('is-active'));
  }
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) certModal.classList.remove('is-active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('is-active')) {
      certModal.classList.remove('is-active');
    }
  });


  // Window Resize Listener
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
