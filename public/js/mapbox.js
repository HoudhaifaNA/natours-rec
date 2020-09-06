/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaG91ZGhhaWZhZGV2IiwiYSI6ImNrZTVmNXkzNzAyNzgycm1pd3EwZTN1ejUifQ.w2GvKqG7mfqgQqDM-tM2Ig';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/houdhaifadev/cke5g3z0h23qe19o8yx1acvl0',
    scroolZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);
    // Extend Bounds

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      right: 100,
      left: 100,
    },
  });
};
