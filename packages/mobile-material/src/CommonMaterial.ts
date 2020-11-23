import { vec4 } from "@alipay/o3-math";
import { DataType } from "@alipay/o3-base";
import { Texture2D } from "@alipay/o3-material";
import { Material, RenderTechnique } from "@alipay/o3-material";
import { TechniqueStates } from "@alipay/o3-material/types/type";

import VertexShader from "./shader/Vertex.glsl";
import { LightFeature } from "@alipay/o3-lighting";

/**
 * 材质的通用参数管理，其他常用材质的基类
 * @class
 */
export abstract class CommonMaterial extends Material {
  private _ambientLightCount: number;
  public renderStates: TechniqueStates = {
    enable: [],
    disable: [],
    functions: {}
  };

  protected abstract _generateTechnique();

  constructor(name: string) {
    super(name);

    this.emission = vec4.fromValues(0, 0, 0, 1);

    this.ambient = vec4.fromValues(0, 0, 0, 1);

    /**
     * Technique 渲染状态控制
     * @member {object}
     */
    this.renderStates = {};
  }

  /**
   * 自发光属性
   * @member {vec4|Texture2D}
   */
  get emission() {
    return this.getValue("u_emission");
  }

  set emission(val) {
    this.setValue("u_emission", val);
  }

  /**
   * 环境光反射属性
   * @member {vec4|Texture2D}
   */
  get ambient() {
    return this.getValue("u_ambient");
  }

  set ambient(val) {
    this.setValue("u_ambient", val);
  }

  prepareDrawing(camera, component, primitive) {
    const lightMgr = camera.scene.findFeature(LightFeature);

    /** 光源 uniform values */
    lightMgr.bindMaterialValues(this);

    const { ambientLightCount } = lightMgr.lightSortAmount;

    if (!this._technique || this._ambientLightCount !== ambientLightCount) {
      this._ambientLightCount = ambientLightCount;
      this._generateTechnique();
      this.bindLightUniformDefine(camera);
    }
    super.prepareDrawing(camera, component, primitive);
  }

  /**
   * 绑定灯光相关 Uniform Define
   * */
  bindLightUniformDefine(camera) {
    const lightMgr = camera.scene.findFeature(LightFeature);
    this._technique.uniforms = {
      ...lightMgr.getUniformDefine(),
      ...this._technique.uniforms
    };
  }

  /**
   * 生成内部的 Technique 对象
   * @private
   */
  _internalGenerate(name, fragmentShader) {
    const customMacros = this._generateMacros();
    const uniforms = this._generateFragmentUniform();

    //--
    const tech = new RenderTechnique(name);
    tech.isValid = true;
    tech.uniforms = uniforms;
    tech.attributes = {};
    tech.states = this.renderStates;
    tech.customMacros = customMacros;
    tech.vertexShader = VertexShader;
    tech.fragmentShader = fragmentShader;

    //-- set default values
    this._technique = tech;
  }

  _generateMacros() {
    const macros = [];

    if (this.emission instanceof Texture2D) macros.push("O3_EMISSION_TEXTURE");

    if (this.ambient instanceof Texture2D) macros.push("O3_AMBIENT_TEXTURE");

    if (this._ambientLightCount) {
      macros.push("O3_HAS_AMBIENT_LIGHT");
    }
    return macros;
  }

  /**
   * 根据自身的参数类型，生成相应的 Fragment Shader 所需的 Uniform 定义
   * @private
   */
  _generateFragmentUniform() {
    const fragmentUniform = {
      u_emission: {
        name: "u_emission",
        type: DataType.FLOAT_VEC4
      },
      u_ambient: {
        name: "u_ambient",
        type: DataType.FLOAT_VEC4
      }
    };

    if (this.emission instanceof Texture2D) {
      fragmentUniform.u_emission.type = DataType.SAMPLER_2D;
    }
    if (this.ambient instanceof Texture2D) {
      fragmentUniform.u_ambient.type = DataType.SAMPLER_2D;
    }

    return fragmentUniform;
  }
}