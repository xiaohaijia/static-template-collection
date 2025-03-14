// 初始化数据
const data = {
    nodes: [
        { id: 'center', label: '核心客户', type: 'core' },
        ...Array.from({ length: 8 }, (_, i) => ({
            id: `level1-${i}`,
            label: `客户${i + 1}`,
            type: 'level1'
        })),
        ...Array.from({ length: 16 }, (_, i) => ({
            id: `level2-${i}`,
            label: `裂变客户${i + 1}`,
            type: 'level2'
        }))
    ],
    edges: [
        // 连接核心节点到一级节点
        ...Array.from({ length: 8 }, (_, i) => ({
            source: 'center',
            target: `level1-${i}`,
            type: 'running-line'
        })),
        // 连接一级节点到二级节点
        ...Array.from({ length: 16 }, (_, i) => ({
            source: `level1-${Math.floor(i / 2)}`,
            target: `level2-${i}`,
            type: 'running-line'
        }))
    ]
};

// 自定义节点和边
G6.registerNode('core', {
    draw(cfg, group) {
      group.attr('cursor', 'move');
        const size = 60;
        // 外发光
        group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size * 0.8,
                fill: '#fff',
                opacity: 0.2,
                blur: 15
            }
        });
        // 主体渐变
        const gradient = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size * 0.6,
                fill: 'l(0) 0:#ff7875 1:#ff4d4f',
                stroke: '#ff4d4f',
                strokeWidth: 2,
                shadowColor: '#ff4d4f',
                shadowBlur: 10
            },
            name: 'circle-shape'
        });
        // 文本
        group.addShape('text', {
            attrs: {
                text: cfg.label,
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fill: '#fff',
                fontSize: 14,
                fontWeight: 'bold'
            },
            name: 'text-shape'
        });
        return gradient;
    }
});

G6.registerNode('level1', {
    draw(cfg, group) {
      group.attr('cursor', 'move');
        const size = 45;
        group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size * 0.8,
                fill: '#fff',
                opacity: 0.1,
                blur: 10
            }
        });
        const gradient = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size * 0.6,
                fill: 'l(0) 0:#f5a6a6 1:#e57373',
                stroke: '#e57373',
                strokeWidth: 2,
                shadowColor: '#e57373',
                shadowBlur: 15
            },
            name: 'circle-shape'
        });
        group.addShape('text', {
            attrs: {
                text: cfg.label,
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fill: '#fff',
                fontSize: 12
            },
            name: 'text-shape'
        });
        return gradient;
    }
});

G6.registerNode('level2', {
    draw(cfg, group) {
      group.attr('cursor', 'move');
        const size = 35;
        group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size * 0.8,
                fill: '#fff',
                opacity: 0.1,
                blur: 8
            }
        });
        const gradient = group.addShape('circle', {
            attrs: {
                x: 0,
                y: 0,
                r: size * 0.6,
                fill: 'l(0) 0:#ffd700 1:#daa520',
                stroke: '#daa520',
                strokeWidth: 2,
                shadowColor: '#daa520',
                shadowBlur: 8
            },
            name: 'circle-shape'
        });
        group.addShape('text', {
            attrs: {
                text: cfg.label,
                x: 0,
                y: 0,
                textAlign: 'center',
                textBaseline: 'middle',
                fill: '#fff',
                fontSize: 10
            },
            name: 'text-shape'
        });
        return gradient;
    }
});

// 自定义边（流动线条效果）
G6.registerEdge('running-line', {
    draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const shape = group.addShape('path', {
            attrs: {
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ],
                stroke: '#fff',
                lineWidth: 1,
                opacity: 0.3,
                lineDash: [4, 2],
                endArrow: {
                    path: 'M 0,0 L 4,2 L 4,-2 Z',
                    fill: 'rgba(255, 255, 255, 0.4)',
                    lineWidth: 1.5,
                    opacity: 0.4,
                    lineDash: [4, 2],
                    endArrow: {
                        path: 'M 0,0 L 4,2 L 4,-2 Z',
                        fill: 'rgba(255, 255, 255, 0.6)'
                    }
                }
            },
            name: 'path-shape'
        });
        // 流动线条动画
        const totalLength = shape.getTotalLength();
        const dashLine = group.addShape('path', {
            attrs: {
                path: [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ],
                stroke: '#fff',
                lineWidth: 2,
                lineDash: [totalLength / 3, totalLength / 3 * 2],
                opacity: 0.3
            },
            name: 'dash-line'
        });
        dashLine.animate(
            {
                lineDash: [
                    totalLength / 3,
                    totalLength / 3 * 2,
                    -totalLength / 3 * 1
                ],
                lineDashOffset: -totalLength
            },
            {
                duration: 3000,
                repeat: true
            }
        );
        return shape;
    }
});

// 初始化图实例
const graph = new G6.Graph({
    container: 'container',
    width: document.getElementById('container').offsetWidth,
    height: document.getElementById('container').offsetHeight,
    modes: {
        default: [{
          type: 'drag-node',
          enableDelegate: true,
          delegateStyle: {
            fill: '#fff',
            stroke: '#1890ff',
            opacity: 0.5
          }
        }, 'drag-canvas', 'zoom-canvas']
    },
    defaultNode: {
        type: 'circle'
    },
    defaultEdge: {
        type: 'running-line'
    },
    layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: 200,
        nodeStrength: -100,
        edgeStrength: 0.5
    },
    animate: true
});

// 窗口大小自适应
window.addEventListener('resize', () => {
    if (!graph || graph.get('destroyed')) return;
    const container = document.getElementById('container');
    graph.changeSize(container.offsetWidth, container.offsetHeight);
});

// 渲染图
graph.data(data);
graph.render();

// 获取节点的所有子节点（递归）
function getAllChildren(graph, nodeId, visited = new Set()) {
    visited.add(nodeId);
    const children = [];
    const neighbors = graph.getNeighbors(graph.findById(nodeId), 'out');
    
    for (const neighbor of neighbors) {
        const neighborId = neighbor.getID();
        if (!visited.has(neighborId)) {
            children.push(neighbor);
            children.push(...getAllChildren(graph, neighborId, visited));
        }
    }
    return children;
}
