import { Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";

import { res, colors, noise2D } from '../helpers'

const area = Math.trunc(res / 100) * 90;
const linesCount = Math.trunc(res / 35);

let hasColoredLine = false;

export function createLines(scene) {
  for (let r = -linesCount; r < linesCount; r++) {
    const wnoise = noise2D(0, r * 0.125) * 1.0;
    const linewidth = 0.25 + Math.pow(wnoise * 0.5 + 1, 2);
    const dashed = Math.random() > 0.5;
    const dashScale = 1;
    const dashSize = Math.pow(Math.random(), 2) * 15 + 4;
    const gapSize = dashSize * (0.5 + Math.random() * 1);

    let lcolor = colors.base;
    if (linewidth > 1.5 && !hasColoredLine && Math.abs(r) < 4) {
      hasColoredLine = true;
      lcolor = colors.light;
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
