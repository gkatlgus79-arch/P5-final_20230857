function setup() {
  createCanvas(600, 400); 
  background(255, 240, 220); 

  // 고양이 얼굴 윤곽
  fill(200, 160, 130);
  ellipse(300, 200, 150, 150); 

  // 고양이 귀
  fill(180, 140, 110);
  triangle(260, 130, 240, 170, 285, 150);
  triangle(340, 130, 360, 170, 315, 150);

  // 고양이 눈
  fill(70, 40, 20);
  ellipse(270, 180, 15, 15);
  ellipse(330, 180, 15, 15);

  // 고양이 코
  fill(160, 120, 90); 
  ellipse(300, 220, 15, 10);

  // 고양이 수염
  stroke(70, 40, 20); 
  strokeWeight(1);
  line(230, 210, 290, 215);
  line(230, 220, 290, 225);
  line(370, 210, 310, 215);
  line(370, 220, 310, 225);
}

function draw() {
  noLoop(); 
}