// Align Basic in ExtendScript (JSX)

//Get token file path
function getTokenFilePath() {
    var isMac = ($.os.indexOf("Mac") !== -1);

    var basePath = isMac
        ? Folder("~/Library/Application Support/Adobe/UXP/PluginsStorage/PHSP")
        : Folder(Folder.userData + "/Adobe/UXP/PluginsStorage/PHSP");

    if (!basePath.exists) return null;

    // possible subfolders
    var subPaths = [
        "/External/ycommvn-typeset/PluginData/token.txt",
        "/Developer/ycommvn-typeset/PluginData/token.txt"
    ];

    // version folders
    var versionFolders = basePath.getFiles(function(f) {
        return f instanceof Folder && /^\d+$/.test(f.name);
    });
    versionFolders.sort(function(a, b) {
        return parseInt(b.name, 10) - parseInt(a.name, 10);
    });

    for (var i = 0; i < versionFolders.length; i++) {
        for (var j = 0; j < subPaths.length; j++) {
            var file = File(versionFolders[i].fsName + subPaths[j]);
            if (file.exists) return file.fsName;
        }
    }

    return null;
};

const tokenFilePath = getTokenFilePath();
const tokenFile = File(tokenFilePath);
if (tokenFile.exists) {

    // Align Remove Tail

    // Check if there is a pixel selection
    const hasSelection = function () {
        try {
            const bounds = app.activeDocument.selection.bounds;
            return bounds && bounds.length === 4;
        } catch (e) {
            return false; // No selection
        }
    };

    // Contract selection
    const contractSelection = function (px) {
        const desc = new ActionDescriptor();
        desc.putUnitDouble(charIDToTypeID("By  "), charIDToTypeID("#Pxl"), px);
        executeAction(charIDToTypeID("Cntc"), desc, DialogModes.NO);
    };

    // Smooth selection
    const smoothSelection = function (radius) {
        if (!hasSelection()) {
            alert("No pixel selection found for smoothing.");
            return;
        }
        if (radius <= 0) {
            alert("Invalid radius.");
            return;
        }
        const desc = new ActionDescriptor();
        desc.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), radius);
        executeAction(charIDToTypeID("Smth"), desc, DialogModes.NO);
    };

    // Align vertical centers
    const alignVertical = function () {
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("Usng"), stringIDToTypeID("alignDistributeSelector"), stringIDToTypeID("ADSCentersV"));
        desc.putBoolean(stringIDToTypeID("alignToCanvas"), false);
        executeAction(charIDToTypeID("Algn"), desc, DialogModes.NO);
    };

    // Align horizontal centers
    const alignHorizontal = function () {
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("Usng"), stringIDToTypeID("alignDistributeSelector"), stringIDToTypeID("ADSCentersH"));
        desc.putBoolean(stringIDToTypeID("alignToCanvas"), false);
        executeAction(charIDToTypeID("Algn"), desc, DialogModes.NO);
    };

    // Deselect
    const deselect = function () {
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("Ordn"), charIDToTypeID("None"));
        executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    };

    // Main function
    const alignRemoveTail = function () {
        if (!hasSelection()) {
            alert("No pixel selection found!");
            return;
        }

        const selectionBounds = app.activeDocument.selection.bounds;
        const left = selectionBounds[0].as("px");
        const right = selectionBounds[2].as("px");
        const contractPx = (right - left) * 0.07;

        contractSelection(contractPx);
        smoothSelection(8);

        alignVertical();
        alignHorizontal();
        deselect();
    };

    // Run
    alignRemoveTail();


} else {
    alert("Please log in first.");
}


