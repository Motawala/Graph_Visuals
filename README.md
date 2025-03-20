# Graph Visuals

A visualization tool for creating and displaying interactive graphs and networks. This project allows users to build, manipulate, and visualize graph data structures with an intuitive interface.

## Features

- Interactive graph creation and editing
- Visualization of data relationships
- Import and export functionality
- Customizable node and edge styling
- Responsive design for different screen sizes

## Detailed Features

### Node Management
- Create custom nodes with various shapes (rectangles, ellipses, circles)
- Drag and drop interface for node positioning
- Resize nodes to accommodate different content
- Custom labeling with text formatting options
- Color coding for different node types or categories

### Edge Customization
- Create directed and undirected connections between nodes
- Multiple edge styles (straight, curved, orthogonal)
- Add labels and weights to edges
- Customize line thickness and pattern (solid, dashed, dotted)
- Color coding for relationship types

### Data Integration
- Import data from Excel spreadsheets (.xlsx files)
- Auto-generate graphs from tabular data
- Map columns to node properties and relationships
- Support for hierarchical data structures
- Export created graphs to various formats (PNG, SVG, JSON)

### Interaction & Navigation
- Zoom in/out for detailed inspection or overview
- Pan across large graph networks
- Select and highlight connected nodes
- Search functionality to locate specific nodes
- Filter nodes and edges based on properties

## Technologies Used

- JointJS for graph visualization
- jQuery for DOM manipulation
- XLSX library for Excel file processing
- HTML5, CSS3, and JavaScript

## Getting Started

1. Clone the repository
2. Open either `index.html` or `graph_creator.html` in a modern web browser
3. No build process is required as this is a client-side application

## Detailed Usage Guide

### Graph Creator (`graph_creator.html`)

The Graph Creator provides a comprehensive interface for building custom graphs:

#### Creating a New Graph
1. Open `graph_creator.html` in your browser
2. Use the sidebar panel to access node creation tools
3. Click the "Add Node" button to create a new node on the canvas
4. Customize node properties through the properties panel:
   - Change shape, size, and color
   - Add text labels or descriptions
   - Set node ID and other metadata

#### Connecting Nodes
1. Select a source node by clicking on it
2. Click the "Create Link" button
3. Click on a target node to establish the connection
4. Alternatively, drag from one node to another while holding the Shift key
5. Customize the edge properties in the sidebar:
   - Change line style, thickness, and color
   - Add directional arrows
   - Include edge labels or weights

#### Saving and Loading
1. Click "Save Graph" to export your work as a JSON file
2. Use "Load Graph" to import previously saved work
3. The "Export as Image" option allows you to save as PNG or SVG

### Data Visualization (`index.html`)

The main visualization tool offers powerful features for working with existing data:

#### Importing Data
1. Prepare your Excel file with appropriate columns for nodes and relationships
2. Click the "Import Data" button and select your file
3. Use the mapping interface to connect spreadsheet columns to graph properties
4. Click "Generate Graph" to create the visualization

#### Navigating Complex Graphs
1. Use the mouse wheel to zoom in and out
2. Click and drag on empty space to pan around the canvas
3. Double-click on a node to focus and center it
4. Use the minimap in the corner for orientation in large graphs

#### Analysis Tools
1. Toggle the "Statistics" panel to view graph metrics
   - Node count, edge count, graph density
   - Centrality measures for important nodes
2. Use "Find Path" to highlight the shortest path between two selected nodes
3. Apply different layout algorithms through the "Layout" dropdown:
   - Force-directed layout for natural clustering
   - Hierarchical layout for organizational structures
   - Circular layout for cyclic relationships

#### Filtering and Searching
1. Use the search bar to find specific nodes by name or property
2. Apply filters based on node properties or relationship types
3. Use the "Highlight Connected" feature to see all nodes connected to a selection

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- JointJS library (https://www.jointjs.com/)
- XLSX library for data processing 