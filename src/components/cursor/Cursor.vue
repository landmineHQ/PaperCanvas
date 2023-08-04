<template>
  <canvas ref="myCanvas" id="myCanvas" resize @contextmenu.prevent.capture></canvas>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import * as paper from 'paper'
import { getCurrentInstance, onMounted, ref, type Ref } from 'vue'

var myCanvas: Ref<HTMLCanvasElement> | Ref<null> = ref(null)
var currentInstance = getCurrentInstance()

onMounted(() => {
  console.clear()
  myCanvasController.init(myCanvas.value as HTMLCanvasElement)
})

class myCanvasController {
  static cursorCircleRadiusSize: number = 20
  static cursorSize: number = 3
  static currentPoint: paper.Point = new paper.Point(
    -this.cursorCircleRadiusSize,
    -this.cursorCircleRadiusSize
  )
  static cursorDot: paper.Path.Circle
  static cursorCircle: paper.Path.Circle
  static cursorSpeed = {
    move: 0.2,
    changeSize: 0.05
  }
  static otherPath: Array<paper.Path> = new Array()
  static otherSpeed = {
    dropSpeed: 0.2
  }
  static parentElement: HTMLElement
  /**
   * 隐藏光标
   * 修改父元素达到效果
   * @return parentElement {HTMLElement} 父元素
   */
  static hiddenCursor(): void {
    let parentElement = getMyCanvasParent() as HTMLElement
    parentElement.style.cursor = 'none'
    this.parentElement = parentElement

    // 光标事件
    parentElement.addEventListener('mousemove', (e: MouseEvent) => {
      mousemove(e)
    })
    parentElement.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault()
      if (e.button === 2) {
        mouseRightDown(e)
      } else {
        mouseLeftDown(e)
      }
    })
    parentElement.addEventListener('mouseup', (e: MouseEvent) => {
      mouseLeftUp(e)
    })
    // @ts-ignore
    parentElement.addEventListener('contextmenu', (e: PointerEvent) => {
      // 阻止默认右键菜单
      e.preventDefault()
    })

    const mouseRightDown = (e: MouseEvent) => {
      removePath()
    }

    const mouseLeftDown = (e: MouseEvent) => {
      this.cursorCircleRadiusSize = 5
      this.cursorSpeed.changeSize = 0.1
      addPath(this.cursorCircle.position)
      changeCursorCircleColor(this.cursorCircle)
    }

    const mousemove = (e: MouseEvent) => {
      this.currentPoint = new paper.Point(e.x, e.y)
    }

    const mouseLeftUp = (e: MouseEvent) => {
      this.cursorCircleRadiusSize = 20
      this.cursorSpeed.changeSize = 0.03
    }

    const removePath = () => {
      this.otherPath.pop()?.remove()
    }

    const addPath = (point: paper.Point) => {
      let circle = new paper.Path.Circle(point, 20)
      circle.strokeColor = this.cursorCircle.strokeColor
      circle.strokeWidth = 5
      this.otherPath.push(circle)
    }

    const changeCursorCircleColor = (circle: paper.Path.Circle) => {
      // circle.strokeColor = this.paper.Color.random()
      gsap.to(circle.strokeColor, {
        red: Math.random(),
        green: Math.random(),
        blue: Math.random(),
        duration: 0.5
      })
    }

    function getMyCanvasParent(): HTMLElement | null | undefined {
      const parent = myCanvas.value?.parentElement
      return parent
    }
  }

  static initCursor = () => {
    this.hiddenCursor()
    this.cursorDot = new paper.Path.Circle(this.currentPoint, this.cursorSize) // cursor target dot
    this.cursorDot.strokeColor = paper.Color.random()
    this.cursorDot.fillColor = this.cursorDot.strokeColor
    this.cursorCircle = new paper.Path.Circle(this.currentPoint, this.cursorCircleRadiusSize)
    this.cursorCircle.strokeColor = paper.Color.random()
    this.cursorCircle.strokeWidth = 3
  }

  static initHandler(): void {
    let tool = getTool() // paper.Tool
    let view = getView() // paper.View

    view.onFrame = (e: paper.Item) => {
      this.cursorDot.position = this.currentPoint
      drawCursorCircle(this.cursorCircle)
    }

    const drawCursorCircle: (cursorCicle: paper.Path.Circle) => void = createClosuresFunction(
      { lastPoint: this.currentPoint, lastSize: this.cursorCircleRadiusSize, _this: this },
      function (circle: paper.Path.Circle) {
        // @ts-ignore
        const closure = this
        let point = lerpPoint(
          closure.lastPoint,
          closure._this.currentPoint,
          closure._this.cursorSpeed.move
        )
        let size = lerp(
          closure.lastSize,
          closure._this.cursorCircleRadiusSize,
          closure._this.cursorSpeed.changeSize
        )

        closure.lastPoint = point
        closure.lastSize = size

        circle.position = point
        circle.scale((size * 2) / circle.bounds.width)

        function lerpPoint(origin: paper.Point, target: paper.Point, delta: number): paper.Point {
          let x = lerp(origin.x, target.x, delta)
          let y = lerp(origin.y, target.y, delta)
          let newPoint = new paper.Point(x, y)
          return newPoint
        }
      }
    )

    function getTool(): paper.Tool {
      let tool = new paper.Tool()
      return tool
    }

    function getView(): paper.View {
      let view = paper.view
      return view
    }
  }

  static init(canvas: HTMLCanvasElement): void {
    paper.setup(canvas)
    this.initHandler()
    this.initCursor()
  }
}

function lerp(x: number, y: number, delta: number) {
  return (1 - delta) * x + delta * y
}

/**
 * creates a function that has its own closure which can be customized
 * @param closure {object} 闭包
 * @param fn {function} 函数
 */
function createClosuresFunction(closure: Object, fn: Function): () => any {
  return function () {
    let _args = arguments
    return fn.apply(closure, _args)
  }
}
</script>

<style lang="scss" scoped>
@import url('./css/main.scss');
</style>
