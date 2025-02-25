import * as vscode from 'vscode';
import { isGeoJSON } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('geojson-tool.viewGeoJSON', () => {
        const editor = vscode.window.activeTextEditor;
        const columnToShowIn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (editor){
            const document = editor.document;
            const documentName = document.fileName;
            const documentText = document.getText();

            if (isGeoJSON(documentText)){
                const panel = vscode.window.createWebviewPanel(
                    'geojson-tool',
                    `GeoJSON Tool - ${documentName}`,
                    columnToShowIn || vscode.ViewColumn.One,
                    {
                        enableScripts: true
                    }
                );
                panel.webview.html = createMap(
                    documentName,
                    documentText
                );
            } else {
                vscode.window.showWarningMessage("Selected file is not a valid GeoJSON.");
            }
        }
    });
    context.subscriptions.push(disposable);
}

function createMap(filename: string, filetext: string){
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename}</title>
     <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>
</head>
<style>
    #map {
        min-height: 400px;
        max-height: 75%;

        min-width: 400px;
        max-width: 50%;
    }
</style>
<body>
    <div id="map"></div>
</body>
<script>
const map = L.map('map');
const geojson = ${filetext};

const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
const geojsonLayer = L.geoJSON(geojson);
const bounds = geojsonLayer.getBounds();

tileLayer.addTo(map);
geojsonLayer.addTo(map);

map.fitBounds(bounds);
</script>
</html>
    `;
}

// This method is called when your extension is deactivated
export function deactivate() {}
