import { vec3 } from "@alipay/o3-math";
import { DataType } from "@alipay/o3-base";
import { Light } from "./Light";

/**
 * 点光源创建类
 * @extends Light
 */
export class PointLight extends Light {
  public color;
  public intensity;
  public distance;
  public decay;
  private _lightColor;
  /**
   * @constructor
   * @param {Node} node 节点对象
   * @param {Object} props 参数对象
   * @param {string} [props.name = pointLight] 名称
   * @param {Vec3} [props.color = vec3.fromValues(1, 1, 1)] 颜色
   * @param {number} [props.intensity=1] 光照强度
   * @param {number} [props.distance=0] 辐射距离
   * @param {number} [props.decay=0] 衰减系数
   */
  constructor(node, props) {
    super(node, props);
    this.name = props.name || "pointLight";

    /**
     * 颜色
     * @member {Vec3}
     */
    this.color = props.color || vec3.fromValues(1, 1, 1);

    /**
     * 光照强度
     * @member {number}
     */
    this.intensity = props.intensity || 1.0;

    /**
     * 辐射距离
     *  @member {number}
     */
    this.distance = props.distance !== undefined ? props.distance : 0;

    /**
     * 衰减系数
     * @member {number}
     */
    this.decay = props.decay !== undefined ? props.decay : 0;

    this._lightColor = vec3.create();
  }

  /** 获取点光源位置
   * @return {vec3} 位置坐标
   * @readonly
   */
  get position() {
    return this.node.worldPosition;
  }

  /** 获取点光源最终颜色
   * @return {vec3} 光源最终颜色
   * @readonly
   */
  get lightColor() {
    vec3.scale(this._lightColor, this.color, this.intensity);
    return this._lightColor;
  }

  /**
   * 生成 Technique 所需的 uniform 定义
   * @param {string} uniformName
   */
  static getUniformDefine(uniformName) {
    /**
      struct PointLight {
        vec3 position;
        vec3 color;
        float intensity;
        float distance;
        float decay;
      };
     */
    const uniforms = {};

    uniforms[uniformName + ".position"] = {
      name: uniformName + ".position",
      type: DataType.FLOAT_VEC3
    };

    uniforms[uniformName + ".color"] = {
      name: uniformName + ".color",
      type: DataType.FLOAT_VEC3
    };

    uniforms[uniformName + ".lightColor"] = {
      name: uniformName + ".lightColor",
      type: DataType.FLOAT_VEC3
    };

    uniforms[uniformName + ".intensity"] = {
      name: uniformName + ".intensity",
      type: DataType.FLOAT
    };

    uniforms[uniformName + ".distance"] = {
      name: uniformName + ".distance",
      type: DataType.FLOAT
    };

    uniforms[uniformName + ".decay"] = {
      name: uniformName + ".decay",
      type: DataType.FLOAT
    };

    return uniforms;
  }

  /**
   * 将灯光参数值提交到材质对象
   */
  bindMaterialValues(mtl, uniformName) {
    mtl.setValue(uniformName + ".position", this.position);
    mtl.setValue(uniformName + ".color", this.color);
    mtl.setValue(uniformName + ".lightColor", this.lightColor);
    mtl.setValue(uniformName + ".intensity", this.intensity);
    mtl.setValue(uniformName + ".distance", this.distance);
    mtl.setValue(uniformName + ".decay", this.decay);
  }
}