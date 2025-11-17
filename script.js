console.clear();

// Function để lấy giá trị từ URL params
function getParamValue(name) {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedContent = urlParams.get("c");
  
  if (encodedContent) {
    try {
      // Giải mã base64 đã được URL-safe
      const base64 = encodedContent.replace(/-/g, "+").replace(/_/g, "/");
      const decodedString = decodeURIComponent(escape(atob(base64)));
      const content = JSON.parse(decodedString);

      // Kiểm tra và trả về giá trị tương ứng
      if (name === "text" && content.text) return content.text;
      if (name === "text1" && content.text1) return content.text1;
      if (name === "text2" && content.text2) return content.text2;
      if (name === "loveText" && content.loveText) return content.loveText;
      if (name === "message" && content.message) return content.message;
      if (name === "instructions" && content.instructions) return content.instructions;
      if (name === "music" && content.music) return content.music;
      if (name === "image" && content.image) return content.image;
    } catch (e) {
      console.error("Lỗi khi giải mã Base64:", e);
    }
  }
  
  return null;
}

// Lấy text từ params và split thành array
const textFromParams = getParamValue("text");

// Kiểm tra nếu là tên chưa mua hàng thì ẩn nội dung
const isBlockedUser = textFromParams === "Phạm Thanh Trúc";

const textContent = (textFromParams && !isBlockedUser) ? textFromParams.split(" ") : [
  "Hằng", "cô", "20/11", "mừng", "chúc",
];

// Lấy nhạc từ params
const musicFromParams = getParamValue("music");

// Debug: Hiển thị thông tin params
console.log('Text từ params:', textFromParams);
console.log('Text content array:', textContent);
console.log('Music từ params:', musicFromParams);
console.log('Is blocked user:', isBlockedUser);

// Ẩn toàn bộ nội dung nếu là user bị chặn
if (isBlockedUser) {
  console.log('User bị chặn - ẩn nội dung');
  document.body.innerHTML = `
    <div style="
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: Arial, sans-serif;
      text-align: center;
    ">
      <div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️</h1>
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem;">Nội dung không khả dụng</h2>
        <p style="font-size: 1rem; opacity: 0.8;">Vui lòng liên hệ để được hỗ trợ.</p>
      </div>
    </div>
  `;
}

// Responsive design variables - phải khai báo trước khi sử dụng
const isMobile = window.innerWidth <= 768;
const particleSize = isMobile ? 0.015 : 0.009; // Tăng kích thước hạt trên mobile
const textSize = isMobile ? 0.25 : 0.18; // Tăng kích thước text trên mobile
const flyingTextSize = isMobile ? 0.3 : 0.22; // Tăng kích thước flying text trên mobile

// 创建场景对象 Scene
const scene = new THREE.Scene();

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//  创建渲染器对象
const renderer = new THREE.WebGLRenderer({
  antialias: true, //  是否执行抗锯齿。默认值为false。
});

// 设置颜色及其透明度F
renderer.setClearColor(new THREE.Color("rgb(0,0,0)"));

// 将输 canvas 的大小调整为 (width, height) 并考虑设备像素比，且将视口从 (0, 0) 开始调整到适合大小
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 表示对象局部位置的 Vector3。默认值为(0, 0, 0)。
camera.position.z = isMobile ? 2.2 : 1.8; // Tăng khoảng cách camera trên mobile

// 轨迹球控制器
const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.noPan = true;
controls.maxDistance = isMobile ? 4 : 3; // Tăng max distance trên mobile
controls.minDistance = isMobile ? 1.2 : 0.7; // Tăng min distance trên mobile

// 物体
const group = new THREE.Group();
scene.add(group);

// Thêm stars và shooting stars vào Three.js scene
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0x9bdfe0,
    size: isMobile ? 0.03 : 0.02, // Tăng kích thước stars trên mobile
    transparent: true,
    opacity: isMobile ? 0.9 : 0.8 // Tăng opacity trên mobile
  });

  const starsCount = isMobile ? 600 : 1200; // Tăng số lượng stars
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    const radius = 5 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Tạo shooting stars
  const shootingStars = [];
  const shootingStarCount = isMobile ? 8 : 15; // Tăng số lượng shooting stars
  
  for (let i = 0; i < shootingStarCount; i++) {
    const shootingStar = {
      startPos: new THREE.Vector3(
        (Math.random() - 0.5) * 8, // Giảm vùng di chuyển
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      endPos: new THREE.Vector3(
        (Math.random() - 0.5) * 8, // Giảm vùng di chuyển
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      currentPos: new THREE.Vector3(),
      speed: 0.02 + Math.random() * 0.03,
      life: 0,
      maxLife: 100 + Math.random() * 100,
      trail: []
    };
    
    shootingStar.currentPos.copy(shootingStar.startPos);
    shootingStars.push(shootingStar);
  }

  // Animation cho stars và shooting stars
  function animateStars() {
    stars.rotation.y += 0.001;
    stars.rotation.x += 0.0005;
    
    // Animate shooting stars
    shootingStars.forEach((star, index) => {
      star.life++;
      
      // Di chuyển shooting star
      const direction = new THREE.Vector3().subVectors(star.endPos, star.currentPos);
      direction.normalize();
      star.currentPos.add(direction.multiplyScalar(star.speed));
      
      // Thêm trail
      star.trail.push(star.currentPos.clone());
      if (star.trail.length > 20) {
        star.trail.shift();
      }
      
      // Reset shooting star
      if (star.life > star.maxLife) {
        star.startPos.set(
          (Math.random() - 0.5) * 8, // Giảm vùng di chuyển
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        );
        star.endPos.set(
          (Math.random() - 0.5) * 8, // Giảm vùng di chuyển
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        );
        star.currentPos.copy(star.startPos);
        star.life = 0;
        star.trail = [];
      }
    });
    
    return shootingStars;
  }
  
  return animateStars;
}

const animateStars = createStars();

let heart = null;
let sampler = null;
let originHeart = null;

// Vòng tròn hạt xoay
let circleParticles = [];
let circleCenter = new THREE.Vector3(0, -0.8, 0);
let circleRadius = 0.7; // Tăng bán kính vòng tròn lớn hơn

// Hạt bay lên
let flyingParticles = [];
let tornadoCenter = new THREE.Vector3(0, -0.8, 0);

// Hiệu ứng hiển thị trái tim
let showHeart = false;
let heartOpacity = 0;
let circleOpacity = 0;
let flyingOpacity = 0;

// Hiệu ứng chuyển màu
let colorChangeTime = 0;
let isRedMode = false;
let colorTransitionProgress = 0;
const COLOR_CHANGE_DELAY = 5000; // 5 giây

// Text particles system
let textParticles = [];
let textGroup = new THREE.Group();
scene.add(textGroup);

// Flying text particles system
let flyingTextParticles = [];
let flyingTextGroup = new THREE.Group();
scene.add(flyingTextGroup);

// Text content for particles (đã được định nghĩa từ params ở trên)

// Text colors
const textColors = [
  "#ffffff", // Trắng
  "#ffffff", // Trắng
  "#ffffff", // Trắng
  "#ffffff", // Trắng
  "#ffffff", // Trắng
  "#ffffff"  // Trắng
];

// Flying text colors
const flyingTextColors = [
  "#ff6b9d", // Pink
  "#ff8fab", // Pink 2
  "#ffa5c3", // Pink 3
  "#ffb8d1", // Pink 4
  "#ffcce0", // Pink 5
  "#ffe0ef"  // Pink 6
];

// Create text texture with transparent background and glow effect
function createTextTexture(text, color = "#ffffff") {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;
  
  // Clear canvas with transparent background
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Responsive font size
  const fontSize = isMobile ? 80 : 60;
  context.font = `bold ${fontSize}px "Brush Script MT", cursive`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Thêm glow effect vừa phải
  context.shadowColor = color;
  context.shadowBlur = 15;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  // Vẽ text với màu vừa phải
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Create text texture with dynamic color and glow effect
function createTextTextureWithColor(text, color) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;
  
  // Clear canvas with transparent background
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Responsive font size
  const fontSize = isMobile ? 80 : 60;
  context.font = `bold ${fontSize}px "Brush Script MT", cursive`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Thêm glow effect vừa phải
  context.shadowColor = color;
  context.shadowBlur = 15;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  // Vẽ text với màu vừa phải
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Create flying text texture with larger font and glow effect
function createFlyingTextTexture(text, color = "#ffffff") {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;
  
  // Clear canvas with transparent background
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Responsive font size
  const fontSize = isMobile ? 100 : 80;
  context.font = `bold ${fontSize}px "Brush Script MT", cursive`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Thêm glow effect vừa phải
  context.shadowColor = color;
  context.shadowBlur = 20;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  // Vẽ text với màu vừa phải
  context.fillStyle = color;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Create text particles
function createTextParticles() {
  const textCount = isMobile ? 16 : 24; // Giảm số lượng text particles trên mobile
  
  for (let i = 0; i < textCount; i++) {
    const text = textContent[i % textContent.length]; // Lặp lại text content
    const color = textColors[i % textColors.length]; // Lặp lại màu sắc
    
    // Tạo plane geometry cho text - responsive size
    const geometry = new THREE.PlaneGeometry(textSize, textSize);
    
    // Tạo material với text texture
    const material = new THREE.MeshBasicMaterial({
      map: createTextTexture(text, color),
      transparent: true,
      opacity: 0.95 + Math.random() * 0.05, // Tăng độ trong suốt
      side: THREE.DoubleSide,
      alphaTest: 0.05, // Giảm alpha test để loại bỏ viền đen
      blending: THREE.AdditiveBlending, // Thêm blending để chữ sáng hơn
      depthWrite: false // Tắt depth write để tránh z-fighting
    });
    
    const textMesh = new THREE.Mesh(geometry, material);
    
    // Vị trí ban đầu - sát vòng tròn hạt
    const angle = (i / textCount) * Math.PI * 2; // Góc đều đặn
    const radius = 0.6; // Bán kính sát với vòng tròn hạt
    
    // Bọc quanh vòng tròn hạt với cong nhẹ
    const baseX = Math.cos(angle) * radius;
    const baseZ = Math.sin(angle) * radius;
    const curveX = Math.sin(angle) * 0.1; // Giảm độ cong
    
    textMesh.position.set(
      circleCenter.x + baseX + curveX,
      circleCenter.y, // Giữ nguyên chiều cao
      circleCenter.z + baseZ + 0.02 // Đẩy về phía trước ít hơn
    );
    
    // Animation properties đơn giản
    const particle = {
      mesh: textMesh,
      text: text, // Lưu text content
      angle: angle,
      radius: radius,
      speed: 0.005 // Tốc độ xoay đồng bộ với circle particles
    };
    
    textParticles.push(particle);
    textGroup.add(textMesh);
  }
}

// Create flying text particles
function createFlyingTextParticles() {
  const flyingTextCount = isMobile ? 6 : 8; // Giảm số lượng flying text particles trên mobile
  
  for (let i = 0; i < flyingTextCount; i++) {
    const text = textContent[Math.floor(Math.random() * textContent.length)];
    const color = textColors[Math.floor(Math.random() * textColors.length)];
    
    // Tạo plane geometry cho text - responsive size
    const geometry = new THREE.PlaneGeometry(flyingTextSize, flyingTextSize);
    
    // Tạo material với text texture
    const material = new THREE.MeshBasicMaterial({
      map: createFlyingTextTexture(text, color),
      transparent: true,
      opacity: 0.95 + Math.random() * 0.05,
      side: THREE.DoubleSide,
      alphaTest: 0.05, // Giảm alpha test để loại bỏ viền đen
      blending: THREE.AdditiveBlending, // Thêm blending để chữ sáng hơn
      depthWrite: false // Tắt depth write để tránh z-fighting
    });
    
    const textMesh = new THREE.Mesh(geometry, material);
    
    // Vị trí ban đầu - rải rác ở trung tâm vòng tròn
    const randomAngle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * 0.3; // Trong vòng tròn nhỏ
    
    textMesh.position.set(
      circleCenter.x + Math.cos(randomAngle) * randomRadius,
      circleCenter.y,
      circleCenter.z + Math.sin(randomAngle) * randomRadius
    );
    
    // Animation properties
    const particle = {
      mesh: textMesh,
      text: text, // Lưu text content
      pos: textMesh.position.clone(),
      targetPos: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1, // Trung tâm trái tim
        0.1 + Math.random() * 0.2, // Trên trái tim
        (Math.random() - 0.5) * 0.1
      ),
      speed: 0.001 + Math.random() * 0.002, // Làm chậm tốc độ bay
      life: 0,
      maxLife: 300 + Math.random() * 150 // Tăng thời gian bay
    };
    
    flyingTextParticles.push(particle);
    flyingTextGroup.add(textMesh);
  }
}

// Update flying text particles
function updateFlyingTextParticles(a, currentColor) {
  flyingTextParticles.forEach((particle, i) => {
    // Di chuyển đến target position (trái tim)
    const direction = new THREE.Vector3().subVectors(particle.targetPos, particle.pos);
    direction.normalize();
    particle.pos.add(direction.multiplyScalar(particle.speed));
    
    particle.life++;
    
    // Thêm hiệu ứng xoay nhẹ khi bay lên (chậm hơn)
    const angle = particle.life * 0.02; // Giảm tốc độ xoay
    const radius = 0.02 + Math.sin(particle.life * 0.01) * 0.01; // Giảm độ xoay
    
    particle.pos.x += Math.cos(angle) * radius * 0.003; // Giảm tốc độ
    particle.pos.z += Math.sin(angle) * radius * 0.003; // Giảm tốc độ
    
    // Reset particle khi đến trái tim hoặc hết life
    if (particle.life > particle.maxLife) {
      const randomAngle = Math.random() * Math.PI * 2;
      const randomRadius = Math.random() * 0.3;
      
      particle.pos.set(
        circleCenter.x + Math.cos(randomAngle) * randomRadius,
        circleCenter.y,
        circleCenter.z + Math.sin(randomAngle) * randomRadius
      );
      particle.life = 0;
    }
    
    particle.mesh.position.copy(particle.pos);
    particle.mesh.lookAt(camera.position);
    
    // Cập nhật màu text dựa trên currentColor
    if (isRedMode) {
      const textColor = "#ffffff"; // Luôn trắng khi chuyển sang đỏ
      particle.mesh.material.map = createTextTextureWithColor(particle.text, textColor);
    }
  });
}

// Update text particles
function updateTextParticles(a, currentColor) {
  textParticles.forEach((particle, i) => {
    // Xoay quanh vòng tròn đồng bộ với circle particles
    particle.angle += 0.005; // Tốc độ giống circle particles
    
    // Tính toán vị trí mới - sát vòng tròn hạt
    const baseX = Math.cos(particle.angle) * particle.radius;
    const baseZ = Math.sin(particle.angle) * particle.radius;
    const curveX = Math.sin(particle.angle) * 0.1; // Giảm độ cong
    
    const x = circleCenter.x + baseX + curveX;
    const y = circleCenter.y; // Giữ nguyên chiều cao
    const z = circleCenter.z + baseZ + 0.02; // Đẩy về phía trước ít hơn
    
    particle.mesh.position.set(x, y, z);
    
    // Không xoay text - giữ nguyên hướng
    particle.mesh.rotation.set(0, 0, 0);
    
    // Cập nhật màu text dựa trên currentColor
    if (isRedMode) {
      const textColor = "#ffffff"; // Luôn trắng khi chuyển sang đỏ
      particle.mesh.material.map = createTextTextureWithColor(particle.text, textColor);
    }
  });
}

// OBJ加载器
new THREE.OBJLoader().load(
  "https://assets.codepen.io/127738/heart_2.obj",
  (obj) => {
    heart = obj.children[0];
    heart.geometry.rotateX(-Math.PI * 0.5);
    heart.geometry.scale(0.04, 0.04, 0.04);
    heart.geometry.translate(0, -0.4, 0);
    group.add(heart);

    // 基础网格材质
    heart.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#9bdfe0"), // Heart color - màu xanh nhạt
    });
    originHeart = Array.from(heart.geometry.attributes.position.array);
    // 用于在网格表面上采样加权随机点的实用程序类。
    sampler = new THREE.MeshSurfaceSampler(heart).build();
    // 生成表皮
    init();
    // 创建圆形粒子
    createCircleParticles();
    // 创建飞升粒子
    createFlyingParticles();
    // 创建文字粒子
    createTextParticles();
    // 创建飞升文字粒子
    createFlyingTextParticles();
    // 每一帧都会调用
    renderer.setAnimationLoop(render);
  }
);

let positions = [];
let colors = [];
const geometry = new THREE.BufferGeometry();

const material = new THREE.PointsMaterial({
  vertexColors: true, // Let Three.js knows that each point has a different color
  size: particleSize, // Use responsive particle size
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending, // Thêm blending để hạt sáng hơn
  sizeAttenuation: false // Tắt size attenuation để shooting stars không bị nhỏ
});

const particles = new THREE.Points(geometry, material);
group.add(particles);

const simplex = new SimplexNoise();
const pos = new THREE.Vector3();
const palette = [
  new THREE.Color("#a8f5ff"), // Light cyan - xanh nhạt
  new THREE.Color("#a8f5ff"), // Light cyan - xanh nhạt
  new THREE.Color("#a8f5ff"), // Light cyan - xanh nhạt
  new THREE.Color("#a8f5ff"), // Light cyan - xanh nhạt
  new THREE.Color("#a8f5ff"), // Light cyan - xanh nhạt
  new THREE.Color("#a8f5ff"), // Light cyan - xanh nhạt
];
class SparkPoint {
  constructor() {
    sampler.sample(pos);
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.rand = Math.random() * 0.03;
    this.pos = pos.clone();
    this.one = null;
    this.two = null;
  }
  update(a) {
    const noise =
      simplex.noise4D(this.pos.x * 1, this.pos.y * 1, this.pos.z * 1, 0.1) +
      1.5;
    const noise2 =
      simplex.noise4D(this.pos.x * 500, this.pos.y * 500, this.pos.z * 500, 1) +
      1;
    this.one = this.pos.clone().multiplyScalar(1.01 + noise * 0.15 * beat.a);
    this.two = this.pos
      .clone()
      .multiplyScalar(1 + noise2 * 1 * (beat.a + 0.3) - beat.a * 1.2);
  }
}

let spikes = [];
function init(a) {
  positions = [];
  colors = [];
  const particleCount = isMobile ? 7000 : 12000; // Tăng số lượng hạt
  for (let i = 0; i < particleCount; i++) {
    const g = new SparkPoint();
    spikes.push(g);
  }
}

// Tạo vòng tròn hạt xoay
function createCircleParticles() {
  const particleCount = isMobile ? 5000 : 10000; // Tăng số lượng hạt
  
  for (let i = 0; i < particleCount; i++) {
    // Tạo hạt với phân bố tập trung ở tâm
    const randomValue = Math.random();
    let radius;
    
    if (randomValue < 0.6) {
      // 60% hạt ở tâm (bán kính 0-0.3)
      radius = Math.random() * 0.3;
    } else if (randomValue < 0.85) {
      // 25% hạt ở giữa (bán kính 0.3-0.5)
      radius = 0.3 + Math.random() * 0.2;
    } else {
      // 15% hạt ở viền (bán kính 0.5-0.7)
      radius = 0.5 + Math.random() * 0.2;
    }
    
    const angle = Math.random() * Math.PI * 2;
    
    const particle = {
      angle: angle,
      radius: radius,
      speed: 0.005 + Math.random() * 0.008, // Làm chậm tốc độ xoay
      color: new THREE.Color("#a8f5ff"), // Màu xanh nhạt
      rand: Math.random() * 0.02
    };
    
    circleParticles.push(particle);
  }
}

// Tạo hạt bay lên
function createFlyingParticles() {
  // Tạo hạt bay lên từ vòng tròn
  const flyingCount = isMobile ? 1500 : 3500; // Tăng số lượng hạt bay lên
  for (let i = 0; i < flyingCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * circleRadius;
    
    // Tạo target position cho hiệu ứng tornado bay lên
    const targetAngle = Math.random() * Math.PI * 2;
    const targetRadius = Math.random() * 0.08; // Bán kính nhỏ hơn cho tập trung
    
    const particle = {
      pos: new THREE.Vector3(
        tornadoCenter.x + Math.cos(angle) * radius,
        tornadoCenter.y,
        tornadoCenter.z + Math.sin(angle) * radius
      ),
      targetPos: new THREE.Vector3(
        Math.cos(targetAngle) * targetRadius, // Phân bố đều quanh trái tim
        0.05 + Math.random() * 0.15, // Chiều cao vừa phải
        Math.sin(targetAngle) * targetRadius
      ),
      color: new THREE.Color("#a8f5ff"), // Màu xanh nhạt
      life: 0,
      maxLife: 120 + Math.random() * 80, // Thời gian bay vừa phải
      speed: 0.002 + Math.random() * 0.004 // Tốc độ mượt mà
    };
    
    flyingParticles.push(particle);
  }
}

const beat = { a: 0 };
gsap
  .timeline({
    repeat: -1,
    repeatDelay: 0.3,
  })
  .to(beat, {
    a: 0.5,
    duration: 0.6,
    ease: "power2.in",
  })
  .to(beat, {
    a: 0.0,
    duration: 0.6,
    ease: "power3.out",
  });

// 0.22954521554974774 -0.22854083083283794
const maxZ = 0.23;
const rateZ = 0.5;

function render(a) {
  positions = [];
  colors = [];
  
  // Kiểm tra điều kiện hiển thị trái tim
  if (circleOpacity > 0.8 && flyingOpacity > 0.8) {
    showHeart = true;
  }
  
  // Hiệu ứng chuyển màu sau 5 giây
  if (showHeart && !isRedMode) {
    colorChangeTime += 16; // Tăng thời gian (16ms mỗi frame)
    if (colorChangeTime >= COLOR_CHANGE_DELAY) {
      isRedMode = true;
      colorTransitionProgress = 0;
    }
  }
  
  // Tính toán màu sắc dựa trên trạng thái
  let currentColor;
  if (isRedMode) {
    colorTransitionProgress = Math.min(colorTransitionProgress + 0.02, 1);
    // Interpolate từ xanh sang màu đỏ đậm
    const blueColor = new THREE.Color("#a8f5ff");
    const redColor = new THREE.Color("#ff1744"); // Màu đỏ đậm hơn
    currentColor = new THREE.Color().lerpColors(blueColor, redColor, colorTransitionProgress);
  } else {
    currentColor = new THREE.Color("#a8f5ff");
  }
  
  // Render heart particles chỉ khi showHeart = true
  if (showHeart) {
    heartOpacity = Math.min(heartOpacity + 0.02, 1);
    spikes.forEach((g, i) => {
      g.update(a);
      
      // Render tất cả hạt trái tim để lấp đầy hoàn toàn
      positions.push(g.one.x, g.one.y, g.one.z);
      colors.push(currentColor.r * heartOpacity, currentColor.g * heartOpacity, currentColor.b * heartOpacity);
      
      positions.push(g.two.x, g.two.y, g.two.z);
      colors.push(currentColor.r * heartOpacity, currentColor.g * heartOpacity, currentColor.b * heartOpacity);
    });
  }
  
  // Render circle particles với hiệu ứng fade in
  circleOpacity = Math.min(circleOpacity + 0.01, 1);
  circleParticles.forEach((particle, i) => {
    // Cập nhật góc xoay
    particle.angle += particle.speed;
    
    // Tính toán vị trí trên vòng tròn
    const x = circleCenter.x + Math.cos(particle.angle) * particle.radius;
    const y = circleCenter.y;
    const z = circleCenter.z + Math.sin(particle.angle) * particle.radius;
    
    // Thêm hiệu ứng noise nhẹ
    const noise = simplex.noise4D(x * 2, y * 2, z * 2, a * 0.001) + 1;
    const offsetX = (noise - 1) * 0.01;
    const offsetZ = (noise - 1) * 0.01;
    
    const finalX = x + offsetX;
    const finalY = y + (noise - 1) * 0.005;
    const finalZ = z + offsetZ;
    
    // Chỉ render particles trong tầm nhìn
    if (Math.abs(finalZ) < 0.8) { // Tăng tầm nhìn để phù hợp với vòng tròn lớn hơn
      positions.push(finalX, finalY, finalZ);
      colors.push(currentColor.r * circleOpacity, currentColor.g * circleOpacity, currentColor.b * circleOpacity);
    }
  });
  
  // Render flying particles với hiệu ứng fade in
  flyingOpacity = Math.min(flyingOpacity + 0.008, 1);
  flyingParticles.forEach((particle, i) => {
    // Di chuyển đến target position với easing mượt mà
    const direction = new THREE.Vector3().subVectors(particle.targetPos, particle.pos);
    direction.normalize();
    
    // Easing mượt mà và đơn giản
    const progress = particle.life / particle.maxLife;
    const easedSpeed = particle.speed * (0.8 + Math.sin(progress * Math.PI) * 0.4);
    
    particle.pos.add(direction.multiplyScalar(easedSpeed));
    
    particle.life++;
    
    // Hiệu ứng bay lên mượt mà và đẹp mắt
    const spiralAngle = particle.life * 0.08; // Tốc độ xoay nhẹ nhàng
    const spiralRadius = 0.03 + Math.sin(particle.life * 0.015) * 0.02; // Bán kính nhỏ hơn
    
    // Chuyển động spiral nhẹ nhàng
    particle.pos.x += Math.cos(spiralAngle) * spiralRadius * 0.006;
    particle.pos.z += Math.sin(spiralAngle) * spiralRadius * 0.006;
    
    // Reset particle khi đến trái tim hoặc hết life
    if (particle.life > particle.maxLife) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * circleRadius;
      
      particle.pos.set(
        tornadoCenter.x + Math.cos(angle) * radius,
        tornadoCenter.y,
        tornadoCenter.z + Math.sin(angle) * radius
      );
      particle.life = 0;
    }
    
    // Chỉ render hạt trong tầm nhìn và không quá gần trái tim
    const distanceToHeart = Math.sqrt(particle.pos.x * particle.pos.x + particle.pos.z * particle.pos.z);
    const distanceToCenter = Math.sqrt(particle.pos.x * particle.pos.x + (particle.pos.y + 0.4) * (particle.pos.y + 0.4) + particle.pos.z * particle.pos.z);
    
    // Ẩn hạt khi quá gần trái tim hoặc trong vùng cấm
    if (Math.abs(particle.pos.z) < 0.8 && distanceToHeart > 0.02 && distanceToCenter > 0.15) {
      // Giảm opacity khi hạt gần trái tim
      const fadeDistance = Math.max(0, distanceToCenter - 0.15) / 0.1;
      const fadeOpacity = Math.min(1, fadeDistance);
      
      // Trail effect đơn giản và đẹp
      const trailCount = 2;
      for (let j = 0; j < trailCount; j++) {
        const trailProgress = j / trailCount;
        const trailPos = new THREE.Vector3(
          particle.pos.x - direction.x * trailProgress * 0.015,
          particle.pos.y - direction.y * trailProgress * 0.015,
          particle.pos.z - direction.z * trailProgress * 0.015
        );
        
        const trailOpacity = fadeOpacity * (1 - trailProgress * 0.5);
        
        positions.push(trailPos.x, trailPos.y, trailPos.z);
        colors.push(
          currentColor.r * flyingOpacity * trailOpacity, 
          currentColor.g * flyingOpacity * trailOpacity, 
          currentColor.b * flyingOpacity * trailOpacity
        );
      }
      
      // Render hạt chính với độ sáng cao hơn
      positions.push(particle.pos.x, particle.pos.y, particle.pos.z);
      colors.push(
        currentColor.r * flyingOpacity * fadeOpacity * 1.1, 
        currentColor.g * flyingOpacity * fadeOpacity * 1.1, 
        currentColor.b * flyingOpacity * fadeOpacity * 1.1
      );
    }
  });

  // Update text particles with color change
updateTextParticles(a, currentColor);

// Update flying text particles with color change
updateFlyingTextParticles(a, currentColor);
  
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );

  const vs = heart.geometry.attributes.position.array;
  for (let i = 0; i < vs.length; i += 3) {
    const v = new THREE.Vector3(
      originHeart[i],
      originHeart[i + 1],
      originHeart[i + 2]
    );
    const noise =
      simplex.noise4D(
        originHeart[i] * 1.5,
        originHeart[i + 1] * 1.5,
        originHeart[i + 2] * 1.5,
        a * 0.0005
      ) + 1;
    v.multiplyScalar(0 + noise * 0.15 * beat.a);
    vs[i] = v.x;
    vs[i + 1] = v.y;
    vs[i + 2] = v.z;
  }
  heart.geometry.attributes.position.needsUpdate = true;

  controls.update();
  const shootingStars = animateStars(); // Animate stars và lấy shooting stars
  
  // Render shooting stars với kích thước lớn hơn
  shootingStars.forEach((star, index) => {
    // Render trail với kích thước lớn
    star.trail.forEach((trailPos, trailIndex) => {
      const trailOpacity = (trailIndex / star.trail.length) * 0.9;
      positions.push(trailPos.x, trailPos.y, trailPos.z);
      colors.push(
        1.0 * trailOpacity, // R - sáng hơn
        1.0 * trailOpacity, // G - sáng hơn
        1.0 * trailOpacity  // B - sáng hơn
      );
    });
    
    // Render shooting star chính với độ sáng cao
    positions.push(star.currentPos.x, star.currentPos.y, star.currentPos.z);
    colors.push(1.0, 1.0, 1.0); // Màu trắng sáng
  });
  
  renderer.render(scene, camera);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Update responsive variables on resize
  const newIsMobile = window.innerWidth <= 768;
  if (newIsMobile !== isMobile) {
    // Reload page if mobile state changes significantly
    location.reload();
  }
}

// Music Control System
document.addEventListener('DOMContentLoaded', function() {
  const music = document.getElementById('backgroundMusic');
  const musicToggle = document.getElementById('musicToggle');
  const playingIcon = musicToggle.querySelector('.music-icon.playing');
  const mutedIcon = musicToggle.querySelector('.music-icon.muted');
  
  // Cập nhật source nhạc từ params nếu có
  if (musicFromParams) {
    music.src = musicFromParams;
    console.log('Đã cập nhật nhạc từ params:', musicFromParams);
  }
  
  let isMusicPlaying = false;
  
  // Function để phát nhạc
  function playMusic() {
    music.play().then(() => {
      isMusicPlaying = true;
      musicToggle.classList.remove('muted');
    }).catch(error => {
      console.log('Không thể phát nhạc tự động:', error);
      // Hiển thị nút muted nếu không thể phát tự động
      musicToggle.classList.add('muted');
    });
  }
  
  // Function để tạm dừng nhạc
  function pauseMusic() {
    music.pause();
    isMusicPlaying = false;
    musicToggle.classList.add('muted');
  }
  
  // Function để toggle nhạc
  function toggleMusic() {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }
  
  // Event listener cho nút bật/tắt
  musicToggle.addEventListener('click', toggleMusic);
  
  // Thêm event listener cho user interaction để có thể phát nhạc
  document.addEventListener('click', function() {
    if (!isMusicPlaying) {
      playMusic();
    }
  }, { once: true });
  
  document.addEventListener('touchstart', function() {
    if (!isMusicPlaying) {
      playMusic();
    }
  }, { once: true });
  
  // Thử phát nhạc tự động sau 1 giây
  setTimeout(() => {
    if (!isMusicPlaying) {
      playMusic();
    }
  }, 1000);
  
  // Xử lý khi nhạc kết thúc
  music.addEventListener('ended', function() {
    // Nhạc sẽ loop tự động
  });
  
  // Xử lý lỗi khi load nhạc
  music.addEventListener('error', function() {
    console.log('Lỗi khi load nhạc');
    musicToggle.classList.add('muted');
  });
});
