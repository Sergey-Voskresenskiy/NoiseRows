import "./style.css";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Color,
  Vector2,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { createNoise2D } from "simplex-noise";
("simplex-noise");

// Noise
const noise2D = createNoise2D();
//END Noise

// Scene
const scene = new Scene();
scene.background = new Color(`rgb(79, 69, 87)`);
// END Scene

// Camera
const res = Math.trunc(
  (document.body.getBoundingClientRect().height / 100) * 75
);

const camera = new OrthographicCamera(
  -res * 0.5,
  res * 0.5,
  res * 0.5,
  -res * 0.5,
  0,
  1000
);
camera.position.z = 0;
// END Camera

// Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(res, res);
document.body.appendChild(renderer.domElement);
// END Renderer

const area = Math.trunc(res / 100) * 90;
const linesCount = Math.trunc(res / 35);

let hasColoredLine = false;

function createLines() {
  for (let r = -linesCount; r < linesCount; r++) {
    const wnoise = noise2D(0, r * 0.125) * 1.0;
    const linewidth = 0.25 + Math.pow(wnoise * 0.5 + 1, 2);
    const dashed = Math.random() > 0.5;
    const dashScale = 1;
    const dashSize = Math.pow(Math.random(), 2) * 15 + 4;
    const gapSize = dashSize * (0.5 + Math.random() * 1);

    let lcolor = `rgb(109, 93, 110)`;
    if (linewidth > 1.5 && !hasColoredLine && Math.abs(r) < 4) {
      hasColoredLine = true;
      lcolor = `rgb(244, 238, 224)`;
    }

    const material = new LineMaterial({
      color: lcolor,
      linewidth,
      dashed,
      dashScale,
      dashSize,
      gapSize,
      resolution: new Vector2(res, res),
    });

    const vertices = [];

    for (let i = 0; i < 100; i++) {
      let height = 0;
      height += noise2D(i * 0.0189 * 1, r * 0.125) * 2.0;
      height += noise2D(i * 0.0189 * 2, r * 0.125) * 1.0;
      height += noise2D(i * 0.0189 * 4, r * 0.125) * 0.5;
      height += noise2D(i * 0.0189 * 8, r * 0.125) * 0.25;
      height += noise2D(i * 0.0189 * 16, r * 0.125) * 0.125;

      vertices.push(-(area / 2) + area * (i / 100), height * 20 + r * 14, 0);
    }

    const geometry = new LineGeometry();
    geometry.setPositions(vertices);

    const line = new Line2(geometry, material);
    line.computeLineDistances();

    scene.add(line);
  }
}

createLines();

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
