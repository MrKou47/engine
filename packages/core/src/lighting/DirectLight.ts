import { Vector3 } from "@alipay/o3-math";
import { DataType } from "../base/Constant";

import { Light } from "./Light";

/**
 * 方向光创建类
 * @extends Light
 */
export class DirectLight extends Light {
  private _forward: Vector3 = new Vector3();
  private _lightColor: Vector3;
  private _reverseDirection: Vector3;
  public color: Vector3;
  public intensity: number;

  /**
   * @constructor
   * @param {Entity} entity 节点对象
   * @param {Object} props 参数对象
   * @param {string} [props.name = directLight] 名称
   * @param {Vector3} [ props.color = vec3.fromValues(1, 1, 1)]颜色，默认 vec3.fromValues(1, 1, 1)
   * @param {number} [props.intensity = 1] 光照强度
   * @param {Vector3} [props.direction] 光照方向，默认节点forward方向
   */
  constructor(entity, props) {
    super(entity);
    this.name = props.name || "directLight";

    /**
     * 颜色
     * @member {Vector3}
     */
    this.color = props.color || new Vector3(1, 1, 1);

    /**
     * 光照强度
     * @member {number}
     */
    this.intensity = props.intensity || 1.0;

    this._lightColor = new Vector3();
    this._reverseDirection = new Vector3();
  }

  /** 获取方向光方向
   * @return {Vector3} 方向向量
   * @readonly
   */
  get direction(): Vector3 {
    this.entity.transform.getWorldForward(this._forward);
    return this._forward;
  }

  /** 获取方向光最终颜色
   * @return {Vector3} 颜色
   * @readonly
   */
  get lightColor(): Vector3 {
    Vector3.scale(this.color, this.intensity, this._lightColor);
    return this._lightColor;
  }

  /** 方向光方向的反方向
   * @return {Vector3} 方向向量
   * @readonly
   */
  get reverseDirection(): Vector3 {
    Vector3.scale(this.direction, -1, this._reverseDirection);
    return this._reverseDirection;
  }

  /**
   * 生成 Technique 所需的 uniform 定义
   * @param {string} uniformName
   */
  static getUniformDefine(uniformName) {
    /**
     *   struct DirectLight {
     *    vec3 color;
     *    float intensity;
     *    vec3 direction;
     *    };
     */
    const uniforms = {};

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

    uniforms[uniformName + ".direction"] = {
      name: uniformName + ".direction",
      type: DataType.FLOAT_VEC3
    };

    return uniforms;
  }

  /**
   * 将灯光参数值提交到材质对象
   */
  bindMaterialValues(mtl, uniformName) {
    mtl.setValue(uniformName + ".color", this.color);
    mtl.setValue(uniformName + ".lightColor", this.lightColor);
    mtl.setValue(uniformName + ".intensity", this.intensity);
    mtl.setValue(uniformName + ".direction", this.direction);
  }
}