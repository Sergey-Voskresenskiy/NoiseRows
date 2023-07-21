import "./style.css";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Color,
} from "three";
import { consola } from 'consola';

import { colors, res } from "./src/helpers";

import { createLines } from './src/collection'

document.documentElement.style.setProperty('--document-background', colors.documentBackground);

// Scene
const scene = new Scene();
scene.background = new Color(colors.canvasBackground);
// END Scene

// Camera
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

// Art collections
const collection = {
  noiseLines: createLines,

}

const art = (name) => {
  consola.info(` Now displayed ${name}`)
  return collection[name](scene)
}
// END Art collections

art('noiseLines');

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
