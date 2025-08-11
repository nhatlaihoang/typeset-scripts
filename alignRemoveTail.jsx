// Align Basic in ExtendScript (JSX)

const isMac = $.os.toLowerCase().indexOf("mac") >= 0;
const isWindows = $.os.toLowerCase().indexOf("windows") >= 0;

const tokenFilePath = isMac
    ? "~/Library/Application Support/Adobe/UXP/PluginsStorage/PHSP/25/Developer/ycommvn-typeset/PluginData/token.txt"
    : "~/AppData/Roaming/Adobe/UXP/PluginsStorage/PHSP/25/Developer/ycommvn-typeset/PluginData/token.txt"; //mock file path


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


