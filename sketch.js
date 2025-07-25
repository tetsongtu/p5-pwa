let tileSize = 16;
let cols, rows;
let mapData = [];
let p = { x: 0, y: 0, dx: 0, dy: 0, spd: 16, sprite: 2, tx: 0, ty: 0 };
let t = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  cols = floor(width / tileSize);
  rows = floor(height / tileSize);
  for (let i = 0; i < cols * rows; i++) {
    mapData[i] = 0;
  }
  p.x = tileSize;
  p.y = tileSize;
  // Ngăn chuột phải hiện menu
  canvas.oncontextmenu = () => false;
}

function draw() {
  background(85);

  // Vẽ map
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (mapData[y * cols + x] === 1) {
        fill(0);
        rect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  // Chuột vẽ/xoá tường
  if (mouseIsPressed) {
    let mx = floor(mouseX / tileSize);
    let my = floor(mouseY / tileSize);
    if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
      let i = my * cols + mx;
      if (mouseButton === LEFT) mapData[i] = 1;
      if (mouseButton === RIGHT) mapData[i] = 0;
    }
  }

  // Phím điều hướng
  if (keyIsPressed) {
    if (keyCode === UP_ARROW)    { p.tx = 0; p.ty = -1; }
    if (keyCode === DOWN_ARROW)  { p.tx = 0; p.ty = 1;  }
    if (keyCode === LEFT_ARROW)  { p.tx = -1; p.ty = 0; }
    if (keyCode === RIGHT_ARROW) { p.tx = 1; p.ty = 0;  }
  }

  // Di chuyển mỗi 10 frame
  t++;
  if (t % 10 === 0) {
    let nx = p.x + p.tx * p.spd;
    let ny = p.y + p.ty * p.spd;
    if (!isWall(nx, ny)) {
      p.dx = p.tx;
      p.dy = p.ty;
    }

    nx = p.x + p.dx * p.spd;
    ny = p.y + p.dy * p.spd;
    if (!isWall(nx, ny)) {
      p.x = nx;
      p.y = ny;
    }
  }

  // Vẽ nhân vật
  fill(255, 255, 0);
  rect(p.x, p.y, tileSize, tileSize);
}

// Va chạm
function isWall(x, y) {
  let cx = floor(x / tileSize);
  let cy = floor(y / tileSize);
  if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return true;
  return mapData[cy * cols + cx] === 1;
}

// Save và load
function keyPressed() {
  if (key === 'S') {
    saveStrings([mapData.join(',')], 'map.txt');
  }

  if (key === 'L') {
    createFileInput(file => {
      if (!file) return;
      let content = file.data;
      if (typeof content === 'string') {
        let parts = content.trim().split(',').map(Number);
        if (parts.length === cols * rows) {
          mapData = parts;
        }
      }
    }).position(10, height + 10);
  }
}

// Cập nhật khi resize cửa sổ
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  cols = floor(width / tileSize);
  rows = floor(height / tileSize);
  let newMap = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      newMap[y * cols + x] = mapData[y * cols + x] || 0;
    }
  }
  mapData = newMap;
}
