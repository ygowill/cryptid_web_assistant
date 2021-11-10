export const CLUE_DATA =
    [
        {name: '在 森林 或 沙漠', distance: 0, type: 'terrain', inverse: false, value1: 'F', value2: 'D'},
        {name: '在 森林 或 海洋', distance: 0, type: 'terrain', inverse: false, value1: 'F', value2: 'W'},
        {name: '在 森林 或 沼泽', distance: 0, type: 'terrain', inverse: false, value1: 'F', value2: 'S'},
        {name: '在 森林 或 山地', distance: 0, type: 'terrain', inverse: false, value1: 'F', value2: 'M'},
        {name: '在 沙漠 或 海洋', distance: 0, type: 'terrain', inverse: false, value1: 'D', value2: 'W'},
        {name: '在 沙漠 或 沼泽', distance: 0, type: 'terrain', inverse: false, value1: 'D', value2: 'S'},
        {name: '在 沙漠 或 山地', distance: 0, type: 'terrain', inverse: false, value1: 'D', value2: 'M'},
        {name: '在 海洋 或 沼泽', distance: 0, type: 'terrain', inverse: false, value1: 'W', value2: 'S'},
        {name: '在 海洋 或 沼泽', distance: 0, type: 'terrain', inverse: false, value1: 'W', value2: 'M'},
        {name: '在 沼泽 或 山地', distance: 0, type: 'terrain', inverse: false, value1: 'S', value2: 'M'},
        {name: '在 森林 的1格距离内', distance: 1, type: 'terrain', inverse: false, value1: 'F', value2: null},
        {name: '在 沙漠 的1格距离内', distance: 1, type: 'terrain', inverse: false, value1: 'D', value2: null},
        {name: '在 沼泽 的1格距离内', distance: 1, type: 'terrain', inverse: false, value1: 'S', value2: null},
        {name: '在 山地 的1格距离内', distance: 1, type: 'terrain', inverse: false, value1: 'M', value2: null},
        {name: '在 海洋 的1格距离内', distance: 1, type: 'terrain', inverse: false, value1: 'W', value2: null},
        {name: '在 任意动物领地 的1格距离内', distance: 1, type: 'animal', inverse: false, value1: 'B', value2: 'C'},
        {name: '在 石柱 的2格距离内', distance: 2, type: 'structType', inverse: false, value1: 'O', value2: null},
        {name: '在 小屋 的2格距离内', distance: 2, type: 'structType', inverse: false, value1: 'T', value2: null},
        {name: '在 熊领地 的2格距离内', distance: 2, type: 'animal', inverse: false, value1: 'B', value2: null},
        {name: '在 狐狸领地 的2格距离内', distance: 2, type: 'animal', inverse: false, value1: 'C', value2: null},
        {name: '在 白色地标 的3格距离内', distance: 3, type: 'structColor', inverse: false, value1: 'W', value2: null},
        {name: '在 蓝色地标 的3格距离内', distance: 3, type: 'structColor', inverse: false, value1: 'B', value2: null},
        {name: '在 绿色地标 的3格距离内', distance: 3, type: 'structColor', inverse: false, value1: 'G', value2: null},
        {name: '在 黑色地标 的3格距离内', distance: 3, type: 'structColor', inverse: false, value1: 'D', value2: null},
        {name: '不在 森林 或 沙漠', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'F', value2: 'D'},
        {name: '不在 森林 或 海洋', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'F', value2: 'W'},
        {name: '不在 森林 或 沼泽', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'F', value2: 'S'},
        {name: '不在 森林 或 山地', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'F', value2: 'M'},
        {name: '不在 沙漠 或 海洋', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'D', value2: 'W'},
        {name: '不在 沙漠 或 沼泽', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'D', value2: 'S'},
        {name: '不在 沙漠 或 山地', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'D', value2: 'M'},
        {name: '不在 海洋 或 沼泽', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'W', value2: 'S'},
        {name: '不在 海洋 或 山地', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'W', value2: 'M'},
        {name: '不在 沼泽 或 山地', distance: 0, type: 'terrain', inverse: true, numValues: 2, value1: 'S', value2: 'M'},
        {
            name: '不在 森林 的1格距离内',
            distance: 1,
            type: 'terrain',
            inverse: true,
            numValues: 2,
            value1: 'F',
            value2: null
        },
        {
            name: '不在 沙漠 的1格距离内',
            distance: 1,
            type: 'terrain',
            inverse: true,
            numValues: 2,
            value1: 'D',
            value2: null
        },
        {
            name: '不在 沼泽 的1格距离内',
            distance: 1,
            type: 'terrain',
            inverse: true,
            numValues: 1,
            value1: 'S',
            value2: null
        },
        {
            name: '不在 山地 的1格距离内',
            distance: 1,
            type: 'terrain',
            inverse: true,
            numValues: 1,
            value1: 'M',
            value2: null
        },
        {
            name: '不在 海洋 的1格距离内',
            distance: 1,
            type: 'terrain',
            inverse: true,
            numValues: 1,
            value1: 'W',
            value2: null
        },
        {
            name: '不在 任意动物领地 的1格距离内',
            distance: 1,
            type: 'animal',
            inverse: true,
            numValues: 2,
            value1: 'B',
            value2: 'C'
        },
        {
            name: '不在 石柱 的2格距离内',
            distance: 2,
            type: 'structType',
            inverse: true,
            numValues: 1,
            value1: 'O',
            value2: null
        },
        {
            name: '不在 小屋 的2格距离内',
            distance: 2,
            type: 'structType',
            inverse: true,
            numValues: 1,
            value1: 'T',
            value2: null
        },
        {
            name: '不在 熊领地 的2格距离内',
            distance: 2,
            type: 'animal',
            inverse: true,
            numValues: 1,
            value1: 'B',
            value2: null
        },
        {
            name: '不在 狐狸领地 的2格距离内',
            distance: 2,
            type: 'animal',
            inverse: true,
            numValues: 1,
            value1: 'C',
            value2: null
        },
        {
            name: '不在 白色地标 的3格距离内',
            distance: 3,
            type: 'structColor',
            inverse: true,
            numValues: 1,
            value1: 'W',
            value2: null
        },
        {
            name: '不在 蓝色地标 的3格距离内',
            distance: 3,
            type: 'structColor',
            inverse: true,
            numValues: 1,
            value1: 'B',
            value2: null
        },
        {
            name: '不在 绿色地标 的3格距离内',
            distance: 3,
            type: 'structColor',
            inverse: true,
            numValues: 1,
            value1: 'G',
            value2: null
        },
        {
            name: '不在 黑色地标 的3格距离内',
            distance: 3,
            type: 'structColor',
            inverse: true,
            numValues: 1,
            value1: 'D',
            value2: null
        },
    ]

export const COLOR_MAP = {
    "F": "#159335",
    "D": "#FECD0D",
    "S": "#85338A",
    "W": "#1E7DBB",
    "M": "#999898"
}

export const MAP =
    [
        ['W', 'S', 'S', 'W', 'S', 'S', 'W', 'W', 'D', 'W', 'D', 'D', 'F', 'F', 'D', 'F', 'F', 'F',],
        ['S', 'S', 'S', 'F', 'S', 'M', 'F', 'F', 'M', 'F', 'D', 'M', 'F', 'D', 'M', 'F', 'D', 'D',],
        ['S', 'S', 'M', 'S', 'S', 'M', 'F', 'F', 'M', 'F', 'M', 'M', 'F', 'W', 'W', 'W', 'W', 'W',],
        ['D', 'D', 'D', 'D', 'D', 'D', 'M', 'M', 'D', 'M', 'W', 'F', 'M', 'W', 'F', 'M', 'W', 'F',],
        ['S', 'S', 'D', 'S', 'D', 'D', 'S', 'D', 'W', 'M', 'W', 'W', 'M', 'M', 'W', 'M', 'M', 'W',],
        ['D', 'M', 'M', 'D', 'M', 'W', 'S', 'S', 'W', 'S', 'S', 'W', 'S', 'F', 'W', 'F', 'F', 'F',],
    ]

export const BEAR =
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1,],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    ]

export const COUGAR =
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
    ]
