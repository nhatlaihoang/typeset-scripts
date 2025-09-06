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
        
    // Check if there's a selection
    function hasSelection(doc) {
        try {
            const bounds = doc.selection.bounds; // Will throw an error if no selection
            return bounds != null;
        } catch (e) {
            return false;
        }
    }

    // Align target layers vertically
    function alignVertical() {
        const idalign = charIDToTypeID("Algn");
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("Usng"), stringIDToTypeID("alignDistributeSelector"), stringIDToTypeID("ADSCentersV"));
        desc.putBoolean(stringIDToTypeID("alignToCanvas"), false);
        executeAction(idalign, desc, DialogModes.NO);
    }

    // Align target layers horizontally
    function alignHorizontal() {
        const idalign = charIDToTypeID("Algn");
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("Usng"), stringIDToTypeID("alignDistributeSelector"), stringIDToTypeID("ADSCentersH"));
        desc.putBoolean(stringIDToTypeID("alignToCanvas"), false);
        executeAction(idalign, desc, DialogModes.NO);
    }

    // Deselect selection
    function deselect() {
        const idsetd = charIDToTypeID("setd");
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("Ordn"), charIDToTypeID("None"));
        executeAction(idsetd, desc, DialogModes.NO);
    }

    // Main function
    function alignBasic() {
        if (!app.documents.length) {
            alert("No document is open!");
            return;
        }

        const doc = app.activeDocument;

        if (!hasSelection(doc)) {
            alert("No selection found!");
            return;
        }

        alignVertical();
        alignHorizontal();
        deselect();
    }

    // Run the function
    alignBasic();

} else {
    alert("Please log in first.");
}


