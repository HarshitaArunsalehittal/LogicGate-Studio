import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { parseBoolean } from './booleanParser';
import { astToReactFlow } from './astToNodes';
import { getVariables, generateTruthTable } from './truthTable';
import { InputNode, AndNode, OrNode, XorNode, NotNode } from './LogicNodes';
import { KMapPanel } from './KMapPanel';
import { CircuitBoard, AlertCircle } from 'lucide-react';
import './App.css';

const nodeTypes = {
  inputNode: InputNode,
  andNode: AndNode,
  orNode: OrNode,
  xorNode: XorNode,
  notNode: NotNode,
};

function App() {
  const [expression, setExpression] = useState('A AND B OR NOT C');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [variables, setVariables] = useState([]);
  const [truthTable, setTruthTable] = useState([]);
  const [error, setError] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const generateCircuit = useCallback(() => {
    try {
      if (!expression.trim()) {
        setNodes([]);
        setEdges([]);
        setVariables([]);
        setTruthTable([]);
        setError(null);
        return;
      }
      const ast = parseBoolean(expression);
      const rfData = astToReactFlow(ast);
      
      const vars = getVariables(ast);
      const tt = generateTruthTable(ast, vars);
      
      setNodes(rfData.nodes);
      setEdges(rfData.edges);
      setVariables(vars);
      setTruthTable(tt);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [expression]);

  // Initial load
  React.useEffect(() => {
    generateCircuit();
  }, [generateCircuit]);

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <CircuitBoard size={32} className="logo-icon" />
          <h1>Logic Diagrammer</h1>
        </div>
        <div className="content">
          <p className="description">
            Convert any boolean expression into a beautiful, interactive logic circuit diagram.
          </p>
          
          <div className="input-group">
            <label>Boolean Expression</label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g. A * B + !C"
              onKeyDown={(e) => e.key === 'Enter' && generateCircuit()}
              className={error ? 'input-error' : ''}
            />
            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <div className="quick-actions">
            <span className="quick-label">Quick Insert:</span>
            <div className="operator-buttons">
              {['.', '*', '+', '(', ')', '!', '^'].map(op => (
                <button 
                  key={op} 
                  className="op-btn"
                  onClick={() => setExpression(prev => prev + op)}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
          
          <button className="generate-btn" onClick={generateCircuit}>
            Generate Circuit
          </button>
          
          <div className="legend">
            <h3>Supported Operators</h3>
            <ul>
              <li><strong>AND</strong>: AND, *, &, .</li>
              <li><strong>OR</strong>: OR, +, |</li>
              <li><strong>XOR</strong>: XOR, ^</li>
              <li><strong>NOT</strong>: NOT, !, ~, '</li>
              <li><strong>Implicit AND</strong>: 'AB'</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          className="react-flow-dark"
        >
          <Background color="#334155" gap={16} />
          <Controls />
        </ReactFlow>
        <KMapPanel variables={variables} truthTable={truthTable} />
      </div>
    </div>
  );
}

export default App;
