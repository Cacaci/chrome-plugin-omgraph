document.addEventListener('copy', async function (event) {
  event.preventDefault()
  const textPlain = ''
  const textHTML = ''
  let textURL = ''

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
    textURL = url
  }
  event.clipboardData.setData('text/plain', textPlain)
  event.clipboardData.setData('text/html', textHTML)
  event.clipboardData.setData('application/x-editor-js', '111')
})

// test
document.addEventListener('paste', function (event) {
  event.preventDefault()
  console.log(event.clipboardData.getData('text/plain'))
  console.log(event.clipboardData.getData('text/html'))
  console.log(event.clipboardData.getData('application/x-editor-js'))
})


// var pageUrl = window.location.href
// var encodedUrl = encodeURI(pageUrl.split('#')[0])
// var copyText = window.getSelection().toString();
// encodedUrl += '#:~:text=' + copyText

// var cliboardTextData = new Blob([url], { type: 'application/omgragh' })
// console.log('type', cliboardTextData.type)
// await navigator.clipboard.write([
//   new ClipboardItem({
//     [cliboardTextData.type]: cliboardTextData
//     // 'text/plain': JSON.stringify({
//     //   type: "web",
//     //   url: url
//     // })
//   }, { raw: true })
// ]).then(() => {
//   console.info('write successfully')
// }).catch(error => {
//   console.error(error)
// });