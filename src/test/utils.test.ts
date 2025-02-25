import * as assert from 'assert';
import * as utils from '../utils';

suite('isGeoJSON test suite', () => {
    const feature = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [125.6, 10.1]
        },
        "properties": {
          "name": "Dinagat Islands"
        }
    };
    const stringifiedFeature = JSON.stringify(feature);
    
    const nonFeature = {
        'test': 100
    };
    const stringifiedNonFeature = JSON.stringify(nonFeature);

    const nonJsonString = '';

	test('Accepts a valid geojson', () => {
		const isValid = utils.isGeoJSON(stringifiedFeature);
        assert.strictEqual(isValid, true);
	});

    test('Rejects non-jsons', () => {
		const isValid = utils.isGeoJSON(nonJsonString);
        assert.strictEqual(isValid, false);
	});

    test('Rejects valid jsons but invalid geojsons', () => {
		const isValid = utils.isGeoJSON(stringifiedNonFeature);
        assert.strictEqual(isValid, false);
	}); 
});
