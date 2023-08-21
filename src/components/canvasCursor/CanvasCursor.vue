<template>
    <div class="container" @contextmenu.prevent @touchmove.prevent>
        <canvas id="myCanvas" resize />
        <slot name="default" />
    </div>
</template>

<script setup lang="ts">
/**
 * This Component is a canvas cursor which is used to display the highlighted cursor
 * @description canvas cursor
 * @property {Boolean} showChains
 */
// @ts-ignore
import { type Cursor, type EventHandler, cursor, chain } from "./interface/interface"
import { onMounted, reactive, toRef, watch } from 'vue'
import paperFull from 'paper'
import gsap from 'gsap'
onMounted(() => {
    MyCanvas.init()
})
const props = defineProps({
    showChains: {
        default: false,
        type: Boolean,
    }
})
let originalProps = reactive({ ...props })
watch(props, () => {
    if (originalProps.showChains !== props.showChains) {
        if (props.showChains === true) {
            MyCanvas.initChain()
        } else {
            MyCanvas.clearChainPaths()
        }
    }

    originalProps = reactive({ ...props })
}, { deep: true })

class MyCanvas {
    /**
     * initializes the chain
     * @return {paper.Path} path - chain的路径
     */
    static initChain() {
        chain.path = new paperFull.Path({
            strokeColor: paperFull.Color.random(),
            strokeWidth: 20,
            strokeCap: 'round',
        })

        // add points to the path
        const start = new paperFull.Point(paperFull.view.center)
        for (var i = 0; i < chain.points; i++) {
            chain.path?.add(start)
        }
        return chain.path
    }
    static chainManager = {
        chainMove(q: paper.Path.Circle) {
            let chainPath = chain.path
            if (chainPath === null) return
            if (props.showChains === false) return
            chainPath.firstSegment.point = q.position
            for (let i = 0; i < chain.points - 1; i++) {
                const segment = chainPath.segments[i]
                const nextSegment = segment.next
                const vector = segment.point.subtract(nextSegment.point)
                vector.length = chain.length
                const gap = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
                nextSegment.point = segment.point.subtract(vector)
            }
            chainPath.smooth({ type: "continuous" })
        }
    }
    /**
     * initializes the canvas cursor
     * @return {Object} {p,q} - p:鼠标;q:跟随圆圈
     */
    static initCursor() {
        cursor.point = new paperFull.Point(paperFull.view.center)
        /** @param p 鼠标 */
        const p = new paperFull.Path.Circle(cursor.point, cursor.config.size.point.normal)
        /** @param q 圆圈 */
        const q = new paperFull.Path.Circle(p.position, cursor.config.size.circle.normal)
        p.strokeColor = paperFull.Color.random()
        q.strokeColor = p.strokeColor

        p.fillColor = p.strokeColor

        q.strokeWidth = 3

        return { p, q }
    }

    static initOnFrame() {
        this.initChain()
        const { p, q } = this.initCursor()


        const originalConfig: Cursor["config"] = JSON.parse(JSON.stringify(cursor.config))
        const tmp = {
            currentCursorPointSize: originalConfig.size.point.normal,
            currentCursorCircleSize: originalConfig.size.circle.normal,
        }

        const onFrame = function () {
            // 圆圈线性过渡
            let aPoint = q.position
            let bPoint = cursor.point as paper.Point
            let newPoint = lerpPoint(aPoint, bPoint, .1)
            p.position = bPoint
            q.position = newPoint

            // 激活线性过渡
            if (cursor.active === true) {
                tmp.currentCursorPointSize = lerp(tmp.currentCursorPointSize, originalConfig.size.point.min, originalConfig.speed.point.in)
                tmp.currentCursorCircleSize = lerp(tmp.currentCursorCircleSize, originalConfig.size.circle.min, originalConfig.speed.circle.in)
            } else {
                tmp.currentCursorPointSize = lerp(tmp.currentCursorPointSize, originalConfig.size.point.normal, originalConfig.speed.point.out)
                tmp.currentCursorCircleSize = lerp(tmp.currentCursorCircleSize, originalConfig.size.circle.normal, originalConfig.speed.circle.out)
            }
            p.scale(tmp.currentCursorPointSize / p.bounds.width * 2, p.position)
            q.scale(tmp.currentCursorCircleSize / q.bounds.width * 2, q.position)
            MyCanvas.chainManager.chainMove(q)
        }
        paperFull.view.onFrame = onFrame

        function lerpPoint(a: paper.Point, b: paper.Point, w: number) {
            let newPoint = new paperFull.Point(lerp(a.x, b.x, w), lerp(a.y, b.y, w))
            return newPoint
        }
    }

    static clearChainPaths() {
        chain.path?.remove()
        chain.path = null
    }

    static mouseEventHandler: EventHandler = {
        initListener(containerElement: HTMLElement) {
            containerElement.addEventListener("mousemove", this.onMove)
            containerElement.addEventListener("mousedown", this.onDown)
            containerElement.addEventListener("mouseup", this.onUp)
        },
        onMove(e: MouseEvent) {
            if (cursor.point === undefined) return
            let currentTarget: HTMLDivElement = e.currentTarget as HTMLDivElement
            let bounds = currentTarget.getBoundingClientRect()
            cursor.point.x = e.clientX - bounds.left
            cursor.point.y = e.clientY - bounds.top
        },
        onDown(e: MouseEvent) {
            cursor.active = true
            if (e.buttons === 2) {
                MyCanvas.clearChainPaths()
            }
        },
        onUp(e: MouseEvent) {
            cursor.active = false
        }
    }

    static touchEventHandler: EventHandler = {
        tmp: {
            offset: {
                x: 0,
                y: 0,
            }
        },
        initListener(containerElement: HTMLElement) {
            containerElement.addEventListener("touchmove", this.onMove.bind(containerElement, this.tmp))
            containerElement.addEventListener("touchstart", this.onDown)
            containerElement.addEventListener("touchend", this.onUp)

            const bounds = containerElement.getBoundingClientRect()
            this.tmp.offset.x = - bounds.left
            this.tmp.offset.y = - bounds.top
        },
        onMove(tmp: any, e: TouchEvent) {
            if (cursor.point === undefined) return
            cursor.point.x = e.touches[0].clientX + tmp.offset.x
            cursor.point.y = e.touches[0].clientY + tmp.offset.y
        },
        onDown(e: TouchEvent) {
            cursor.active = true

        },
        onUp(e: TouchEvent) {
            cursor.active = false
        }
    }

    static eventHandler(containerElement: HTMLElement) {
        window.addEventListener("pointerdown", justifyEvent)
        let eventObject: EventHandler;
        function justifyEvent(e: PointerEvent) {
            if (e.pointerType === 'touch') {
                // 处理触控操作
                console.log('touch');
                eventObject = MyCanvas.touchEventHandler
            } else if (e.pointerType === 'mouse') {
                // 处理鼠标操作
                console.log('mouse')
                eventObject = MyCanvas.mouseEventHandler
            }
            window.removeEventListener("pointerdown", justifyEvent)

            eventObject.initListener(containerElement)
            eventObject.onDown(e)
        }
    }

    static init() {
        const canvasElement = document.querySelector("#myCanvas") as HTMLCanvasElement
        const containerElement = document.querySelector(".container") as HTMLCanvasElement
        // paperFull element initialization
        paperFull.setup(canvasElement)

        this.eventHandler(containerElement)
        this.initOnFrame()
    }
}

function lerp(a: number, b: number, w: number) {
    return a + w * (b - a)
}

</script>

<style scoped lang="scss">
@import url("./css/index.scss");
</style>