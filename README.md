# 豆瓣添加条目助手 DoubanListingHelper

关注我的豆瓣: lzqqqqqq (https://www.douban.com/people/49528893/)。有bug提建议欢迎开issue或在豆瓣私信我！

## 安装 Installation

- **Firefox商店**：https://addons.mozilla.org/en-US/firefox/addon/doubanlistinghelper/
- **Chrome商店**：审核中
- 插件商店由于审核会有延迟，从Github安装最新版：
    - 点击Github页面绿色按钮下载压缩包。
    - Firefox: 下载全部文件解压。在地址栏中输入"about:debugging"，点左侧栏中“此Firefox (This firefox)"，点“临时载入附加组件 (Load Temporary Add-on)”，选中文件夹中任何一个文件（例如manifest.json)。**这种方式每次重启firefox需重新安装。**
    - Chrome：下载全部文件解压。在Chrome地址栏中输入chrome://extensions/, 点击开发者模式（Developer mode），再将插件文件夹拖至该页面。
    - 理论上也支持Opera/Safari/Edge浏览器，未测试，如有测试结果请开issue/豆瓣私信告知。
- **安装开发版本**：点击左上角“main”，下拉菜单中选择“dev”，点击绿色按钮下载压缩包。

## 使用 Documentation

条目页面左上角会出现一个“Collect”按钮，点击后自动跳转至豆瓣添加条目界面自动填表，并把专辑封面下载到浏览器默认文件夹（我的是Downloads）。上传封面仍需手动，在默认下载文件夹选中即可。

现支持如下条目页面：
- 音乐：Bandcamp（专辑页面）, Discogs（master/release页面）,Apple Music
- 电影：IMDB
- 书籍：开发中
- 游戏：Steam

**请务必在自动填表后人工检查内容并修改，确保豆瓣条目信息的准确性。**

## 进展 Progress

- **0.3** 整个插件重写了一遍，为将来支持其他条目做准备。修复chrome支持，修复部分bug。打包发布Firefox和Chrome应用商店。
- **0.2** 增加chrome支持。
- **0.1** 支持firefox和bandcamp/discogs/apple music网站，之后会增加chrome浏览器和soundcloud/spotify等网站的支持。

## License 

MIT 