import { Engine } from '@alipay/o3-core';
import { ADefaultCamera } from '@alipay/o3-default-camera';
import { AGeometryRenderer } from '@alipay/o3-geometry';
import '@alipay/o3-engine-stats';
import createCubeGeometry from './geometry';
import createCubeMaterial from '../common/geometryMaterial';
import ARotation from '../common/ARotation';
import { ResourceLoader } from '@alipay/o3-loader';
import { SceneRenderer } from '@alipay/o3-renderer-cull';
import { AOrbitControls } from '@alipay/o3-orbit-controls';
// 创建引擎、获取场景根节点
const engine = new Engine();
const scene = engine.currentScene;
const rootNode = scene.root;

const resourceLoader = new ResourceLoader(engine);

// 在场景中创建相机节点、配置位置和目标方向
const cameraNode = rootNode.createChild('camera_node');
let camera = cameraNode.createAbility(ADefaultCamera, {
  SceneRenderer: SceneRenderer,
  canvas: 'o3-demo',
  position: [ 0, 10, 20 ],
  target: [ 0, 0, 0 ],
});

const cube1 = rootNode.createChild('cube1');
// 在 cube 节点上绑定自动旋转功能
cube1.createAbility(ARotation);
cube1.position[ 0 ] = -5;
const cubeRenderer1 = cube1.createAbility(AGeometryRenderer);
cubeRenderer1.geometry = createCubeGeometry(3);
cubeRenderer1.setMaterial(createCubeMaterial(resourceLoader));


const cube2 = rootNode.createChild('cube2');
cube2.position[ 0 ] = 5;
// 在 cube 节点上绑定自动旋转功能
cube2.createAbility(ARotation);
const cubeRenderer2 = cube2.createAbility(AGeometryRenderer);
cubeRenderer2.geometry = createCubeGeometry(3);
cubeRenderer2.setMaterial(createCubeMaterial(resourceLoader));

cameraNode.createAbility(AOrbitControls, { target: [ 0, 0, 0 ], canvas: document.getElementById('o3-demo') });
// 启动引擎
engine.run();

setInterval(() => {
  console.log('cube1', cubeRenderer1.geometry.primitive.boundingBoxIntersectsInfo);
  console.log('cube2', cubeRenderer2.geometry.primitive.boundingBoxIntersectsInfo);
}, 100);
