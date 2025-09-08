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
        
    // Make sure a text layer is selected
    if (app.activeDocument.activeLayer.kind == LayerKind.TEXT) {
        var layer = app.activeDocument.activeLayer;

        // Get text color (SolidColor)
        var textColor = layer.textItem.color;

        // Function: darken but keep saturation
        function darkenColor(color, brightnessFactor, saturationBoost) {
            var hsb = color.hsb;
            var newColor = new SolidColor();
            newColor.hsb.hue = hsb.hue;
            newColor.hsb.saturation = Math.min(100, hsb.saturation * saturationBoost);
            newColor.hsb.brightness = Math.max(0, hsb.brightness * brightnessFactor);
            return newColor;
        };

        // Darken by 20% but keep saturation strong
        var strokeColor = darkenColor(textColor, 0.7, 1.8); 

        // Apply stroke effect
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
        desc.putReference( charIDToTypeID("null"), ref );

        var fxDesc = new ActionDescriptor();
        var strokeDesc = new ActionDescriptor();

        strokeDesc.putBoolean( charIDToTypeID("enab"), true );                // Enable
        strokeDesc.putUnitDouble( charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), 1 ); // Stroke size
        strokeDesc.putEnumerated( charIDToTypeID("Pstn"), charIDToTypeID("FrFl"), charIDToTypeID("InsF") ); // Position: Outside

        // Set stroke color
        var colorDesc = new ActionDescriptor();
        colorDesc.putDouble( charIDToTypeID("Rd  "), strokeColor.rgb.red );
        colorDesc.putDouble( charIDToTypeID("Grn "), strokeColor.rgb.green );
        colorDesc.putDouble( charIDToTypeID("Bl  "), strokeColor.rgb.blue );
        strokeDesc.putObject( charIDToTypeID("Clr "), charIDToTypeID("RGBC"), colorDesc );

        strokeDesc.putEnumerated( charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml") ); // Normal blend mode
        strokeDesc.putUnitDouble( charIDToTypeID("Opct"), charIDToTypeID("#Prc"), 100 ); // 100% opacity

        fxDesc.putObject( charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), strokeDesc );
        desc.putObject( charIDToTypeID("T   "), charIDToTypeID("Lefx"), fxDesc );

        executeAction( charIDToTypeID("setd"), desc, DialogModes.NO );
        
    } else {
        alert("Please select a text layer first.");
    }


} else {
    alert("Please log in first.");
};


