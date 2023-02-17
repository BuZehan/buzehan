import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//导入dat.gui   轻量级ui库  界面初始化
import * as dat from 'dat.gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';

export default (container) => {
    console.log('container :', container)
    //基本内容 
    // 1、 创建场景 + 使用控制器查看3d物体 + 控制3D物体移动  + BufferGeometry
    const scene = new THREE.Scene();
    // 2、 创建相机  （透视相机）
    const camera = new THREE.PerspectiveCamera(75, (container.offsetWidth / 2) / (container.offsetHeight / 2), 0.1, 1000)
    //设置相机位置
    camera.position.set(5, 2, 8)
    scene.add(camera)

    // 3、 添加物体                                      ************目标代码 
    //创建几何体 + 材质      

    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(40, 20, 30); //点光源位置
    scene.add(point); //点光源添加到场景中
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/') // 设置public下的解码路径，注意最后面的/
    //环境光
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);
    let mixer = null;
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load('./LittlestTokyo.glb', function (gltf) {
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.02, 0.02, 0.02);
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
        render();
    })
    const renderer = new THREE.WebGLRenderer()
    renderer.outputEncoding = THREE.sRGBEncoding;

    // 设置 渲染尺寸的的大小
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    // 将WebGl渲染的canva添加到body上
    container.appendChild(renderer.domElement)
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色

    //使用渲染器 通过相机 将场景渲染出来
    // renderer.render(scene, camera)
    // 创建轨道控制器                                                  ****使用控制器查看3d物体****
    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置控制器阻尼  让控制器又更真实的效果  必须在动画循环里调用.update()
    controls.enableDamping = true

    //渲染函数   tiem  => ms
    //设置时钟
    const clock = new THREE.Clock()
    //设置动画 
    function render() {
        controls.update()
        renderer.render(scene, camera);
        //渲染下一帧后 就会调用render函数  请求动画帧 事件参数 控制动画
        const delta = clock.getDelta();
        try {
            mixer.update(delta);
        } catch (error) {

        }
        controls.update();
        requestAnimationFrame(render);
    }
    render();

    //  监听页面变化  更新渲染画面
    window.addEventListener('resize', () => {
        // 更新摄像头
        camera.aspect = container.innerWidth / container.innerHeight
        // 更新摄像机的投影矩阵
        camera.updateProjectionMatrix()
        // 更新渲染器
        renderer.setSize(container.innerWidth, container.innerHeight)
        // 设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio)
    })

    window.addEventListener('dblclick', () => {
        // 双击控制全屏 退出全屏
        const fullScreenElement = document.fullscreenElement
        if (!fullScreenElement) {
            renderer.domElement.requestFullscreen() //让画布对象全屏
        } else {
            document.exitFullscreen() //退出全屏  document
        }
    })

    console.log('scene :', scene);
}