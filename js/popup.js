const btn = document.getElementById('btn');
const right = document.getElementById('right');
const bottom = document.getElementById('bottom');
const file = document.getElementById('file');
const img = document.querySelector('.back-to-up-icon');

chrome.storage.local.get(['right', 'bottom', 'icon'], function(result) {
  if(result) {
    right.value = result.right || '';
    bottom.value = result.bottom || '';
    if(result.icon) {
      img.src = result.icon;
      img.dataset.uploaded = true;
    }
  }
});

btn.addEventListener('click', function(e) {
  const errmsg1 = document.querySelector('.error-msg1');
  const errmsg2 = document.querySelector('.error-msg2');
  if(!Number(right.value)) {
    errmsg1.textContent = 'right值请输入数字';
    return false;
  }
  if(!Number(bottom.value)) {
    errmsg2.textContent = 'bottom值请输入数字';
    return false;
  }
  errmsg1.textContent = errmsg2.textContent = '';
  const rightVal = right.value;
  const bottomVal = bottom.value;
  chrome.storage.local.set({right: rightVal, bottom: bottomVal});
  if(img.dataset.uploaded) {
    chrome.storage.local.set({icon: img.src});
  }
});

file.addEventListener('change', function(e) {
  const imgerr = document.querySelector('.img-err');
  if(e.target.files[0].size > 40 * 1024) {
    imgerr.textContent = 'icon请小于40kb';
    return false;
  }
  imgerr.textContent = '';
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function(result) {
    img.src = this.result;
  };
});
