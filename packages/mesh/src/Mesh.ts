import { AssetObject } from "@alipay/o3-core";
import { Primitive } from "@alipay/o3-primitive";

let meshID = 0;

/**
 * Mesh Asset Object
 * @class
 */
export class Mesh extends AssetObject {
  public primitives: Primitive[];
  public weights: number[];

  /**
   * 构造函数
   * @param {string} name 名称
   */
  constructor(name?: string) {
    super(name || "DEFAULT_MESH_NAME_" + meshID++);

    /** @member {Array} */
    this.primitives = []; // Primitive array
  }

  updatePrimitiveWeightsIndices(weightsIndices: number[]) {
    this.primitives.forEach(primitive => {
      primitive.updateWeightsIndices(weightsIndices);
    });
  }
}