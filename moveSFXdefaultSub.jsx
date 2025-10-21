
app.activeDocument.suspendHistory("Move Layers to Fixed Subgroup", "main()");

function main() {
    if (!app.documents.length) {
        alert("No document open.");
        return;
    };

    var doc = app.activeDocument;

    // === SET YOUR FOLDER NAMES HERE ===
    var parentName = "sfx";   // parent folder name
    var subName = "default sfx";       // subgroup name
    // ==================================

    var selectedLayers = getSelectedLayers();
    if (selectedLayers.length === 0) {
        alert("No layers selected!");
        return;
    };

    // Find or create parent and subgroup
    var parentGroup = findOrCreateGroup(doc, parentName);
    var subGroup = findOrCreateSubGroup(parentGroup, subName);

    // Move selected layers into the subgroup
    for (var i = 0; i < selectedLayers.length; i++) {
        selectedLayers[i].move(subGroup, ElementPlacement.INSIDE);
    };

    // Optional confirmation
    // alert("Moved " + selectedLayers.length + " layer(s) into '" + parentName + "/" + subName + "'");
}

// ===== Helper Functions =====

// Get selected layers safely
function getSelectedLayers() {
    var resultLayers = [];
    var ref = new ActionReference();
    ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("targetLayers"));
    ref.putEnumerated(stringIDToTypeID("document"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));

    try {
        var targetLayers = executeActionGet(ref).getList(stringIDToTypeID("targetLayers"));
        var doc = app.activeDocument;
        for (var i = 0; i < targetLayers.count; i++) {
            var layerIndex = targetLayers.getReference(i).getIndex();
            resultLayers.push(doc.layers[doc.layers.length - layerIndex]);
        }
    } catch (e) {
        resultLayers.push(app.activeDocument.activeLayer);
    }
    return resultLayers;
};

// Find or create a top-level group
function findOrCreateGroup(doc, name) {
    for (var i = 0; i < doc.layerSets.length; i++) {
        if (doc.layerSets[i].name === name) return doc.layerSets[i];
    }
    var newGroup = doc.layerSets.add();
    newGroup.name = name;
    return newGroup;
};

// Find or create a subgroup inside a parent group
function findOrCreateSubGroup(parent, name) {
    for (var i = 0; i < parent.layerSets.length; i++) {
        if (parent.layerSets[i].name === name) return parent.layerSets[i];
    }
    var newSub = parent.layerSets.add();
    newSub.name = name;
    return newSub;
};
