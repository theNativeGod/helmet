import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {Pane} from 'tweakpane';


// creating a scene
const scene = new THREE.Scene()

//initializing tweakpane
const pane = new Pane();

//initialize textureLoader
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('./textures/cube_map/')

//loading texture
const envMap = cubeTextureLoader.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] );

scene.background = envMap

//initialize gltfloader 

const gltfLoader = new GLTFLoader()
const model = gltfLoader.load('./models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf)=> {
  const modelScene = gltf.scene
  const material = modelScene.children[0].material
  material.roughness = 0.1
  material.color = new THREE.Color('red')
  material.metalness = 1
  material.envMap = envMap
  
  scene.add(modelScene)
})

// add light
const ambientLight = new THREE.AmbientLight('orange', .5)

scene.add(ambientLight)

const light = new THREE.DirectionalLight( 'orange', .5 );

const light1 = new THREE.DirectionalLight( 'orange', .5 );


const light2 = new THREE.DirectionalLight( 'orange', .5 );
light.position.set( 2,2,2 );
//scene.add( light );


//initializing camera 
const camera = new THREE.PerspectiveCamera(  
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  200,
)

camera.position.z = 3

const canvas = document.querySelector('canvas.threejs')

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth, window.innerHeight)

const maxPixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(maxPixelRatio)

window.addEventListener('resize', ()=> {
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})

const renderloop =()=> {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(renderloop)
}

renderloop()


