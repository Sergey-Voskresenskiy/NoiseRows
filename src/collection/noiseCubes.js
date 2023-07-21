import { Vector2, Vector3, Color } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";

import { res, colors, noise2D } from "../helpers";

const yV = new Vector3(0, 1, 0);
const xV = new Vector3(1, 0, 0);
const zV = new Vector3(0, 0, 1);

const frontMaterial = new LineMaterial({
  color: new Color(colors.base),
  linewidth: 2,
  resolution: new Vector2(res, res),
});

const frontRedMaterial = new LineMaterial({
  color: new Color(colors.red),
  linewidth: 2,
  resolution: new Vector2(res, res),
});

const backMaterial = new LineMaterial({
  color: new Color(colors.base).multiplyScalar(0.75),
  linewidth: 1.5,
  dashed: true,
  dashScale: 1,
  dashSize: 15,
  gapSize: 15,
  resolution: new Vector2(res, res),
});

function addCube({
  position,
  subdivisions,
  noiseScale,
  scale,
  randAxis,
  randAngle,
  isRed,
  scene,
}) {
  for (let face = 0; face < 6; face++) {
    for (let sx = 0; sx < subdivisions; sx++) {
      for (let sv = 0; sv < subdivisions; sv++) {
        const cellSize = 1 / subdivisions;
        const cellOffset = new Vector3(sx * cellSize, sv * cellSize, 0);

        const vertices = [
          new Vector3(-1, -1, +1),
          new Vector3(+1, -1, +1),
          new Vector3(+1, +1, +1),
          new Vector3(-1, +1, +1),
        ];

        const noisePositionX =
          position.x +
          cellOffset.x * 17.18 +
          cellOffset.y * 81.91 +
          face * 0.178;

        const noisePositionY =
          position.x +
          cellOffset.x * 17.18 +
          cellOffset.y * 81.91 +
          face * 0.178;

        vertices.forEach((v) => {
          v.multiplyScalar(0.5).addScalar(0.5);
          v.multiply(new Vector3(cellSize, cellSize, 1));
          v.add(cellOffset);

          v.add(
            new Vector3(
              noiseScale * noise2D(noisePositionX, noisePositionY),
              noiseScale *
                noise2D(noisePositionX + 17.898, noisePositionY + 17.898),
              0
            )
          );

          v.multiplyScalar(2).addScalar(-1);
        });

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

        const isBackFace = normal.dot(zV) < 0;

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

        if (isBackFace) {
          geometry.translate(0, 0, -1);
        }

        const line = new Line2(
          geometry,
          !isBackFace ?  isRed ? frontRedMaterial : frontMaterial : backMaterial
        );
        line.computeLineDistances();

        line.renderOrder = !isBackFace ? 2 : 1; 

        scene.add(line);
      }
    }
  }
}

export function noiseCubes(scene) {
  const hugeNoise = Math.random() > 0.75 ? 4 : 1;
  const redCubeXP = Math.floor(Math.random() * 5 - 2);
  const redCubeYP = Math.floor(Math.random() * 5 - 2);


  for (let i = -2; i < 3; i++) {
    for (let j = -2; j < 3; j++) {
      const scale = (res * 0.035) + noise2D(i * 0.1789, j * 0.1789) * 10;
      const noiseScale = noise2D(i * 0.1789 + 39.789, j * 0.1789 + 39.789) * 2.5 * hugeNoise;

      addCube({
        isRed: i == redCubeXP && j == redCubeYP,
        position: new Vector3(i * 125, j * 125, -100), 
        scale,
        randAxis: new Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).normalize(),
        subdivisions: Math.floor((j + 2 + i + 2) / 3) + 1, 
        noiseScale: (j + 2 + i + 2) * 0.1 * noiseScale,
        randAngle: Math.random() * Math.PI * 2,
        scene,
      });
    }
  }


}
