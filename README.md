# 豆瓣添加条目助手 Douban listing helper

我的豆瓣 Follow me on Douban: lzqqqqqq (https://www.douban.com/people/49528893/)

豆瓣添加条目太难用了，受不了了，写了一个firefox浏览器自动填表的助手。目前仅支持firefox和bandcamp/discogs/apple music网站，之后会增加chrome浏览器和soundcloud/spotify等网站的支持。

有bug提建议有疑问欢迎开issue或在豆瓣私信我！

## 使用说明 Documentation

安装：下载全部文件。在firefox地址栏中输入"about:debugging"，点左侧栏中“此firefox (This firefox)"，点“临时载入附加组件 (Load Temporary Add-on)”，选中文件夹中任何一个文件（例如manifest.json)即可。

使用：

安装好后，在任何discogs/bandcamp/apple music的专辑页面左上角会出现一个“Collect”按钮，点击后自动跳转至豆瓣音乐添加条目界面自动填表，并把专辑封面下载到浏览器默认文件夹（我的是Downloads）。上传封面仍需手动，在默认下载文件夹选中即可。

**请务必在自动填表后人工检查内容并修改。自动填的信息不一定准确（例如不同网站的曲风命名不同）。豆瓣条目信息的准确性对豆瓣社区很重要。**

## 进展 Progress

v 0.1 
目前仅支持firefox和bandcamp/discogs/apple music网站，之后会增加chrome浏览器和soundcloud/spotify等网站的支持。

## 未来计划 Plan
- 已知bug：
    - 暂不支持条形码
    - 暂不支持自动上传封面
    - bandcamp暂不自动检测厂牌和曲风。厂牌默认为Self-Released。
    - 曲风检测需改进
- 添加chrome支持
- 添加网站支持（soundcloud/spotify)
- 添加电影、图书等条目支持
- 有什么建议或想参与这个项目欢迎开issue/在豆瓣上私信我 

## License 

MIT 