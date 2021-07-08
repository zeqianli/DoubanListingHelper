console.log("background console starts");

let data=null; // metadata

let getActiveTab=()=> {
    return browser.tabs.query({active: true, currentWindow: true});
}

browser.runtime.onMessage.addListener((msg, sender, sendResponse) =>{
    console.log("received content message.");
    switch (msg.page){
        case "bandcamp":
        case "discogs":
        case "apple":
        // case "soundcloud": // TODO
            console.log("Metadata received in background");
            console.log(msg.data);
            data=JSON.parse(msg.data);
            if (data['imgUrl']){
                browser.downloads.download({'url': data['imgUrl']}
                ).then(
                    (id)=>{console.log('Image downloaded');}, 
                    (error)=>{console.log("Image download failed");}
                );
            }
    
            break;
        case "doubanMusic1":
            if (data){
                console.log("DoubanMusic1 message received and meta is stored in background.")
                getActiveTab().then((tabs) =>{
                    browser.tabs.sendMessage(tabs[0].id, {'data':JSON.stringify(data)});
                    data=null;
                });
            }
            break;
    }
});

console.log("background console ends");