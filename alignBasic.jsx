// Align Basic in ExtendScript (JSX)

const isMac = $.os.toLowerCase().indexOf("mac") >= 0;
const isWindows = $.os.toLowerCase().indexOf("windows") >= 0;

const tokenFilePath = isMac
    ? "~/Library/Application Support/Adobe/UXP/PluginsStorage/PHSP/25/Developer/ycommvn-typeset/PluginData/token.txt"
    : "~/AppData/Roaming/Adobe/UXP/PluginsStorage/PHSP/25/Developer/ycommvn-typeset/PluginData/token.txt"; //mock file path


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


