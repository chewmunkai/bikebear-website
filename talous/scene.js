/* Talous — hero scene: a morphing iris point-field blob.
   Vanilla Three.js (r128 UMD). Organic vertex displacement via 3D simplex
   noise, rendered as additive points + a faint wireframe shell. */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  // ---- 3D simplex noise (Stefan Gustavson, public domain, compacted) ----
  const grad3 = new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const n = Math.floor(Math.random() * (i + 1)); const t = p[i]; p[i] = p[n]; p[n] = t; }
  const perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod12[i] = perm[i] % 12; }
  const F3 = 1 / 3, G3 = 1 / 6;
  function noise3(xin, yin, zin) {
    let n0, n1, n2, n3;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const X0 = i - t, Y0 = j - t, Z0 = k - t;
    const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
    const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if (t0 < 0) n0 = 0; else { const gi0 = permMod12[ii+perm[jj+perm[kk]]]*3; t0*=t0; n0 = t0*t0*(grad3[gi0]*x0+grad3[gi0+1]*y0+grad3[gi0+2]*z0); }
    let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if (t1 < 0) n1 = 0; else { const gi1 = permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]*3; t1*=t1; n1 = t1*t1*(grad3[gi1]*x1+grad3[gi1+1]*y1+grad3[gi1+2]*z1); }
    let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if (t2 < 0) n2 = 0; else { const gi2 = permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]*3; t2*=t2; n2 = t2*t2*(grad3[gi2]*x2+grad3[gi2+1]*y2+grad3[gi2+2]*z2); }
    let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if (t3 < 0) n3 = 0; else { const gi3 = permMod12[ii+1+perm[jj+1+perm[kk+1]]]*3; t3*=t3; n3 = t3*t3*(grad3[gi3]*x3+grad3[gi3+1]*y3+grad3[gi3+2]*z3); }
    return 32 * (n0 + n1 + n2 + n3);
  }

  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const parent = canvas.parentElement;
  let W = parent.clientWidth, H = parent.clientHeight;

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.z = 5.2;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  // deeper base tones so additive overlap stays coloured instead of white
  const IRIS = new THREE.Color('#6A57E6');
  const IRIS_HOT = new THREE.Color('#9D8DFF');
  const GOLD = new THREE.Color('#E0A02E');

  const group = new THREE.Group();
  group.position.x = 1.15;
  scene.add(group);

  // --- point-field blob ---
  const detail = 26;
  const geo = new THREE.IcosahedronGeometry(1.5, detail);
  const basePos = geo.attributes.position.array.slice();
  const count = geo.attributes.position.count;

  // per-point colour: mostly iris, a sprinkle of gold + hot iris
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const c = r > 0.93 ? GOLD : (r > 0.78 ? IRIS_HOT : IRIS);
    colors[i*3] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // round sprite for soft points
  const sprite = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32,32,0,32,32,32);
    grd.addColorStop(0,'rgba(255,255,255,1)');
    grd.addColorStop(0.35,'rgba(255,255,255,0.7)');
    grd.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0,0,64,64);
    const tex = new THREE.CanvasTexture(c); return tex;
  })();

  const mat = new THREE.PointsMaterial({
    size: 0.038, map: sprite, vertexColors: true, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.62,
  });
  const points = new THREE.Points(geo, mat);
  group.add(points);

  // faint wireframe shell
  const wireGeo = new THREE.IcosahedronGeometry(1.5, 4);
  const wireBase = wireGeo.attributes.position.array.slice();
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(wireGeo),
    new THREE.LineBasicMaterial({ color: IRIS, transparent: true, opacity: 0.10 })
  );
  group.add(wire);

  // ambient particle dust
  const dustCount = 420;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const rad = 2.6 + Math.random() * 2.8;
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2*Math.random()-1);
    dustPos[i*3] = rad * Math.sin(ph) * Math.cos(th);
    dustPos[i*3+1] = rad * Math.sin(ph) * Math.sin(th);
    dustPos[i*3+2] = rad * Math.cos(ph);
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    size: 0.02, color: IRIS, map: sprite, transparent: true, opacity: 0.5,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(dust);

  // --- interaction / animation ---
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5);
    mouse.ty = (e.clientY / window.innerHeight - 0.5);
  });

  let scrollFactor = 0;
  window.addEventListener('scroll', () => {
    scrollFactor = window.scrollY / Math.max(window.innerHeight, 1);
  }, { passive: true });

  const pos = geo.attributes.position;
  const wpos = wireGeo.attributes.position;
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function displace(attr, base, time, amp) {
    const a = attr.array;
    for (let i = 0; i < a.length; i += 3) {
      const bx = base[i], by = base[i+1], bz = base[i+2];
      const n = noise3(bx*0.9 + time, by*0.9 + time*0.8, bz*0.9);
      const n2 = noise3(bx*2.1 - time*0.6, by*2.1, bz*2.1 + time*0.5) * 0.35;
      const d = 1 + (n + n2) * amp;
      a[i] = bx * d; a[i+1] = by * d; a[i+2] = bz * d;
    }
    attr.needsUpdate = true;
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const time = t * 0.18;
    displace(pos, basePos, time, reduced ? 0.04 : 0.16);
    displace(wpos, wireBase, time, reduced ? 0.04 : 0.16);
    wire.geometry.dispose();
    wire.geometry = new THREE.WireframeGeometry(wireGeo);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    group.rotation.y = t * 0.05 + mouse.x * 0.6;
    group.rotation.x = mouse.y * 0.4;
    group.position.y = -scrollFactor * 0.9;
    group.scale.setScalar(1 - Math.min(scrollFactor, 1) * 0.12);
    dust.rotation.y = -t * 0.02;
    dust.rotation.x = t * 0.01;

    renderer.render(scene, camera);
  }
  animate();

  function resize() {
    W = parent.clientWidth; H = parent.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', resize);
})();
