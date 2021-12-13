let hotkeys = []
function guid(rawid = '') {
  rawid = rawid ? rawid : 'xyxxxxxyx'
  let formatter = rawid + '-xxxyxxx-xxxxxxxx'
  return formatter.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const generateFragmentURL = async () => {
  const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
  const result = generateFragment(window.getSelection());
  if (result.status === 0) {
    let url = location.origin + location.pathname + location.search;
    const fragment = result.fragment;
    const prefix = fragment.prefix ? encodeURIComponent(fragment.prefix) + '-,' : '';
    const suffix = fragment.suffix ? ',-' + encodeURIComponent(fragment.suffix) : '';
    const textStart = encodeURIComponent(fragment.textStart);
    const textEnd = fragment.textEnd ? ',' + encodeURIComponent(fragment.textEnd) : '';
    url = url + '#:~:text=' + prefix + textStart + textEnd + suffix;
    return url
  }
}

document.body.addEventListener('keydown', function (event) {
  // console.log('keydown', event)
  hotkeys.push(event.key)
  if (hotkeys.length > 3) {
    hotkeys.shift()
  }
}, false)

document.body.addEventListener('keyup', async function (event) {
  // TODO: 暂时先不根据 uc 判断平台
  // if (hotkeys.toString() === 'Control,Shift,C') {}
  if ((event.metaKey && event.shiftKey && event.keyCode === 67) || (event.ctrlKey && event.shiftKey && event.keyCode === 67)) {
    // console.log('keyup', event)
    event.preventDefault();
    const copyText = window.getSelection().toString();
    const pageUrl = window.location.href
    if (!copyText) return
    generateFragmentURL().then(async fragmentUrl => {
      console.log('url', fragmentUrl)
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([copyText], { type: 'text/plain' }),
          'text/html': new Blob([`
              <span
                id="${guid()}"
                data-target-title="${document.title}" 
                data-target-type="web"
                data-target-url="${fragmentUrl}"
                data-target-origin-url="${pageUrl}"
                data-target-origin-text="${copyText}">${copyText}</span>
              `], { type: 'text/html' })
        })
      ]);
    })
  }
})


document.body.addEventListener('paste', function (event) {
  console.log(event.clipboardData.getData('text/html'))
})