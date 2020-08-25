import { Matrix } from "@alipay/o3-math";
import { MeshRenderer } from "./MeshRenderer";
import { Mesh } from "./Mesh";
import { Skin } from "./Skin";
import { Entity } from "../Entity";
import { Texture2D } from "../material/Texture2D";
import { TextureFormat } from "../base/Constant";

/**
 * 负责渲染一个 Skinned Mesh 的组件
 * @extends MeshRenderer
 */
export class SkinnedMeshRenderer extends MeshRenderer {
  private _hasInitJoints: boolean = false;

  public matrixPalette: Float32Array;
  public jointNodes: Entity[];
  public jointTexture: Texture2D;

  private _mat: Matrix;
  private _weights: number[];
  private weightsIndices: number[] = [];
  private _skin: Skin;
  /** 当超过设备最大骨骼数时，自动使用骨骼纹理技术，该技术能提高骨骼上限，但是性能会下降 */
  private _useJointTexture: boolean = false;

  /**
   * constructor
   * @param entity
   * @param props
   */
  constructor(entity: Entity, props: { mesh?: Mesh; skin?: Skin; weights?: number[]; rootNodes?: Entity[] } = {}) {
    super(entity, props);
    this._mat = new Matrix();
    this._weights = null;
    this._skin = null;

    this.skin = props.skin;
    this.setWeights(props.mesh?.weights);
  }

  /**
   * set morph target weights
   * @param {Number|Vec} weights 权重参数
   */
  setWeights(weights: number[]) {
    this._weights = weights;
    if (!weights) {
      return;
    }
    const len = weights.length;
    for (let i = 0; i < len; i++) {
      this.weightsIndices[i] = i;
    }

    const weightsIndices = this.weightsIndices;

    // 冒泡排序，对 weights 进行大小排序，weightsIndices 根据 weights 顺序而调换顺序
    for (let i = 0; i < len - 1; i++) {
      for (let j = i + 1; j < len; j++) {
        if (weights[j] > weights[i]) {
          let t = weights[i];
          weights[i] = weights[j];
          weights[j] = t;
          t = weightsIndices[i];
          weightsIndices[i] = weightsIndices[j];
          weightsIndices[j] = t;
        }
      }
    }
    this.mesh.updatePrimitiveWeightsIndices(weightsIndices);
  }

  /**
   * 当前绑定的 Skin 对象
   */
  get skin() {
    return this._skin;
  }

  /**
   * 绑定 Skin 对象
   */
  set skin(skin) {
    this._skin = skin;
    // this._started = false; // force onStart callback
  }

  get weights() {
    return this._weights;
  }

  _initJoints() {
    if (!this._skin) return;
    const skin = this._skin;
    //-- init

    const joints = skin.joints;
    const jointNodes = [];
    for (let i = joints.length - 1; i >= 0; i--) {
      jointNodes[i] = this.findByNodeName(this.entity, joints[i]);
    } // end of for
    this.matrixPalette = new Float32Array(jointNodes.length * 16);
    this.jointNodes = jointNodes;

    /** 是否使用骨骼纹理 */
    const rhi = this.entity.engine._hardwareRenderer;
    if (!rhi) return;
    const maxAttribUniformVec4 = rhi.renderStates.getParameter(rhi.gl.MAX_VERTEX_UNIFORM_VECTORS);
    const maxJoints = Math.floor((maxAttribUniformVec4 - 16) / 4);

    if (joints.length > maxJoints && rhi.canIUseMoreJoints) {
      this._useJointTexture = true;
    }
  }

  private findByNodeName(entity: Entity, nodeName: string) {
    if (!entity) return null;

    const n = entity.findByName(nodeName);

    if (n) return n;

    return this.findByNodeName(entity.parent, nodeName);
  }

  /**
   * 在SceneGraph的树形结构中中向上查找
   * @param {SceneNode} entity
   * @param {string} nodeName
   * @private
   */
  _findParent(entity: Entity, nodeName: string) {
    if (entity) {
      const parent = entity.parent;
      if (!parent) return null;
      if (parent.name === nodeName) return parent;

      const brother = parent.findByName(nodeName);
      if (brother) return brother;

      return this._findParent(parent, nodeName);
    }
    return null;
  }

  /**
   * TODO 渲染之前
   * update matrix palette
   * @private
   */
  update() {
    if (!this._hasInitJoints) {
      this._initJoints();
      this._hasInitJoints = true;
    }
    if (this._skin) {
      const joints = this.jointNodes;
      const ibms = this._skin.inverseBindMatrices;
      const matrixPalette = this.matrixPalette;
      const worldToLocal = this.entity.getInvModelMatrix();

      const mat = this._mat;
      for (let i = joints.length - 1; i >= 0; i--) {
        mat.identity();
        if (joints[i]) {
          Matrix.multiply(joints[i].transform.worldMatrix, ibms[i], mat);
        } else {
          ibms[i].cloneTo(mat);
        }
        Matrix.multiply(worldToLocal, mat, mat);
        matrixPalette.set(mat.elements, i * 16);
      } // end of for
      if (this._useJointTexture) {
        this.createJointTexture();
      }
    }
  }

  /**
   * 生成骨骼纹理，将 matrixPalette 存储到 u_jointSampler 中
   * 格式：(4 * RGBA) * jointCont
   * */
  createJointTexture() {
    if (!this.jointTexture) {
      const rhi = this.entity.engine._hardwareRenderer;
      if (!rhi) return;
      this.jointTexture = new (Texture2D as any)(rhi, 4, this.jointNodes.length, TextureFormat.R32G32B32A32, false);
    }
    this.jointTexture.setPixelBuffer(this.matrixPalette);
  }
}