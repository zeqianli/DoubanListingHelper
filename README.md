# 豆瓣添加条目助手 Douban listing helper
forked from zeqianli/DoubanListingHelper[https://github.com/zeqianli/DoubanListingHelper]

## Manual

**安装**
- 点击 github 页面绿色按钮下载压缩包。
- Firefox：下载全部文件解压。在 firefox 地址栏中输入 "about:debugging"，点左侧栏中“此firefox (This firefox)"，点“临时载入附加组件 (Load Temporary Add-on)”，选中文件夹中任何一个文件（例如manifest.json)即可。**由于插件未正式发布，每次重启firefox需重新安装。**
- Chrome：下载全部文件解压。在 chrome 地址栏中输入 chrome://extensions/, 点击开发者模式（Developer mode），再将插件文件夹拖至该页面。

**使用**
在任何 discogs/bandcamp/apple music 的专辑页面左上角会出现一个“Collect”按钮，点击后自动跳转至豆瓣音乐添加条目界面自动填表，并把专辑封面下载到浏览器默认文件夹。上传封面仍需手动，在默认下载文件夹选中即可。

**请务必在自动填表后人工检查内容并修改。自动填的信息不一定准确（例如不同网站的曲风命名不同）。豆瓣条目信息的准确性对豆瓣社区很重要。**

## Plan
- 已知bug：
    - 暂不支持条形码
    - 暂不支持自动上传封面
    - bandcamp 暂不自动检测厂牌和曲风，厂牌默认为Self-Released。
    - 曲风检测需改进
- 添加网站支持（soundcloud/spotify/rateyourmusic...）
- 有什么建议或想参与这个项目欢迎开issue/在豆瓣上私信我 @noisemoon

## License 

MIT 