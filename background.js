console.log("background console starts");

let meta = null; // metadata

let getActiveTab = () => {
    return browser.tabs.query({active: true, currentWindow: true});
}

browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("received content message.");
    switch (msg.page) {
        case "bandcamp":
        case "discogs":
        case "apple":
            // case "soundcloud": // TODO
            console.log("Metadata received in background");
            meta = JSON.parse(msg.meta);
            if (meta['imgUrl']) {
                browser.downloads.download({'url': meta['imgUrl']}
                ).then(
                    (id) => {
                        console.log('Image downloaded');
                    },
                    (error) => {
                        console.log("Image download failed");
                    }
                );
            }

            break;
        case "douban-1":
            if (meta) {
                console.log("Douban-1 message received and meta is stored in background.")
                getActiveTab().then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, {'meta': JSON.stringify(meta)});
                    meta = null;
                });
            }
            break;
    }
});

console.log("background console ends");