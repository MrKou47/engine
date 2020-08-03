import { ACamera } from "@alipay/o3-core";
import { ClearMode } from "@alipay/o3-base";
import { GLRenderHardware } from "@alipay/o3-rhi-webgl";
import { BasicSceneRenderer } from "@alipay/o3-renderer-basic";
import { ICameraProps, RHIOption } from "@alipay/o3-core/types/type";

/**
 * 辅助创建默认相机，基于{@link ACamera}
 *
 * @alias ADefaultCamera
 * @constructor
 */
export class ADefaultCamera extends ACamera {
  canvas;
  private _fov: number;
  lastWidth: number;
  lastHeight: number;

  private _pixelRatio;

  /**
   * 创建一个默认相机
   * @param {Node} node 对象所在节点
   * @param {Object} props  相机配置参数，包含以下项
   * @property {Canvas|String} props.canvas 画布对象，可以是 HTML Canvas Element 或者对象的 id
   * @property {RHIOption} [props.attributes={}] - RHI 操作参数
   * @property {SceneRenderer} [props.SceneRenderer=BasicSceneRenderer] 渲染器类型，{@link BasicSceneRenderer} 和 {@link SceneRenderer}
   * @property {GLRenderHardware} [props.RHI=GLRenderHardware] 硬件抽象层类型，{@link GLRenderHardware}
   * @property {Array} [props.position=[0, 10, 20]] 相机位置
   * @property {Array} [props.target=[0, 0, 0]] 相机看向的目标点
   * @property {Array} [props.up=[0, 1, 0]] 相机上方向
   * @property {Number} [props.fov=45] 透视投影视场角
   * @property {Number} [props.near=1] 透视投影近裁剪面
   * @property {Number} [props.far=1000] 透视投影远裁剪面
   * @property {Number} [props.pixelRatio=window.devicePixelRatio] drawingBufferSize 的缩放比率
   * @property {ClearMode} [props.clearMode=ClearMode.SOLID_COLOR] 画布清除模式，详见{@link ClearMode}
   * @property {*} [props.clearParam=[0.25, 0.25, 0.25, 1]] 画布清除参数，详见{@link ClearMode}
   */
  constructor(node, props) {
    const cameraProps: ICameraProps = {
      RHI: props.RHI || GLRenderHardware,
      SceneRenderer: props.SceneRenderer || BasicSceneRenderer,
      canvas: props.canvas,
      attributes: props.attributes || {}
    };

    super(node, cameraProps);

    let canvas;
    if (typeof props.canvas === "string") {
      canvas = document.getElementById(props.canvas);
    } else {
      canvas = props.canvas;
    }
    this.canvas = canvas;

    const target = props.target || [0, 0, 0];
    const up = props.up || [0, 1, 0];
    node.position = props.position || [0, 10, 20];
    node.lookAt(target, up);

    /**
     * 透视相机视场角角度
     * @member {Number}
     */
    this._fov = props.fov || 45;
    /**
     * 透视相机近裁剪面
     * @member {Number}
     */
    this.zNear = props.near || 0.01;
    /**
     * 透视相机远裁剪面
     * @member {Number}
     */
    this.zFar = props.far || 1000;
    this.pixelRatio = props.pixelRatio || window.devicePixelRatio;

    const clearMode = props.clearMode !== undefined ? props.clearMode : ClearMode.SOLID_COLOR;
    const clearParam = props.clearParam || [0.25, 0.25, 0.25, 1];
    this.setClearMode(clearMode, clearParam);
  }

  /**
   * 像素比率
   * @type {Number}
   */
  get pixelRatio() {
    return this._pixelRatio;
  }

  set pixelRatio(v) {
    if (v && this._pixelRatio !== v) {
      this._pixelRatio = v;
      this.updateSizes();
    }
  }

  get fov() {
    return this._fov;
  }

  set fov(fov: number) {
    if (fov !== this.fov) {
      this._fov = fov;
      this.setPerspective(this.fov, this.canvas.width, this.canvas.height, this.near, this.far);
    }
  }

  /**
   * 向下兼容
   * */
  get near() {
    return this.zNear;
  }

  set near(zNear: number) {
    if (zNear !== this.near) {
      this.setPerspective(this.fov, this.canvas.width, this.canvas.height, zNear, this.far);
    }
  }

  get far() {
    return this.zFar;
  }

  set far(zFar: number) {
    if (zFar !== this.far) {
      this.setPerspective(this.fov, this.canvas.width, this.canvas.height, this.near, zFar);
    }
  }

  /**
   * 更新画布大小和透视矩阵
   * @param {Number} [pixelRatio=this.pixelRatio] 像素比率
   * @param {Number} [fov=this.fov] 视场角角度
   */
  updateSizes(pixelRatio = null, fov = null) {
    if (pixelRatio) {
      this._pixelRatio = pixelRatio;
    }
    if (fov) {
      this._fov = fov;
    }

    const width = (this.canvas.clientWidth * this.pixelRatio) | 0;
    const height = (this.canvas.clientHeight * this.pixelRatio) | 0;

    if (width !== this.lastWidth || height !== this.lastHeight) {
      this.lastWidth = width;
      this.lastHeight = height;
      this.canvas.width = width;
      this.canvas.height = height;

      this.setPerspective(this.fov, width, height, this.near, this.far);
      this.setViewport(0, 0, width, height);
      return true;
    }

    return false;
  }
}