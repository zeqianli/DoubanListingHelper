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
        case "steam":
        case 'imdb':
        // case "soundcloud": // TODO
            console.log("Metadata received in background");
            console.log(msg.data);
            data=JSON.parse(msg.data);
            if (data['imgUrl']){
                browser.downloads.download({'url': data['imgUrl']}).then(
                    (id)=>{console.log('Image downloaded');}, 
                    (error)=>{console.log("Image download failed");}
                );
            }
            break;
        case "doubanMusic1":
        case 'doubanGame1':
        case 'doubanMovie1':
            console.log(data);
            try{
            if (data){
                console.log("Douban message received and meta is stored in background.");
                getActiveTab().then((tabs) =>{
                    browser.tabs.sendMessage(tabs[0].id, {'data':JSON.stringify(data)});
                    data=null;
                });
            }
            } catch(err) {console.log(err);}
            break;
    }
});

console.log("background console ends");