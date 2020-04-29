import { Engine } from '@alipay/o3-core';
import { ADefaultCamera } from '@alipay/o3-default-camera';
import { AGeometryRenderer } from '@alipay/o3-geometry';
import '@alipay/o3-engine-stats';
import createCubeGeometry from './geometry';
import { createCubeMaterial } from './geometryMaterial';
import ARotation from '../common/ARotation';
import { ResourceLoader } from '@alipay/o3-loader';
import { UpdateType } from '@alipay/o3-base';
import AGeometryScale from './AGeometryScale.js';

// 创建引擎、获取场景根节点
const engine = new Engine();
const scene = engine.currentScene;
const rootNode = scene.root;

const resourceLoader = new ResourceLoader(engine);

// 在场景中创建相机节点、配置位置和目标方向
const cameraNode = rootNode.createChild('camera_node');
let camera = cameraNode.createAbility(ADefaultCamera, {
  canvas: 'o3-demo', position: [0, 10, 40], target: [0, 0, 0]
});
// 在场景中创建 cube 节点
const cube = rootNode.createChild("cube");
// 在 cube 节点上绑定自动旋转功能
cube.createAbility(ARotation);
// 在 cube 节点上绑定几何体渲染器功能、引用几何体资源对象、添加材质对象
const cubeRenderer = cube.createAbility(AGeometryRenderer);
const geometry = createCubeGeometry(3);
cubeRenderer.geometry = geometry;
const material = createCubeMaterial(resourceLoader);
cubeRenderer.setMaterial(material);
cube.createAbility(AGeometryScale, { geometry });


// 启动引擎
engine.run();