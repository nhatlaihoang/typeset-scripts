// Align Basic in ExtendScript (JSX)

//Get token file path
function getTokenFilePath() {
    var isMac = ($.os.indexOf("Mac") !== -1);

    // Correct UXP PluginsStorage base path
    var basePath = isMac
        ? Folder("~/Library/Application Support/Adobe/UXP/PluginsStorage/PHSP")
        : Folder(Folder.userData + "/Adobe/UXP/PluginsStorage/PHSP"); 
        // Folder.userData resolves to ~/AppData/Roaming on Windows

    // Different subpath for Mac vs Windows
    var subPath = isMac
        ? "/Developer/ycommvn-typeset/PluginData/token.txt"
        : "/External/ycommvn-typeset/PluginData/token.txt";
        
    var baseFolder = Folder(basePath);

    if (!baseFolder.exists) return null;

    // Find subfolders that are only numbers (Photoshop major versions)
    var versionFolders = baseFolder.getFiles(function(f) {
        return f instanceof Folder && /^\d+$/.test(f.name);
    });

    // Sort by newest version first
    versionFolders.sort(function(a, b) {
        return parseInt(b.name, 10) - parseInt(a.name, 10);
    });

    // Check each version folder for token.txt
    for (var i = 0; i < versionFolders.length; i++) {
        var file = File(versionFolders[i].fsName + subPath);
        if (file.exists) return file.fsName;
    }

    return null; // not found
}

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


