import { Engine } from "../Engine";
import { VertexElementFormat } from "../geometry/graphic/enums/VertexElementFormat";
import { VertexElement } from "../geometry/graphic/VertexElement";
import { GeometryShape } from "./GeometryShape";

export class TorusGeometry extends GeometryShape {
  constructor(
    private parameters: {
      radius?: number;
      tube?: number;
      radialSegments?: number;
      tubularSegments?: number;
      arc?: number;
    } = {},
    engine?: Engine
  ) {
    super();

    this.type = "TorusBufferGeometry";

    const radius = this.parameters.radius || 1;
    const tube = this.parameters.tube || 0.4;
    const radialSegments = Math.floor(this.parameters.radialSegments) || 8;
    const tubularSegments = Math.floor(this.parameters.tubularSegments) || 6;
    const arc = this.parameters.arc || Math.PI * 2;

    // buffers
    const vertices: Float32Array = new Float32Array((radialSegments + 1) * (tubularSegments + 1) * 3);
    const indices: Uint16Array = new Uint16Array(radialSegments * tubularSegments * 6);

    // generate vertices, normals and uvs
    let index = 0;
    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = (i / tubularSegments) * arc;
        const v = (j / radialSegments) * Math.PI * 2;

        // POSITION
        vertices[index++] = (radius + tube * Math.cos(v)) * Math.cos(u);
        vertices[index++] = (radius + tube * Math.cos(v)) * Math.sin(u);
        vertices[index++] = tube * Math.sin(v);
      }
    }

    // generate indices
    index = 0;
    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        // indices
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;

        // faces
        indices[index++] = a;
        indices[index++] = b;
        indices[index++] = d;
        indices[index++] = b;
        indices[index++] = c;
        indices[index++] = d;
      }
    }
    this._initialize(engine, vertices, indices);
  }

  _initialize(engine: Engine, vertices: Float32Array, indices: Uint16Array) {
    engine = engine || Engine._getDefaultEngine();

    const vertexStride = 12;
    const vertexElements = [new VertexElement("POSITION", 0, VertexElementFormat.Vector3, 0)];

    this._initBuffer(engine, vertices, indices, vertexStride, vertexElements);
  }
}
