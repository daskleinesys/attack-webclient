const CALLBACK_NAME = 'googleMapsApiCallback';

let initialized = !!window.google;
let resolveInitPromise;
let rejectInitPromise;
const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve;
  rejectInitPromise = reject;
});

/**
 * adds a script tag to the DOM that loads the Google Maps JavaScript API (v3)
 * returns a Promise that is resolved (with the API object as first parameter) as soon as the API is ready
 * usage:
 * const google = await googleMapsApi();
 *
 * @returns {Promise}
 */
export default function googleMapsApi() {
  if (initialized) {
    return initPromise;
  }

  initialized = true;
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google);

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  let src = `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=drawing,geometry&callback=${CALLBACK_NAME}`;
  if (process.env.VUE_APP_GOOGLE_MAPS_API_KEY) {
    src += `&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`;
  }
  script.src = src;
  script.onerror = rejectInitPromise;
  document.querySelector('head').appendChild(script);

  return initPromise;
}
