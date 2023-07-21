import "./style.css";
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  Color,
} from "three";
import { consola } from 'consola';

import { colors, res } from "./src/helpers";
import { noiseLines, noiseCubes } from './src/collection'

document.documentElement.style.setProperty('--document-background', colors.documentBackground);

// Art collections
const artCollection = {
  noiseLines,
  noiseCubes, 
}
// END Art collections

// Select
let selectedCanvas = 'noiseCubes';

const artCollectionSelect = document.createElement("select");
artCollectionSelect.classList.add("canvas-selector");

document.body.appendChild(artCollectionSelect);

Object.keys(artCollection).forEach(art => {
  const option = document.createElement("option");
  option.value = art;
  option.text = art;
  option.selected = art === selectedCanvas

  artCollectionSelect.appendChild(option);
})

artCollectionSelect.addEventListener('change', event => {
  selectedCanvas = event.target.value;
  showArt(selectedCanvas);
})

// END Select

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
renderer.tabindex = 0
document.body.appendChild(renderer.domElement);
// END Renderer

const showArt = (name) => {
  consola.info(` Now displayed ${name}`);
  document.title = ` Art | ${name}`;
  // clean up scene
  scene.remove.apply(scene, scene.children);

  return artCollection[name](scene);
}

showArt(selectedCanvas);

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
