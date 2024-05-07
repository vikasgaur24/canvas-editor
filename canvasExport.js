// canvasExport.js
export function saveCanvasAsImage(canvas, imageFormat, dpi) {
    const scaleFactor = dpi / 96; // Baseline DPI is 96
    const width = canvas.width * scaleFactor;
    const height = canvas.height * scaleFactor;

    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    let tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0, width, height);
    return tempCanvas.toDataURL(imageFormat);
}

export function triggerDownload(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
