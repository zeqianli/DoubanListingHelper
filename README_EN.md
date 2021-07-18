# DoubanListingHelper (English documentation)

[中文文档][README.md] / [Follow me on Douban: lzqqqqqq](https://www.douban.com/people/49528893/)

[Douban](https://www.douban.com/) is a popular Chinese social media site centered around reviewing and categorizing music, movies/TVs, books, games, etc. Imagine Rate Your Music/Discogs, IMDB/Letterboxed, Goodreads, etc, all in one but you can post content, organize events, discuss in forums and much more. 

Music/file/book/game listings are the center of Douban and are manually added by users based on other source sites. This is very time-consuming and is subject to errors and format inconsistencies. This browser plug-in makes it much easier by scraping listing data from source sites and auto-fills forms on Douban. 

## Installation

- **Firefox store**: https://addons.mozilla.org/en-US/firefox/addon/doubanlistinghelper/
- **Chrome store**: in review
- Install from Github: 
    - Click the green button to download the package.
    - Firefox: Unzip the package. Type "about:debugging" in the address bar. Click "This firefox" and then "Load Temporary Add-on". Select any file in the unzipped folder (for example, manifest.json). **You have to re-install every time you restart Firefox.**
    - Chrome: Upzip the package. Type "chrome://extensions/" in the address bar. Click "Developer mode" and drag the unzipped folder to the page. 
    - Opera/Safari/Edge are theoretically supported by not tested. If you tried on them, please report results.  
- **Install development version**：Click "main" on the upper left corner and choose "dev" from the manual. Then click the green button to download the package. Follow steps above. 

### Reporting bugs

- Please open issues on Github or message me on Douban to report bugs. Please attach the source page link and your brower name when reporting. 
- If you regularly add a large number of new listings, and are interested in joining the testing team for future releases, please message me on Douban. 

## Usage

A "Collect" button appears on the upper-left corner of source pages. Clicking the botton collects listing data from the page, redirect to Douban, and auto-fill forms. It also downloads the cover image to the default download folder (Downloads, in my case). Users still have to upload the cover image manually (just select from the default download folder)

Supported source sites:
- Music: Bandcamp (album page), Discogs（master and release page), Apple Music (album page)
- Movie/TV: IMDB
- Book: In development
- Game: Steam

**Please double check auto filled entries and correct any errors. Accurate listing information is important for Douban.**

## Progress

- **1.0** Support Movie and Game listings. Fixed logged-out Discogs pages. Fixed many bugs. 
- **0.3** Re-wrote the whole thing to support other listings in the future. Fixed Chrome support. Fixed some bugs. Submitted to Firefox store and Chrome store。
- **0.2** Support Chrome。
- **0.1** Support Firefox and Bandcamp/Discogs/Apple Music. Will add support for Chrome and Soundcloud/Spotify.

## License 

MIT 