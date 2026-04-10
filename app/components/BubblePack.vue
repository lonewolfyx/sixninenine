<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { IGithubUserInfo } from '~/types'

export type BubbleItem = IGithubUserInfo & {
    contributions: number
}

type NormalizedBubbleItem = BubbleItem & {
    name: string
    avatarUrl: string
}

export type BubbleNode = NormalizedBubbleItem & {
    id: string
    x: number
    y: number
    r: number
}

interface Props {
    data: BubbleItem[]
    size?: number
    minRadius?: number
    maxRadius?: number
}

type LayoutMode = 'dense' | 'sparse'

const props = withDefaults(defineProps<Props>(), {
    size: 900,
    minRadius: 2,
    maxRadius: 150,
})

const emit = defineEmits<{
    select: [node: BubbleNode]
}>()

const nodes = shallowRef<BubbleNode[]>([])
const hiddenCount = shallowRef(0)
const hoveredId = shallowRef<string | null>(null)
const nodeRefs = shallowRef<Record<string, HTMLElement | null>>({})

/**
 * 固定策略
 */
const DENSE_OUTER_PADDING = 12
const SPARSE_OUTER_PADDING = 6
const GAP = 8
const TEXT_MIN_RADIUS = 16
const COUNT_MIN_RADIUS = 22
const MIN_VISIBLE_TARGET = 200
const HARD_RENDER_CAP = 720

/**
 * 当数据量较小时，启用“分层扩散布局”
 * 让中心、中圈、边缘都能有节点
 */
const SPARSE_LAYOUT_THRESHOLD = 260

let computeTimer: ReturnType<typeof setTimeout> | null = null

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function distance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
}

function createId(name: string, index: number) {
    return `${name.replace(/\s+/g, '-').toLowerCase()}-${index}`
}

function isInsideOuterCircle(
    x: number,
    y: number,
    r: number,
    cx: number,
    cy: number,
    outerR: number,
) {
    return distance(x, y, cx, cy) + r <= outerR
}

function shouldShowName(r: number) {
    return r >= TEXT_MIN_RADIUS
}

function shouldShowCount(r: number) {
    return r >= COUNT_MIN_RADIUS
}

function nameFontSize(r: number) {
    return clamp(Math.round(r * 0.22), 9, 18)
}

function countFontSize(r: number) {
    return clamp(Math.round(r * 0.14), 8, 13)
}

function truncate(text: string, r: number) {
    const maxChars = r >= 40 ? 10 : r >= 30 ? 8 : r >= 22 ? 6 : 4

    return text.length > maxChars
        ? `${text.slice(0, maxChars)}…`
        : text
}

function getInitials(name: string) {
    const value = (name || '').trim()
    if (!value) return 'NA'
    return value.slice(0, 2).toUpperCase()
}

function createFallbackAvatar(name: string, index: number) {
    const colors = [
        '#2563eb',
        '#7c3aed',
        '#db2777',
        '#ea580c',
        '#16a34a',
        '#0891b2',
        '#4f46e5',
        '#9333ea',
        '#dc2626',
        '#0f766e',
    ]

    const bg = colors[index % colors.length]
    const text = getInitials(name)

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
      <rect width="120" height="120" rx="60" ry="60" fill="${bg}" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="central"
        font-size="42"
        font-family="Arial, sans-serif"
        font-weight="700"
        fill="#ffffff"
      >${text}</text>
    </svg>
  `.trim()

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function normalizeData(raw: BubbleItem[]): NormalizedBubbleItem[] {
    return raw.map((item, index) => ({
        ...item,
        name: item.name || `user-${index + 1}`,
        avatarUrl: item.avatarUrl || createFallbackAvatar(item.name || `U${index + 1}`, index),
        contributions: Number.isFinite(item.contributions) ? Math.max(1, item.contributions) : 1,
    }))
}

function getLayoutMode(total: number): LayoutMode {
    return total <= SPARSE_LAYOUT_THRESHOLD ? 'sparse' : 'dense'
}

function getLayoutOuterPadding(mode: LayoutMode) {
    return mode === 'sparse'
        ? SPARSE_OUTER_PADDING
        : DENSE_OUTER_PADDING
}

/**
 * 大数据时：
 * - 头部保留
 * - 尾部均匀采样
 */
function pickVisibleSource(raw: BubbleItem[]) {
    if (raw.length <= HARD_RENDER_CAP) {
        return [...raw]
    }

    const sorted = [...raw].sort((a, b) => b.contributions - a.contributions)
    const headCount = Math.min(sorted.length, 180)
    const head = sorted.slice(0, headCount)
    const tail = sorted.slice(headCount)

    const remain = HARD_RENDER_CAP - head.length
    if (remain <= 0 || tail.length === 0) {
        return head
    }

    const sampled: BubbleItem[] = []
    const step = tail.length / remain

    for (let i = 0; i < remain; i++) {
        const index = Math.floor(i * step)
        const item = tail[index]
        if (item) {
            sampled.push(item)
        }
    }

    return [...head, ...sampled]
}

/**
 * 基础半径映射
 * 后续再统一乘以 scale 做自动压缩
 */
function mapBaseRadius(
    data: BubbleItem[],
    minRadius: number,
    maxRadius: number,
) {
    const values = data.map(item => Math.log1p(Math.max(item.contributions, 1)))
    const min = Math.min(...values)
    const max = Math.max(...values)

    return data.map((item, index) => {
        const value = Math.log1p(Math.max(item.contributions, 1))
        const t = max === min ? 0.5 : (value - min) / (max - min)
        const eased = Math.pow(t, 0.82)

        return {
            ...item,
            id: createId(item.name, index),
            baseR: minRadius + eased * (maxRadius - minRadius),
        }
    })
}

function scalePreparedRadius(
    prepared: Array<NormalizedBubbleItem & { id: string, baseR: number }>,
    scale: number,
) {
    return prepared.map(item => ({
        ...item,
        r: item.baseR * scale,
    }))
}

/**
 * 小数据模式下：
 * 给每个节点一个“目标半径带”
 * 让节点从中心 -> 中圈 -> 外圈逐层扩散
 */
function getSparsePreferredDistance(
    index: number,
    total: number,
    maxDist: number,
) {
    if (total <= 1) return 0

    const ratio = index / (total - 1)

    /**
     * 保证：
     * - 中心附近有内容
     * - 中圈有内容
     * - 外圈也有内容
     */
    const mapped = 0.08 + 0.84 * Math.pow(ratio, 0.92)

    return maxDist * mapped
}

function createSparseShellCandidates(
    preferred: number,
    maxDist: number,
    step: number,
) {
    const values: number[] = []
    const tries = Math.ceil(maxDist / step) + 2
    const minShell = Math.max(step * 0.35, 1)

    values.push(clamp(preferred, minShell, maxDist))

    for (let i = 1; i <= tries; i++) {
        const out = preferred + i * step
        const inn = preferred - i * step

        if (out <= maxDist) {
            values.push(out)
        }

        if (inn >= minShell) {
            values.push(inn)
        }
    }

    // 去重
    const unique: number[] = []
    const seen = new Set<number>()

    for (const value of values) {
        const key = Math.round(value * 100)
        if (!seen.has(key)) {
            seen.add(key)
            unique.push(value)
        }
    }

    return unique
}

/**
 * 实际放置节点
 * - dense: 大数据优先容量
 * - sparse: 小数据优先从中心向边缘分层扩散
 */
function placePreparedNodes(
    prepared: Array<NormalizedBubbleItem & { id: string, r: number }>,
    size: number,
    outerPadding: number,
    mode: LayoutMode,
) {
    const cx = size / 2
    const cy = size / 2
    const outerR = size / 2 - outerPadding
    const sorted = [...prepared].sort((a, b) => b.r - a.r)
    const placed: BubbleNode[] = []

    const maxR = sorted[0]?.r ?? 0
    const cellSize = Math.max(4, maxR + GAP + 2)
    const grid = new Map<string, BubbleNode[]>()

    function gridKey(gx: number, gy: number) {
        return `${gx}:${gy}`
    }

    function insert(node: BubbleNode) {
        const gx = Math.floor(node.x / cellSize)
        const gy = Math.floor(node.y / cellSize)
        const key = gridKey(gx, gy)
        const bucket = grid.get(key)

        if (bucket) {
            bucket.push(node)
        }
        else {
            grid.set(key, [node])
        }
    }

    function hasCollision(x: number, y: number, r: number) {
        const gx = Math.floor(x / cellSize)
        const gy = Math.floor(y / cellSize)

        for (let ix = gx - 2; ix <= gx + 2; ix++) {
            for (let iy = gy - 2; iy <= gy + 2; iy++) {
                const bucket = grid.get(gridKey(ix, iy))
                if (!bucket) continue

                for (const node of bucket) {
                    if (distance(x, y, node.x, node.y) < r + node.r + GAP) {
                        return true
                    }
                }
            }
        }

        return false
    }

    for (const [index, item] of sorted.entries()) {
        if (index === 0) {
            const node: BubbleNode = {
                ...item,
                x: cx,
                y: cy,
            }

            placed.push(node)
            insert(node)
            continue
        }

        let found: BubbleNode | null = null
        const startAngle = (index * 137.50776405 * Math.PI) / 180
        const shellStep = Math.max(item.r * 0.65, 2)
        const maxDist = Math.max(0, outerR - item.r)

        if (mode === 'sparse') {
            /**
             * 小数据模式：
             * 先围绕目标半径带找位置，形成“由中心到边缘”的扩散
             */
            const preferred = getSparsePreferredDistance(index, sorted.length, maxDist)
            const shells = createSparseShellCandidates(preferred, maxDist, shellStep)

            for (const shell of shells) {
                const circumference = 2 * Math.PI * Math.max(shell, 1)
                const slots = clamp(
                    Math.floor(circumference / Math.max(item.r * 1.15 + GAP, 6)),
                    14,
                    300,
                )

                for (let s = 0; s < slots; s++) {
                    const angle = startAngle + (s / slots) * Math.PI * 2
                    const x = cx + Math.cos(angle) * shell
                    const y = cy + Math.sin(angle) * shell

                    if (!isInsideOuterCircle(x, y, item.r, cx, cy, outerR)) {
                        continue
                    }

                    if (hasCollision(x, y, item.r)) {
                        continue
                    }

                    found = {
                        ...item,
                        x,
                        y,
                    }
                    break
                }

                if (found) break
            }

            /**
             * 兜底：如果目标半径带没找到位置，再做全局搜索
             */
            if (!found) {
                for (let shell = shellStep; shell <= maxDist; shell += shellStep) {
                    const circumference = 2 * Math.PI * shell
                    const slots = clamp(
                        Math.floor(circumference / Math.max(item.r * 1.15 + GAP, 6)),
                        14,
                        320,
                    )

                    for (let s = 0; s < slots; s++) {
                        const angle = startAngle + (s / slots) * Math.PI * 2
                        const x = cx + Math.cos(angle) * shell
                        const y = cy + Math.sin(angle) * shell

                        if (!isInsideOuterCircle(x, y, item.r, cx, cy, outerR)) {
                            continue
                        }

                        if (hasCollision(x, y, item.r)) {
                            continue
                        }

                        found = {
                            ...item,
                            x,
                            y,
                        }
                        break
                    }

                    if (found) break
                }
            }
        }
        else {
            /**
             * 大数据模式：
             * 优先从中心向外找空位，追求更高容量
             */
            for (let shell = shellStep; shell <= maxDist; shell += shellStep) {
                const circumference = 2 * Math.PI * shell
                const slots = clamp(
                    Math.floor(circumference / Math.max(item.r * 1.15 + GAP, 6)),
                    12,
                    360,
                )

                for (let s = 0; s < slots; s++) {
                    const angle = startAngle + (s / slots) * Math.PI * 2
                    const x = cx + Math.cos(angle) * shell
                    const y = cy + Math.sin(angle) * shell

                    if (!isInsideOuterCircle(x, y, item.r, cx, cy, outerR)) {
                        continue
                    }

                    if (hasCollision(x, y, item.r)) {
                        continue
                    }

                    found = {
                        ...item,
                        x,
                        y,
                    }
                    break
                }

                if (found) break
            }
        }

        if (found) {
            placed.push(found)
            insert(found)
        }
    }

    return placed
}

/**
 * 核心：
 * - 小数据：优先分层扩散
 * - 大数据：优先显示数量
 * - 半径不够装时自动压缩
 */
function buildLayout(
    raw: BubbleItem[],
    size: number,
    minRadius: number,
    maxRadius: number,
) {
    const normalized = normalizeData(raw)
    const visibleSource = pickVisibleSource(normalized)
    const mode = getLayoutMode(visibleSource.length)
    const outerPadding = getLayoutOuterPadding(mode)
    const target = Math.min(MIN_VISIBLE_TARGET, visibleSource.length)

    const prepared = mapBaseRadius(visibleSource, minRadius, maxRadius)

    const scales = [
        1,
        0.85,
        0.72,
        0.6,
        0.5,
        0.42,
        0.36,
        0.3,
        0.26,
        0.22,
        0.18,
        0.15,
        0.12,
        0.1,
        0.08,
        0.06,
        0.05,
        0.04,
        0.03,
    ]

    let bestNodes: BubbleNode[] = []

    for (const scale of scales) {
        const scaledPrepared = scalePreparedRadius(prepared, scale)
        const placed = placePreparedNodes(
            scaledPrepared,
            size,
            outerPadding,
            mode,
        )

        if (placed.length > bestNodes.length) {
            bestNodes = placed
        }

        if (placed.length >= target) {
            return {
                nodes: placed,
                hiddenCount: Math.max(0, raw.length - placed.length),
                outerPadding,
            }
        }
    }

    return {
        nodes: bestNodes,
        hiddenCount: Math.max(0, raw.length - bestNodes.length),
        outerPadding,
    }
}

function computeLayout() {
    const nextMin = clamp(props.minRadius, 1, 40)
    const nextMax = clamp(props.maxRadius, nextMin + 1, 200)

    const result = buildLayout(
        props.data,
        props.size,
        nextMin,
        nextMax,
    )

    nodes.value = result.nodes
    hiddenCount.value = result.hiddenCount
}

function scheduleCompute() {
    if (computeTimer) {
        clearTimeout(computeTimer)
    }

    computeTimer = setTimeout(() => {
        computeLayout()
    }, 0)
}

function handleClick(node: BubbleNode) {
    emit('select', node)
}

function handleNodeEnter(node: BubbleNode) {
    hoveredId.value = node.id
}

function handleNodeLeave() {
    hoveredId.value = null
}

function setNodeRef(nodeId: string, el: Element | ComponentPublicInstance | null) {
    nodeRefs.value[nodeId] = el instanceof HTMLElement
        ? el
        : null
}

function getNodeStyle(node: BubbleNode) {
    const diameter = (node.r * 2 / props.size) * 100
    const left = ((node.x - node.r) / props.size) * 100
    const top = ((node.y - node.r) / props.size) * 100

    return {
        width: `${diameter}%`,
        height: `${diameter}%`,
        left: `${left}%`,
        top: `${top}%`,
        // transform: hoveredId.value === node.id ? 'scale(1.03)' : 'scale(1)',
    }
}

watch(
    () => props.data,
    () => {
        scheduleCompute()
    },
    { immediate: true, deep: true },
)

watch(
    () => [props.size, props.minRadius, props.maxRadius],
    () => {
        scheduleCompute()
    },
)

onBeforeUnmount(() => {
    if (computeTimer) {
        clearTimeout(computeTimer)
    }
})
</script>

<template>
    <TooltipProvider>
        <div class="flex w-fit h-full items-center justify-center">
            <div class="relative h-full w-full aspect-square overflow-hidden rounded-full">
                <Tooltip
                    v-for="node in nodes"
                    :key="node.id"
                >
                    <TooltipTrigger
                        as-child
                        :reference="nodeRefs[node.id] ?? undefined"
                    >
                        <a
                            :ref="el => setNodeRef(node.id, el)"
                            class="absolute block overflow-hidden rounded-full transition-all duration-500 hover:scale-110 hover:shadow-lg"
                            :style="getNodeStyle(node)"
                            :href="node.url"
                            target="_blank"
                        >
                            <img
                                :src="node.avatarUrl"
                                class="w-full h-full rounded-full"
                                alt=""
                            >
                        </a>
                    </TooltipTrigger>
                    <TooltipContent
                        side="top"
                        align="center"
                        :side-offset="8"
                    >
                        <div class="grid gap-1">
                            <p class="text-sm font-semibold leading-[1.2]">
                                {{ node.name }}
                            </p>
                            <p class="text-xs leading-[1.2] text-zinc-500">
                                {{ node.contributions }} contributions
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    </TooltipProvider>
</template>
