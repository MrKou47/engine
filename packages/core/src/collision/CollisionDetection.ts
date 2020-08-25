import { Vector3 } from "@alipay/o3-math";
import { Event } from "../base/Event";
import { ABoxCollider } from "../collider/ABoxCollider";
import { Script } from "../Script";
import { intersectBox2Box, intersectSphere2Box, intersectSphere2Sphere } from "./intersect";
import { ASphereCollider } from "../collider/ASphereCollider";
import { ColliderFeature } from "../collider/ColliderFeature";
import { ACollider } from "../collider";

/**
 * 检测当前 Entity 上的 Collider 与场景中其他 Collider 的碰撞
 * 发出事件：collision
 */
export class CollisionDetection extends Script {
  private static _tempVec3: Vector3 = new Vector3();

  private _colliderManager;
  private _myCollider;
  private _overlopCollider;
  private _sphere;
  private _box;

  /**
   * 构造函数
   * @param {Entity} entity 对象所在节点
   */
  constructor(entity) {
    super(entity);

    this._colliderManager = null;
    this._myCollider = null;
    this._overlopCollider = null;

    // this.addEventListener("start", this._onStart);
  }

  /**
   * 和当前 Entity 上的 Collider 相交的 Collider 对象
   */
  get overlopCollider() {
    return this._overlopCollider;
  }

  /**
   * 每帧更新时，计算与其他 collider 的碰撞
   */
  onUpdate(deltaTime) {
    super.onUpdate(deltaTime);

    let overlopCollider = null;

    if (this._colliderManager && this._myCollider) {
      const colliders = this._colliderManager.colliders;

      if (this._myCollider instanceof ABoxCollider) {
        this._box = this._getWorldBox(this._myCollider);
        for (let i = 0, len = colliders.length; i < len; i++) {
          const collider = colliders[i];
          if (collider != this._myCollider && this._boxCollision(collider)) {
            overlopCollider = collider;
            this.trigger(new Event("collision", this, { collider }));
          }
        } // end of for
      } else if (this._myCollider instanceof ASphereCollider) {
        this._sphere = this._getWorldSphere(this._myCollider);
        for (let i = 0, len = colliders.length; i < len; i++) {
          const collider = colliders[i];
          if (collider != this._myCollider && this._sphereCollision(collider)) {
            overlopCollider = collider;
            this.trigger(new Event("collision", this, { collider }));
          }
        } // end of for
      }
    } // end of if

    //-- overlop events
    if (overlopCollider != null && this._overlopCollider != overlopCollider) {
      this.trigger(new Event("begin_overlop", this, { collider: overlopCollider }));
    }

    if (this._overlopCollider != null && this._overlopCollider != overlopCollider) {
      const e = this._overlopCollider;
      this.trigger(new Event("end_overlop", this, { collider: e }));
    }

    this._overlopCollider = overlopCollider;
  }

  /**
   * 获得世界空间中的 Box 坐标
   * @param boxCollider
   */
  _getWorldBox(boxCollider) {
    const mat = boxCollider.entity.transform.worldMatrix;
    const max: Vector3 = new Vector3();
    const min: Vector3 = new Vector3();
    Vector3.transformCoordinate(boxCollider.boxMax, mat, max);
    Vector3.transformCoordinate(boxCollider.boxMin, mat, min);

    //--
    const temp: Vector3 = CollisionDetection._tempVec3;
    const corners = boxCollider.getCorners();
    for (let i = 0; i < 8; i++) {
      Vector3.transformCoordinate(corners[i], mat, temp);
      if (temp.x > max.x) max.x = temp.x;
      if (temp.y > max.y) max.y = temp.y;
      if (temp.z > max.z) max.z = temp.z;
      if (temp.x < min.x) min.x = temp.x;
      if (temp.y < min.y) min.y = temp.y;
      if (temp.z < min.z) min.z = temp.z;
    }

    return {
      min,
      max
    };
  }

  /**
   * 获得世界空间中的 Sphere 坐标
   * @param {SphereCollider} sphereCollider
   */
  _getWorldSphere(sphereCollider) {
    const center: Vector3 = new Vector3();
    Vector3.transformCoordinate(sphereCollider.center, sphereCollider.entity.transform.worldMatrix, center);
    return {
      radius: sphereCollider.radius,
      center
    };
  }

  /**
   * 自身的 Collider 与另一个 Collider 做碰撞检测
   * @param {ABoxCollider|ASphereCollider} other
   */
  _boxCollision(other) {
    if (other instanceof ABoxCollider) {
      const box = this._getWorldBox(other);
      return intersectBox2Box(box, this._box);
    } else if (other instanceof ASphereCollider) {
      const sphere = this._getWorldSphere(other);
      return intersectSphere2Box(sphere, this._box);
    }
    return false;
  }

  /**
   * 自身的 Collider 与另一个 Collider 做碰撞检测
   * @param {ABoxCollider|ASphereCollider} other
   */
  _sphereCollision(other) {
    if (other instanceof ABoxCollider) {
      const box = this._getWorldBox(other);
      return intersectSphere2Box(this._sphere, box);
    } else if (other instanceof ASphereCollider) {
      const sphere = this._getWorldSphere(other);
      return intersectSphere2Sphere(sphere, this._sphere);
    }
    return false;
  }

  /**
   * 在 start 事件时，查找其他组件并记录下来
   */
  _onAwake() {
    this._colliderManager = this.scene.findFeature(ColliderFeature);
    this._myCollider = this.entity.getComponent(ACollider);
  }
}