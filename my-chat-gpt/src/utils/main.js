import * as THREE from 'three'
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//导入dat.gui   轻量级ui库  界面初始化
import * as dat from 'dat.gui'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
import auto from './auto'
export default (container, loadNum, lastLoading) => {
    let width = window.innerWidth;
    let height = 350;
    if(container.offsetHeight && container.offsetWidth) {
        width = container.offsetWidth;
        height = container.offsetHeight;
    }else{

    }
   
    function showLoad() {
        let h1 = container.children[0].children[0]
        let progress = container.children[0].children[1]
        let progressWrapper = container.children[0]
        if(window.__Loading.loading === 100) {
            h1.textContent = '加载完成'
           progress.style.width = window.__Loading.loading +'%'
            console.log("模型加载完成")
            progressWrapper.style.opacity = 0
            progressWrapper = null
            return 
        }else{
           h1.textContent = window.__Loading.loading + '%' 
           progress.style.width = window.__Loading.loading +'%'
        }
    }
    auto.autoRun(showLoad)
    //基本内容 
    // 1、 创建场景 + 使用控制器查看3d物体 + 控制3D物体移动  + BufferGeometry
    const scene = new THREE.Scene();
    // 2、 创建相机  （透视相机）
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    //设置相机位置
    camera.position.set(5, 2, 8)
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer()
    // 设置 渲染尺寸的的大小
    renderer.setSize(width,height)
    // 将WebGl渲染的canva添加到body上
    container.appendChild(renderer.domElement)
    renderer.setClearColor(0xfffffff, 1); //设置背景颜色

    // 3、 添加物体 
    //创建几何体 + 材质      

    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(40, 20, 30); //点光源位置
    scene.add(point); //点光源添加到场景中
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/') // 设置public下的解码路径，注意最后面的/

    //环境光
    var ambient = new THREE.AmbientLight(0xfeefff);
    scene.add(ambient);
    let mixer = null;

    //物体自发光
    renderer.outputEncoding = THREE.sRGBEncoding;

    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
    };
    loadNum = 0;
    lastLoading = 0
    const loader = new GLTFLoader(manager)
    loader.setDRACOLoader(dracoLoader)
    loader.load('./LittlestTokyo.glb', function (gltf) {
        console.log("加载中")
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.02, 0.02, 0.02);
        scene.add(model);
        loadNum = 0;
        lastLoading = 0
        window.__Loading.loading = 100
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
        render();

    }, function (xhr) {
        if (lastLoading > Math.ceil(loadNum / xhr.loaded * 100)) {
            return
        } else {
            lastLoading = Math.ceil(loadNum / xhr.loaded * 100)
        }
        console.log('loading......', lastLoading + '%')
        window.__Loading.loading = lastLoading
        loadNum = xhr.loaded
    }, function (e) {
        alert('模型加载失败，刷新或者直接进入')
        console.log('error :', e)
    })

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

}