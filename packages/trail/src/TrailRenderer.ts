import { BufferUsage, DataType, DrawMode } from "@alipay/o3-core";
import { BufferGeometry, GeometryRenderer } from "@alipay/o3-geometry";
import { Material, Texture2D } from "@alipay/o3-material";
import { Quaternion, Vector2, Vector3, Matrix } from "@alipay/o3-math";
import { TrailMaterial } from "./TrailMaterial";

const _tempVector3 = new Vector3();

/**
 * 拖尾效果渲染组件
 */
export class TrailRenderer extends GeometryRenderer {
  private _stroke;
  private _minSeg;
  private _lifetime;
  private _maxPointNum;
  private _points: Array<Vector3>;
  private _pointStates: Array<number>;
  private _strapPoints: Array<Vector3>;
  private _curPointNum;
  private _prePointsNum;
  /**
   * 纹理对象基类
   * @param {Entity} entity 所属的Node对象
   * @param {Object} props 可选配置，包含以下参数
   * @param {float} [props.stroke=0.2] 拖尾的宽度
   * @param {float} [props.minSeg=0.02] 拖尾形状由物体运动轨迹上的点构成，描述相邻点之间最小间隔距离
   * @param {Number} [props.lifetime=1000] 物体运动时，拖尾效果持续的时长
   * @param {Material} [props.material=TrailMaterial] 拖尾使用的材质，默认使用内置的TrailMaterial
   */
  constructor(entity, props) {
    super(entity);

    this._stroke = props.stroke || 0.2;
    this._minSeg = props.minSeg || 0.02;
    this._lifetime = props.lifetime || 1000;
    this._maxPointNum = (this._lifetime / 1000.0) * entity.engine._FPS;

    this._points = [];
    this._pointStates = [];
    this._strapPoints = [];
    for (let i = 0; i < this._maxPointNum; i++) {
      this._points.push(new Vector3());
      this._pointStates.push(this._lifetime);

      this._strapPoints.push(new Vector3());
      this._strapPoints.push(new Vector3());
    }
    this._curPointNum = 0;

    const mtl = props.material || new TrailMaterial("trial_mtl");
    this.setMaterial(mtl);

    this.setTexture(props.texture);
    this._initGeometry();
  }

  /**
   * 每帧的更新函数
   * @private
   */
  update(deltaTime) {
    let mov = 0,
      newIdx = 0;
    for (let i = 0; i < this._curPointNum; i++) {
      this._pointStates[i] -= deltaTime;
      if (this._pointStates[i] < 0) {
        mov++;
      } else if (mov > 0) {
        newIdx = i - mov;

        // Move data
        this._pointStates[newIdx] = this._pointStates[i];

        // Move point
        this._points[i].cloneTo(this._points[newIdx]);
      }
    }
    this._curPointNum -= mov;

    let appendNewPoint = true;
    if (this._curPointNum === this._maxPointNum) {
      appendNewPoint = false;
    } else if (this._curPointNum > 0) {
      const lastPoint = this._points[this._points.length - 1];
      if (Vector3.distance(this.entity.worldPosition, lastPoint) < this._minSeg) {
        appendNewPoint = false;
      } else {
        // debugger
      }
    }

    if (appendNewPoint) {
      this._pointStates[this._curPointNum] = this._lifetime;
      this.entity.worldPosition.cloneTo(this._points[this._curPointNum]);

      this._curPointNum++;
    }
  }

  /**
   * 更新位置，将数据对象加入渲染队列
   * @param {Camera} camera
   * @private
   */
  render(camera) {
    this._updateStrapVertices(camera, this._points);
    this._updateStrapCoords();

    super.render(camera);
  }

  /**
   * 设置当前拖尾的纹理
   * @param {Texture2D} texture
   */
  setTexture(texture) {
    if (texture) {
      this.getMaterial().setValue("u_texture", texture);
    }
  }

  // ----------  private  -------------------
  /**
   * 初始化 geometry
   * @private
   */
  _initGeometry() {
    this.geometry = new BufferGeometry();
    this.geometry.initialize(
      [
        { semantic: "POSITION", size: 3, type: DataType.FLOAT, normalized: false },
        { semantic: "TEXCOORD_0", size: 2, type: DataType.FLOAT, normalized: true }
      ],
      this._maxPointNum * 2,
      BufferUsage.DYNAMIC_DRAW
    );
    this.geometry.mode = DrawMode.TRIANGLE_STRIP;
  }

  /**
   * 更新拖尾顶点位置
   * @private
   */
  _updateStrapVertices(camera, points: Array<Vector3>) {
    const m: Matrix = camera.viewMatrix;
    const e = m.elements;
    const vx = new Vector3(e[0], e[4], e[8]);
    const vy = new Vector3(e[1], e[5], e[9]);
    const vz = new Vector3(e[2], e[6], e[10]);
    const s = this._stroke;

    vy.scale(s);

    const up = new Vector3();
    const down = new Vector3();

    const rotation = new Quaternion();

    Vector3.transformByQuat(vx, rotation, vx);
    Vector3.transformByQuat(vy, rotation, vy);

    const dy = new Vector3();
    const cross = new Vector3();
    const perpVector = new Vector3();

    vx.normalize();

    //-- quad pos
    for (let i = 0; i < this._maxPointNum; i++) {
      //-- center pos
      if (i < this._curPointNum) {
        const p = points[i];

        if (i === this._curPointNum - 1 && i !== 0) {
          Vector3.subtract(p, points[i - 1], perpVector);
        } else {
          Vector3.subtract(points[i + 1], p, perpVector);
        }

        this._projectOnPlane(perpVector, vz, perpVector);
        perpVector.normalize();

        // Calculate angle between vectors
        let angle = Math.acos(Vector3.dot(vx, perpVector));
        Vector3.cross(vx, perpVector, cross);
        if (Vector3.dot(cross, vz) <= 0) {
          angle = Math.PI * 2 - angle;
        }
        Quaternion.rotationAxisAngle(vz, angle, rotation);
        Vector3.transformByQuat(vy, rotation, dy);

        Vector3.add(p, dy, up);
        Vector3.subtract(p, dy, down);
      }

      this.geometry.setValue("POSITION", i * 2, [up.x, up.y, up.z]);
      this.geometry.setValue("POSITION", i * 2 + 1, [down.x, down.y, down.z]);
    }
  }

  /**
   * 更新拖尾 uv 位置
   * @private
   */
  _updateStrapCoords() {
    if (this._prePointsNum === this._curPointNum) {
      return;
    }

    this._prePointsNum = this._curPointNum;

    const count = this._curPointNum;
    const texDelta = 1.0 / count;
    for (let i = 0; i < count; i++) {
      const d = 1.0 - i * texDelta;
      this.geometry.setValue("TEXCOORD_0", i * 2, [0, d]);
      this.geometry.setValue("TEXCOORD_0", i * 2 + 1, [1.0, d]);
    }
  }

  /**
   * 将向量 a 投影到向 p 上。
   * @param a - 要投影的向量
   * @param p - 目标向量
   * @param out - 向量 a 投影到向量 p 的结果向量
   */
  _projectOnVector(a: Vector3, p: Vector3, out: Vector3): void {
    const n_p = p.clone();
    Vector3.normalize(n_p, n_p);
    const cosine = Vector3.dot(a, n_p);
    out.x = n_p.x * cosine;
    out.y = n_p.y * cosine;
    out.z = n_p.z * cosine;
  }

  /**
   * 将向量 a 投影到和法向量 n 正交的平面上。
   * @param a - 输入向量
   * @param n - 法向量
   * @param out - 投影到平面上的向量
   */
  _projectOnPlane(a: Vector3, n: Vector3, out: Vector3) {
    this._projectOnVector(a, n, _tempVector3);
    Vector3.subtract(a, _tempVector3, out);
  }
}