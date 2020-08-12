/**
 * 资源的类型，主要用来处理资源对象关联的GL对象的回收
 */
export enum InternalAssetType {
  /** 属于当前场景的，场景切换时，GL资源会被自动释放 */
  Scene = 1,
  /** Cache自动处理，在一段时间内没有用到，则GL资源会被释放 */
  Cache = 2
}

/**
 * Camera 的清空模式枚举
 * @readonly
 */
export enum ClearMode {
  /** 不执行任何清空背景的操作 */
  DONT_CLEAR = 0,
  /** 清空背景颜色和深度缓冲 */
  SOLID_COLOR = 1,
  /** 只清空深度缓冲 */
  DEPTH_ONLY = 2,
  /** 只清空颜色 */
  COLOR_ONLY = 3,
  /** 只清空模版缓冲*/
  STENCIL_ONLY = 4,
  /** 清空所有缓冲区 */
  ALL_CLEAR = 5
}

/**
 * 材质类型枚举
 * @readonly
 */
export enum MaterialType {
  /** 不透明 */
  OPAQUE = 1000,
  /** 透明或半透明 */
  TRANSPARENT = 2000
}

/**
 * 图元的绘制模式
 * @readonly
 */
export enum DrawMode {
  /** 绘制一系列点 */
  POINTS = 0, // gl.POINTS
  /** 绘制一系列单独线段，每两个点作为一条线段的端点。 */
  LINES = 1, // gl.LINES
  /** 绘制一系列线段，上一点连接下一点，并且最后一点与第一个点相连。  */
  LINE_LOOP = 2, // gl.LINE_LOOP
  /** 绘制一系列线段，上一点连接下一点。 */
  LINE_STRIP = 3, // gl.LINE_STRIP
  /** 绘制一系列三角形, 每三个点作为顶点。 */
  TRIANGLES = 4, // gl.TRIANGLES
  /** 绘制一个三角带。 */
  TRIANGLE_STRIP = 5, // gl.TRIANGLE_STRIP
  /** 绘制一个三角扇。 */
  TRIANGLE_FAN = 6 // gl.TRIANGLE_FAN
}

/**
 * 可以开启或者关闭的渲染状态
 * @readonly
 */
export enum RenderState {
  /** 片元的颜色融合计算 */
  BLEND = 3042,
  /** 多边形正反面剔除 */
  CULL_FACE = 2884,
  /** 深度测试 */
  DEPTH_TEST = 2929,
  /** Alpha通道测试 */
  ALPHA_TEST = 3008,
  /** 多边形片段的深度值偏移 */
  POLYGON_OFFSET_FILL = 32823,
  /** 通过alpha值决定的临时覆盖值计算。 */
  SAMPLE_ALPHA_TO_COVERAGE = 32926,
  /** 剪裁测试，即丢弃在剪裁矩形范围外的片段。 */
  SCISSOR_TEST = 3089
}

/**
 * 面朝向枚举
 * @readonly
 */
export enum FrontFace {
  /** 顺时针 */
  CW = 0x0900,
  /** 逆时针 */
  CCW = 0x0901
}

/**
 * 面剔除枚举
 * @readonly
 */
export enum CullFace {
  /** 正面 */
  FRONT = 1028,
  /** 反面 */
  BACK = 1029,
  /** 正面和反面 */
  FRONT_AND_BACK = 1032
}

/**
 * 显示面枚举
 * @readonly
 * */
export enum Side {
  /** 背面剔除，只显示正面 */
  FRONT,
  /** 正面剔除，只显示背面 */
  BACK,
  /** 光珊化前剔除，不显示任何面 */
  NONE,
  /** 关闭剔除，显示正反面 */
  DOUBLE
}

/**
 * 比较函数枚举
 * @readonly
 */
export enum CompFunc {
  /** 永不通过 */
  NEVER = 0x0200,
  /** 小于参考值时通过 */
  LESS = 0x0201,
  /** 等于参考值时通过 */
  EQUAL = 0x0202,
  /** 小于等于参考值时通过 */
  LEQUAL = 0x0203,
  /** 大于参考值时通过 */
  GREATER = 0x0204,
  /** 不等于参考值时通过 */
  NOTEQUAL = 0x0205,
  /** 大于等于参考值时通过 */
  GEQUAL = 0x0206,
  /** 总是通过 */
  ALWAYS = 0x0207
}

/**
 * 纹理过滤枚举
 * @readonly
 */
export enum TextureFilter {
  NEAREST = 9728, // gl.NEAREST
  LINEAR = 9729, // gl.LINEAR
  NEAREST_MIPMAP_NEAREST = 9984, // gl.NEAREST_MIPMAP_NEAREST
  LINEAR_MIPMAP_NEAREST = 9985, // gl.LINEAR_MIPMAP_NEAREST
  NEAREST_MIPMAP_LINEAR = 9986, // gl.NEAREST_MIPMAP_LINEAR
  LINEAR_MIPMAP_LINEAR = 9987 // gl.LINEAR_MIPMAP_LINEAR
}

/**
 * 数据类型枚举
 */
export enum DataType {
  /** 浮点数 */
  FLOAT = 5126, // gl.FLOAT
  /** 浮点型二维向量 */
  FLOAT_VEC2 = 35664, // gl.FLOAT_VEC2
  /** 浮点型三维向量 */
  FLOAT_VEC3 = 35665, // gl.FLOAT_VEC3
  /** 浮点型四维向量 */
  FLOAT_VEC4 = 35666, // gl.FLOAT_VEC4

  /** 整数 */
  INT = 5124, // gl.INT
  /** 整型二维向量 */
  INT_VEC2 = 35667, // gl.INT_VEC2
  /** 整型三维向量 */
  INT_VEC3 = 35668, // gl.INT_VEC3
  /** 整型四维向量 */
  INT_VEC4 = 35669, // gl.INT_VEC4

  /** 布尔类型 */
  BOOL = 35670, // gl.BOOL
  /** 布尔型二维向量 */
  BOOL_VEC2 = 35671, // gl.BOOL_VEC2
  /** 布尔型三维向量 */
  BOOL_VEC3 = 35672, // gl.BOOL_VEC3
  /** 布尔型四维向量 */
  BOOL_VEC4 = 35673, // gl.BOOL_VEC4

  /** 二阶矩阵 */
  FLOAT_MAT2 = 35674, // gl.FLOAT_MAT2
  /** 三阶矩阵 */
  FLOAT_MAT3 = 35675, // gl.FLOAT_MAT3
  /** 四阶矩阵 */
  FLOAT_MAT4 = 35676, // gl.FLOAT_MAT4

  /** 浮点数组 */
  FLOAT_ARRAY = 35677, // gl.FLOAT_ARRAY

  /** 2D 纹理采样 */
  SAMPLER_2D = 35678, // gl.SAMPLER_2D
  /** Cube Map 纹理采样 */
  SAMPLER_CUBE = 35680, // gl.SAMPLER_CUBE

  /** 单字节类型 */
  BYTE = 5120, // gl.BYTE
  /** 无符号的字节类型 */
  UNSIGNED_BYTE = 5121, // gl.UNSIGNED_BYTE
  /** Short 类型 */
  SHORT = 5122, // gl.SHORT
  /** 无符号的 Short 在线 */
  UNSIGNED_SHORT = 5123, // gl.UNSIGNED_SHORT
  /** 无符号整数 */
  UNSIGNED_INT = 5125 // gl.UNSIGNED_INT
}

/**
 * glTF 1.0所支持的Uniform Semantic以及Oasis3D的扩展
 * @readonly
 */
export enum UniformSemantic {
  // -- GLTF
  /** Local 矩阵 */
  LOCAL = 1,
  /** Model 矩阵 */
  MODEL = 2,
  /** View 矩阵 */
  VIEW = 3,
  /** Project 矩阵 */
  PROJECTION = 4,
  /** Model View 矩阵 */
  MODELVIEW = 5,
  /** Model View Project 矩阵 */
  MODELVIEWPROJECTION = 6,
  /** Model 矩阵的逆矩阵 */
  MODELINVERSE = 7,
  /** View 矩阵的逆矩阵 */
  VIEWINVERSE = 8,
  /** Projection 矩阵的逆矩阵 */
  PROJECTIONINVERSE = 9,
  /** Model View 矩阵的逆矩阵 */
  MODELVIEWINVERSE = 10,
  /** Model View Project 矩阵的逆矩阵 */
  MODELVIEWPROJECTIONINVERSE = 11,
  /** Model 矩阵的逆转置矩阵，可用来变换 Normal */
  MODELINVERSETRANSPOSE = 12,
  /** Model View 矩阵的逆转置矩阵 */
  MODELVIEWINVERSETRANSPOSE = 13,
  /** Viewport 参数 */
  VIEWPORT = 14,
  /** 骨骼矩阵数组 */
  JOINTMATRIX = 15,
  /** MorphTarget 权重 */
  MORPHWEIGHTS = 16,

  // --
  /** 当前的摄像机的位置 */
  EYEPOS = 17,
  /** 当前程序运行的时长 */
  TIME = 18,
  /** 骨骼矩阵纹理 */
  JOINTTEXTURE = 19,
  /** joint 个数 */
  JOINTCOUNT = 20
}

/**
 * Buffer 的使用方式枚举
 * @readonly
 */
export enum BufferUsage {
  /** Buffer 内容极少更新（一般只在初始化时更新一次） */
  STATIC_DRAW = 0x88e4,
  /** Buffer 内容只写入不读取 */
  STREAM_DRAW = 0x88e0,
  /** Buffer 内容经常更新，只写入不读取 */
  DYNAMIC_DRAW = 0x88e8
}

/**
 * 颜色混合方式枚举
 */
export enum BlendFunc {
  /** 所有通道乘以0 */
  ZERO = 0,
  /** 所有通道乘以1 */
  ONE = 1,
  /** 所有通道乘以 Source Color */
  SRC_COLOR = 768,
  /** 所有通道乘以 1 减去 Source Color */
  ONE_MINUS_SRC_COLOR = 769,
  /** 所有通道乘以 Source Alpha */
  SRC_ALPHA = 770,
  /** 所有通道乘以 1 减去 Source Alpha */
  ONE_MINUS_SRC_ALPHA = 771,
  /** 所有通道乘以 destination Alpha */
  DST_ALPHA = 772,
  /** 所有通道乘以 1 减去 destination Alpha */
  ONE_MINUS_DST_ALPHA = 773,
  /** 所有通道乘以 1 减去 destination Color */
  DST_COLOR = 774,
  /** 所有通道乘以 1 减去 destination Color */
  ONE_MINUS_DST_COLOR = 775,
  /**
   * Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1.
   */
  SRC_ALPHA_SATURATE = 776,
  /**
   * 所有通道乘以一个颜色常量
   */
  enumANT_COLOR = 32769,
  /** 所有通道乘以 1 减去颜色常量 */
  ONE_MINUS_enumANT_COLOR = 32770,
  /**
   * 所有通道乘以一个Alpha常量
   */
  enumANT_ALPHA = 32771,
  /**
   * 所有通道乘以一减去Alpha常量
   */
  ONE_MINUS_enumANT_ALPHA = 32772
}

/**
 * 更新方式枚举
 * @readonly
 */
export enum UpdateType {
  /** 不需要更新 */
  NO_UPDATE = 0,
  /** 全部更新 */
  UPDATE_ALL = 1,
  /** 更新指定范围 */
  UPDATE_RANGE = 2
}

/**
 * RenderPass 的可用 MASK
 * @readonly
 * @private
 */
export enum MaskList {
  MASK1 = 0b1,
  MASK2 = 0b10,
  MASK3 = 0b100,
  MASK4 = 0b1000,
  MASK5 = 0b10000,
  MASK6 = 0b100000,
  MASK7 = 0b1000000,
  MASK8 = 0b10000000,
  MASK9 = 0b100000000,
  MASK10 = 0b1000000000,
  MASK11 = 0b10000000000,
  MASK12 = 0b100000000000,
  MASK13 = 0b1000000000000,
  MASK14 = 0b10000000000000,
  MASK15 = 0b100000000000000,
  MASK16 = 0b1000000000000000,
  MASK17 = 0b10000000000000000,
  MASK18 = 0b100000000000000000,
  MASK19 = 0b1000000000000000000,
  MASK20 = 0b10000000000000000000,
  // MASK21=        0b100000000000000000000,  // 预留
  // MASK22=        0b1000000000000000000000,
  // MASK23=        0b10000000000000000000000,
  // MASK24=        0b100000000000000000000000,
  // MASK25=        0b1000000000000000000000000,
  // MASK26=        0b10000000000000000000000000,
  // MASK27=        0b100000000000000000000000000,
  EVERYTHING = 0b1111111111111111111111111111,
  SHADOW = 0b10000000000000000000000000000,
  SHADOW_MAP = 0b100000000000000000000000000000
}

/**
 * 探针渲染速率
 * */
export enum RefreshRate {
  /** 只渲染一次 */
  ONCE = 1,
  /** 每帧渲染 */
  EVERYFRAME = 2
}

/**
 * 相交信息
 * */
export enum IntersectInfo {
  /** 分离 */
  EXCLUDE,
  /** 交叉 */
  INTERSECT,
  /** 包含 */
  INCLUDE
}

/**
 * 包围物类型
 * */
export enum BoundingType {
  /** 轴对齐包围盒 */
  AABB,
  /** 方向包围盒 */
  OBB,
  /** 包围球 */
  SPHERE
}

/**
 * GL 层能力
 * 有些能力可以靠 extension 来抹平，有些能力必须支持 WebGL 2.0
 * */
export enum GLCapabilityType {
  standardDerivatives = "OES_standard_derivatives",
  shaderTextureLod = "EXT_shader_texture_lod",
  elementIndexUint = "OES_element_index_uint",
  depthTexture = "WEBGL_depth_texture",
  drawBuffers = "WEBGL_draw_buffers",
  vertexArrayObject = "OES_vertex_array_object",
  instancedArrays = "ANGLE_instanced_arrays",
  multipleSample = "multipleSampleOnlySupportedInWebGL2",
  textureFloat = "OES_texture_float",
  textureHalfFloat = "OES_texture_half_float",
  WEBGL_colorBufferFloat = "WEBGL_color_buffer_float",
  colorBufferFloat = "EXT_color_buffer_float",
  colorBufferHalfFloat = "EXT_color_buffer_half_float",
  textureFilterAnisotropic = "EXT_texture_filter_anisotropic",

  astc = "WEBGL_compressed_texture_astc",
  astc_webkit = "WEBKIT_WEBGL_compressed_texture_astc",
  etc = "WEBGL_compressed_texture_etc",
  etc_webkit = "WEBKIT_WEBGL_compressed_texture_etc",
  etc1 = "WEBGL_compressed_texture_etc1",
  etc1_webkit = "WEBKIT_WEBGL_compressed_texture_etc1",
  pvrtc = "WEBGL_compressed_texture_pvrtc",
  pvrtc_webkit = "WEBKIT_WEBGL_compressed_texture_pvrtc",
  s3tc = "WEBGL_compressed_texture_s3tc",
  s3tc_webkit = "WEBKIT_WEBGL_compressed_texture_s3tc"
  // atc = "WEBGL_compressed_texture_atc",
  // s3tc_srgb = "WEBGL_compressed_texture_s3tc_srgb"
}

/**
 * @deprecated
 */
export enum GLCompressedTextureInternalFormat {
  // astc
  RGBA_ASTC_4X4_KHR = 0x93b0,
  RGBA_ASTC_5X4_KHR = 0x93b1,
  RGBA_ASTC_5X5_KHR = 0x93b2,
  RGBA_ASTC_6X5_KHR = 0x93b3,
  RGBA_ASTC_6X6_KHR = 0x93b4,
  RGBA_ASTC_8X5_KHR = 0x93b5,
  RGBA_ASTC_8X6_KHR = 0x93b6,
  RGBA_ASTC_8X8_KHR = 0x93b7,
  RGBA_ASTC_10X5_KHR = 0x93b8,
  RGBA_ASTC_10X6_KHR = 0x93b9,
  RGBA_ASTC_10X8_KHR = 0x93ba,
  RGBA_ASTC_10X10_KHR = 0x93bb,
  RGBA_ASTC_12X10_KHR = 0x93bc,
  RGBA_ASTC_12X12_KHR = 0x93bd,
  SRGB8_ALPHA8_ASTC_4X4_KHR = 0x93d0,
  SRGB8_ALPHA8_ASTC_5X4_KHR = 0x93d1,
  SRGB8_ALPHA8_ASTC_5X5_KHR = 0x93d2,
  SRGB8_ALPHA8_ASTC_6X5_KHR = 0x93d3,
  SRGB8_ALPHA8_ASTC_6X6_KHR = 0x93d4,
  SRGB8_ALPHA8_ASTC_8X5_KHR = 0x93d5,
  SRGB8_ALPHA8_ASTC_8X6_KHR = 0x93d6,
  SRGB8_ALPHA8_ASTC_8X8_KHR = 0x93d7,
  SRGB8_ALPHA8_ASTC_10X5_KHR = 0x93d8,
  SRGB8_ALPHA8_ASTC_10X6_KHR = 0x93d9,
  SRGB8_ALPHA8_ASTC_10X8_KHR = 0x93da,
  SRGB8_ALPHA8_ASTC_10X10_KHR = 0x93db,
  SRGB8_ALPHA8_ASTC_12X10_KHR = 0x93dc,
  SRGB8_ALPHA8_ASTC_12X12_KHR = 0x93dd,

  // etc1
  RGB_ETC1_WEBGL = 0x8d64,

  // etc2
  R11_EAC = 0x9270,
  SIGNED_R11_EAC = 0x9271,
  RG11_EAC = 0x9272,
  SIGNED_RG11_EAC = 0x9273,
  RGB8_ETC2 = 0x9274,
  SRGB8_ETC2 = 0x9275,
  RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9276,
  SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9277,
  RGBA8_ETC2_EAC = 0x9278,
  SRGB8_ALPHA8_ETC2_EAC = 0x9279,

  // pvrtc
  RGB_PVRTC_4BPPV1_IMG = 0x8c00,
  RGB_PVRTC_2BPPV1_IMG = 0x8c01,
  RGBA_PVRTC_4BPPV1_IMG = 0x8c02,
  RGBA_PVRTC_2BPPV1_IMG = 0x8c03,

  // s3tc
  RGB_S3TC_DXT1_EXT = 0x83f0,
  RGBA_S3TC_DXT1_EXT = 0x83f1,
  RGBA_S3TC_DXT3_EXT = 0x83f2,
  RGBA_S3TC_DXT5_EXT = 0x83f3
}

/**
 * OIT 模式
 * */
export enum OITMode {
  /** 加权平均算法，性能较高 */
  WEIGHTED_AVERAGE,
  /** 深度剥离算法，性能较低，但精确度高 */
  DEPTH_PEEL,
  /** 双层深度剥离，性能更好，强依赖 MRT */
  DUAL_DEPTH_PEEL
}

/**
 * 纹理的循环模式。
 */
export enum TextureWrapMode {
  /** 截取模式，超过纹理边界使用边缘像素的颜色。 */
  Clamp = 0,
  /** 重复模式，超过纹理边界会循环平铺。*/
  Repeat = 1,
  /** 镜像重复模式，超过纹理边界会镜像循环平铺。*/
  Mirror = 2
}

/**
 * 纹理的过滤模式。
 */
export enum TextureFilterMode {
  /** 点过滤。*/
  Point = 0,
  /** 双线性过滤。*/
  Bilinear = 1,
  /** 三线性过滤。*/
  Trilinear = 2
}

/**
 * 纹理格式枚举。
 */
export enum TextureFormat {
  /** RGB格式，每通道8 bits。*/
  R8G8B8 = 0,
  /** RGBA格式，每通道8 bits。*/
  R8G8B8A8 = 1,
  /** RGB格式,R通道5 bits，G通道6 bits，B通道5 bits。*/
  R5G6B5 = 2,
  /** 透明格式，8 bits。*/
  Alpha8 = 3,
  /** RGBA格式，每个通道32 bits。*/
  R32G32B32A32 = 4,
  /** RGB压缩格式的压缩格式。*/
  DXT1 = 5,
  /** RGBA压缩格式的压缩格式。*/
  DXT5 = 6,
  /** RGB压缩格式，4 bits每像素。*/
  ETC1_RGB = 7,
  /** RGB压缩格式，4 bits每像素。*/
  ETC2_RGB = 8,
  /** RGBA压缩格式，5 bits每像素,RGB 4 bit,Alpha 1 bit。*/
  ETC2_RGBA5 = 9,
  /** RGB压缩格式，8 bits每像素。*/
  ETC2_RGBA8 = 10,
  /** RGB压缩格式，2 bits每像素。*/
  PVRTC_RGB2 = 11,
  /** RGBA压缩格式，2 bits每像素。*/
  PVRTC_RGBA2 = 12,
  /** RGB压缩格式，4 bits每像素。*/
  PVRTC_RGB4 = 13,
  /** RGBA压缩格式，4 bits每像素。*/
  PVRTC_RGBA4 = 14,
  /** RGB(A)压缩格式，128 bits 每4x4像素块。*/
  ASTC_4x4 = 15,
  /** RGB(A)压缩格式，128 bits 每5x5像素块。*/
  ASTC_5x5 = 16,
  /** RGB(A)压缩格式，128 bits 每6x6像素块。*/
  ASTC_6x6 = 17,
  /** RGB(A)压缩格式，128 bits 每8x8像素块。*/
  ASTC_8x8 = 18,
  /** RGB(A)压缩格式，128 bits 每10x10像素块。*/
  ASTC_10x10 = 19,
  /** RGB(A)压缩格式，128 bits 每12x12像素块。*/
  ASTC_12x12 = 20
}

/**
 * 立方体纹理面。
 */
export enum TextureCubeFace {
  /** X轴正方向。 */
  PositiveX = 0,
  /** X轴负方向。 */
  NegativeX = 1,
  /** Y轴正方向。 */
  PositiveY = 2,
  /** Y轴负方向。 */
  NegativeY = 3,
  /** Z轴正方向。 */
  PositiveZ = 4,
  /** Z轴负方向。 */
  NegativeZ = 5
}

/**
 * 渲染缓冲颜色格式枚举。
 */
export enum RenderBufferColorFormat {
  /** RGB格式，每通道8 bits。*/
  R8G8B8 = 0,
  /** RGBA格式，每通道8 bits。*/
  R8G8B8A8 = 1,
  /** 透明格式，8 bits。*/
  Alpha8 = 2,
  /** RGBA格式,每通道16 bits。*/
  R16G16B16A16 = 3,
  /** RGBA格式，每个通道32 bits。*/
  R32G32B32A32 = 4
}

/**
 * 渲染缓冲深度格式枚举。
 */
export enum RenderBufferDepthFormat {
  /** 深度缓冲，自动选择精度 */
  Depth = 0,
  /** 深度模版缓冲，自动选择精度 */
  DepthStencil = 1,
  /** 模板缓冲 */
  Stencil = 2,

  /** 强制16位深度缓冲 */
  Depth16 = 3,
  /** 强制24位深度缓冲 */
  Depth24 = 4,
  /** 强制32位深度缓冲 */
  Depth32 = 5,
  /** 强制24位深度缓冲+8位模版缓冲 */
  Depth24Stencil8 = 6,
  /** 强制32位深度缓冲+8位模版缓冲 */
  Depth32Stencil8 = 7
}