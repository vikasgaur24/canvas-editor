// script.js
import { saveCanvasAsImage, triggerDownload } from './canvasExport.js';
import { testFunction } from './shapes.js';
testFunction();

import { Rectangle, Circle, Line, Pencil } from './shapes.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapes = []; // Array to store shape objects
let currentShape = null; 
let isDrawing = false;
let isDragging = false;
let startX = 0;
let startY = 0;
let selectedShapes = [];
let currentTool = 'select'; // Default tool
let undoStack = [];
let redoStack = [];


// Set up tool selection
document.getElementById('rectangleButton').addEventListener('click', () => setTool('rectangle'));
document.getElementById('circleButton').addEventListener('click', () => setTool('circle'));
document.getElementById('lineButton').addEventListener('click', () => setTool('line'));
document.getElementById('pencilButton').addEventListener('click', () => setTool('pencil'));
document.getElementById('selectButton').addEventListener('click', () => setTool('select'));
document.getElementById('undoButton').addEventListener('click', undo);
document.getElementById('redoButton').addEventListener('click', redo);
document.getElementById('downloadButton').addEventListener('click', () => {
    const imageFormat = document.getElementById('imageFormat').value;
    const dpi = parseInt(document.getElementById('dpiInput').value, 10);
    const imageDataUrl = saveCanvasAsImage(canvas, imageFormat, dpi);
    const extension = imageFormat.split('/')[1]; // 'png', 'jpeg', 'webp'
    const filename = `canvas_image.${extension}`;
    triggerDownload(imageDataUrl, filename);
})

function setTool(tool) {
    if (currentTool !== 'select') {
        selectedShapes = [];
    }
    currentTool = tool;
}

function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack whenever a new action is taken
}

document.addEventListener('DOMContentLoaded', function() {
    saveState(); // Save the initial state of the canvas
});

canvas.addEventListener('mousedown', function (e) {
    startX = e.offsetX;
    startY = e.offsetY;
    if (currentTool === 'select') {
        let index = findShape(startX, startY);
        if (index !== -1) {
            isDragging = true;
            selectedShapes = [shapes[index]]; // select single shape
        }
    } else {
        isDrawing = true;
        createShape(startX, startY);
    }
});

canvas.addEventListener('mousemove', function (e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    if (isDragging && selectedShapes.length) {
        const dx = mouseX - startX;
        const dy = mouseY - startY;
        selectedShapes.forEach(shape => shape.move(dx, dy));
        startX = mouseX;
        startY = mouseY;
        redrawCanvas();
    } else if (isDrawing) {
        if (currentShape) {
            updateShape(currentShape, startX, startY, mouseX, mouseY);
            redrawCanvas();
        }
    } else {
        // Hover effect for cursor
        canvas.style.cursor = findShape(mouseX, mouseY) !== -1 ? 'pointer' : 'default';
    }
});

canvas.addEventListener('mouseup', function () {
    if (isDrawing || isDragging) {
        saveState(); // Save the final state after drawing or moving a shape
    }
    isDrawing = false;
    isDragging = false;
});

function createShape(x, y) {
    switch (currentTool) {
        case 'rectangle':
            currentShape = new Rectangle(x, y, 0, 0);
            break;
        case 'circle':
            currentShape = new Circle(x, y, 0);
            break;
        case 'line':
            currentShape = new Line(x, y, x, y);
            break;
        case 'pencil':
            currentShape = new Pencil([{x, y}]);
            break;
    }
    shapes.push(currentShape);
}

function updateShape(shape, x1, y1, x2, y2) {
    if (shape instanceof Rectangle || shape instanceof Circle || shape instanceof Line) {
        shape.width = x2 - x1;
        shape.height = y2 - y1;
        if (shape instanceof Line) {
            shape.x2 = x2;
            shape.y2 = y2;
        } else if (shape instanceof Circle) {
            shape.radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
    } else if (shape instanceof Pencil) {
        shape.points.push({x: x2, y: y2});
    }
}

function findShape(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].contains({x, y})) {
            return i;
        }
    }
    return -1;
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => shape.draw(ctx));
}

function undo() {
    if (undoStack.length > 0) {
        const prevState = undoStack.pop();
        redoStack.push(canvas.toDataURL()); // Save current state before undoing
        loadState(prevState);
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(canvas.toDataURL()); // Save current state before redoing
        loadState(nextState);
    }
}

function loadState(state) {
    const img = new Image();
    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        // After drawing the previous state, update the shapes array if necessary
    };
    img.src = state;
}

