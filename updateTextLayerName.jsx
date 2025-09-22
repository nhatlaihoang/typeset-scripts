// Rename all text layers so their name = their text content
// Works on all layers, including inside groups

function renameTextLayers(layerSet) {
    for (var i = 0; i < layerSet.layers.length; i++) {
        var layer = layerSet.layers[i];
        
        if (layer.typename === "ArtLayer" && layer.kind === LayerKind.TEXT) {
            try {
                var textContent = layer.textItem.contents;
                // Trim long names to avoid absurdly long layer names
                if (textContent.length > 30) {
                    textContent = textContent.substring(0, 30) + "...";
                }
                layer.name = textContent;
            } catch (e) {
                // ignore locked or invalid text layers
            }
        }
        
        // If it's a group (LayerSet), recurse
        if (layer.typename === "LayerSet") {
            renameTextLayers(layer);
        }
    }
};

// Run on active document
if (app.documents.length > 0) {
    app.activeDocument.suspendHistory("Rename Text Layers", "renameTextLayers(app.activeDocument)");
} else {
    alert("No document open.");
}
