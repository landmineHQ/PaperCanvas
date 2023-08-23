interface Cursor {
    // 鼠标点
    point: paper.Point | undefined
    // 激活
    active: boolean
    // 设置
    config: {
        size: {
            point: SizeRangeOptions
            circle: SizeRangeOptions
        }
        speed: {
            point: SpeedOptions
            circle: SpeedOptions
        }
    }
}

interface SizeRangeOptions {
    normal: number
    max: number
    min: number
}

interface SpeedOptions {
    in: number
    out: number
}

const cursor: Cursor = {
    point: undefined,
    active: false,
    config: {
        size: {
            circle: {
                normal: 30,
                min: 10,
                max: 35
            },
            point: {
                normal: 3,
                min: 5,
                max: 1
            }
        },
        speed: {
            circle: {
                in: 0.3,
                out: 0.1
            },
            point: {
                in: 0.3,
                out: 0.1
            }
        }
    }
}

type Chain = typeof chain

const chain: { [key: string]: any } = {
    points: 45,
    length: 25,
    path: null,
}

interface EventHandler {
    initListener: any
    onMove: any
    onDown: any
    onUp: any
    [key: string]: any
}

export {
    type Cursor,
    type EventHandler,
    type Chain,
    cursor,
    chain,
}
