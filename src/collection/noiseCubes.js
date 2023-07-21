import { Vector2, Vector3 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";

import { res, colors, noise2D } from "../helpers";

const yV = new Vector3(0, 1, 0);
const xV = new Vector3(1, 0, 0);
const zV = new Vector3(0, 0, 1);

const material = new LineMaterial({
  color: colors.base,
  linewidth: 2,
  resolution: new Vector2(res, res),
});

function addCube({ position, scale, randAxis, randAngle, scene }) {
  for (let face = 0; face < 6; face++) {
    const vertices = [
      new Vector3(-1, -1, +1),
      new Vector3(+1, -1, +1),
      new Vector3(+1, +1, +1),
      new Vector3(-1, +1, +1),
    ];

    const normal = new Vector3(0, 0, 1);

    let rotAxis = null;
    let rotAngle = null;

    switch (face) {
      case 0:
        rotAxis = xV;
        rotAngle = 0;
        break;
      case 1:
        rotAxis = yV;
        rotAngle = Math.PI * 0.5;
        break;
      case 2:
        rotAxis = yV;
        rotAngle = Math.PI * 1.0;
        break;
      case 3:
        rotAxis = yV;
        rotAngle = Math.PI * 1.5;
        break;
      case 4:
        rotAxis = xV;
        rotAngle = Math.PI * 0.5;
        break;
      case 5:
        rotAxis = xV;
        rotAngle = Math.PI * -0.5;
        break;
    }

    vertices.forEach((v) => {
      v.applyAxisAngle(rotAxis, rotAngle);
    });
    normal.applyAxisAngle(rotAxis, rotAngle);

    vertices.forEach((v) => {
      v.applyAxisAngle(randAxis, randAngle);
    });
    normal.applyAxisAngle(randAxis, randAngle);

    vertices.forEach((v) => {
      v.multiplyScalar(scale);
      v.add(position);
    });

    const geoVertices = [
      vertices[0].x,
      vertices[0].y,
      vertices[0].z,
      vertices[1].x,
      vertices[1].y,
      vertices[1].z,
      vertices[2].x,
      vertices[2].y,
      vertices[2].z,
      vertices[3].x,
      vertices[3].y,
      vertices[3].z,
      vertices[0].x,
      vertices[0].y,
      vertices[0].z,
    ];

    const geometry = new LineGeometry();
    geometry.setPositions(geoVertices);

    const line = new Line2(geometry, material);
    line.computeLineDistances();

    scene.add(line);
  }
}

export function noiseCubes(scene) {
  addCube({
    position: new Vector3(0, 0, -500),
    scale: 100,
    randAxis: new Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize(),
    randAngle: Math.random() * Math.PI * 2,
    scene,
  });
}
