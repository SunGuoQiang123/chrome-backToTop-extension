chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: 'toggle',
    id: 'toggle'
  });

  chrome.contextMenus.onClicked.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      sendMsg(tabs.length ? tabs[0].id : null);
    });
  });

  chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    console.log('input changed: ', text);
    if(!text) return;
    if (text.startsWith('电影')) {
      const m = text.slice(3);
      suggest([
        {content: `豆瓣 ${m}`, description: `豆瓣搜索${m}`},
        {content: `烂番茄 ${m}`, description: `烂番茄搜索${m}`},
        {content: `知乎 ${m}`, description: `知乎搜索${m}`}
      ]);
    } else if(text.startsWith('购物')) {
      const k = text.slice(3);
      suggest([
        {content: `天猫 ${k}`, description: `天猫搜索${k}`},
        {content: `京东 ${k}`, description: `京东搜索${k}`},
        {content: `淘宝 ${k}`, description: `淘宝搜索${k}`},
      ]);
    }
  });

  chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('inputEntered is: ', text);
    if(!text) return;
    let href = '';
    let key = text.split(' ')[1];
    const map = new Map([
      [/^豆瓣/, `https://movie.douban.com/subject_search?search_text=${key}`],
      [/^烂番茄/, `https://www.rottentomatoes.com/m/${key}`],
      [/^知乎/, `https://www.zhihu.com/search?type=content&q=${key}`],
      [/^天猫/, `https://list.tmall.com/search_product.htm?q=${key}`],
      [/^京东/, `https://search.jd.com/Search?keyword=${key}`],
      [/^淘宝/, `https://s.taobao.com/search?q=${key}`],
    ]);
    for(let [k, value] of map) {
      if (k.test(text)) {
        href = value;
        break;
      }
    }
    chrome.tabs.update({url: href});
  });
});

function sendMsg(tabId) {
  chrome.tabs.sendMessage(tabId, 'toggle', function(res) {
    console.log(res);
  });
}
