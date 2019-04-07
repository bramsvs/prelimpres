let myDiagram

function init() {
    // if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =
        $(go.Diagram, "myDiagramDiv",
            {
                allowCopy: false,
                allowDelete: false,
                "draggingTool.dragsTree": true,
                layout:
                    $(go.TreeLayout,
                        { angle: 90, layerSpacing: 30 }),
                "undoManager.isEnabled": true
            });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    function nodeFillConverter(figure) {
        switch (figure) {
            case "AndGate":
                // right to left so when it's rotated, it goes from top to bottom
                return $(go.Brush, "Linear", { 0: "#EA8100", 1: "#C66D00", start: go.Spot.Right, end: go.Spot.Left });
            case "OrGate":
                return $(go.Brush, "Linear", { 0: "#0058D3", 1: "#004FB7", start: go.Spot.Right, end: go.Spot.Left });
            case "Circle":
                return $(go.Brush, "Linear", { 0: "#009620", 1: "#007717" });
            case "Triangle":
                return $(go.Brush, "Linear", { 0: "#7A0099", 1: "#63007F" });
            default:
                return "whitesmoke";
        }
    }

    myDiagram.nodeTemplate =  // the default node template
        $(go.Node, "Spot",
            { selectionObjectName: "BODY", locationSpot: go.Spot.Center, locationObjectName: "BODY" },
            // the main "BODY" consists of a Rectangle surrounding some text
            $(go.Panel, "Auto",
                { name: "BODY", portId: "" },
                $(go.Shape,
                    { fill: $(go.Brush, "Linear", { 0: "#770000", 1: "#600000" }), stroke: null }),
                $(go.TextBlock,
                    {
                        margin: new go.Margin(2, 10, 1, 10), maxSize: new go.Size(100, NaN),
                        stroke: "whitesmoke", font: "10pt Segoe UI, sans-serif"
                    },
                    new go.Binding("text"))
            ),  // end "BODY", an Auto Panel
            $("TreeExpanderButton", { alignment: go.Spot.Right, alignmentFocus: go.Spot.Left, "ButtonBorder.figure": "Rectangle" }),
            $(go.Shape, "LineV",
                new go.Binding("visible", "figure", function (f) { return f !== "None"; }),
                { strokeWidth: 1.5, height: 20, alignment: new go.Spot(0.5, 1, 0, -1), alignmentFocus: go.Spot.Top }),
            $(go.Shape,
                new go.Binding("visible", "figure", function (f) { return f !== "None"; }),
                {
                    alignment: new go.Spot(0.5, 1, 0, 5), alignmentFocus: go.Spot.Top, width: 30, height: 30,
                    stroke: null
                },
                new go.Binding("figure"),
                new go.Binding("fill", "figure", nodeFillConverter),
                new go.Binding("angle", "figure", function (f) { return (f === "OrGate" || f === "AndGate") ? -90 : 0; })), // ORs and ANDs should point upwards
            $(go.TextBlock,
                new go.Binding("visible", "figure", function (f) { return f !== "None"; }), // if we don't have a figure, don't display any choice text
                {
                    alignment: new go.Spot(0.5, 1, 20, 20), alignmentFocus: go.Spot.Left,
                    stroke: "black", font: "10pt Segoe UI, sans-serif"
                },
                new go.Binding("text", "choice"))
        );

    myDiagram.linkTemplate =
        $(go.Link, go.Link.Orthogonal,
            { layerName: "Background", curviness: 20, corner: 5 },
            $(go.Shape,
                { strokeWidth: 1.5 })
        );

    load();
}

function save() {
    document.getElementById("mySavedModel").value = myDiagram.model.toJson();
    myDiagram.isModified = false;
}
function load() {
    myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

init()
// load()