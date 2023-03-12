import * as THREE from "three";
import { PointCloudOctree, Potree } from "@pnext/three-loader";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { useEffect, useRef } from "react";

let camera: any, scene: any, renderer: any;
// const baseUrl =
//   "/data/pointclouds/";
// "https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/";

// Manages the necessary state for loading/updating one or more point clouds.
const potree = new Potree();
// Show at most 2 million points.
potree.pointBudget = 2_000_000;
// List of point clouds which we loaded and need to update.
let pointClouds: PointCloudOctree[] = [];
const publicPath = window.location.href;

function init(node: HTMLElement, url: string) {
  let baseUrl: string;

  const metaFileName = url.split("/").pop();

  if (!metaFileName) {
    throw new Error("Invalid url. No meta file name found. " + url);
  }

  url = url.replace(metaFileName, "");

  if (url.startsWith("http") || url.startsWith("file")) {
    baseUrl = url;
  } else {
    baseUrl = publicPath + url;
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  node.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const target = new THREE.Vector3();

  camera.position.set(0, 0, 10);
  camera.lookAt(target);
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target = target;
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 0.5;
  controls.maxDistance = 100;

  // scene.add(new THREE.AxesHelper(1));

  potree
    .loadPointCloud(
      // The name of the point cloud which is to be loaded.
      metaFileName,
      // Given the relative URL of a file, should return a full URL (e.g. signed).
      (relativeUrl) => `${baseUrl}${relativeUrl}`
    )
    .then((pco) => {
      pointClouds.push(pco);
      scene.add(pco); // Add the loaded point cloud to your ThreeJS scene.
      pco.translateX(-1);
      pco.rotateX(-Math.PI / 2);

      // The point cloud comes with a material which can be customized directly.
      // Here we just set the size of the points.
      pco.material.size = 1.0;

      const gui = new GUI();

      gui.add(pco.material, "size", 0.001, 4).onChange(render);
      // gui.addColor(pco.material, "color").onChange(render);
      gui.open();
    })
    .then(render);
  //const loader = new PCDLoader();
  //loader.load("/data/nalls_pumpkin_hill.pcd", function (points: any) {
  //  points.geometry.center();
  //  // points.geometry.rotateX(Math.PI);
  //  points.name = "NallsPumpkinHill.pcd";
  //  scene.add(points);

  //  //

  //

  // render();
  // });

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  // This is where most of the potree magic happens. It updates the visiblily of the octree nodes
  // based on the camera frustum and it triggers any loads/unloads which are necessary to keep the
  // number of visible points in check.
  potree.updatePointClouds(pointClouds, camera, renderer);

  // Render your scene as normal
  renderer.clear();
  renderer.render(scene, camera);
}

function destroy() {
  window.removeEventListener("resize", onWindowResize);
  pointClouds.forEach((pco) => pco.dispose());
  pointClouds = [];
}

export function PointCloudData({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    init(ref.current, url);
    return () => {
      destroy();
    };
  }, [url]);

  return <div style={{ height: "100%", width: "100%" }} ref={ref} />;
}
