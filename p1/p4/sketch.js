let centerX = 300; // 고양이 얼굴의 중심 X 좌표
let centerY = 200; // 고양이 얼굴의 중심 Y 좌표

// 파티클 객체를 저장할 배열 선언
let particles = []; 
let numParticles = 30; // 파티클 개수

function setup() {
  createCanvas(600, 400); // 가로 600, 세로 400 픽셀 캔버스 생성
  // HSB 모드 사용, 알파값(투명도) 범위도 0-100으로 명확히 설정
  colorMode(HSB, 360, 100, 100, 100); 
  
  // 파티클 초기화: setup()에서 한 번만 위치와 초기 크기 설정
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),     // 캔버스 내 무작위 X 위치
      y: random(height),    // 캔버스 내 무작위 Y 위치
      baseSize: random(2, 5), // 파티클의 기본 크기
      // 각 파티클마다 다른 반짝임 시작점을 위해 오프셋 추가
      offset: random(TWO_PI) // 0에서 2π (한 바퀴) 사이의 무작위 값
    });
  }
}

function draw() {
  // --- 애니메이션 변수 계산 ---
  
  // 1. 기본 애니메이션 (움직임): sin()을 이용한 상하 움직임 (폭: 10픽셀)
  let yOffset = sin(frameCount * 0.05) * 10;
  let currentY = centerY + yOffset;
  
  // 2. 고양이 색상 변화: frameCount에 따라 Hue 값(0~360)이 순환적으로 변화
  let hue = (frameCount * 2) % 360; 
  
  // 3. 크기 변화: sin()을 이용한 눈 크기 변화 (15에서 25 사이)
  let eyeSize = 20 + sin(frameCount * 0.15) * 5; 
  
  // 4. 배경 변화: sin()을 이용해 명도(Brightness)를 85~95 사이로 변화
  let bgBrightness = 90 + sin(frameCount * 0.03) * 5;
  
  // 배경색: 잔잔하게 명도가 변화하는 미색 (Hue: 35, Saturation: 10, Brightness: 85~95)
  background(35, 10, bgBrightness); 

  // --- 배경 파티클 그리기 ---
  for (let i = 0; i < numParticles; i++) {
    let p = particles[i]; // 현재 파티클 객체 참조
    
    // 크기 변화: 기본 크기에서 sin 값에 따라 +-(1.5) 만큼 변화
    let particleSize = p.baseSize + sin(frameCount * 0.1 + p.offset) * 1.5; 
    
    // 투명도 변화: 20에서 100 사이로 변화 
    let particleAlpha = 60 + sin(frameCount * 0.08 + p.offset) * 40; 
    
    noStroke();
    // 별 색상을 흰색으로 고정 (H:0, S:0, B:100)하고 투명도를 적용
    fill(0, 0, 100, particleAlpha); 
    
    // 파티클 위치는 setup에서 설정된 고정된 위치를 사용
    ellipse(p.x, p.y, particleSize, particleSize); 
  }

  // --- 고양이 얼굴 그리기 (애니메이션 적용) ---

  // 고양이 얼굴 윤곽 (큰 원)
  noStroke();
  fill(hue, 80, 90); 
  ellipse(centerX, currentY, 150, 150); 

  // 고양이 귀 (삼각형)
  fill((hue + 30) % 360, 70, 70); 
  triangle(centerX - 40, currentY - 70, centerX - 60, currentY - 30, centerX, currentY - 50);
  triangle(centerX + 40, currentY - 70, centerX + 60, currentY - 30, centerX, currentY - 50);

  // 고양이 눈 (작은 원)
  fill(0, 0, 15); // 어두운 색상 (검은색)
  ellipse(centerX - 30, currentY - 20, eyeSize, eyeSize); 
  ellipse(centerX + 30, currentY - 20, eyeSize, eyeSize); 

  // 고양이 코 (작은 원)
  fill(340, 50, 90); // 분홍색 계열
  ellipse(centerX, currentY + 20, 15, 10);

  // 고양이 수염 (선)
  stroke(0, 0, 15); 
  strokeWeight(1);
  line(centerX - 70, currentY + 10, centerX - 20, currentY + 15);
  line(centerX - 70, currentY + 20, centerX - 20, currentY + 25);
  line(centerX + 70, currentY + 10, centerX + 20, currentY + 15);
  line(centerX + 70, currentY + 20, centerX + 20, currentY + 25);
  
} // <- draw() 함수 닫는 괄호 추가!

// 마우스 클릭 이벤트 함수는 draw() 함수 바깥에 정의해야 합니다.
function mousePressed() {
  saveCanvas('my-drawing', 'png'); 
}