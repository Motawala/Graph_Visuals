// Check if JointJS is available
if (typeof joint === 'undefined') {
    console.error('JointJS library not loaded. Please check your internet connection.');
    // The error will be displayed in the HTML error banner
} else {
    // Graph state variables
    let graph;
    let paper;
    let nodeCounter = 0; // Counter for assigning sequential node IDs

    // Initialize the graph
    function initGraph() {
        try {
            graph = new joint.dia.Graph();
            paper = new joint.dia.Paper({
                el: document.getElementById('graph'),
                model: graph,
                width: '100%',
                height: '100%',
                gridSize: 10,
                drawGrid: true,
                background: {
                    color: 'white'
                },
                interactive: true,
                defaultLink: new joint.shapes.standard.Link({
                    attrs: {
                        line: {
                            stroke: '#1a237e',
                            strokeWidth: 2
                        }
                    }
                })
            });

            // Make elements draggable
            paper.on('element:pointerdown', function(elementView, evt, x, y) {
                // Enable dragging for all elements
                elementView.model.toFront();
            });

            // Add tooltip functionality
            paper.on('element:mouseenter', (elementView) => {
                const tooltip = elementView.model.get('tooltip');
                if (tooltip) {
                    const tooltipEl = document.createElement('div');
                    tooltipEl.className = 'tooltip';
                    tooltipEl.textContent = tooltip;
                    document.body.appendChild(tooltipEl);

                    const rect = elementView.el.getBoundingClientRect();
                    tooltipEl.style.left = rect.right + 10 + 'px';
                    tooltipEl.style.top = rect.top + 'px';
                }
            });

            paper.on('element:mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });

            // Add tooltip for links
            paper.on('link:mouseenter', (linkView) => {
                const tooltip = linkView.model.get('tooltip');
                if (tooltip) {
                    const tooltipEl = document.createElement('div');
                    tooltipEl.className = 'tooltip';
                    tooltipEl.textContent = tooltip;
                    document.body.appendChild(tooltipEl);

                    const rect = linkView.el.getBoundingClientRect();
                    tooltipEl.style.left = rect.right + 10 + 'px';
                    tooltipEl.style.top = rect.top + 'px';
                }
            });

            paper.on('link:mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });

            // Display status message that the graph is ready
            showStatusMessage("Graph initialized. Ready to add nodes.");
            return true;
        } catch (error) {
            console.error('Error initializing graph:', error);
            showError('Failed to initialize graph: ' + error.message);
            return false;
        }
    }

    // Show error message in the banner
    function showError(message) {
        const errorBanner = document.getElementById('errorBanner');
        if (errorBanner) {
            errorBanner.textContent = message;
            errorBanner.style.display = 'block';
        }

        showStatusMessage(message, true);
    }

    // Show status message
    function showStatusMessage(message, isError = false) {
        const statusMsg = document.getElementById('statusMessage');
        if (!statusMsg) return;

        statusMsg.textContent = message;
        statusMsg.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
        statusMsg.classList.add('visible');

        // Auto-hide after 3 seconds
        setTimeout(() => {
            statusMsg.classList.remove('visible');
        }, 3000);
    }

    // Add a new node
    function addNode() {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            const labelInput = document.getElementById('nodeLabel');
            const tooltipInput = document.getElementById('nodeTooltip');
            const widthInput = document.getElementById('nodeWidth');
            const heightInput = document.getElementById('nodeHeight');
            const colorInput = document.getElementById('nodeColor');

            if (!labelInput) {
                showError('Node label input not found');
                return;
            }

            const label = labelInput.value.trim();
            const tooltip = tooltipInput ? tooltipInput.value.trim() : '';
            const width = widthInput ? parseInt(widthInput.value) || 150 : 150;
            const height = heightInput ? parseInt(heightInput.value) || 60 : 60;
            const color = colorInput ? colorInput.value : '#1a237e';

            if (!label) {
                showStatusMessage('Please enter a node label', true);
                return;
            }

            // Increment node counter for sequential IDs
            nodeCounter++;

            // Calculate position for the new node
            // Get current nodes count to place new nodes in different positions
            const nodesCount = graph.getElements().length;
            const xPos = 100 + (nodesCount % 3) * 300;  // Distribute horizontally
            const yPos = 100 + Math.floor(nodesCount / 3) * 150;  // And vertically

            const node = new joint.shapes.standard.Rectangle({
                position: { x: xPos, y: yPos },
                size: { width: width, height: height },
                attrs: {
                    body: {
                        fill: color,
                        stroke: '#000',
                        strokeWidth: 2,
                        rx: 6,
                        ry: 6
                    },
                    label: {
                        text: label,
                        fill: 'white',
                        fontSize: 14,
                        fontWeight: 'bold',
                        textVerticalAnchor: 'middle',
                        textAnchor: 'middle'
                    }
                }
            });

            // Add custom properties
            node.set('tooltip', tooltip);
            node.set('nodeId', nodeCounter); // Store sequential ID for export

            // Add the node to the graph
            graph.addCell(node);

            // Update node selection dropdowns
            updateNodeSelects();

            // Clear inputs
            labelInput.value = '';
            if (tooltipInput) tooltipInput.value = '';

            // Show success message
            showStatusMessage(`Node "${label}" added successfully.`);
        } catch (error) {
            console.error('Error adding node:', error);
            showError('Failed to add node: ' + error.message);
        }
    }

    // Add a text label to the graph
    function addLabel() {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            const labelTextInput = document.getElementById('labelText');
            const labelSizeInput = document.getElementById('labelFontSize');
            const labelColorInput = document.getElementById('labelColor');
            const labelStyleInput = document.getElementById('labelStyle');

            if (!labelTextInput) {
                showError('Label text input not found');
                return;
            }

            const labelText = labelTextInput.value.trim();
            const labelSize = labelSizeInput ? parseInt(labelSizeInput.value) || 14 : 14;
            const labelColor = labelColorInput ? labelColorInput.value : '#4CAF50';
            const labelStyle = labelStyleInput ? labelStyleInput.value : 'rectangle';

            if (!labelText) {
                showStatusMessage('Please enter label text', true);
                return;
            }

            // Calculate position for the new label
            const nodesCount = graph.getElements().length;
            const xPos = 200 + (nodesCount % 3) * 250;
            const yPos = 200 + Math.floor(nodesCount / 3) * 150;

            let label;

            // Create different styles of labels based on selection
            switch (labelStyle) {
                case 'circle':
                    label = new joint.shapes.standard.Circle({
                        position: { x: xPos, y: yPos },
                        size: { width: 120, height: 120 },
                        attrs: {
                            body: {
                                fill: labelColor,
                                stroke: '#000',
                                strokeWidth: 1
                            },
                            label: {
                                text: labelText,
                                fill: 'white',
                                fontSize: parseInt(labelSize),
                                fontWeight: 'bold',
                                textVerticalAnchor: 'middle',
                                textAnchor: 'middle'
                            }
                        }
                    });
                    break;
                case 'ellipse':
                    label = new joint.shapes.standard.Ellipse({
                        position: { x: xPos, y: yPos },
                        size: { width: 150, height: 80 },
                        attrs: {
                            body: {
                                fill: labelColor,
                                stroke: '#000',
                                strokeWidth: 1
                            },
                            label: {
                                text: labelText,
                                fill: 'white',
                                fontSize: parseInt(labelSize),
                                fontWeight: 'bold',
                                textVerticalAnchor: 'middle',
                                textAnchor: 'middle'
                            }
                        }
                    });
                    break;
                case 'cloud':
                    label = new joint.shapes.standard.Path({
                        position: { x: xPos, y: yPos },
                        size: { width: 150, height: 100 },
                        attrs: {
                            body: {
                                refD: 'M 25,60 a 20,20 0 1,0 0,-40 a 20,20 0 1,0 -30,10 a 30,30 0 1,0 -10,40 a 20,20 0 1,0 30,0 a 20,20 0 1,0 10,-10 z',
                                fill: labelColor,
                                stroke: '#000',
                                strokeWidth: 1
                            },
                            label: {
                                text: labelText,
                                fill: 'white',
                                fontSize: parseInt(labelSize),
                                fontWeight: 'bold',
                                textVerticalAnchor: 'middle',
                                textAnchor: 'middle',
                                refX: 0.5,
                                refY: 0.5
                            }
                        }
                    });
                    break;
                default: // rectangle
                    label = new joint.shapes.standard.Rectangle({
                        position: { x: xPos, y: yPos },
                        size: { width: 150, height: 50 },
                        attrs: {
                            body: {
                                fill: labelColor,
                                stroke: '#000',
                                strokeWidth: 1,
                                rx: 5,
                                ry: 5
                            },
                            label: {
                                text: labelText,
                                fill: 'white',
                                fontSize: parseInt(labelSize),
                                fontWeight: 'bold',
                                textVerticalAnchor: 'middle',
                                textAnchor: 'middle'
                            }
                        }
                    });
            }

            // Set tooltip to be the same as the label text
            label.set('tooltip', labelText);
            label.set('isLabel', true); // Mark as a label for filtering in export
            label.set('nodeId', 'L' + nodeCounter++); // Use L prefix for labels

            // Add the label to the graph
            graph.addCell(label);

            // Update node selection dropdowns in case labels can be linked
            updateNodeSelects();

            // Show success message
            showStatusMessage(`Label "${labelText}" added successfully.`);

            // Clear inputs
            labelTextInput.value = '';
        } catch (error) {
            console.error('Error adding label:', error);
            showError('Failed to add label: ' + error.message);
        }
    }

    // Create a link between nodes
    function createLink() {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            const sourceSelect = document.getElementById('sourceNode');
            const targetSelect = document.getElementById('targetNode');
            const linkLabelInput = document.getElementById('linkLabel');
            const linkColorInput = document.getElementById('linkColor');

            if (!sourceSelect || !targetSelect) {
                showError('Source or target node selectors not found');
                return;
            }

            const sourceId = sourceSelect.value;
            const targetId = targetSelect.value;
            const linkLabel = linkLabelInput ? linkLabelInput.value.trim() : '';
            const color = linkColorInput ? linkColorInput.value : '#1a237e';

            if (!sourceId || !targetId) {
                showStatusMessage('Please select both source and target nodes', true);
                return;
            }

            if (sourceId === targetId) {
                showStatusMessage('Source and target nodes must be different', true);
                return;
            }

            const source = graph.getCell(sourceId);
            const target = graph.getCell(targetId);

            if (!source || !target) {
                showStatusMessage('Selected nodes not found', true);
                return;
            }

            // Get source and target node labels for tooltip
            const sourceLabel = source.attr('label/text');
            const targetLabel = target.attr('label/text');
            const tooltipText = `${sourceLabel} → ${targetLabel}`;

            const link = new joint.shapes.standard.Link({
                source: { id: sourceId },
                target: { id: targetId },
                attrs: {
                    line: {
                        stroke: color,
                        strokeWidth: 2,
                        targetMarker: {
                            type: 'path',
                            d: 'M 10 -5 0 0 10 5 z'
                        }
                    }
                },
                labels: linkLabel ? [
                    {
                        position: 0.5,
                        attrs: {
                            text: {
                                text: linkLabel,
                                fill: '#333',
                                fontWeight: 'bold',
                                fontSize: 12,
                                textAnchor: 'middle',
                                textVerticalAnchor: 'middle',
                                textDecoration: 'none'
                            },
                            rect: {
                                fill: 'white',
                                stroke: color,
                                strokeWidth: 1,
                                rx: 3,
                                ry: 3
                            }
                        },
                        size: {
                            width: 'auto',
                            height: 'auto'
                        }
                    }
                ] : []
            });

            // Set link properties
            link.set('tooltip', tooltipText);
            link.set('customLabel', linkLabel || '');

            graph.addCell(link);
            showStatusMessage('Link created successfully.');

            // Clear link label input
            if (linkLabelInput) linkLabelInput.value = '';
        } catch (error) {
            console.error('Error creating link:', error);
            showError('Failed to create link: ' + error.message);
        }
    }

    // Update node selection dropdowns
    function updateNodeSelects() {
        try {
            if (!graph) return;

            const nodes = graph.getElements();
            const sourceSelect = document.getElementById('sourceNode');
            const targetSelect = document.getElementById('targetNode');

            if (!sourceSelect || !targetSelect) return;

            sourceSelect.innerHTML = '';
            targetSelect.innerHTML = '';

            if (nodes.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No nodes available';
                sourceSelect.appendChild(option.cloneNode(true));
                targetSelect.appendChild(option);
                return;
            }

            // Add empty default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a node';
            sourceSelect.appendChild(defaultOption.cloneNode(true));
            targetSelect.appendChild(defaultOption.cloneNode(true));

            nodes.forEach(node => {
                // Skip if this is an unidentified element
                if (!node.attr || typeof node.attr !== 'function') return;

                try {
                    const option = document.createElement('option');
                    option.value = node.id;

                    // The nodeId helps identify the node in the list
                    const nodeId = node.get('nodeId') || '?';
                    const nodeText = node.attr('label/text');
                    const isLabel = node.get('isLabel');

                    option.textContent = `${isLabel ? 'Label' : 'Node'} ${nodeId}: ${nodeText}`;

                    sourceSelect.appendChild(option.cloneNode(true));
                    targetSelect.appendChild(option);
                } catch (e) {
                    console.error('Error creating option for node:', e);
                }
            });
        } catch (error) {
            console.error('Error updating node selects:', error);
        }
    }

    // Export graph to Excel
    function exportToExcel() {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            const nodes = graph.getElements();
            const links = graph.getLinks();

            if (nodes.length === 0) {
                showStatusMessage('No nodes to export. Please create some nodes first.', true);
                return;
            }

            // Create nodes worksheet
            const nodesWS = XLSX.utils.aoa_to_sheet([
                ['Node ID', 'Label', 'Notes/Tooltip', 'Width', 'Height', 'Color', 'X Position', 'Y Position', 'Type']
            ]);

            // Filter out normal nodes (not labels)
            const normalNodes = nodes.filter(node => !node.get('isLabel'));
            const labelNodes = nodes.filter(node => node.get('isLabel'));

            // Add normal nodes first with sequential IDs
            normalNodes.forEach(node => {
                const nodeId = node.get('nodeId') || '?';
                XLSX.utils.sheet_add_aoa(nodesWS, [[
                    nodeId, // Use our sequential ID
                    node.attr('label/text'),
                    node.get('tooltip') || '',
                    node.get('size').width,
                    node.get('size').height,
                    node.attr('body/fill'),
                    node.get('position').x,
                    node.get('position').y,
                    'Node'
                ]], { origin: -1 });
            });

            // Then add label nodes
            labelNodes.forEach(node => {
                const nodeId = node.get('nodeId') || 'L?';
                XLSX.utils.sheet_add_aoa(nodesWS, [[
                    nodeId,
                    node.attr('label/text'),
                    node.get('tooltip') || '',
                    node.get('size').width,
                    node.get('size').height,
                    node.attr('body/fill'),
                    node.get('position').x,
                    node.get('position').y,
                    'Label'
                ]], { origin: -1 });
            });

            // Create links worksheet
            const linksWS = XLSX.utils.aoa_to_sheet([
                ['Source Node ID', 'Target Node ID', 'Color', 'Link Label', 'Tooltip']
            ]);

            links.forEach(link => {
                const sourceCell = graph.getCell(link.get('source').id);
                const targetCell = graph.getCell(link.get('target').id);

                if (sourceCell && targetCell) {
                    const sourceId = sourceCell.get('nodeId') || '?';
                    const targetId = targetCell.get('nodeId') || '?';

                    XLSX.utils.sheet_add_aoa(linksWS, [[
                        sourceId,
                        targetId,
                        link.attr('line/stroke'),
                        link.get('customLabel') || '',
                        link.get('tooltip')
                    ]], { origin: -1 });
                }
            });

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, nodesWS, 'Nodes');
            XLSX.utils.book_append_sheet(wb, linksWS, 'Links');

            // Save file
            XLSX.writeFile(wb, 'graph_data.xlsx');
            showStatusMessage('Graph data exported to Excel successfully.');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            showError('Failed to export to Excel: ' + error.message);
        }
    }

    // Zoom controls
    function zoomIn() {
        try {
            if (!paper) return;
            const currentScale = paper.scale();
            paper.scale(currentScale.sx * 1.2, currentScale.sy * 1.2);
        } catch (error) {
            console.error('Error zooming in:', error);
        }
    }

    function zoomOut() {
        try {
            if (!paper) return;
            const currentScale = paper.scale();
            paper.scale(currentScale.sx * 0.8, currentScale.sy * 0.8);
        } catch (error) {
            console.error('Error zooming out:', error);
        }
    }

    function resetView() {
        try {
            if (!paper) return;
            paper.translate(0, 0);
            paper.scale(1, 1);
            showStatusMessage('View reset to default.');
        } catch (error) {
            console.error('Error resetting view:', error);
        }
    }

    // Initialize event listeners
    document.addEventListener('DOMContentLoaded', function() {
        try {
            // Initialize the graph
            const success = initGraph();
            if (!success) {
                document.querySelectorAll('button').forEach(btn => {
                    btn.disabled = true;
                });
                showError('Failed to initialize the graph. Please check the console for details.');
                return;
            }

            // Color picker sync
            setupColorPicker('nodeColor', 'nodeColorHex');
            setupColorPicker('linkColor', 'linkColorHex');
            setupColorPicker('labelColor', 'labelColorHex');

            // Initial update of node selects
            updateNodeSelects();
        } catch (error) {
            console.error('Error initializing graph:', error);
            showError('Failed to initialize graph: ' + error.message);
        }
    });

    // Helper function to set up color pickers
    function setupColorPicker(colorInputId, hexInputId) {
        const colorInput = document.getElementById(colorInputId);
        const hexInput = document.getElementById(hexInputId);

        if (!colorInput || !hexInput) return;

        // Update hex when color changes
        colorInput.addEventListener('input', function(e) {
            hexInput.value = e.target.value;
        });

        // Update color when hex changes
        hexInput.addEventListener('input', function(e) {
            // Validate hex color format
            const hexColor = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
                colorInput.value = hexColor;
            }
        });
    }

    // Add a node from Excel data
    function addNodeFromExcel(nodeId, label, tooltip, width, height, color, x, y) {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            const node = new joint.shapes.standard.Rectangle({
                position: { x: parseInt(x), y: parseInt(y) },
                size: { width: parseInt(width), height: parseInt(height) },
                attrs: {
                    body: {
                        fill: color,
                        stroke: '#000',
                        strokeWidth: 2,
                        rx: 6,
                        ry: 6
                    },
                    label: {
                        text: label,
                        fill: 'white',
                        fontSize: 14,
                        fontWeight: 'bold',
                        textVerticalAnchor: 'middle',
                        textAnchor: 'middle'
                    }
                }
            });

            // Add custom properties
            node.set('tooltip', tooltip || '');
            node.set('nodeId', nodeId);

            // Add the node to the graph
            graph.addCell(node);
        } catch (error) {
            console.error('Error adding node from Excel:', error);
            showError('Failed to add node from Excel: ' + error.message);
        }
    }

    // Add a label from Excel data
    function addLabelFromExcel(nodeId, label, tooltip, width, height, color, x, y) {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            const labelElement = new joint.shapes.standard.Rectangle({
                position: { x: parseInt(x), y: parseInt(y) },
                size: { width: parseInt(width), height: parseInt(height) },
                attrs: {
                    body: {
                        fill: color,
                        stroke: '#000',
                        strokeWidth: 1,
                        rx: 5,
                        ry: 5
                    },
                    label: {
                        text: label,
                        fill: 'white',
                        fontSize: 14,
                        fontWeight: 'bold',
                        textVerticalAnchor: 'middle',
                        textAnchor: 'middle'
                    }
                }
            });

            // Add custom properties
            labelElement.set('tooltip', tooltip || '');
            labelElement.set('nodeId', nodeId);
            labelElement.set('isLabel', true);

            // Add the label to the graph
            graph.addCell(labelElement);
        } catch (error) {
            console.error('Error adding label from Excel:', error);
            showError('Failed to add label from Excel: ' + error.message);
        }
    }

    // Create a link from Excel data
    function createLinkFromExcel(sourceId, targetId, color, linkLabel, tooltip) {
        try {
            if (!graph) {
                showError('Graph not initialized. Please refresh the page.');
                return;
            }

            // Find source and target elements by their nodeId
            const source = graph.getElements().find(el => el.get('nodeId') === sourceId);
            const target = graph.getElements().find(el => el.get('nodeId') === targetId);

            if (!source || !target) {
                console.warn(`Could not find source or target elements for link: ${sourceId} -> ${targetId}`);
                return;
            }

            const link = new joint.shapes.standard.Link({
                source: { id: source.id },
                target: { id: target.id },
                attrs: {
                    line: {
                        stroke: color,
                        strokeWidth: 2,
                        targetMarker: {
                            type: 'path',
                            d: 'M 10 -5 0 0 10 5 z'
                        }
                    }
                },
                labels: linkLabel ? [
                    {
                        position: 0.5,
                        attrs: {
                            text: {
                                text: linkLabel,
                                fill: '#333',
                                fontWeight: 'bold',
                                fontSize: 12,
                                textAnchor: 'middle',
                                textVerticalAnchor: 'middle',
                                textDecoration: 'none'
                            },
                            rect: {
                                fill: 'white',
                                stroke: color,
                                strokeWidth: 1,
                                rx: 3,
                                ry: 3
                            }
                        },
                        size: {
                            width: 'auto',
                            height: 'auto'
                        }
                    }
                ] : []
            });

            // Set link properties
            link.set('tooltip', tooltip || '');
            link.set('customLabel', linkLabel || '');

            graph.addCell(link);
        } catch (error) {
            console.error('Error creating link from Excel:', error);
            showError('Failed to create link from Excel: ' + error.message);
        }
    }

    // Expose functions to the global scope for button onclick handlers
    window.addNode = addNode;
    window.addLabel = addLabel;
    window.createLink = createLink;
    window.exportToExcel = exportToExcel;
    window.zoomIn = zoomIn;
    window.zoomOut = zoomOut;
    window.resetView = resetView;
    window.addNodeFromExcel = addNodeFromExcel;
    window.addLabelFromExcel = addLabelFromExcel;
    window.createLinkFromExcel = createLinkFromExcel;

    // Getter functions to access graph objects
    window.getGraph = function() {
        return graph;
    };

    window.getPaper = function() {
        return paper;
    };
}

function redirect_to_view() {
    window.location.href = 'https://motawala.github.io/Graph_Visuals/';
}
