const CANVAS_W = 600;
const CANVAS_H = 400;

// Palette
const YELLOW_BG = '#FFD84D';
const SHIRT_BLUE = '#2A6FE8';
const SKIN = '#FFCFA6';
const HAIR_BROWN = '#6A3F26';
const IRIS_BROWN = '#3B2A22';
const LINE_DARK = '#4A2D1D';
const RAIN_COLOR = '#3498DB'; // 빗방울 색

const MM_TO_PX = 3.7795; // 1 mm ≈ 3.78 px
let t = 0;

// 비 배열
const rainDrops = [];

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  pixelDensity(2);
  frameRate(30); // GIF용 프레임 속도

  // 비 초기화
  for (let i = 0; i < 100; i++) {
    rainDrops.push({
      x: random(width),
      y: random(-height, 0),
      length: random(10, 20),
      speed: random(4, 10)
    });
  }

  // GIF 저장 안내
  console.log("‘g’ 키를 눌러 GIF 저장 가능!");
}

function draw() {
  background(YELLOW_BG);
  const cx = width * 0.5;

  // --- 땅바닥 ---
  noStroke();
  fill('#2ECC71'); 
  const groundHeight = 60;
  rect(0, height - groundHeight, width, groundHeight);

  // --- 비 ---
  stroke(RAIN_COLOR);
  strokeWeight(2);
  for (let drop of rainDrops) {
    line(drop.x, drop.y, drop.x, drop.y + drop.length);
    drop.y += drop.speed;
    if (drop.y > height) {
      drop.y = random(-100, -10);
      drop.x = random(width);
      drop.length = random(10, 20);
      drop.speed = random(4, 10);
    }
  }

  // --- 캐릭터 ---
  drawCharacter(cx);

  t++;
}

function keyPressed() {
  if (key === 'g') {
    saveGif('character_rain', 10, {delay: 0, units: 'seconds'});
    console.log("GIF 녹화 시작! 10초 후 다운로드");
  }
}

function drawCharacter(cx) {
  // --- Hair & Face ---
  const hairCircleD = 220;
  const hairCircleY = 140;
  const hairRectW = hairCircleD;
  const hairRectTopY = hairCircleY;
  const hairRectH = (200 + 15 * MM_TO_PX) - 6 * MM_TO_PX;
  const hairRectBottomY = hairRectTopY + hairRectH;

  const faceBaseD = hairCircleD * 0.7 * 1.5;
  const faceW = faceBaseD * 0.5 * 1.4;
  const faceH = faceBaseD * 1.2;
  const faceCY = hairCircleY + 10 - (faceH - faceBaseD) * 0.5;
  const faceBottomY = faceCY + faceH / 2;

  // --- Eyes ---
  const eyeGap = min(90, faceW * 0.7);
  const scleraW = min(42, faceW * 0.32);
  const scleraH0 = scleraW * 0.62;
  const eyeY = faceCY + faceH * 0.14;
  const leftEyeX = cx - eyeGap / 2;
  const rightEyeX = cx + eyeGap / 2;

  const blinkFrame = t % 30 < 15 ? 1 : 0;
  const scleraH = scleraH0 * blinkFrame;
  const irisR = scleraW * 0.35;
  const showIris = blinkFrame > 0;

  // --- Nose & Mouth ---
  const featureDown = 3 * MM_TO_PX;
  const noseY = eyeY + scleraH0 * 0.8 + featureDown;
  const mouthW = min(eyeGap, faceW * 0.85) * 0.5;
  const mouthY = noseY + scleraH0 * 0.9;
  const mouthH0 = mouthW * 0.45;
  const smile = map(sin(t * 0.05 - HALF_PI), -1, 1, 0.7, 1.3);
  const mouthH = mouthH0 * smile;
  const mouthLowestY = mouthY + mouthH / 2;

  // --- Neck & Shirt ---
  const neckTop = mouthLowestY;
  const neckBottom = hairRectBottomY;
  const neckH = max(0, neckBottom - neckTop);
  const neckW = max(28, faceBaseD * 0.32);
  const neckX = cx - neckW / 2;
  const blueRectW = max(8, faceW - 10 * MM_TO_PX);
  const blueRectX = cx - blueRectW / 2;
  const blueRectY = faceBottomY + 5 * MM_TO_PX;
  const shirtW = max(10, hairRectW * 1.2 * 1.5 - (11 * MM_TO_PX));
  const shirtH = hairRectH * 1.2;
  const shirtX = cx - shirtW / 2;
  const shirtY = blueRectY;
  const shirtBottomY = shirtY + shirtH;
  const blueRectH = max(0, shirtBottomY - blueRectY);

  // Shirt
  fill(SHIRT_BLUE);
  noStroke();
  rect(shirtX, shirtY, shirtW, shirtH, 16);

  fill(SKIN);
  triangle(cx - min(shirtW * 0.22, 120)/2, shirtY,
           cx + min(shirtW * 0.22, 120)/2, shirtY,
           cx, shirtY + min(shirtH * 0.25,46));

  // Hair
  fill(HAIR_BROWN);
  rectMode(CENTER);
  rect(cx, hairRectTopY + hairRectH / 2, hairRectW, hairRectH, 10);
  rectMode(CORNER);

  // Neck
  fill(SKIN);
  rect(neckX, neckTop, neckW, neckH, 6);

  // Blue rect
  fill(SHIRT_BLUE);
  rect(blueRectX, blueRectY, blueRectW, blueRectH);

  fill(SKIN);
  triangle(cx - min(blueRectW*0.28,120)/2, blueRectY,
           cx + min(blueRectW*0.28,120)/2, blueRectY,
           cx, blueRectY + min(blueRectH*0.5,46));

  // Head
  fill(HAIR_BROWN);
  circle(cx, hairCircleY, hairCircleD);

  fill(SKIN);
  arc(cx, faceCY, faceW, faceH, 0, PI, CHORD);

  // Eyes
  fill(255);
  ellipse(leftEyeX, eyeY, scleraW, scleraH);
  ellipse(rightEyeX, eyeY, scleraW, scleraH);

  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(leftEyeX, eyeY, scleraW, scleraH);
  ellipse(rightEyeX, eyeY, scleraW, scleraH);

  if(showIris){
    noStroke();
    fill(IRIS_BROWN);
    circle(leftEyeX, eyeY, irisR*2);
    circle(rightEyeX, eyeY, irisR*2);

    fill(255);
    circle(leftEyeX + irisR*0.42, eyeY - irisR*0.42, max(3, irisR*0.32));
    circle(rightEyeX + irisR*0.42, eyeY - irisR*0.42, max(3, irisR*0.32));
  }

  // Eyebrows
  fill(HAIR_BROWN);
  noStroke();
  const browY = eyeY - 3*MM_TO_PX - 5*MM_TO_PX + 1*MM_TO_PX;
  rectMode(CENTER);
  rect(leftEyeX, browY, scleraW + 2*MM_TO_PX, max(1, (scleraH0*0.22)/2), 2);
  rect(rightEyeX, browY, scleraW + 2*MM_TO_PX, max(1, (scleraH0*0.22)/2), 2);
  rectMode(CORNER);

  // Nose
  noFill();
  stroke(LINE_DARK);
  strokeWeight(2);
  arc(cx, noseY, scleraW*0.5, scleraW*0.5, radians(230), radians(310));

  // Mouth
  stroke(LINE_DARK);
  strokeWeight(2.2);
  arc(cx, mouthY, mouthW, mouthH, 0, PI);

  // Black dot
  noStroke();
  fill(0);
  circle((cx - mouthW/2) - 2*MM_TO_PX, mouthY - 2*MM_TO_PX, 4);

  // Brow triangles
  fill(SKIN);
  noStroke();
  const triBase = 2*MM_TO_PX;
  const triH = 10*MM_TO_PX;
  triangle(leftEyeX - triBase/2, faceCY, leftEyeX + triBase/2, faceCY, leftEyeX, faceCY - triH);
  triangle(rightEyeX - triBase/2, faceCY, rightEyeX + triBase/2, faceCY, rightEyeX, faceCY - triH);
}
