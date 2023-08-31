 export const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoicnVzdGFtLW5hcmF5YW4iLCJhIjoiY2xsZGVzYXlwMGExNDNkbjE1dmp2OW5hMSJ9.hPd2zmsCK-bEWCw6FcMfew';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/rustam-narayan/clldqixxc00zg01ph9nog22qm',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 10,
        // interactive: false 
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    // check documentation for adding more information and styling to the map
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};