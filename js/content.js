let visibleHeight = 400;
let right = '80px';
let bottom = '100px';

const container = document;
const target = document.documentElement;

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if(changes.bottom) {
    el.style.bottom = `${changes.bottom.newValue}px`;
  }
  if (changes.right) {
    el.style.right = `${changes.right.newValue}px`;
  }
  if (changes.icon) {
    img.src = changes.icon.newValue;
  }
});

const el = document.createElement('div');
el.show = true; // 控制icon是否显示
el.classList.add('ce-btt-container');


el.style.opacity = target.scrollTop > visibleHeight ? 1 : 0;

const img = document.createElement('img');
img.classList.add('ce-btt-icon');

el.appendChild(img);


chrome.storage.local.get(['right', 'bottom', 'icon'], function(result) {
  el.style.right = result && result.right ? result.right + 'px' : right;
  el.style.bottom = result && result.bottom ?  result.bottom + 'px' : bottom;
  img.src = result && result.icon ? result.icon : chrome.runtime.getURL('icons/backToTop.png');
  document.body.appendChild(el);
});

el.addEventListener('click', function(e) {
  let step = 20;
  let timer = setInterval(() => {
    if(target.scrollTop <= 0) {
      clearInterval(timer);
    } else {
      step += 20;
      target.scrollTop -= step;
    }
  }, 20);
});

function throttle(fn, time) {
  let start = +new Date();
  let timer;
  return function() {
    clearTimeout(timer);
    const now = Date.now();
    if(now - start >= time) {
      start = now;
      return fn.apply(null, arguments);
    } else {
      timer = setTimeout(() => {
        fn.apply(null, arguments);
      }, time);
    }
  };
}

const handleScroll = function() {
  if(!el.show) return false;  // icon不显示时，不处理
  if(target.scrollTop > visibleHeight) {
    el.style.opacity = 1;
  } else {
    el.style.opacity = 0;
  }
};

container.addEventListener('scroll', throttle(handleScroll, 300));

chrome.runtime.onMessage.addListener(function(req, sender, respond) {
  if(req === 'toggle') {
    if (target.scrollTop > visibleHeight) {
      el.style.opacity = el.style.opacity === '1' ? 0 : 1;
    }
    el.show = !el.show;
    respond('toggle success');
  }
});
