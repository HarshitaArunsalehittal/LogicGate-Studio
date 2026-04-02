export function parseBoolean(expression) {
  // Tokenize
  const rawTokens = [];
  let i = 0;
  while (i < expression.length) {
    const char = expression[i];
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    
    // Check for multi-character operators (AND, OR, NOT, XOR)
    const subStr = expression.substring(i);
    const matchAnd = subStr.match(/^(AND)/i);
    const matchOr = subStr.match(/^(OR)/i);
    const matchXor = subStr.match(/^(XOR)/i);
    const matchNot = subStr.match(/^(NOT)/i);
    
    if (matchAnd) { rawTokens.push({ type: 'AND', val: 'AND' }); i += matchAnd[0].length; continue; }
    if (matchOr) { rawTokens.push({ type: 'OR', val: 'OR' }); i += matchOr[0].length; continue; }
    if (matchXor) { rawTokens.push({ type: 'XOR', val: 'XOR' }); i += matchXor[0].length; continue; }
    if (matchNot) { rawTokens.push({ type: 'NOT', val: 'NOT' }); i += matchNot[0].length; continue; }
    
    if (char === '(') { rawTokens.push({ type: 'LPAREN', val: '(' }); i++; continue; }
    if (char === ')') { rawTokens.push({ type: 'RPAREN', val: ')' }); i++; continue; }
    
    if (char === '!' || char === '~') { rawTokens.push({ type: 'NOT', val: char }); i++; continue; }
    if (char === '&' || char === '*' || char === '.') { rawTokens.push({ type: 'AND', val: char }); i++; continue; }
    if (char === '|' || char === '+') { rawTokens.push({ type: 'OR', val: char }); i++; continue; }
    if (char === '^') { rawTokens.push({ type: 'XOR', val: char }); i++; continue; }
    
    // Handle postfix '
    if (char === "'") { rawTokens.push({ type: 'POST_NOT', val: "'" }); i++; continue; }
    
    // Variables
    const matchVar = subStr.match(/^[a-zA-Z0-9_]+/);
    if (matchVar) {
      rawTokens.push({ type: 'VAR', val: matchVar[0] });
      i += matchVar[0].length;
      continue;
    }
    
    throw new Error(`Unexpected character at index ${i}: ${char}`);
  }
  
  // Handle POST_NOT by converting VAR POST_NOT to NOT VAR (conceptually)
  // Actually, wait, it's easier to process POST_NOT during parsing. Let's just keep Token stream.
  const tokens = [];
  // Insert implicit ANDs
  for (let j = 0; j < rawTokens.length; j++) {
    tokens.push(rawTokens[j]);
    // If this token is VAR, POST_NOT, or RPAREN, and next is VAR, NOT, or LPAREN -> insert implicit AND
    if (j < rawTokens.length - 1) {
      const current = rawTokens[j].type;
      const next = rawTokens[j+1].type;
      
      const isEnd = current === 'VAR' || current === 'POST_NOT' || current === 'RPAREN';
      const isStart = next === 'VAR' || next === 'NOT' || next === 'LPAREN';
      
      if (isEnd && isStart) {
        tokens.push({ type: 'AND', val: 'implicit_and' });
      }
    }
  }

  // Shunting Yard to postfix
  const precedence = {
    'NOT': 4,
    'POST_NOT': 4,
    'AND': 3,
    'XOR': 2,
    'OR': 1
  };
  
  const outputQueue = [];
  const operatorStack = [];
  
  for (const token of tokens) {
    if (token.type === 'VAR') {
      outputQueue.push(token);
    } else if (token.type === 'NOT') {
      operatorStack.push(token);
    } else if (token.type === 'POST_NOT') {
      // POST_NOT binds immediately to the preceding expression
      // Push it to output straight away like an operator that is already in postfix
      outputQueue.push(token);
    } else if (token.type === 'AND' || token.type === 'OR' || token.type === 'XOR') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN' &&
        precedence[operatorStack[operatorStack.length - 1].type] >= precedence[token.type]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
        outputQueue.push(operatorStack.pop());
      }
      if (operatorStack.length === 0) throw new Error("Mismatched parentheses");
      operatorStack.pop(); // discard LPAREN
    }
  }
  
  while (operatorStack.length > 0) {
    const op = operatorStack.pop();
    if (op.type === 'LPAREN') throw new Error("Mismatched parentheses");
    outputQueue.push(op);
  }
  
  // Postfix to AST
  const astStack = [];
  let nodeIdCounter = 0;
  for (const token of outputQueue) {
    if (token.type === 'VAR') {
      astStack.push({ id: `node_${nodeIdCounter++}`, type: 'INPUT', value: token.val });
    } else if (token.type === 'NOT' || token.type === 'POST_NOT') {
      if (astStack.length < 1) throw new Error("Invalid expression: Missing operand for NOT");
      const child = astStack.pop();
      astStack.push({ id: `node_${nodeIdCounter++}`, type: 'NOT', children: [child] });
    } else {
      if (astStack.length < 2) throw new Error(`Invalid expression: Missing operands for ${token.type}`);
      const right = astStack.pop();
      const left = astStack.pop();
      astStack.push({ id: `node_${nodeIdCounter++}`, type: token.type, children: [left, right] });
    }
  }
  
  if (astStack.length !== 1) {
    throw new Error("Invalid expression");
  }
  
  return astStack[0];
}
