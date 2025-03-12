console.log('hello fro popup')

const setToStorage = async (key, data) => {
    let obj = {}
    obj[key] = data
    await chrome.storage.local.set(obj)
}

const getFromStorage = async (key) => {
    let sres = await chrome.storage.local.get(key)
    return sres[key]
}


const toggleBtn=document.getElementById('toggleBtn')
const main = async() => {
 let prototype=await getFromStorage('prototype')
    if(prototype){
        toggleBtn.checked=true
    }
    else{
        toggleBtn.checked=false
    }
}

main()

const handletoggleClick=async()=>{
    let toggleVal=await getFromStorage('prototype')
    toggleVal=toggleVal?false:true
    await setToStorage('prototype',toggleVal)
    await main()
}
toggleBtn.addEventListener('click',handletoggleClick)