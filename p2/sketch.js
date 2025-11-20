/**
 * Self-Portrait (600x400)
 * Keys: 'S' to save PNG
 * This patch:
 * - Brown hair-rect: shorten 6mm from bottom
 * - Blue front rect height extends to back shirt bottom
 * - Eyebrow triangles apex upward
 * - Iris diameter +0.5mm (radius +0.25mm)
 * - Black dot 2mm up from previous (now mouthY - 2mm)
 */

const CANVAS_W = 600;
const CANVAS_H = 400;

// Palette
const YELLOW_BG = '#FFD84D';
const SHIRT_BLUE = '#2A6FE8';
const SKIN      = '#FFCFA6';  // light orange
const HAIR_BROWN = '#6A3F26';  // brown
const IRIS_BROWN = '#3B2A22';  // dark brown
const LINE_DARK  = '#4A2D1D';

// Unit conversion
const MM_TO_PX = 3.7795; // 1 mm ≈ 3.78 px

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  noLoop();
  pixelDensity(2);
}

function draw() {
  background(YELLOW_BG);
  const cx = width * 0.5;

  // --- Hair geometry ---
  const hairCircleD  = 220;
  const hairCircleY  = 140;

  // Brown hair rectangle: width = circle; top at circle midline; height prev (+15mm) then -6mm now
  const hairRectW    = hairCircleD;
  const hairRectTopY = hairCircleY;
  const hairRectH    = (200 + 15 * MM_TO_PX) - 6 * MM_TO_PX; // ↓ 6mm from bottom
  const hairRectBottomY = hairRectTopY + hairRectH;

  // --- Face semicircle (kept) ---
  let faceBaseD    = hairCircleD * 0.7 * 1.5; // 105% of hair circle
  const faceW      = faceBaseD * 0.5 * 1.4;   // non-uniform width
  const faceH      = faceBaseD * 1.2;          // height stretched
  const faceCY    = hairCircleY + 10 - (faceH - faceBaseD) * 0.5;
  const faceBottomY = faceCY + faceH / 2;

  // --- Eye base sizes ---
  const eyeGap  = min(90, faceW * 0.70);
  const scleraW = min(42, faceW * 0.32);
  const scleraH = scleraW * 0.62;

  // Iris radius: previous (scleraW*0.35 - 1mm), now +0.25mm (diameter +0.5mm)
  let irisR = max(1, scleraW * 0.35 - 1 * MM_TO_PX);
  irisR += 0.25 * MM_TO_PX;

  // Eye positions
  const eyeY      = faceCY + faceH * 0.14;
  const leftEyeX  = cx - eyeGap / 2;
  const rightEyeX = cx + eyeGap / 2;

  // --- Nose & Mouth (kept at +3mm down from earlier)
  const featureDown = 3 * MM_TO_PX;
  const noseY    = eyeY + scleraH * 0.8 + featureDown;

  const mouthW_full = min(eyeGap, faceW * 0.85);
  const mouthW  = mouthW_full * 0.5;                // halved from earlier step
  const mouthY  = noseY + scleraH * 0.9;          // follows nose (+3mm)
  const mouthH  = mouthW * 0.45;
  const mouthLowestY = mouthY + mouthH / 2;          // "입이 끝나는 점"

  // --- Neck: behind blueRect; from mouthLowestY to hairRectBottomY ---
  const neckTop = mouthLowestY;
  const neckBottom = hairRectBottomY;              // updated due to -6mm hairRect
  const neckH = max(0, neckBottom - neckTop);
  const neckW = max(28, faceBaseD * 0.32);
  const neckX = cx - neckW / 2;

  // --- Blue front rect (sharp corners): starts 5mm below face bottom; width previously -10mm ---
  const blueRectW0 = faceW;
  const blueRectW  = max(8, blueRectW0 - 10 * MM_TO_PX); // -10mm (kept)
  const blueRectX  = cx - blueRectW / 2;
  const blueRectY  = faceBottomY + 5 * MM_TO_PX; // 5mm below face bottom

  // --- Back shirt (behind hair-rect), top aligned to blueRect; width -11mm total (kept) ---
  let shirtW = hairRectW * 1.2 * 1.5;
  shirtW = max(10, shirtW - (11 * MM_TO_PX));      // keep prior total reduction
  const shirtH = (hairRectH) * 1.2;
  const shirtX = cx - shirtW / 2;
  const shirtY = blueRectY;                      // align top to blueRect

  // Blue front rect height must reach shirt bottom
  const shirtBottomY = shirtY + shirtH;
  const blueRectH = max(0, shirtBottomY - blueRectY);

  // ===== Draw order (back → front) =====
  // 1) Shirt (behind hair-rect)
  fill(SHIRT_BLUE);
  noStroke();
  rectMode(CORNER);
  rect(shirtX, shirtY, shirtW, shirtH, 16);

  // (Optional) Shirt V-neck (still behind hair-rect)
  fill(SKIN);
  const shirtVw = min(shirtW * 0.22, 120);
  const shirtVd = min(shirtH * 0.25, 46);
  triangle(
    cx - shirtVw / 2, shirtY,
    cx + shirtVw / 2, shirtY,
    cx,               shirtY + shirtVd
  );

  // 2) Brown HAIR RECT (in front of shirt)
  fill(HAIR_BROWN);
  rectMode(CENTER);
  rect(cx, hairRectTopY + hairRectH / 2, hairRectW, hairRectH, 10);

  // 3) Neck (behind blueRect)
  fill(SKIN);
  rectMode(CORNER);
  rect(neckX, neckTop, neckW, neckH, 6);

  // 4) Blue front RECT (sharp corners) on top of neck, from blueRectY to shirt bottom
  fill(SHIRT_BLUE);
  rect(blueRectX, blueRectY, blueRectW, blueRectH); // sharp corners

  // 5) Inverted triangle for BlueRect (on top of BlueRect)
  fill(SKIN);
  const blueVw = min(blueRectW * 0.28, 120);
  const blueVd = min(blueRectH * 0.5,  46);
  triangle(
    cx - blueVw / 2, blueRectY,
    cx + blueVw / 2, blueRectY,
    cx,               blueRectY + blueVd  // V-neck apex downward (unchanged)
  );

  // 6) Hair CIRCLE (behind face)
  fill(HAIR_BROWN);
  circle(cx, hairCircleY, hairCircleD);

  // 7) Face: semicircle (lower half) on top of neck/hair-circle
  noStroke();
  fill(SKIN);
  arc(cx, faceCY, faceW, faceH, 0, PI, CHORD);

  // 8) Eyes (sclera + black 1px outline)
  fill(255);
  ellipse(leftEyeX,  eyeY, scleraW, scleraH);
  ellipse(rightEyeX, eyeY, scleraW, scleraH);
  stroke(0);
  strokeWeight(1);
  noFill();
  ellipse(leftEyeX,  eyeY, scleraW, scleraH);
  ellipse(rightEyeX, eyeY, scleraW, scleraH);

  // Irises/pupils (dark brown)
  noStroke();
  fill(IRIS_BROWN);
  circle(leftEyeX,  eyeY, irisR * 2);
  circle(rightEyeX, eyeY, irisR * 2);

  // Highlights
  fill(255);
  const hlr = max(3, irisR * 0.32);
  circle(leftEyeX  + irisR * 0.42, eyeY - irisR * 0.42, hlr);
  circle(rightEyeX + irisR * 0.42, eyeY - irisR * 0.42, hlr);

  // 9) Eyebrows (thickness halved; previously adjusted pos kept)
  const browBaseOffsetY = 3 * MM_TO_PX;    // original 3mm above eye
  const browLiftPrev    = 5 * MM_TO_PX;    // lifted +5mm earlier
  const browAdjustDown  = 1 * MM_TO_PX;    // then -1mm
  const browY = (eyeY - browBaseOffsetY - browLiftPrev) + browAdjustDown;
  const browW = scleraW + 2 * MM_TO_PX;    // sclera + 2mm
  const browH = max(1, (scleraH * 0.22) / 2); // half thickness (min 1px)
  fill(HAIR_BROWN);
  noStroke();
  rectMode(CENTER);
  rect(leftEyeX,  browY, browW, browH, 2);
  rect(rightEyeX, browY, browW, browH, 2);
  rectMode(CORNER);

  // 10) Nose (mirrored 'C')
  noFill();
  stroke(LINE_DARK);
  strokeWeight(2);
  const noseD = irisR * 1.05;
  arc(cx, noseY, noseD, noseD, radians(230), radians(310));

  // 11) Mouth (lower-half arc)
  stroke(LINE_DARK);
  strokeWeight(2.2);
  arc(cx, mouthY, mouthW, mouthH, 0, PI);

  // 12) Black dot: move 2mm up from previous (i.e., mouthY - 2mm)
  noStroke();
  fill(0);
  const dotX = (cx - mouthW / 2) - 2 * MM_TO_PX;   // 2mm left of mouth's left edge
  const dotY = mouthY - 2 * MM_TO_PX;          // 2mm up
  circle(dotX, dotY, 4);

  // 13) Two SKIN triangles above each brow — apex UPWARD now
  fill(SKIN);
  noStroke();
  const triBase = 2 * MM_TO_PX;  // 2mm
  const triH    = 10 * MM_TO_PX; // 10mm
  // Left triangle (base on face top chord at left brow x; apex upward)
  triangle(
    leftEyeX - triBase / 2, faceCY,        // base left on top chord
    leftEyeX + triBase / 2, faceCY,        // base right on top chord
    leftEyeX,               faceCY - triH  // apex UP
  );
  // Right triangle
  triangle(
    rightEyeX - triBase / 2, faceCY,
    rightEyeX + triBase / 2, faceCY,
    rightEyeX,               faceCY - triH
  );

  // Reset
  noStroke();
  rectMode(CORNER);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('self-portrait', 'png');
  }
}