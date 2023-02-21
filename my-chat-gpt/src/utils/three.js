//three类封装
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'

export default class Three {
    constructor(container, size = { width: 300, height: 300 }) {
        this._this = null;
        this.container = container,
            this.width = size.width,
            this.height = size.height,
            this.ThreeObject = {}
    }

    //创建相机
    CreateCamera(fov, aspect, near, far, vectorPosition) {
        // fov — 摄像机视锥体垂直视野角度
        // aspect — 摄像机视锥体长宽比
        // near — 摄像机视锥体近端面
        // far — 摄像机视锥体远端面
        // vectorPosition  -相机位置 三维向量
        this.ThreeObject.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        //设置相机位置
        this.ThreeObject.camera.position.set(...vectorPosition);
        this.ThreeObject.scene.add(this.ThreeObject.camera)
    }

    //设置渲染尺寸
    SetRenderSize() {
        this.ThreeObject.renderer = new THREE.WebGLRenderer()
        this.ThreeObject.renderer.setSize(this.width, this.height)
        // 将WebGl渲染的canva添加到body上
        this.container.value.appendChild(this.ThreeObject.renderer.domElement)
        this.ThreeObject.renderer.setClearColor(0xffffff, 1); //设置背景颜色
    }

    //设置 loader相关
    SetLoader() {
        //解码器 draco 压缩算法
        this.ThreeObject.dracoLoader = new DRACOLoader();
        this.ThreeObject.dracoLoader.setDecoderPath('./draco/'); // 设置public下的解码路径，注意最后面的/


        this.ThreeObject.manager = new THREE.LoadingManager();
        this.ThreeObject.manager.onProgress = function (item, loaded, total) {
        };

        // GLTFLoader 
        this.ThreeObject.loader = new GLTFLoader(this.ThreeObject.manager);
        // 提供DRACOLoader实例。
        this.ThreeObject.loader.setDRACOLoader(this.ThreeObject.dracoLoader)
        this.ThreeObject.loader.load('./LittlestTokyo.glb', (gltf) => {
            console.log("glTF加载中")
            const model = gltf.scene;
            model.position.set(1, 1, 0);
            model.scale.set(0.02, 0.02, 0.02);
            this.ThreeObject.scene.add(model)
            this.ThreeObject.mixer = new THREE.AnimationMixer(model);
            this.ThreeObject.mixer.clipAction(gltf.animations[0]).play();
            this.Render()
        }, function (xhr) {
        }, function (err) {
            console.log('err :', err)
        })
    }

    // 创建轨道控制器 
    SetControls() {
        this.ThreeObject.controls = new OrbitControls(this.ThreeObject.camera, this.ThreeObject.renderer.domElement)
        // 设置控制器阻尼  让控制器又更真实的效果  必须在动画循环里调用.update()
        this.ThreeObject.controls.enableDamping = true
    }

    //光源
    AddingLight() {
        //点光源
        var point = new THREE.PointLight(0xffffff);
        point.position.set(40, 20, 30); //点光源位置
        this.ThreeObject.scene.add(point); //点光源添加到场景中
        // 物体自发光
        this.ThreeObject.renderer.outputEncoding = THREE.sRGBEncoding;
        //环境光
        var ambient = new THREE.AmbientLight(0xfeefff);
        this.ThreeObject.scene.add(ambient);
    }

    //渲染函数  设置动画 
    Render = () => {
        //设置时钟
        this.ThreeObject.controls.update();
        this.ThreeObject.renderer.render(this.ThreeObject.scene, this.ThreeObject.camera);
        //渲染下一帧后 就会调用render函数  请求动画帧 事件参数 控制动画
        const delta = this.ThreeObject.clock.getDelta();
        try {
            this.ThreeObject.mixer.update(delta);
        } catch (error) {

        }
        requestAnimationFrame(this.Render);
    }

    //初始化
    Init() {
        //创建默认大小盒子
        try {
            this.container.value.style.width = `${this.width}px`
            this.container.value.style.height = `${this.height}px`
            this.container.value.style.position = 'absolute'
            this.container.value.style.zIndex = 10000
            this.container.value.style.border = '1px solid #888'
            this.container.value.style.borderRadius = '5px'
            this.container.value.style.left = '50%'
            this.container.value.style.transform = 'translateX(-50%)'
        } catch (error) {
            console.log('this.container :', this.container)
            console.log('error :', error)
        }
        //创建场景
        this.ThreeObject.scene = new THREE.Scene();
        //创建相机
        this.CreateCamera(75, this.width / this.height, 0.1, 1000, [5, 0, 9]);
        //创建渲染尺寸
        this.SetRenderSize();
        //设置loader
        this.SetLoader();
        //设置控制器
        this.SetControls()
        //設置光源
        this.AddingLight()
        //设置时钟
        this.ThreeObject.clock = new THREE.Clock()
        this.Render()

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

}