// console.log('content script starts');


let listingKeys={
    'music':    ['album','barcode','albumAltName','artist1','artist1','genre','releaseType','media','date','label','numOfDiscs','isrc','tracks','description'],
    'movie':    [],
    'game':     [],
    'book':     []
}


// ====== Douban ====== 

class DoubanPage {
    keys=null;

    constructor(){

    }
 
    fill(listing) {
        for (key in this.keys){
            let element=this.getElement(key) // an array: [element, elementType, elementParas]
            try{
                this.fillElement(element[2],element[0],element[1],listing[key])
            } catch(err){
                console.log("Can't fill "+key); 
            }
        }
    }

    getElement(key){
        throw "Not Implemented"
    } 

    fillElement(element, elementType, elementParas,value){    
        // fill value to the web element
        switch (elementType){
            case 'text': // small textbox
            case 'textLarge': // large textbox
            case 'date': // date
                element.value=value;
                break;
            case 'dropdown': // dropdown 
                try{
                    fillDropdown(element, value, elementParas);
                } catch {err} {
                    throw "Illegal dropdown parameter!";
                }
                
        }
    } 

    fillDropdown(dropdown, value, keys){
        let i=0;
        for (key in keys){
            if (value==key) break;
            i+=1;
        }
        // console.log(i);
        if (i<length(keys)) {
            dropdown.getElementsByClassName('options')[0].getElementsByClassName('sub')[i].click();
        }
    }

}

class DoubanMusicPage1 extends DoubanPage {
    keys=listingKeys['music'];

    getElement(key){
        switch (key){
            case 'album':   return ['text',null,document.getElementById('p_title')]
            case 'barcode': return ['text',null,document.getElementById('uid')]
        }
    }

    click(listing){
        let button;
        if (listing.get('barcode')){
            // console.log('have barcode');
            button=document.getElementsByClassName('submit')[0];
        } else{
            button=document.getElementsByClassName('btn-link')[0];
        }
        button.click(); 
    }
}


class DoubanMusicPage2 extends DoubanPage {
    keys=listingKeys['music'];

    dropdownKeys={
        'genre':['Blues','Classical','EasyListening','Electronic','Folk','FunkSoulRnB','Jazz','Latin','Pop','Rap','Reggae' ,'Rock','Soundtrack','World'],
        'releaseType':['Album', 'Compilation','EP', 'Single','Bootleg', 'Video'],
        'media':['CD','Digital','Cassette','Vinyl']
    }

    getElement(key){
        switch (key){
            case 'album': return ['text',null,document.getElementsByClassName('item basic')[0].getElementsByClassName('input_basic modified')];
            case 'date': return ['date',null,document.getElementsByClassName('item basic')[1].getElementsByClassName('datepicker input_basic hasDatepicker')[0]];
            case 'label': return ['text',null,document.getElementsByClassName('item basic')[2].getElementsByClassName('input_basic')[0]];
            case 'numberOfDiscs': return ['text',null,document.getElementsByClassName('item basic')[3].getElementsByClassName('input_basic')[0]];
            case 'isrc': return ['text',null,document.getElementsByClassName('item basic')[4].getElementsByClassName('input_basic')[0]];
            case 'albumAltName': return ['text',null,document.getElementsByClassName('item list')[0].getElementsByClassName('input_basic')[0]];
            case 'artist0': return ['text',null,document.getElementsByClassName('item list musicians')[0].getElementsByClassName('input_basic')[0]];
            case 'artist1': return ['text',null,document.getElementsByClassName('item list musicians')[0].getElementsByClassName('input_basic')[1]];
            case 'artist2': return ['text',null,document.getElementsByClassName('item list musicians')[0].getElementsByClassName('input_basic')[2]];
            case 'genre': return ['dropdown',this.dropdownKeys['genre'],document.getElementsByClassName('dropdown')[0]];
            case 'releaseType': return ['dropdown',this.dropdownKeys['releaseType'],document.getElementsByClassName('dropdown')[1]];
            case 'media': return ['dropdown',this.dropdownKeys['media'],document.getElementsByClassName('dropdown')[2]];
            case 'tracks': return ['textLarge',null,document.getElementsByClassName('item text section')[0].getElementsByClassName('textarea_basic')[0]];
            case 'description': return ['textLarge',null,document.getElementsByClassName('item text section')[1].getElementsByClassName('textarea_basic')[0]];
        }
    }
    
    click(listing){
        // Jump to the next page
        throw "NotImplemented"
    }    
}

class DoubanMusicPage3 extends DoubanPage { // TODO: auto-select image
    keys=listingKeys['music'];
} 

class DoubanMoviePage1 extends DoubanPage {
    keys=listingKeys['movie'];
}

class DoubanMoviePage2 extends DoubanPage {
    keys=listingKeys['movie'];
}

class DoubanBookPage1 extends DoubanPage {
    keys=listingKeys['book'];
}

class DoubanBookPage2 extends DoubanPage {
    keys=listingKeys['book'];
}

class DoubanGamePage1 extends DoubanPage {
    keys=listingKeys['game'];
}

class DoubanGamePage2 extends DoubanPage {
    keys=listingKeys['game'];
}


// ===== SourcePage ======

class SourcePage {
    keys=null
    data={}

    constructor(){
        for (let key in keys){
            this.data[keys]=null
        }
    }

    collect(){
        for (let key in keys){
            try {
                this.data[key]=this.collectItem(key);
                if (key=='date') this.data[key]=this.formatDate(this.data[key]);
                else if (key=='description'){
                    const suffix="本条目由豆瓣条目添加助手自动生成（https://www.douban.com/note/790499272/)，如有信息错误请更正。感谢为豆瓣添砖加瓦。"
                    this.data['key']=this.data['key']+"\n\n" + suffix;
                }
            } catch (err) {
                console.log("Error for collecting " + key);
                console.log(err);
            }
        }
        return this.data
    }

    collectItem(key){
        // I do it this way to make the data collection more robust to exceptions. 
    }

    formatDate(dateStr) {
        // This is a general purpose formatter 
        // supported format: yyyy年mm月dd日; yyyy/mm/dd; mm/dd/yyyy; month/dd/yyyy; dd/month/yyyy; yyyy; month/yyyy; mm/yyyy； 
        try{
            let spl=dateStr.split(/ ?[, 年月日] ?/).filter(n=>n);
            const monthNameMap={"jan":"01","feb":"02","mar":"03","apr":"04","may":"05","jun":"06","jul":"07","aug":"08","sep":"09","oct":"10","nov":"11","dec":"12","january":"01","february":"02","march":"03","april":"04","may":"05","june":"06","july":"07","august":"08","september":"09","october":"10","november":"11","december":"12"}
            let month="01", day="01", year='null';
            if (spl.length==1){
                year=dateStr;
            } else if (spl.length==2){
                month=spl[0];
                year=spl[1];
            } else if (spl.length>=3){
                if (spl[0].match(/\d\d\d\d/)){
                    year=spl[0],month=spl[1],day=spl[2];
                } else {
                    year=spl[2];
                    month=spl[0];
                    day=spl[1]
                    if (monthNameMap[String(day).toLowerCase()]){
                        month=spl[1];
                        day=spl[0];
                    }
                }
            } else {return null;}
            
            month=month.padStart(2,'0').toLowerCase();
            if (monthNameMap[month]) month=monthNameMap[month];
            day=day.padStart(2,'0')
            return `${year}-${month}-${day}`;
        } catch(err){
            return null
        }
    }


}

class Bandcamp extends SourcePage {
    keys=listingKeys['music'];

    collectItem(key){  
        switch (key){
            case 'url'           : return document.URL;
            case 'album'         : return document.getElementById('name-section').children[0].textContent.trim();
            case 'barcode'       : return null;
            case 'albumAltName'  : return null;
            case 'artist1'       : return [document.getElementById('name-section').children[1].getElementsByTagName('span')[0].textContent.trim()];
            case 'artist2'       : return [document.getElementById('name-section').children[1].getElementsByTagName('span')[0].textContent.trim()];
            case 'artist3'       : return [document.getElementById('name-section').children[1].getElementsByTagName('span')[0].textContent.trim()];
            case 'genre'         : return 'Electronic';
            case 'releaseType'   : return 'Album'; // Not labeled on Bandcamp
            case 'media'         : return 'Digital'; // Not labeled on Bandcamp
            case 'date'          : return document.getElementsByClassName("tralbumData tralbum-credits")[0].textContent.trim().split('\n')[0].replace('released ','');
            case 'label'         : return "Self-Released"; // Bandcamp doesn't have a generic way for label
            case 'numberOfDiscs' : return "1";
            case 'isrc'          : return null;
            case 'tracks': 
                return Array.from(document.getElementById('track_table').children[0].getElementsByClassName("track_row_view")).map((ele) =>{
                                 return ele.textContent.replaceAll(/[\n\t ]+/g,' ').replace(/ *buy track */,'').replace(/ *lyrics */,'').replace(/ *video */,'').trim()
                             }).join('\n').trim(); 
            case 'description'   : 
                let out=document.URL;
                try {
                    out+="\n\n"+document.getElementsByClassName("tralbumData tralbum-about")[0].textContent.trim()
                } catch (err){}
                return out;
            case 'imgUrl'       : return document.getElementById('tralbumArt').children[0].href; 
        }
    }
}

class AppleMusic extends SourcePage {
    keys=listKeys['music'];

    collectItem(key){
        switch (key){
            case 'url': return document.URL;
            case 'album': return document.getElementsByClassName('album-header-metadata')[0].children[0].textContent.trim();
            case 'barcode': return null;
            case 'artists': return document.getElementsByClassName('album-header-metadata')[0].children[1].textContent.trim();
            case 'genre':
                let genre=document.getElementsByClassName('album-header-metadata')[0].children[2].textContent.trim().split("·")[0].trim();
                const genreNameMap={'Dance':'Electronic','Hip-Hop':'Rap','HipHop':'Rap','Alternative':'Rock', "Hip-Hop/Rap":'Rap'};
                if (genre && genreNameMap[genre]) return genreNameMap[genre];
                else return null;
            case 'releaseType': return 'Album'; // TODO
            case 'media': return 'Digital';
            case 'date': return document.getElementsByClassName("bottom-metadata")[0].getElementsByClassName('song-released-container')[0].textContent.replace("RELEASED",'').trim() 
            case 'label':
                return document.getElementsByClassName("bottom-metadata")[0].getElementsByClassName('song-copyright')[0].textContent.replace(/℗ \d+ /,'');
            case 'numberOfDiscs': return "1"; // TODO
            case 'tracks':
                let tracksText="";
                let songs=document.getElementsByClassName("songs-list")[0].getElementsByClassName('song-name');
                for (i=0;i<songs.length;i++){
                    tracksText+=`${i+1}. ${songs[i].textContent.trim()}\n`;
                } 
                return tracksText
            case 'description':
                let description=document.URL;
                try{
                    description+='\n\n'+document.getElementsByClassName('product-page-header')[0].getElementsByClassName('truncated-content-container')[0].textContent.replace(/Editors’ Notes/,'').trim()
                } catch(err){}
                return description;

            case 'imgUrl':
                
                let _arr=document.getElementsByClassName('product-info')[0].getElementsByTagName('source')[1].srcset.split(" ");
                return _arr[_arr.length-2];
        }
    }
}

class Discog extends SourcePage {
    keys=listKeys['music'];

    collectItem(key){
        switch(key){
            

            
            case 'url': return document.URL
            case 'album': return document.getElementsByClassName('profile')[0].children[0].children[1].textContent.trim()
            case 'artist0':
            case 'artist1':
            case 'artist2':
                return Array.from(profileBlock.children[0].children[0].children).map((ele)=>{return ele.title.trim()}); // TODO 
            case 'media': return 'Vinyl'; // default
            case 'label': return 'Self-Released'; //default
            case 'genre':
            case 'date':
            case 'media':
            case 'label':
                let profileBlock=document.getElementsByClassName('profile')[0];
                const keyRenameMap={'Genre': 'genre', 'Year': 'date', "Format":"media","Released":'date', 'Label': 'label'};
                const valueRenameMap={'Hip Hop':'Rap'}
                for (let i=1;i<profileBlock.children.length-1;i+=2){ //This handles genre, media, date, label
                    try{
                        let key=profileBlock.children[i].textContent.replace(":","").trim();
                        let value=profileBlock.children[i+1].children[0].textContent.trim(); // TODO: multiple genres, multiple labels, etc; empty entry
                        key=keyRenameMap[key]
                        if (key){
                            if (valueRenameMap[value]) value=valueRenameMap[value];
                            out[key]=value;
                        }
                    } catch (err){}
                } // TODO
            
            case 'releaseType': return 'Album'; // TODO: detect single/ep/album by # of tracks
            case 'numberOfDiscs': 1;
            case 'tracks':
                let tracks=document.getElementById('tracklist').getElementsByTagName('tbody')[0]
                let trackText="";
                for (let i=0;i< tracks.children.length;i++){
                    let track=tracks.children[i]
                    let trackPos=(i+1).toString();
                    let es=track.getElementsByClassName("tracklist_track_pos")
                    if (es.length>0) trackPos=es[0].textContent.trim();
                    let trackTitle=''
                    es=track.getElementsByClassName("tracklist_track_title")
                    if (es.length>0) trackTitle=es[0].textContent.trim();
                    let trackDur=''
                    es=track.getElementsByClassName("tracklist_track_duration")
                    if (es.length>0) trackDur=es[0].textContent.trim();
                    trackText+=`${trackPos} - ${trackTitle} ${trackDur}\n`
                }
                return trackText;

            case 'description': 
                let description=document.URL;
                try{
                    description+='\n\n'+document.getElementById('notes').children[1].textContent.trim();
                } catch (err){}
                return description

            case 'imgUrl':
                return JSON.parse(document.getElementById('page_content').getElementsByClassName("image_gallery")[0].attributes['data-images'].nodeValue)[0]['full'];
        }
    }
    
}

class Soundcloud extends SourcePage {
    keys=listKeys['music'];
}

class IMDB extends SourcePage {
    keys=listKeys['movie'];
}

class Steam extends SourcePage {
    keys=listKeys['game'];
}

class AmazonBook extends SourcePage {
    keys=listKeys['book'];
}



// ====== Main ======


// console.log("Testing plugin");
// console.log(getCurrentPage());


let getCurrentPage=()=>{
    let match=window.location.href.match(/([\w]+)\.com/);
    let site=match && match[1];
    let page;

    switch(site){
        case 'douban':
            let nBasic=document.getElementsByClassName('basic').length;
            if (nBasic==2) page='douban-1';
            else if (nBasic>2) page='douban-2';
            else page='douban-3';
            break;
        case 'bandcamp':
        case 'discogs':
        case 'soundcloud':
        case 'apple':
            page=site;
            break;
    }
    return page
}

let collectMeta=(currentPage) => {
    switch (currentPage){
        case "bandcamp":
            return collectBandcampMeta();
        case "discogs":
            return collectDiscogsMeta();
        case "soundcloud":
           return collectSoundcloudMeta();
        case "apple":
            return collectAppleMeta();
        default:
            return null
    }
}


const localStorageId='DoubanListingMetadata'


let createButton = (currentPage)=>{
    var button=document.createElement("Button");
    button.innerHTML ="Collect";
    button.style = "top:0;left:0;position:absolute;z-index:9999";
    button.onclick=function(){
        let meta=collectMeta(currentPage);
        browser.runtime.sendMessage({page:currentPage,meta: JSON.stringify(meta)});
        window.open("https://music.douban.com/new_subject");
    };
    document.body.appendChild(button);
}

let main = ()=>{
    let currentPage=getCurrentPage();

    // Default action: add buttons to bandcamp/discogs/soundcloud/apple pages
    switch(currentPage){
        case 'bandcamp':
        case 'discogs':
        case 'apple':
        // case 'soundcloud':
            createButton(currentPage);
        case 'douban-1':
        case 'douban-2':
        case 'douban-3':
            browser.runtime.sendMessage({page:currentPage});
            break;
    }

    // listens to background script message
    // only get message on douban-1 opened by the bandcamp button
    browser.runtime.onMessage.addListener(message => {
        console.log("Message from the background script:");
        if (message.meta){
            let metaBackground=JSON.parse(message.meta)
            if(currentPage=='douban-1'){
                fillDouban1(metaBackground,click=true);
                localStorage.setItem(localStorageId, JSON.stringify(metaBackground));
            }
        }

    });

    // autofill douban-2 if meta is stored to localStorage
    let metaStored=localStorage.getItem(localStorageId)
    if (metaStored){
        metaStored=JSON.parse(metaStored);
        if (currentPage=='douban-2'){
            fillDouban2(metaStored,click=false);
        }
        localStorage.removeItem(localStorageId);
    }

}

main()


console.log('content script ends');


// TODO
// https://www.discogs.com/Various-Sweet-House-Chicago/master/79323
// https://adaptedrecords.bandcamp.com/album/freedom
// https://music.apple.com/cn/album/%E6%90%96%E6%BB%BE86/1391495014 (date)
// get track duration on apple music
// https://www.discogs.com/Greekboy-Shaolin-Technics/release/11434711 (format)
// https://music.apple.com/us/album/the-palmwine-express/1491006159 (url)
// https://www.discogs.com/Various-Starship-The-De-Lite-Superstars/release/569725 (genre name map)
// https://www.discogs.com/Richard-Groove-Holmes-Soul-Power/release/2997598 (artist)
// [FIXED] bc track list sometimes has extra space (https://lbrecordings.bandcamp.com/album/l-b020-hyperromantic-isle-of-dead-ep)
// Master page on discogs grab label from the first release. 
// Recognize digital on discog from format like this https://www.discogs.com/DJ-Trax-Find-A-Way-EP/release/16466505 
// Recognize artist/duration on apple music like this https://music.apple.com/us/album/lo-fi-house-zip/1490994043
// Auto recognize EP in album title: https://how2make.bandcamp.com/album/vortex-ep
// Recognize label on bandcamp from side column (if label==artist then use self-released)
// Recognize "12''" on discogs https://www.discogs.com/Wax-Doctor-Cruise-Control-EP/release/90227 
// guess a release is EP/album by track count/track list numbering
// Multiple artists on bandcamp? 
// Add tags onto bandcamp description