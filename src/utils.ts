export function isGeoJSON(filetext: string){
    try {
        const object = JSON.parse(filetext);
        const hasType = 'type' in object;
        return hasType;
    } catch {
        return false;
    }
};
