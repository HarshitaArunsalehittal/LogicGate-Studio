export function getVariables(ast) {
  if (!ast) return [];
  const vars = new Set();
  function traverse(node) {
    if (node.type === 'INPUT') {
      vars.add(node.value);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  traverse(ast);
  return Array.from(vars).sort();
}

export function evaluateAST(ast, assignments) {
  if (!ast) return 0;
  if (ast.type === 'INPUT') {
    return assignments[ast.value] ? 1 : 0;
  }
  if (ast.type === 'NOT' || ast.type === 'POST_NOT') {
    return evaluateAST(ast.children[0], assignments) ? 0 : 1;
  }
  
  const left = evaluateAST(ast.children[0], assignments);
  const right = evaluateAST(ast.children[1], assignments);
  
  if (ast.type === 'AND') {
    return (left && right) ? 1 : 0;
  }
  if (ast.type === 'OR') {
    return (left || right) ? 1 : 0;
  }
  if (ast.type === 'XOR') {
    return (left ^ right) ? 1 : 0;
  }
  
  return 0;
}

export function generateTruthTable(ast, vars) {
  if (vars.length === 0) return [];
  const numVars = vars.length;
  const rows = [];
  const totalRows = 1 << numVars;
  
  // To avoid performance issues, cap at 8 variables (256 rows).
  // But K-map only needs up to 4 vars anyway.
  if (numVars > 8) {
    throw new Error(`Too many variables (${numVars}) for Truth Table generation.`);
  }

  for (let i = 0; i < totalRows; i++) {
    const assignments = {};
    for (let j = 0; j < numVars; j++) {
      // MSB to LSB mapping: vars[0] is MSB, vars[numVars-1] is LSB
      assignments[vars[j]] = (i >> (numVars - 1 - j)) & 1;
    }
    const result = evaluateAST(ast, assignments);
    rows.push({ assignments, result });
  }
  return rows;
}
