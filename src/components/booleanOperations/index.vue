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
    myCanvas.value?.addEventListener("mousedown", () => {
        console.log(e);
    })
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
    private activatedItem!: paper.Item | null;

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
        pathItem.insertBelow(this.group)
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

    hookMouseDrage(mouseDrage: paper.View["onMouseDrag"]) {
        let tool = new this.paper.Tool()
        tool.onMouseDown = (e: MouseEvent) => {
            console.log(e);

        }

        /* this.paper.view.onMouseDown = (e: MouseEvent) => {
            const hitResult = this.group.hitTest(new paperFull.Point([e.x, e.y]))
            this.activatedItem = hitResult && hitResult.item
            console.log(this.activatedItem);

        }
        this.paper.view.onMouseDown = mouseDrage
        this.paper.view.onMouseUp = () => {
            this.activatedItem = null
        } */
    }

    /**
     * 默认初始化
     * @param canvasElement 
     * @return app {paper.Scope} - the paper scope of the canvas element
     */
    static init(canvasElement: HTMLCanvasElement) {
        // ============ initApp ============
        const app = new App(canvasElement)

        // view center
        const viewCenter = app.paper.view.center
        // computed path
        let result: paper.PathItem;

        // ============ group ============
        /**
         * this group is invisible
         * 该组用于逻辑处理，不可见
         */
        const invisibleGroup = new paperFull.Group({ insert: false })
        // ============ ring ============
        const innerRing = new paperFull.Path.Circle({
            position: viewCenter,
            radius: 100,
            parent: invisibleGroup,
        })
        const outerRing = new paperFull.Path.Circle({
            position: viewCenter,
            radius: 150,
            parent: invisibleGroup,
        })
        // compute the ring
        const ring = outerRing.subtract(innerRing)
        // ============ square ============
        const square = new paperFull.Path.Rectangle({
            position: viewCenter,
            size: 350,
            parent: invisibleGroup,
        })
        // ============ animation on frame ============
        app.onFrame((e: any) => {
            e = e as { count: number, time: number, delta: number }
            // move the ring around
            let offset = new paperFull.Point([140, 80]).multiply([Math.sin(e.count / 60), Math.cos(e.count / 60)])
            ring.position = app.paper.view.center.add(offset)

            // run boolean operations
            if (result !== undefined) {
                result.remove()
            }
            result = square[props.operation](ring as paper.PathItem & true)
            result.fillColor = new paperFull.Color(props.fillColor)

            app.drawCanvas(result)
        })
        // ============ mouseDrage ============
        app.hookMouseDrage((e: MouseEvent) => {
            console.log(e);

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