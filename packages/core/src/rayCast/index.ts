import { Ray } from "./Ray";
import { Vector3, Matrix } from "@alipay/o3-math";
import { RaycastHit } from "./RaycastHit";
import { MaskList } from "../base/Constant";
import { Scene } from "../Scene";
import { ColliderFeature } from "../collider/ColliderFeature";
import { ABoxCollider } from "../collider/ABoxCollider";
import { ASphereCollider } from "../collider/ASphereCollider";
import { PlaneCollider } from "../collider/PlaneCollider";

/**
 * 对场景中所有 Collider 进行射线检测，返回离射线起点最近的一个
 * @param {Ray} _ray 使用的射线，对于点击拾取，这个设想可以调用 CameraComponent.screenPointToRay() 方法获得
 * @param {Vector3} _outPos 射线和碰撞体的交点
 * @return {ACollider} 射线检测结果
 */
(Scene.prototype as any).raycast = function (_ray, _outPos: Vector3, tag: MaskList = MaskList.EVERYTHING) {
  const ray = new Ray(_ray.origin, _ray.direction);
  const cf = this.findFeature(ColliderFeature);
  const colliders = cf.colliders;

  let nearestHit = new RaycastHit();

  for (let i = 0, len = colliders.length; i < len; i++) {
    const collider = colliders[i];
    if (!collider.entity.isActiveInHierarchy) {
      continue;
    }

    if (!(collider.tag & tag)) {
      continue;
    }
    const hit = new RaycastHit();
    if (collider.raycast(ray, hit)) {
      if (hit.distance < nearestHit.distance) {
        nearestHit = hit;
      }
    }
  } // end of for

  if (_outPos && nearestHit.collider) {
    nearestHit.point.cloneTo(_outPos);
  }

  return nearestHit.collider;
};

/**
 * 执行射线检测
 * @param {Ray} ray
 * @param {RaycastHit} hit
 */
(ABoxCollider.prototype as any).raycast = function (ray, hit) {
  const localRay = _getLocalRay(this, ray);
  const intersect = localRay.intersectAABB(this.boxMax, this.boxMin);
  if (intersect) {
    _updateHitResult(this, localRay, intersect, hit, ray.origin);
    return true;
  } else {
    return false;
  } // end of else
};

(ASphereCollider.prototype as any).raycast = function (ray, hit) {
  const localRay = _getLocalRay(this, ray);
  const intersect = localRay.intersectSphere(this.center, this.radius);
  if (intersect) {
    _updateHitResult(this, localRay, intersect, hit, ray.origin);
    return true;
  } else {
    return false;
  } // end of else
};

(PlaneCollider.prototype as any).raycast = function (ray, hit) {
  const localRay = _getLocalRay(this, ray);
  const intersect = localRay.intersectPlane(this.planePoint, this.normal);
  if (intersect) {
    _updateHitResult(this, localRay, intersect, hit, ray.origin);
    return true;
  } else {
    return false;
  } // end of else
};

/**
 * 计算世界坐标系中的碰撞点
 * @param {Ray} ray
 * @param {number} distance
 * @param {RaycastHit} outHit
 * @private
 */
function _updateHitResult(collider, ray: Ray, distance: number, outHit: RaycastHit, origin: Vector3) {
  const hitPos = ray.getPoint(distance);
  Vector3.transformCoordinate(hitPos, collider.entity.transform.worldMatrix, hitPos);

  outHit.distance = Vector3.distance(origin, hitPos);
  outHit.collider = collider;
  outHit.point = hitPos;
}

/**
 * transform ray to local space
 * @param {Ray} ray
 * @private
 */

function _getLocalRay(collider, ray) {
  const worldToLocal = collider.entity.getInvModelMatrix();

  // o = worldToLocal * vec4(ray.origin, 1)
  const o = new Vector3();
  Vector3.transformCoordinate(ray.origin, worldToLocal, o);

  // d = worldToLocal * vec4(ray.direction, 0)
  const d = new Vector3();
  _transformDirection(d, ray.direction, worldToLocal);

  return new Ray(o, d);
}

// a: vec3
// m: mat4
// return m * vec3(a, 0)
function _transformDirection(out: Vector3, a: Vector3, m: Matrix) {
  const x = a.x;
  const y = a.y;
  const z = a.z;
  const e = m.elements;
  out.x = x * e[0] + y * e[4] + z * e[8];
  out.y = x * e[1] + y * e[5] + z * e[9];
  out.z = x * e[2] + y * e[6] + z * e[10];
  return out;
}