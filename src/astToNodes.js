import dagre from 'dagre';
import { MarkerType } from '@xyflow/react';

export function astToReactFlow(ast) {
  if (!ast) return { nodes: [], edges: [] };

  const rawNodes = [];
  const rawEdges = [];

  function traverse(node) {
    const isInput = node.type === 'INPUT';
    let type = 'default';
    if (isInput) type = 'inputNode';
    else if (node.type === 'AND') type = 'andNode';
    else if (node.type === 'OR') type = 'orNode';
    else if (node.type === 'XOR') type = 'xorNode';
    else if (node.type === 'NOT') type = 'notNode';

    const rfNode = {
      id: node.id,
      data: { label: isInput ? node.value : node.type },
      type: type,
      position: { x: 0, y: 0 },
    };
    rawNodes.push(rfNode);

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
        const edge = {
          id: `e-${child.id}-${node.id}`,
          source: child.id,
          target: node.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#8b5cf6',
          },
        };
        rawEdges.push(edge);
      }
    }
  }

  traverse(ast);

  // Deduplicate input nodes
  const varNodes = new Map();
  const nodes = [];
  const redirectMap = new Map();

  for (const n of rawNodes) {
    if (n.type === 'inputNode') {
      if (varNodes.has(n.data.label)) {
        redirectMap.set(n.id, varNodes.get(n.data.label).id);
      } else {
        varNodes.set(n.data.label, n);
        nodes.push(n);
      }
    } else {
      nodes.push(n);
    }
  }

  const edges = rawEdges.map(e => {
    if (redirectMap.has(e.source)) {
      return { ...e, source: redirectMap.get(e.source) };
    }
    return e;
  });

  // Calculate Layout with dagre
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  // Left to Right layout
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 120, nodesep: 80 });

  for (const n of nodes) {
    dagreGraph.setNode(n.id, { width: 140, height: 70 });
  }
  for (const e of edges) {
    dagreGraph.setEdge(e.source, e.target);
  }

  dagre.layout(dagreGraph);

  const finalNodes = nodes.map(n => {
    const nodeWithPosition = dagreGraph.node(n.id);
    return {
      ...n,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });

  return { nodes: finalNodes, edges };
}
