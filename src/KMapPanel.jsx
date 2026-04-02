import React from 'react';
import './KMapPanel.css';

export function KMapPanel({ variables, truthTable }) {
  if (!variables || variables.length < 2 || variables.length > 4) {
    if (variables && variables.length > 4) {
      return (
        <div className="kmap-panel">
          <div className="panel-header">K-Map</div>
          <div className="panel-body empty-msg">
            K-Maps are only supported for 2 to 4 variables.
          </div>
        </div>
      );
    }
    return null; // Don't show for 0 or 1 variable
  }

  // Pre-calculate gray codes
  const grayCode2 = ['0', '1'];
  const grayCode4 = ['00', '01', '11', '10'];

  let rowVars = [], colVars = [];
  let rowLabels = [], colLabels = [];

  const n = variables.length;
  if (n === 2) {
    rowVars = [variables[0]];
    colVars = [variables[1]];
    rowLabels = grayCode2;
    colLabels = grayCode2;
  } else if (n === 3) {
    rowVars = [variables[0]];
    colVars = [variables[1], variables[2]];
    rowLabels = grayCode2;
    colLabels = grayCode4;
  } else if (n === 4) {
    rowVars = [variables[0], variables[1]];
    colVars = [variables[2], variables[3]];
    rowLabels = grayCode4;
    colLabels = grayCode4;
  }

  // Build a lookup map from binary string to result
  const lookup = {};
  for (const row of truthTable) {
    // Stringify assignments in variable order
    const key = variables.map(v => row.assignments[v]).join('');
    lookup[key] = row.result;
  }

  return (
    <div className="kmap-panel">
      <div className="panel-header">Karnaugh Map (K-Map)</div>
      <div className="panel-body">
        <table className="kmap-table">
          <thead>
            <tr>
              <th className="diagonal-cell">
                <span className="var-col">{colVars.join('')}</span>
                <span className="var-slash">/</span>
                <span className="var-row">{rowVars.join('')}</span>
              </th>
              {colLabels.map(cl => <th key={cl}>{cl}</th>)}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map(rl => (
              <tr key={rl}>
                <th>{rl}</th>
                {colLabels.map(cl => {
                  const key = rl + cl;
                  const value = lookup[key];
                  return (
                    <td 
                      key={cl} 
                      className={value === 1 ? 'cell-one' : 'cell-zero'}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
