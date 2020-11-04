/**
 * 克隆模式。
 */
export enum CloneMode {
  /** 忽略克隆。*/
  Ignore,
  /** 浅克隆,直接对字段或属性进行赋值。*/
  Shallow,
  /**
   * 深克隆,适用于 Obect、Array 和 Class 类型。
   * Class 会调用对象的 cloneTo() 实现克隆，需要对象实现 IClone 接口。
   * @remarks 如果深克隆过程遇到 ReferenceObject 则使用浅拷贝。
   */
  Deep
}