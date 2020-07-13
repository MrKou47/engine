/**
 * 资产类型。
 */
export enum AssetType {
  /** 文本。*/
  Text = 0,
  /** JSON。*/
  JSON = 1,
  /** 缓冲。*/
  Buffer = 2,
  /** 2D纹理。*/
  Texture2D = 3,
  /** 立方纹理。*/
  TextureCube = 4,
  /** 材质。*/
  Material = 5,
  /** 网格。*/
  Mesh = 6,
  /** 动画文件。*/
  AnimationClip = 7,
  /** 预设。*/
  Perfab = 8
}