// Phone Link cannot open the Android Home app on this PC. It falls back to
// a Bing search whose query is the app name, "home". This worker sends that
// tab to the Google Home site instead.
//
// manifest.json has no comments: Chrome rejects a manifest that is not
// strict JSON. Those fields mean:
//   manifest_version 3     current extension format; the background is a
//                           service worker, not a persistent page
//   permissions             webNavigation, so this file can see navigations
//   host_permissions        only https://www.bing.com/*, so the worker is
//                           not granted access to other sites
//   background              loads this file
//   action                  toolbar button, popup.html, and its icons
//   icons                   the same images used in chrome://extensions

// Signed-in Google Home web app. The "/u/0/" segment is the first Google
// account in the browser.
const TARGET = "https://home.google.com/u/0/";

// True only when the main Bing query is exactly "home".
// "home depot" and "google home" stay on Bing because searchParams returns
// the whole query, and this compares it to the single word.
function isHomeSearch(urlString) {
  let url;
  try {
    // Phone Link always passes an absolute https URL. Reject anything the
    // URL parser cannot read instead of throwing out of the listener.
    url = new URL(urlString);
  } catch {
    return false;
  }
  // Ignore http, other Bing hosts, and Bing pages that are not search.
  if (url.protocol !== "https:") return false;
  if (url.hostname !== "www.bing.com") return false;
  if (url.pathname !== "/search") return false;
  // Missing q is an empty string, which is not a match. Case is ignored
  // because Phone Link has sent both "home" and "Home".
  return (url.searchParams.get("q") || "").toLowerCase() === "home";
}

// Fires after Chrome has committed to a navigation but before the document
// is fetched, which keeps the Bing results page from being shown.
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    // frameId 0 is the tab itself. Subframes, such as Bing's own ads, must
    // not replace the whole tab.
    if (details.frameId !== 0) return;
    // The filter below is only a coarse host check. Confirm the query here.
    if (!isHomeSearch(details.url)) return;
    // Replace the tab URL. This does not open a second window.
    chrome.tabs.update(details.tabId, { url: TARGET });
  },
  // Wake the service worker only for Bing search navigations.
  { url: [{ hostEquals: "www.bing.com", pathEquals: "/search" }] }
);
