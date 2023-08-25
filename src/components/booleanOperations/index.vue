<template>
    <div class="container">
        <canvas resize ref="myCanvas"></canvas>
        <slot name="default"></slot>
    </div>
</template>

<script setup lang="ts">
/**
 * 逻辑运算
 * @description boolean operations
 * @property operation {OperationsType} - 运算方式
 */
import { type PropType, onMounted, ref, type Ref } from 'vue'
import { type OperationsType } from './interface/interface'
import paperFull from 'paper';
import { gsap } from 'gsap';
const props = defineProps({
    operation: {
        default: "subtract",
        type: String as PropType<OperationsType>
    },
    fillColor: {
        default: "green",
        type: String
    }
})
/**
 * 通过ref获取canvas元素
 * @param myCanvas {Ref<HTMLCanvasElement>} - myCanvas元素
 */
const myCanvas: Ref<HTMLCanvasElement | null> = ref(null)
onMounted(() => {
    App.init(myCanvas.value as HTMLCanvasElement)
})
class App {
    /**
     * @param paper {paper.PaperScope} - the paperJS scope
     */
    private paper: paper.PaperScope;
    /**
     * 所有渲染的图层均在此组
     * @param group {paper.Group} - the group of paperJS
     */
    private group: paper.Group;
    private selectedItem!: paper.Item | null;

    /**
     * 构造函数
     * @param canvasElement
     */
    constructor(canvasElement: HTMLCanvasElement) {
        this.paper = new paperFull.PaperScope()
        this.paper.activate()
        this.paper.setup(canvasElement) // activate the paper scope
        this.group = new this.paper.Group()
    }

    /**
     * 绘制图形
     * @param pathItem 
     */
    drawCanvas(pathItem: paper.PathItem) {
        this.group.insertChild(0, pathItem)
    }

    /**
     * 清除绘制
     * @param pathItem 
     */
    clearCanvas(pathItem: paper.PathItem) {
        pathItem.remove()
    }

    /**
     * 动画框架
     * @param frame 
     */
    onFrame(frame: paper.View["onFrame"]) {
        this.paper.view.onFrame = frame
    }

    /**
     * 鼠标拖拽
     * @param renderlessGroup {paper.Group} - 逻辑运算组 
     * @param mouseDrage {paper.MouseEvent} - 鼠标事件
     */
    hookMouseDrage(renderlessGroup: paper.Group, mouseDrage: (event: paper.MouseEvent) => void) {
        this.paper.view.onMouseDown = (e: paper.MouseEvent) => {
            const hitResult = renderlessGroup.hitTest(e.point)
            this.selectedItem = hitResult && hitResult.item
            if (this.selectedItem === null) return
            gsap.to(this.selectedItem.position, {
                x: e.point.x,
                y: e.point.y,
            })
        }
        this.paper.view.onMouseDrag = mouseDrage
        this.paper.view.onMouseUp = (e: paper.MouseEvent) => {
            if (this.selectedItem === null) return
            gsap.to(this.selectedItem.position, {
                x: this.group.view.center.x,
                y: this.group.view.center.y,
            })
            this.selectedItem = null
        }
    }

    /**
     * 默认初始化
     * @param canvasElement 
     * @return app {paper.Scope} - the paper scope of the canvas element
     */
    static init(canvasElement: HTMLCanvasElement) {
        // ============ initApp ============
        const app = new App(canvasElement)

        /** view center */
        const viewCenter = app.paper.view.center
        /** computed path */
        let result: paper.PathItem;
        // ============ boolean operate group ============
        /** 仅供布尔运算的group */
        const renderlessGroup = new paperFull.Group({ insert: false })
        // ============ ring ============
        const innerRing = new paperFull.Path.Circle({
            position: viewCenter,
            radius: 100,
            parent: renderlessGroup,
            fillColor: 'white'
        })
        const outerRing = new paperFull.Path.Circle({
            position: viewCenter,
            radius: 150,
            parent: renderlessGroup,
            fillColor: 'white'
        })
        /** compute the ring */
        const ring = outerRing.subtract(innerRing)
        // ============ square ============
        const square = new paperFull.Path.Rectangle({
            position: viewCenter,
            size: 350,
            parent: renderlessGroup,
            radius: 30,
            fillColor: new paperFull.Color('white')
        })
        square.insertBelow(ring)
        // ============ animation on frame ============
        app.onFrame((e: any) => {
            e = e as { count: number, time: number, delta: number }
            // move the ring around
            if (app.selectedItem !== ring) {
                const offset = new paperFull.Point([150, 100]).multiply([Math.sin(e.count / 60), Math.cos(e.count / 60)])
                const newPosition = app.paper.view.center.add(offset)
                gsap.to(ring.position, {
                    x: newPosition.x,
                    y: newPosition.y,
                })
            }

            // run boolean operations
            if (result !== undefined) {
                result.remove()
            }
            result = square[props.operation](ring as paper.PathItem & true)
            result.fillColor = new paperFull.Color(props.fillColor)
            result.selected = true

            app.drawCanvas(result)
        })
        // ============ mouseDrage ============
        app.hookMouseDrage(renderlessGroup, (e: paper.MouseEvent) => {
            // 没有选中无渲染层则返回
            if (app.selectedItem === null) return
            gsap.to(app.selectedItem.position, {
                x: e.point.x,
                y: e.point.y,
            })
        })
        // ============ initApp return ============
        // 返回app实例
        return app
    }
}

</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
}

canvas[resize] {
    width: 100%;
    height: 100%;
    position: absolute;
    border: 3px solid #ccc;
}
</style>