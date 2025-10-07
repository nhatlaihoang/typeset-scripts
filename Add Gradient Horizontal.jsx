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
        
    // Add Gradient Horizontal (Foreground → Background)

    function addGradientVertical() {
        const doc = app.activeDocument;

        // Store current foreground & background colors
        const fColor = app.foregroundColor.rgb;
        const bColor = app.backgroundColor.rgb;

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
        applyGradientEffect(tempLayer, fColor, bColor, 0);

        // Step 4: Move effect to original layer
        moveGradientEffect(originalLayerIndex);

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

    function applyGradientEffect(layer, fColor, bColor, angle) {
        const desc = new ActionDescriptor();
        const ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), stringIDToTypeID("layerEffects"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        desc.putReference(charIDToTypeID("null"), ref);

        const effectDesc = new ActionDescriptor();
        effectDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 416.6667);

        const gradFillDesc = new ActionDescriptor();
        gradFillDesc.putBoolean(charIDToTypeID("enab"), true);
        gradFillDesc.putBoolean(stringIDToTypeID("present"), true);
        gradFillDesc.putBoolean(stringIDToTypeID("showInDialog"), true);
        gradFillDesc.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
        gradFillDesc.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);

        const gradientDesc = new ActionDescriptor();
        gradientDesc.putString(charIDToTypeID("Nm  "), "Foreground to Background");
        gradientDesc.putEnumerated(stringIDToTypeID("gradientForm"), stringIDToTypeID("gradientForm"), stringIDToTypeID("customStops"));
        gradientDesc.putDouble(stringIDToTypeID("interfaceIconFrameDimmed"), 4096);

        const colorStops = new ActionList();
        const stop1 = new ActionDescriptor();
        stop1.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), makeRGB(fColor.red, fColor.green, fColor.blue));
        stop1.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("colorStopType"), stringIDToTypeID("userStop"));
        stop1.putInteger(charIDToTypeID("Lctn"), 0);
        stop1.putInteger(charIDToTypeID("Mdpn"), 50);
        colorStops.putObject(stringIDToTypeID("colorStop"), stop1);

        const stop2 = new ActionDescriptor();
        stop2.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), makeRGB(bColor.red, bColor.green, bColor.blue));
        stop2.putEnumerated(stringIDToTypeID("type"), stringIDToTypeID("colorStopType"), stringIDToTypeID("userStop"));
        stop2.putInteger(charIDToTypeID("Lctn"), 4096);
        stop2.putInteger(charIDToTypeID("Mdpn"), 50);
        colorStops.putObject(stringIDToTypeID("colorStop"), stop2);

        gradientDesc.putList(charIDToTypeID("Clrs"), colorStops);

        const transpStops = new ActionList();
        const t1 = new ActionDescriptor();
        t1.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
        t1.putInteger(charIDToTypeID("Lctn"), 0);
        t1.putInteger(charIDToTypeID("Mdpn"), 50);
        transpStops.putObject(stringIDToTypeID("transferSpec"), t1);

        const t2 = new ActionDescriptor();
        t2.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100);
        t2.putInteger(charIDToTypeID("Lctn"), 4096);
        t2.putInteger(charIDToTypeID("Mdpn"), 50);
        transpStops.putObject(stringIDToTypeID("transferSpec"), t2);

        gradientDesc.putList(charIDToTypeID("Trns"), transpStops);

        gradFillDesc.putObject(charIDToTypeID("Grad"), stringIDToTypeID("gradientClassEvent"), gradientDesc);
        gradFillDesc.putUnitDouble(charIDToTypeID("Angl"), charIDToTypeID("#Ang"), angle);
        gradFillDesc.putEnumerated(charIDToTypeID("Type"), charIDToTypeID("GrdT"), charIDToTypeID("Lnr "));
        gradFillDesc.putBoolean(charIDToTypeID("Rvrs"), false);
        gradFillDesc.putBoolean(charIDToTypeID("Dthr"), false);
        gradFillDesc.putEnumerated(stringIDToTypeID("gradientInterpolationMethod"), stringIDToTypeID("gradientInterpolationMethodType"), stringIDToTypeID("perceptual"));
        gradFillDesc.putBoolean(stringIDToTypeID("kgradientsLegacyRendering"), true);
        gradFillDesc.putBoolean(stringIDToTypeID("Algn"), true);
        gradFillDesc.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);

        const offsetDesc = new ActionDescriptor();
        offsetDesc.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Prc"), 0);
        offsetDesc.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Prc"), 0);
        gradFillDesc.putObject(charIDToTypeID("Ofst"), charIDToTypeID("Ofst"), offsetDesc);

        effectDesc.putObject(stringIDToTypeID("gradientFill"), stringIDToTypeID("gradientFill"), gradFillDesc);
        desc.putObject(charIDToTypeID("T   "), stringIDToTypeID("layerEffects"), effectDesc);

        executeAction(charIDToTypeID("setd"), desc, DialogModes.NO);
    };

    function makeRGB(r, g, b) {
        const rgb = new ActionDescriptor();
        rgb.putDouble(charIDToTypeID("Rd  "), r);
        rgb.putDouble(charIDToTypeID("Grn "), g);
        rgb.putDouble(charIDToTypeID("Bl  "), b);
        return rgb;
    };

    function moveGradientEffect(originalLayerIndex) {
        var idmove = stringIDToTypeID( "move" );
        var desc292 = new ActionDescriptor();
        var idnull = stringIDToTypeID( "null" );
            var ref21 = new ActionReference();
            var idgradientFill = stringIDToTypeID( "gradientFill" );
            ref21.putIndex( idgradientFill, 1 );
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

    addGradientVertical();


} else {
    alert("Please log in first.");
};


