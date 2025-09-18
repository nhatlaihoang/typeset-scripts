function makeLayersVisibleByName(targetName) {
    var doc = app.activeDocument;
    var allLayers = getAllLayers(doc);

    for (var i = 0; i < allLayers.length; i++) {
        var layer = allLayers[i];
        if (layer.name === targetName) {
            layer.visible = true;
        }
    }
};

// Helper function to flatten Photoshop’s layer sets into a list
function getAllLayers(parent) {
    var layers = [];
    for (var i = 0; i < parent.layers.length; i++) {
        var layer = parent.layers[i];
        if (layer.typename === "ArtLayer") {
            layers.push(layer);
        } else if (layer.typename === "LayerSet") {
            layers = layers.concat(getAllLayers(layer));
        }
    }
    return layers;
};

// Example usage: replace "Logo" with your desired layer name
makeLayersVisibleByName("체모");
