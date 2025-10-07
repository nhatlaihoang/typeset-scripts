
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
        
    // Add Stroke function

    function addStroke() {
        const doc = app.activeDocument;

        // Step 1: Get original layer index
        function getOriginalLayerIndex() {
            const ref = new ActionReference();
            ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt")); 
            return executeActionGet(ref).getInteger(stringIDToTypeID("itemIndex"));
        };

        const originalLayerIndex = getOriginalLayerIndex() - 1;

        // Step 2: Create temp layer
        const tempLayer = doc.artLayers.add();
        tempLayer.name = "TempGradient";

        // Step 3: Apply vertical gradient (90°)
        applyStroke(tempLayer);

        // Step 4: Move effect to original layer
        moveStroke(originalLayerIndex);

        // Step 5: Delete temp layer
        tempLayer.remove();

        //Select original layer
        selectOriginalLayer(originalLayerIndex);
    };

    function getActiveLayerIndex() {
        const ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        const desc = executeActionGet(ref);
        return desc.getInteger(stringIDToTypeID("itemIndex"));
    };

    function applyStroke(layer) {
        if (app.documents.length > 0) {
            var doc = app.activeDocument;
            var layer = layer;

            // Prompt user for stroke thickness
            var strokeSize = Number(prompt("Enter stroke thickness (px):", "5"));
            if (isNaN(strokeSize) || strokeSize <= 0) {
                alert("Invalid thickness. Operation cancelled.");
                exit(); // <-- use exit() instead of return
            };

            // Get current foreground color
            var fg = app.foregroundColor;

            // Build layer style (stroke) descriptor
            var idsetd = charIDToTypeID("setd");
            var desc = new ActionDescriptor();
            var idnull = charIDToTypeID("null");
            var ref = new ActionReference();
            var idPrpr = charIDToTypeID("Prpr");
            var idLefx = charIDToTypeID("Lefx");
            ref.putProperty(idPrpr, idLefx);
            ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            desc.putReference(idnull, ref);

            var idT = charIDToTypeID("T   ");
            var desc2 = new ActionDescriptor();

            // Stroke style
            var idFrFX = charIDToTypeID("FrFX");
            var desc3 = new ActionDescriptor();
            desc3.putBoolean(charIDToTypeID("enab"), true);          // enable stroke
            desc3.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF")); // Outside
            desc3.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), strokeSize); // stroke size

            // Stroke color
            var col = new ActionDescriptor();
            col.putDouble(charIDToTypeID("Rd  "), fg.rgb.red);
            col.putDouble(charIDToTypeID("Grn "), fg.rgb.green);
            col.putDouble(charIDToTypeID("Bl  "), fg.rgb.blue);
            desc3.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), col);

            desc2.putObject(idFrFX, idFrFX, desc3);
            desc.putObject(idT, idLefx, desc2);

            executeAction(idsetd, desc, DialogModes.NO);
        } else {
            alert("No document is open.");
            exit();
        };
    };

    function moveStroke(originalLayerIndex) {
        var idmove = stringIDToTypeID( "move" );
        var desc292 = new ActionDescriptor();
        var idnull = stringIDToTypeID( "null" );
            var ref21 = new ActionReference();
            var idStroke = charIDToTypeID("FrFX");
            ref21.putIndex( idStroke, 1 );
            var idlayer = stringIDToTypeID( "layer" );
            var idordinal = stringIDToTypeID( "ordinal" );
            var idtargetEnum = stringIDToTypeID( "targetEnum" );
            ref21.putEnumerated( idlayer, idordinal, idtargetEnum );
        desc292.putReference( idnull, ref21 );
        var idto = stringIDToTypeID( "to" );
            var ref22 = new ActionReference();
            var idlayer = stringIDToTypeID( "layer" );
            ref22.putIndex( idlayer, originalLayerIndex );
        desc292.putReference( idto, ref22 );
        executeAction( idmove, desc292, DialogModes.NO );
    };

    function selectOriginalLayer(originalLayerIndex) {
        var modifiedOriginalLayerIndex = originalLayerIndex;
        var ref = new ActionReference();
        ref.putIndex(charIDToTypeID("Lyr "), modifiedOriginalLayerIndex);
        var desc = new ActionDescriptor();
        desc.putReference(charIDToTypeID("null"), ref);
        desc.putBoolean(charIDToTypeID("MkVs"), false);
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    };

    addStroke();


} else {
    alert("Please log in first.");
};


