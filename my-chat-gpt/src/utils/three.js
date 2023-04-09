//three类封装
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import * as THREE from 'three'

export default class Three {
    constructor(container, size = { width: window.innerWidth, height: window.innerHeight }) {
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
        //设置加载管理器
        let event = {}
        event.onload = (gltf) => {
            if (!gltf) return
            this.ThreeObject.model = gltf.scene;
            this.ThreeObject.model.position.set(1, 1, 0);
            this.ThreeObject.model.scale.set(0.01, 0.01, 0.01);
            this.ThreeObject.scene.add(this.ThreeObject.model)
            this.ThreeObject.mixer = new THREE.AnimationMixer(this.ThreeObject.model);
            this.ThreeObject.mixer.clipAction(gltf.animations[0]).play();
            this.ThreeObject.castShadow = true
            this.Render()
        }
        event.onprogress = (xhr) => {
        }
        event.onerror = (err) => {
            console.log('err :', err)
        }
        this.ThreeObject.manager = new THREE.LoadingManager(event.onload, event.onprogress, event.onerror);
        // GLTFLoader 
        this.ThreeObject.loader = new GLTFLoader(this.ThreeObject.manager);
        // 提供DRACOLoader实例。
        this.ThreeObject.loader.setDRACOLoader(this.ThreeObject.dracoLoader)
        this.ThreeObject.loader.load('./LittlestTokyo.glb', event.onload, event.onprogress, event.onerror)
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
        // var point = new THREE.PointLight(0xff0000);
        // point.position.set(40, 20, 30); //点光源位置
        // this.ThreeObject.scene.add(point); //点光源添加到场景中
        // 物体自发光
        this.ThreeObject.renderer.outputEncoding = THREE.sRGBEncoding;
        //环境光
        var ambient = new THREE.AmbientLight(0x777777);
        this.ThreeObject.scene.add(ambient);
        // 聚光灯
        const pointLight = new THREE.PointLight(0xffffff, 1)
        //光的位置 / position
        pointLight.position.set(0.5, 0.5, 0.5)
        // 投射目标
        pointLight.target = this.ThreeObject.model
        // 投射阴影
        pointLight.castShadow = true
        // 设置阴影模糊度
        pointLight.shadow.radius = 4
        // 设置阴影贴图精细度
        pointLight.shadow.mapSize.set(2048, 2048)
        // 设置角度
        pointLight.angle = Math.PI / 3
        // 设置透视相机的属性
        // 灯光衰减
        pointLight.distance = 0
        // 半影衰减效果
        pointLight.penumbra = 0
        // 光照距离衰减
        pointLight.decay = 0
        // 亮度
        pointLight.intensity = 2
        //相机角度
        pointLight.shadow.camera.fov = 500
        //相机助手
        // let helper = new THREE.CameraHelper(pointLight.shadow.camera)
        // 把聚光灯加到小球上
        console.log('object :', this.ThreeObject.smallBall)
        this.ThreeObject.smallBall.add(pointLight)
        // this.ThreeObject.scene.add(helper)
    }

    //渲染函数  设置动画 
    Render = () => {
        //设置时钟
        this.ThreeObject.controls.update();
        this.ThreeObject.renderer.render(this.ThreeObject.scene, this.ThreeObject.camera);
        this.ThreeObject.renderer.shadowMap.enabled = true
        this.ThreeObject.renderer.physicallyCorrectLights = true
        const time = this.ThreeObject.clock.getElapsedTime()
        //小圆点运动
        this.ThreeObject.smallBall.position.x = Math.sin(time) * 3
        this.ThreeObject.smallBall.position.z = Math.cos(time) * 3
        // this.ThreeObject.smallBall.position.y = 2 + Math.sin(time) * 0.5
        try {
            const delta = this.ThreeObject.clock.getDelta();
            this.ThreeObject.mixer.update(delta);
        } catch (error) {
        }
        requestAnimationFrame(this.Render);
    }

    //  加载HDR环境贴图
    Textures() {
        const rgbeLoader = new RGBELoader()
        rgbeLoader.loadAsync('/textures/HDR/env01.hdr').then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping
            this.ThreeObject.scene.environment = texture
            this.ThreeObject.scene.background = texture
        })
    }

    // 创建基本模型
    CreateBasicModel() {
        //平面
        const planeGeometry = new THREE.PlaneGeometry(200, 200)
        const material = new THREE.MeshStandardMaterial({color:0x111111})
        this.ThreeObject.plane = new THREE.Mesh(planeGeometry, material)
        this.ThreeObject.plane.position.set(0, -1, 0)
        this.ThreeObject.plane.rotation.x = -Math.PI / 2
        this.ThreeObject.plane.receiveShadow = true
        this.ThreeObject.scene.add(this.ThreeObject.plane)
        //小球
        this.ThreeObject.smallBall = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 50, 50),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        )
        this.ThreeObject.smallBall.position.set(20, 1, 20)
        this.ThreeObject.scene.add(this.ThreeObject.smallBall)
    }

    //初始化
    Init() {
        //创建默认大小盒子
        try {
            this.container.value.style.width = `${this.width}px`
            this.container.value.style.height = `${this.height}px`
            this.container.value.style.position = 'absolute'
            this.container.value.style.zIndex = 10000
            this.container.value.style.left = '50%'
            this.container.value.style.transform = 'translateX(-50%)'
        } catch (error) {
            console.log('this.container :', this.container)
            console.log('error :', error)
        }


        //创建场景
        this.ThreeObject.scene = new THREE.Scene();
        this.CreateBasicModel()
        //加载HDR环境贴图
        this.Textures()
        //创建相机
        this.CreateCamera(75, this.width / this.height, 0.1, 1000, [5, 0, 9]);
        //创建渲染尺寸
        this.SetRenderSize();
        //设置时钟
        this.ThreeObject.clock = new THREE.Clock()
        //设置loader
        this.SetLoader();
        //设置控制器
        this.SetControls()
        //設置光源
        this.AddingLight()
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