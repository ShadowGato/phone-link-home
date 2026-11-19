# Phone Link Home

Chrome extension that opens Google Home when Microsoft Phone Link / Notications opens a Bing search for the word `home`.

Link mirrors notifications from the Home app. Those notifications open the app on the phone/desktop. On Windows, Phone / Notifications Link cannot launch that app, so it searches Bing (Thanks MS) for the app name. This extension catches `https://www.bing.com/search?q=home` and sends the tab to `https://home.google.com/u/0/`.

Other Bing searches are unchanged. A search for `home depot` or `google home` stays on Bing. A Windows taskbar search for the single word `home` uses the same Bing address, so that search opens Google Home too.

This project is not affiliated with Google or Microsoft.

## Install

1. Clone this repository.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and choose this folder.

Click **Reload** on the extension card after pulling changes.

## What it matches

`background.js` listens for a top-level navigation to `https://www.bing.com/search` whose `q` parameter is exactly `home`, ignoring case. It then sets that tab's URL to `https://home.google.com/u/0/`.

`manifest.json` has no comments. Chrome rejects a manifest that is not strict JSON. The fields are explained at the top of `background.js`.
