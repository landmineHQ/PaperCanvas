<template>
  <canvas ref="myCanvas" id="myCanvas" resize @contextmenu.prevent.capture></canvas>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import paperFull from 'paper'
import { onMounted, ref, type Ref } from 'vue'

var myCanvas: Ref<HTMLCanvasElement> | Ref<null> = ref(null)

onMounted(() => {
  console.clear()
  myCanvasController.init(myCanvas.value as HTMLCanvasElement)
})

class myCanvasController {
  static paper: paper.PaperScope = paperFull // paper
  static cursorCircleRadiusSize: number = 20
  static cursorSize: number = 3
  static currentPoint: paper.Point = new this.paper.Point(
    -this.cursorCircleRadiusSize,
    -this.cursorCircleRadiusSize
  )
  static cursorSpeed = {
    move: 0.25,
    changeSize: 0.05
  }
  static otherPath: Array<paper.Path> = new Array()
  static otherSpeed = {
    dropSpeed: 0.2
  }

  static init(canvas: HTMLCanvasElement): void {
    this.paper.setup(canvas)
    this.initHandler()
    this.hiddenCursor(this.getMyCanvasParent() as HTMLElement)
  }

  static getTool(): paper.Tool {
    let tool = new this.paper.Tool()
    return tool
  }

  static getView(): paper.View {
    let view = this.paper.view
    return view
  }

  static getMyCanvasParent(): HTMLElement | null | undefined {
    const parent = myCanvas.value?.parentElement
    return parent
  }

  static hiddenCursor(el: HTMLElement): HTMLElement {
    console.log(el)
    el.style.cursor = 'none'
    return el
  }

  static initHandler(): void {
    let tool = this.getTool() // paper.Tool
    let view = this.getView() // paper.View
    let cursorDot: paper.Path.Circle = new this.paper.Path.Circle(
      this.currentPoint,
      this.cursorSize
    ) // cursor target dot
    cursorDot.strokeColor = this.paper.Color.random()
    cursorDot.fillColor = cursorDot.strokeColor
    let cursorCircle = new this.paper.Path.Circle(this.currentPoint, this.cursorCircleRadiusSize)
    cursorCircle.strokeColor = this.paper.Color.random()
    cursorCircle.strokeWidth = 3

    tool.onMouseDown = (e: paper.MouseEvent): void => {
      // 鼠标右键
      // @ts-ignore
      if (e.event.button == 2) {
        removePath()
        return
      }

      // 鼠标左键
      this.cursorCircleRadiusSize = 5
      this.cursorSpeed.changeSize = 0.1
      addPath(cursorCircle.position)
      changeCursorCircleColor(cursorCircle)
    }

    tool.onMouseMove = (e: paper.MouseEvent): void => {
      this.currentPoint = e.point
    }

    tool.onMouseUp = (e: paper.MouseEvent): void => {
      this.cursorCircleRadiusSize = 20
      this.cursorSpeed.changeSize = 0.03
    }

    tool.onKeyDown = (e: paper.KeyEvent): void => {
      // @ts-ignore
      if (e.key === 'z' && e.event.ctrlKey === true) {
        removePath()
      }
    }

    view.onFrame = (e: paper.Item) => {
      cursorDot.position = this.currentPoint
      drawCursorCircle(cursorCircle)
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
          let newPoint = new myCanvasController.paper.Point(x, y)
          return newPoint
        }
      }
    )

    const removePath = () => {
      this.otherPath.pop()?.remove()
    }

    const addPath = (point: paper.Point) => {
      let circle = new this.paper.Path.Circle(point, 20)
      circle.strokeColor = cursorCircle.strokeColor
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
