export default {
    Observe(target) {
        for (const key in target) {
            if (Object.hasOwnProperty.call(target, key)) {
                //收集依赖
                let functions = []
                let innerVlaue = target[key]
                Object.defineProperty(target, key, {
                    get() {
                         if(window.__fn && !functions.includes(window.__fn)) {
                            functions.push(window.__fn)
                         }
                        return innerVlaue
                    },
                    set(val) {
                        innerVlaue = val
                        //触发更新所有依次为依赖的界面
                        functions.map(f => f())
                    }
                })
            }
        }
    },
    
    autoRun(fn) {
        window.__fn = fn
        fn()
        window.__fn = null
    }
}