// chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
//   const msg = `Navigation to ${e.request.url} redirected on tab ${e.request.tabId}.`;
//   console.log(msg);
// });

// console.log('Service worker started.');

const setToStorage = async (key, data) => {
  let obj = {}
  obj[key] = data
  await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
  let sres = await chrome.storage.local.get(key)
  return sres[key]
}


const removeAllRules = async () => {
  chrome.declarativeNetRequest.getDynamicRules((e) => {
    e.forEach(i => {
      let ids = i.id
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [ids]
      })
    })
  })
}
chrome.runtime.onInstalled.addListener(async () => {
  await setToStorage('prototype', true)
  let k=await getFromStorage('prototype')
  console.log(k);
})

const handlePrototype1 = async (obj) => {
  await removeAllRules()
  let httpDomain = "http://*/*";
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 3,
        priority: 3,
        action: {
          "type": "redirect",
          "redirect": {
            "transform": {
              "scheme": "https"
            }
          }
        },
        condition: {
          urlFilter: httpDomain,
          resourceTypes: [
            "main_frame"
          ]
        }
      }
    ],
    removeRuleIds: [3],
  });
}

removeAllRules()

const main = async () => {
  let prototype = await getFromStorage('prototype')
  if(prototype) handlePrototype1()
}



chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
  removeAllRules()
  main()
})
chrome.tabs.onActivated.addListener(({ tabId, windowId }) => {
  removeAllRules()
  main()
})