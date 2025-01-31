console.log('content script starts');

let listingKeys={
    'music':    ['url','album','barcode','albumAltName','artist0','artist1','artist2','genre','releaseType','media','date','label','numberOfDiscs','isrc','tracks','description','imgUrl','reference'],
    'movie':    ['url','type','name','chineseName','altName','imdb','director','screenwriter','cast0','cast1','cast2','genre','website','region','language','year','date','debutRegion','length','description','imgUrl'],
    'game':     ['url','name','chineseName','platform','genre','date','description','imgUrl'],
    'book':     []
}


// ====== Douban ====== 

class DoubanPage {

    constructor(){
        this.keys=null;
    }
 
    fill(listing) {
        //console.log(this.keys);
        for (let key of this.keys){
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
                element.value=value || "";
                break;
            case 'dropdown': // dropdown 
                // console.log("check");
                try{
                    this.fillDropdown(element, value, elementParas);
                } catch {err} {
                    throw "Illegal dropdown parameter!";
                }
                
        }
    } 

    fillDropdown(dropdown, value, keys){
        // console.log("filling dropdown");
        let i=0;
        for (let key of keys){
            if (value==key) break;
            i+=1;
        }

        // console.log(i);
        if (i<keys.length) {
            dropdown.getElementsByClassName('options')[0].getElementsByClassName('sub')[i].click();
        }
    }

}

class DoubanMusicPage1 extends DoubanPage {

    constructor(){
        super();
        this.keys=listingKeys['music'];
        
    }

    getElement(key){
        switch (key){
            case 'album':   return ['text',null,document.getElementById('p_title')]
            case 'barcode': return ['text',null,document.getElementById('uid')]
        }
    }

    click(listing){
        console.log("clicking");
        let button;
        if (listing['barcode']){
            // console.log('have barcode');
            button=document.getElementsByClassName('submit')[0];
        } else{
            button=document.getElementsByClassName('btn-link')[0];
        }
        button.click(); 
    }
}


class DoubanMusicPage2 extends DoubanPage {
    constructor(){
        super();
        this.keys=listingKeys['music'];
        this.dropdownKeys={
            'genre':['Blues','Classical','EasyListening','Electronic','Folk','FunkSoulRnB','Jazz','Latin','Pop','Rap','Reggae' ,'Rock','Soundtrack','World'],
            'releaseType':['Album', 'Compilation','EP', 'Single','Bootleg', 'Video'],
            'media':['CD','Digital','Cassette','Vinyl']
        }
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
            case 'reference': return ['textLarge',null,document.getElementsByClassName('item text section')[2].getElementsByClassName('textarea_basic')[0]];
        }
    }
 
}

class DoubanMoviePage1 extends DoubanPage {
    constructor(){
        super();
        this.keys=listingKeys['movie'];
    }

    getElement(key){
        switch(key){
            case 'type': return ['movieCheckbox',null,document.getElementsByClassName('sub')];
            case 'name': return ['text',null,document.getElementById('p_title')];
            case 'imdb': return ['text',null,document.getElementById('p_uid')];
        }
    }
    click(listing){
        if (listing['imdb']){
            document.getElementsByName('subject_submit')[0].click();
        } else{
            document.getElementsByName("no_ud_submit")[0].click();
        }
    }

    fillElement(element, elementType, elementParas, value){ 
        console.log(value);
        switch(elementType){
            case 'movieCheckbox':
                console.log("check" + value);
                if (value=='movie'){
                    element[0].click();
                } else if (value=='tv'){
                    element[1].click();
                }
                break;
            default:
                super.fillElement(element,elementType, elementParas, value);
        }
    }
}

class DoubanMoviePage2 extends DoubanPage {
    constructor(){
        super();
        this.keys=listingKeys['movie'];
    }

    getElement(key){
        switch(key){
            case 'name': return ['text',null,document.getElementById('p_14')];
            case 'chineseName': return ['text',null,document.getElementById('p_95')];
            case 'altName': return ['text',null,document.getElementById('p_15_0')];
            case 'director': return ['text',null,document.getElementById('p_18_0')];
            case 'screenwriter': return ['text',null,document.getElementById('p_97_0')];
            case 'cast0': return ['text',null,document.getElementById('p_19_0')];
            case 'cast1': return ['text',null,document.getElementById('p_19_1')]; // TODO: multiple director/casts
            case 'cast2': return ['text',null,document.getElementById('p_19_2')];
            case 'genre': return ['movieDropdown',null, document.getElementsByClassName('opts-group')[0]]; // TODO
            case 'website': return ['text',null,document.getElementById('p_45')];
            case 'region': return ['movieDropdown',{'united states':'usa'},document.getElementsByClassName('opts-group')[1]];
            case 'language': return ['movieDropdown',null,document.getElementsByClassName('opts-group')[2]];
            case 'year': return ['text',null,document.getElementById('p_118')];
            case 'date': return ['text',null,document.getElementById('date_p_17_0')];
            case 'debutRegion': return ['text',null,document.getElementById('desc_p_17_0')];
            case 'length': return ['text',null,document.getElementById('p_119_0')];
            case 'description': return ['textLarge',null,document.getElementsByName('p_16_other')[0]];
        }
    }

    fillElement(element, elementType, elementParas,value){
        switch(elementType){
            case 'movieDropdown':
                let valueOriginal=value;
                value=value.toLowerCase();
                if (elementParas && elementParas[value]){
                    value=elementParas[value];
                }
                let removeCharacter=(str)=>{return str.substr(str.indexOf(' ')+1)};
                for (let option of element.getElementsByClassName('sub')){
                    if (removeCharacter(option.textContent.trim()).toLowerCase().trim()==value){
                        option.click();
                        return;
                    }
                }
                // none selected
                element.getElementsByClassName('selected')[0].textContent=valueOriginal;
                break;
            default: super.fillElement(element,elementType,elementParas, value)
        }
    }

}

// class DoubanBookPage1 extends DoubanPage {
//     keys=listingKeys['book'];
// }

// class DoubanBookPage2 extends DoubanPage {
//     keys=listingKeys['book'];
// }


class DoubanGamePage1 extends DoubanPage {
    constructor(){
        super();
        this.keys=listingKeys['game'];
    }

    getElement(key){
        switch(key) {
            case 'name': return ['text',null,document.getElementsByName('thing_name')[0]]
            default: return null
        }
    }

    click(listing=null){
        let button=document.getElementsByClassName('bn-flat1')[0];
        button.click();
    }
}

class DoubanGamePage2 extends DoubanPage {
    constructor(){
        super();
        this.keys=listingKeys['game'];
    }

    getElement(key){
        switch(key) {
            case 'name': return ['text',null,document.getElementsByName('thing_name')[0]];
            case 'chineseName': return ['text',null,document.getElementsByName('cn_name')[0]];
            case 'platform':
                const platformTranslator={'contains':false, 'data':{
                    'win':'PC', 'mac':'Mac','macOS':'Mac','linux':'Linux'
                }}
                return ['checkbox',platformTranslator,document.getElementsByClassName('checkbox-input')[0]];
            case 'genre': 
                const genreTranslator={'contains':true,'data':{ 
                    'action':'动作', 
                    'adventure':'冒险',
                    'sport':'体育','sports':'体育',
                    'rpg':'角色扮演','role-playing':'角色扮演',
                    'racing':'竞速',
                    'simulation':'模拟',
                    'fighting':'格斗',
                    'shooter':'射击','shooting':'射击',
                    'strategy':'即时战略','rts':'即时战略',
                    'card':'卡牌',
                    'massively multiplayer':'大型多人在线',
                    'puzzle':'益智',
                    'music':'音乐/旋律',
                    'first-person shooter':'第一人称射击','fps':'第一人称射击',
                    //光枪射击
                    'visual novel':'文字冒险'
                    //乱斗/清版
                    //横版过关
                }}
                return ['checkbox',genreTranslator,document.getElementsByClassName('checkbox-input')[1]];
            case 'date': return ['dateDropdown',null,document.getElementsByClassName("item-date")[0]];
            case 'description': return ['textLarge',null,document.getElementsByName("desc")[0]];
            default: return null;
        }
    }

    fillElement(element, elementType, elementParas,value){
        switch (elementType){
            case 'checkbox': 
                let checks=new Set();
                for (let vData of value){
                    for (let v in elementParas['data']){
                        if (elementParas['contains'] && vData.toLowerCase().includes(v.toLowerCase())){
                            checks.add(elementParas['data'][v]);
                        } else if ((!elementParas['contains']) && (vData.toLowerCase()==v.toLowerCase())){
                            checks.add(elementParas['data'][v]);
                        }
                    }
                }
                if (checks.size>0){
                    for (let box of element.querySelectorAll(".option-list,.pbox")){
                        if (checks.has(box.textContent.trim())){
                            box.children[0].click();
                        }
                    }
                }
                break;
            case 'dateDropdown': 
                let spl=value.split('-');
                if (spl.length!=3) throw "date format problem!"
                let boxes=element.getElementsByTagName('select');
                for (let i=0;i<3;i++){
                    boxes[i].value=parseInt(spl[i].trim()).toString();
                }
            default: super.fillElement(element, elementType, elementParas,value)
            
        }
    }
}


// ===== SourcePage ======

class SourcePage {
    constructor(){
        this.keys=null;
        this.data={};
        this.doubanLink=null;
    }

    collect(){
        console.log(this.keys);
        for (let key of this.keys){
            this.data[key]=null;
        }
        for (let key of this.keys){
            console.log(key);
            try {
                this.data[key]=this.collectItem(key);
                if (key=='date') this.data[key]=this.formatDate(this.data[key]);
                else if (key=='description'){
                    const suffix="本条目由豆瓣条目添加助手自动生成（https://www.douban.com/note/790499272/)，如有信息错误请更正。"
                    this.data[key]=this.data[key]+"\n\n========\n\n" + suffix;
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

class Spotify extends SourcePage {
    constructor(){
        super();
        this.keys = listingKeys['music'];
        this.doubanLink = "https://music.douban.com/new_subject";
        this.data = {};
    }

    collectItem(key){
        switch(key){
            case 'url': 
                return document.URL;
            case 'album':
                return document.querySelector('span[data-testid="entityTitle"] h1').textContent.trim();
            case 'artist0':
            case 'artist1':
            case 'artist2':
                let i = parseInt(key.slice(-1));
                let artists = Array.from(document.querySelectorAll('a[data-testid="creator-link"]'))
                    .map(a => a.textContent.trim());
                return i < artists.length ? artists[i] : null;
            case 'date':
                try {
                    return document.querySelector('.DmrVJc9vWCbjU_DuRvfe div p.e-9541-text').textContent;
                } catch(err) {
                    return null;
                }
            case 'tracks':
                try {
                    return Array.from(document.querySelectorAll('a[data-testid="internal-track-link"]'))
                        .map((row, index) => {
                            let title = row.querySelector('a[data-testid="internal-track-link"] div').textContent.trim();
                            return `${index + 1}. ${title}`;
                        }).join('\n');
                } catch(err) {
                    return null;
                }
            case 'description':
                let desc = document.URL + '\n\n';
                return desc;
            case 'genre': 
                return 'Pop'; // Spotify不直接显示流派信息
            case 'releaseType':
                return 'Album';
            case 'media':
                return 'Digital';
            case 'label':
                try {
                    let copyright = document.querySelector('div.rTMkDBDp47Eo12ZEQv4U p').textContent;
                    let match = copyright.match(/(?:℗|©) \d{4} (.+?)(?:,|\d|$)/);
                    return match ? match[1].trim() : null;
                } catch(err) {
                    return null;
                }
            case 'imgUrl':
                try {
                    const link = document.querySelector('button[aria-label="View album artwork"] div img').src;
                    return link + ".jpg";
                } catch(err) {
                    return null;
                }
            case 'reference':
                return document.URL;
        }
    }
}

class Bandcamp extends SourcePage {

    constructor(){
        super();
        this.keys=listingKeys['music'] // TODO: static variable
        this.doubanLink="https://music.douban.com/new_subject";
        this.data={}
    }

    collectItem(key){  
        switch (key){
            case 'url'           : return document.URL;
            case 'album'         : return document.getElementById('name-section').children[0].textContent.trim();
            case 'barcode'       : return null;
            case 'albumAltName'  : return null;
            case 'artist0'       : 
            case 'artist1'       : 
            case 'artist2'       : 
                let i=parseInt(key.slice(-1));
                let artists=document.getElementById('name-section').children[1].getElementsByTagName('span')[0].textContent.trim().split(/ *[,|&] */);
                if (i<artists.length) return artists[i].trim();
                else return null;
            case 'genre'         : return 'Electronic';
            case 'releaseType'   : return 'Album'; // TODO: infer by # of tracks
            case 'media'         : return 'Digital'; // Not labeled on Bandcamp
            case 'date'          : return document.getElementsByClassName("tralbumData tralbum-credits")[0].textContent.trim().split('\n')[0].replace(/release[sd] ?/,'');
            case 'label'         : 
                try{
                    return document.getElementsByClassName("back-link-text")[0].innerText.split('\n')[1].trim();
                } catch (err){
                    let accountName=document.getElementById("band-name-location").children[0].textContent.trim();
                    if (accountName.toLowerCase()==this.collectItem('artist0').toLowerCase()){
                        return "Self-Released";
                    } else{
                        return accountName;
                    }
                } 
            case 'numberOfDiscs' : return "1";
            case 'isrc'          : return null;
            case 'tracks': 
                return Array.from(document.getElementById('track_table').children[0].getElementsByClassName("track_row_view")).map((ele) =>{
                                 return ele.textContent.replaceAll(/[\n\t ]+/g,' ').replace(/ *buy track */,'').replace(/ *info */,'').replace(/ *lyrics */,'').replace(/ *video */,'').trim()
                             }).join('\n').trim(); 
            case 'description'   : 
                let out=document.URL;
                try {
                    out+="\n\n"+document.getElementsByClassName("tralbumData tralbum-about")[0].textContent.trim()
                } catch (err){}
                return out;
            case 'imgUrl'       : return document.getElementById('tralbumArt').children[0].href; 
            case 'reference':
                return document.URL;
        }
    }
}

class AppleMusic extends SourcePage {
    
    constructor(){
        super();
        this.keys=listingKeys['music'] // TODO: static variable
        this.doubanLink="https://music.douban.com/new_subject";
        this.data={}
    }

    collectItem(key){
        
        switch (key){
            case 'url': return document.URL;
            case 'album': return document.getElementsByClassName('album-header-metadata')[0].children[0].textContent.trim();
            case 'barcode': return null;
            case 'albumAltName': return null;
            case 'artist0':
            case 'artist1':
            case 'artist2':
                let i=parseInt(key.slice(-1));
                let artists=document.getElementsByClassName('album-header-metadata')[0].children[1].textContent.trim();
                try{
                    return artists.split(/,|and/)[i].trim();
                } catch (err) {return null;}
            case 'genre':
                let genre=document.getElementsByClassName('album-header-metadata')[0].children[2].textContent.trim().split("·")[0].trim();
                const genreNameMap={'Dance':'Electronic','Hip-Hop':'Rap','HipHop':'Rap','Alternative':'Rock', "Hip-Hop/Rap":'Rap'};
                if (genre && genreNameMap[genre]) return genreNameMap[genre];
                else return null;
            case 'releaseType': return 'Album'; // TODO
            case 'media': return 'Digital';
            case 'date': return document.getElementsByClassName("bottom-metadata")[0].getElementsByClassName('song-released-container')[0].textContent.replace("RELEASED",'').trim();
            case 'label':
                return document.getElementsByClassName("bottom-metadata")[0].getElementsByClassName('song-copyright')[0].textContent.replace(/℗ \d+ /,'');
            case 'numberOfDiscs': return "1"; // TODO
            case 'isrc': return null;
            case 'tracks':
                let tracksText="";
                let songs=document.getElementsByClassName("songs-list")[0].getElementsByClassName('songs-list-row');
                let song;
                console.log("hre0");
                for (let i=0;i<songs.length;i++){
                    song=songs[i];
                    let songName='';
                    let songLength='';
                    try {
                        songName=song.getElementsByClassName('songs-list-row__song-name')[0].textContent.trim();
                    } catch (err) {}
                    try {
                        songLength=song.getElementsByClassName('songs-list-row__length')[0].textContent.trim();
                    } catch (err) {}
                    tracksText+=`${i+1}. ${songName} ${songLength}\n`;
                } 
                return tracksText
            case 'description':
                let description=document.URL;
                try{
                    description+='\n\n'+document.getElementsByClassName('product-page-header')[0].getElementsByClassName('truncated-content-container')[0].textContent.replace(/Editors' Notes/,'').trim()
                } catch(err){}
                return description;

            case 'imgUrl':
                
                let _arr=document.getElementsByClassName('product-info')[0].getElementsByTagName('source')[1].srcset.split(" ");
                return _arr[_arr.length-2];
            case 'reference':
                return document.URL;
        }
    }
}

class Discogs extends SourcePage {
    constructor(){
        super();
        this.keys=listingKeys['music'] // TODO: static variable
        this.doubanLink="https://music.douban.com/new_subject";
        this.data={}
    }

    collectItem(key){
        switch(key){
            case 'url': return document.URL;
            case 'album': 
                try {
                    return document.getElementById('profile_title').children[1].textContent.trim();
                } catch(err){
                    return document.getElementsByTagName('h1')[0].textContent.split('–')[1].trim();
                }
            case 'barcode': return null; // TODO
            case 'albumAltName': return null;
            case 'artist0':
            case 'artist1':
            case 'artist2':
                let i=parseInt(key.slice(-1));
                try{
                    let artists=document.getElementsByClassName('profile')[0].children[0].children[0].children
                    if (i<artists.length) return artists[i].title.replace(/(\(\d+\))/,'').trim();
                    else return null
                } catch (err) {
                    let artists=document.getElementsByTagName('h1')[0].getElementsByTagName('span');
                    if (i<artists.length) return artists[i].textContent.replace(/(\(\d+\))/,'').trim();
                    else return null;
                }
            case 'genre':
            case 'date':
            case 'media':
            case 'label':
                let profileBlock;
                let keyValuePair=[];

                const keyRenameMap={'Genre': 'genre', 'Year': 'date', "Format":"media","Released":'date', 'Label': 'label'};
                const valueRenameMap={'Hip Hop':'Rap','File':'Digital'};

                try{
                    profileBlock=document.getElementsByClassName('profile')[0];
                    for (let i=1;i<profileBlock.children.length-1;i+=2){
                        keyValuePair.push([profileBlock.children[i].textContent,profileBlock.children[i+1].textContent]);
                    }
                } catch(err){
                    profileBlock=document.getElementById('release-header').children[2];
                    for (let row of profileBlock.children){
                        keyValuePair.push([row.children[0].textContent,row.children[1].textContent]);
                    }
                }

                try{
                    for (let keyValue of keyValuePair){ 
                        let profileKey=keyRenameMap[keyValue[0].replace(":","").trim()];
                        if (profileKey && key==profileKey){
                            console.log("found " + key);
                            let profileValue=keyValue[1].trim();
                            if (profileKey!='date'){
                                profileValue=profileValue.split(/[,–] /)[0].trim();
                            }
                            if (valueRenameMap[profileValue]){
                                return valueRenameMap[profileValue];
                            } else if (profileValue){
                                return profileValue;
                            } else {
                                throw "No Value in profile block";
                            } 
                        }            
                    }
                } catch (err){
                    switch (key){
                        case 'media': return "Vinyl";
                        case 'label': return "Self-Released";
                        default: return null;
                    }
                }
                return null;
            
            case 'releaseType': return 'Album'; // TODO: detect single/ep/album by # of tracks
            case 'numberOfDiscs': return '1';
            case 'isrc': return null;
            case 'tracks':
                let tracks,trackText;
                let trackPos, trackArtist, trackTitle, trackDur;
                try{
                    // logged in, master or release; or not logged in, master page
                    tracks=document.getElementById('tracklist').getElementsByTagName('tr');
                    trackText="";
                    for (let i=0;i< tracks.length;i++){
                        let track=tracks[i]
                        trackPos=(i+1).toString();
                        if (track.getAttribute('data-track-position')){
                            trackPos=track.getAttribute('data-track-position');
                        }
                        let es=track.getElementsByClassName("tracklist_track_pos")
                        if (es.length>0) trackPos=es[0].textContent.trim();
                        trackTitle=''
                        es=track.getElementsByClassName("tracklist_track_title")
                        if (es.length>0) trackTitle=es[0].textContent.trim();
                        trackDur=''
                        es=track.getElementsByClassName("tracklist_track_duration")
                        if (es.length>0) trackDur=es[0].textContent.trim();
                        trackText+=`${trackPos} - ${trackTitle} ${trackDur}\n`
                    }
                } catch(err){
                    // not logged in, release page
                    tracks=document.getElementById('release-tracklist').getElementsByTagName('tr');
                    trackText='';
                    for (let i=0;i< tracks.length;i++){
                        let track=tracks[i];
                        trackPos=(i+1).toString();
                        if (track.getAttribute('data-track-position')){
                            trackPos=track.getAttribute('data-track-position');
                        } else {
                            trackText+=(track.textContent.trim()+'\n');
                            continue;
                        }
                        console.log("hello");
                        trackArtist='';
                        trackTitle='';
                        trackDur='';
                        for (let ele of track.children){
                            try{
                                if (ele.className.startsWith("artist") && ele.textContent.trim()){
                                    trackArtist=ele.children[0].textContent.trim()+' - ';
                                } else if (ele.className.startsWith("trackTitle")){
                                    trackTitle=ele.children[0].textContent.trim()
                                } else if (ele.className.startsWith("duration")){
                                    trackDur=' '+ele.textContent.trim();
                                }
                            } catch (err){}
                        }
                        trackText+=`${trackPos}. ${trackArtist}${trackTitle}${trackDur}\n`
                    }

                }
                 
                return trackText;

            case 'description': 
                let description=document.URL;
                try{
                    let ele=document.getElementById('notes');
                    if (!ele){
                        ele=document.getelementsById('release-notes');
                    }
                    description+='\n\n'+ele.children[1].textContent.trim();
                    
                } catch (err){}
                return description

            case 'imgUrl':
                try{
                    return JSON.parse(document.getElementById('page_content').getElementsByClassName("image_gallery")[0].attributes['data-images'].nodeValue)[0]['full'];
                } catch(err){
                    return document.querySelector('[property="og:image"]').content;
                }
            case 'reference':
                return document.URL;
        }
    }
    
}

// class Soundcloud extends SourcePage {
//     keys=listKeys['music'];
// }

class IMDB extends SourcePage {
    constructor(){
        super();
        this.keys=listingKeys['movie'];
        this.doubanLink="https://movie.douban.com/new_subject";
    }
    
    collectItem(key){
        let ele;
        let match;
        let i;
        switch(key){
            case 'url': return document.URL;
            case 'type': 
                ele=document.querySelector('[data-testid="hero-title-block__metadata"]');
                if (ele.children[0].textContent.trim().startsWith('TV')) return 'tv';
                else return 'movie';
            case 'name': return document.getElementsByTagName('h1')[0].textContent.trim();
            case 'chineseName': return null;
            case 'altName': 
                try{
                    return this.parseLine('title-details-akas')[0];
                } catch(err) {return null;}
            case 'imdb': 
                match=document.URL.match(/\/title\/(.+)\//);
                return match && match[1];
            case 'director':
                key='Director';
            case 'screenwriter':
                key='Writer';
                try{
                    for (let section of [document.getElementsByClassName('ipc-metadata-list--base')[0].children,document.querySelector('[data-testid="title-pc-wide-screen"]').getElementsByClassName("ipc-metadata-list__item"),document.querySelector('[data-testid="title-pc-expandable-panel"]').getElementsByClassName("ipc-metadata-list__item")]){
                        for (let row of section){
                            if (row.children[0].textContent.trim().startsWith(key)){
                                return this.parseLine(row)[0];
                            }
                        }
                    }
                } catch (err) {}
                return null;
            case 'cast0':
            case 'cast1':
            case 'cast2':
                i=parseInt(key.slice(-1));
                try{
                    return document.querySelectorAll("[data-testid='title-cast-item__actor']")[i].textContent.trim(); // TODO: add more actors
                } catch (err){
                    return null;
                }
            case 'genre': return this.parseLine("storyline-genres")[0];
            case 'website': return document.querySelector('[data-testid="title-details-officialsites"]').getElementsByClassName('ipc-inline-list__item')[0].children[0].href.trim();
            case 'region': return this.parseLine("title-details-origin")[0];
            case 'language': return this.parseLine("title-details-languages")[0];
            case 'year': 
                ele=document.querySelector('[data-testid="hero-title-block__metadata"]');
                if (this.collectItem('type')=='tv') return ele.children[1].textContent.trim().split('–')[0].trim();
                else return ele.children[0].children[0].textContent.trim();
            case 'date':
                return this.parseLine("title-details-releasedate")[0].split(" (")[0];
            case 'debutRegion':
                match=this.parseLine("title-details-releasedate")[0].match(/\((.*)\)/);
                return match && match[1];
            case 'length':
                return this.parseLine("title-techspec_runtime")[0];
            case 'description':
                try{
                    return document.URL+"\n\n"+document.querySelector('[data-testid="storyline-plot-summary"]').textContent.trim();
                } catch (err) {return document.URL+"\n\n";}
            case 'imgUrl':
                return document.querySelector('[data-testid="hero-media__poster"]').getElementsByTagName('img')[0].srcset.split(', ').slice(-1)[0].trim().split(' ')[0].trim();
        }
    }

    parseLine(val){
        if (typeof val === 'string' || val instanceof String){
            val=document.querySelector('[data-testid="'+val+'"]');
        }
        return Array.from(val.getElementsByClassName("ipc-inline-list__item")).map((ele)=>{return ele.textContent.trim()});
    }
}

class Steam extends SourcePage {
    constructor(){
        super();
        this.keys=listingKeys['game'];
        this.doubanLink="https://www.douban.com/game/create";
        this.data={};
    }

    collectItem(key){
        switch (key){
            case 'url': return document.URL;
            case 'name': return document.getElementById('appHubAppName').textContent.trim();
            case 'chineseName': return this.collectItem('name');
            case 'platform': 
                try{
                    return Array.from(document.getElementsByClassName("game_area_purchase_platform")[0].children).map((ele)=>{return ele.classList[1].trim();}); // win, mac, linux
                } catch (err) {return 'win'};
            case 'genre': 
                for (let text of document.getElementById("genresAndManufacturer").textContent.trim().split(/[\n\t]+/)){
                    if (text.startsWith('Genre:')){
                        text=text.replace('Genre:','').trim();
                        return text.split(/ ?, ?/).map((ele)=>{return ele.trim()});
                    }
                }
                return null
            case 'date':
                for (let text of document.getElementById("genresAndManufacturer").textContent.trim().split(/[\n\t]+/)){
                    if (text.startsWith('Release Date:')){
                        text=text.replace('Release Date:','').trim();
                        return text;
                    }
                }
                return null
            case 'description': return document.getElementsByClassName("game_description_snippet")[0].textContent.trim();
            case 'imgUrl': return document.getElementsByClassName("game_header_image_full")[0].src.trim();
        }
    }
}

// class AmazonBook extends SourcePage {
//     keys=listKeys['book'];
// }



// ====== Main ======


// console.log("Testing plugin");
// console.log(getCurrentPage());


let getCurrentPage=()=>{
    // Get current page 
    let match=document.URL.match(/([\w]+)\.com/);
    let site=match && match[1];

    switch(site){
        case 'douban':
            if (document.URL.includes('music')){
                let nBasic=document.getElementsByClassName('basic').length;
                if (nBasic==2) return 'doubanMusic1';
                else if (nBasic>2) return 'doubanMusic2';
                else return null;
            } else if (document.URL.includes('game')){
                if (document.getElementsByClassName('create-input').length>=1) return 'doubanGame1';
                else if (document.getElementsByClassName("single-input").length>=2) return 'doubanGame2';
                else return null;
            } else if (document.URL.includes('movie')){
                if (document.getElementsByClassName('item basic').length<=4) return 'doubanMovie1';
                else return 'doubanMovie2';
            } else return null;
        case 'steampowered':
            return 'steam';
        case 'bandcamp':
        case 'discogs':
        case 'soundcloud':
        case 'apple':
        case 'imdb':
            return site;
        case 'spotify':
            if(document.URL.match(/open\.spotify\.com\/album/)) return 'spotify';
            return null;
        default:
            return null;
    }
}

const localStorageID='DoubanListingData';


let createButton = (currentPage)=>{
    var button=document.createElement("Button");
    button.innerHTML ="Collect";
    button.style = "top:0;left:0;position:absolute;z-index:9999";
    button.onclick=function(){
        console.log("button clicked. ")

        let page;
        
        switch (currentPage){
            case 'bandcamp':
                page=new Bandcamp();
                break;
            case 'discogs': 
                page=new Discogs();
                break;
            case 'apple':
                page=new AppleMusic();
                break;
            case 'steam':
                page=new Steam();
                break;
            case 'imdb':
                page=new IMDB();
                break;
            case 'spotify':
                page=new Spotify();
                break;
        }
        console.log("button clicked. ")
        try{
            let data=page.collect();
            console.log(currentPage + JSON.stringify(data));
            browser.runtime.sendMessage({page:currentPage,data: JSON.stringify(data)});
            console.log(data);
            window.open(page.doubanLink);
        } catch(err) {console.log(err);}
        
    };
    document.body.appendChild(button);

}

let main = ()=>{

    //console.log("chekc");
    let currentPage=getCurrentPage();

    // Default action: add buttons to bandcamp/discogs/soundcloud/apple pages
    console.log(currentPage);
    switch(currentPage){
        case 'bandcamp':
        case 'discogs':
        case 'apple':
        // case 'soundcloud':
        case 'steam':
        case 'imdb':
        case 'spotify':
            createButton(currentPage);
        case 'doubanMusic1':
        case 'doubanMusic2':
        case 'doubanGame1':
        case 'doubanGame2':
        case 'doubanMovie1':
        case 'doubanMovie2':
            browser.runtime.sendMessage({page:currentPage});
            break;
    }

    // listens to background script message
    // only get message on doubanMusic1 opened by the bandcamp button
    browser.runtime.onMessage.addListener(message => {
        console.log("Message from the background script:");
        if (message.data){
            let dataBackground=JSON.parse(message.data)
            let page=null;
            if(currentPage=='doubanMusic1'){
                page=new DoubanMusicPage1();
            } else if (currentPage=='doubanGame1'){
                page=new DoubanGamePage1();
            } else if (currentPage=='doubanMovie1'){
                console.log('this is movie1');
                page=new DoubanMoviePage1();
            }
            if (page){
                console.log(dataBackground);
                page.fill(dataBackground);
                localStorage.setItem(localStorageID, JSON.stringify(dataBackground));
                try{
                    page.click(dataBackground);
                } catch (err){console.log(err);}
            }
        }
    });

    // autofill douban-2 if data is stored to localStorage
    let dataStored=localStorage.getItem(localStorageID)
    if (dataStored){
        dataStored=JSON.parse(dataStored);
        let page;
        if (currentPage=='doubanMusic2'){
            page=new DoubanMusicPage2();
        } else if (currentPage=='doubanGame2'){
            page=new DoubanGamePage2();
        } else if (currentPage=='doubanMovie2'){
            page=new DoubanMoviePage2();
        }
        if (page){
            page.fill(dataStored);
            localStorage.removeItem(localStorageID);
        }
    }
}

main();


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
// discogs; remove (NUM) from label/artist affixes. 
