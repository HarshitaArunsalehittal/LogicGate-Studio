# LogicGate Studio

This interactive web application serves as a comprehensive educational and professional tool meticulously designed to bridge the gap between theoretical digital logic and visual circuit architecture. Built using modern frontend technologies, primarily React and Vite, the platform seamlessly translates abstract Boolean equations into concrete, interactive graphical visualizations. It operates as an invaluable resource for computer science students, engineering educators, and electronics enthusiasts aiming to fundamentally master logic gates, truth tables, and circuit simplification techniques natively within their web browser.

At the operational core of the application lies a custom-built syntax parser that rapidly evaluates string-based Boolean expressions in real time. Utilizing precise tokenization alongside a modified Shunting Yard algorithm, the parser intelligently breaks down incredibly complex user inputs. It rigorously respects the mathematical order of operations, automatically manages nested architectural groupings, and handles implicit logical interactions. This parsed computational data is subsequently transformed into an Abstract Syntax Tree, which acts as the foundational structural blueprint driving all downstream visualization features.

From this architectural blueprint, the software engine derives two distinct and highly interactive visual representations. First, by leveraging React Flow combined with directed graph mapping algorithms, the application dynamically renders a fully connected logic circuit diagram. This robust node-based visualizer strictly maps inputs and algorithmic operations, such as AND, OR, NOT, and XOR gates, providing a clean, auto-organized graphical flow of data extending from the raw inputs directly to the final schematic node.

Complementing this diagram, the app integrates a dynamic Karnaugh Map matrix. The map automatically populates based on truth table permutations sourced directly from the Boolean logic. By visually locking grid coordinates, it empowers users to naturally identify grouping bounds and better conceptualize the mathematical minimization and design optimization of their digital circuits, transforming highly complex digital logic into an intuitive, engaging, and deeply educational engineering experience.

## Installation & Setup

1. Clone the repository: `git clone https://github.com/HarshitaArunsalehittal/LogicGate-Studio.git`
2. Enter directory: `cd LogicGate-Studio`
3. Install dependencies: `npm install`
4. Run locally: `npm run dev`
