// === Resize Image Height by 10% (Unlinked Width) ===
// Increases only height, keeps width fixed

if (app.documents.length === 0) {
    alert("No document open.");
} else {
    var doc = app.activeDocument;
    var origWidth = doc.width.as("px");
    var origHeight = doc.height.as("px");

    var newHeight = origHeight * 1.1; // +10%

    doc.resizeImage(UnitValue(origWidth, "px"), UnitValue(newHeight, "px"), undefined, ResampleMethod.BICUBIC);
}
