const calcBtn = document.getElementById('calc-btn')

calcBtn.addEventListener('click', mainBtn)

function mainBtn() {
  const inputIP = document.getElementById("ip-address").value.split('.');
  let inputMsq = document.getElementById("msq-address").value;
  if (/\/\d{2}/g.test(inputMsq)) {
    inputMsq = getMsq(inputMsq.match(/\d{2}/g).join(''))
    console.log(inputMsq)
  }
  result(inputIP, inputMsq.split('.'))
}

function result(ip, msq) {
  const ipNetwork = getIPNetwrk(ip, msq);
  const ipBroadcast = getIpBroadcast(ip, msq);
  const ipcontain = getPort(ipNetwork, ipBroadcast)
  const port = portAvailable(msq)
  const resultContainer = document.querySelector('.output')

  resultContainer.innerHTML = ""
  let pNetwork = document.createElement("p")
  pNetwork.innerHTML = `IP Network <span>${ipNetwork.join('.')}</span>`
  let pBroadcast = document.createElement("p")
  pBroadcast.innerHTML = `Broadcast Ip <span>${ipBroadcast.join('.')}</span>`
  let fistIp = document.createElement("p")
  fistIp.innerHTML = `First Ip<span>${ipcontain[0]}</span> `
  let lastIp = document.createElement("p")
  lastIp.innerHTML = `Last Ip <span>${ipcontain[1]}</span>`
  let portNumber = document.createElement("p")
  portNumber.innerHTML = `Port Number <span>${port}</span>`
  resultContainer.appendChild(pNetwork)
  resultContainer.appendChild(pBroadcast)
  resultContainer.appendChild(fistIp)
  resultContainer.appendChild(lastIp)
  resultContainer.appendChild(portNumber)

}

function getMsq(bitCount) {
  console.log(bitCount)
  var mask = [];
  for (var i = 0; i < 4; i++) {
    var n = Math.min(bitCount, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    bitCount -= n;
  }
  return mask.join(".");
}

function getIPNetwrk(ip, msq) {
  let result = []
  for (let i = 0; i < 4; i++) {
    result.push(ip[i] & msq[i])
  }
  return result
}
function getIpBroadcast(ip, msq) {
  let result = []
  for (let i = 0; i < 4; i++) {
    result.push(ip[i] | (255 - msq[i]))
  }
  return result
}

function getPort(ipNetwrk, ipBroadcast) {
  let base = [0, 0, 0, 1]
  let result = [[], []]
  for (let i = 0; i < 4; i++) {
    result[0].push(parseInt(ipNetwrk[i]) + base[i])
    result[1].push(parseInt(ipBroadcast[i]) - base[i])
  }
  return result.map(ele => ele.join('.'))
}

function portAvailable(msq) {
  return Math.pow(2, 32 - getBin(msq)) - 2
}


var getBin = (netmask) => (netmask.map(Number)
  .map(part => (part >>> 0).toString(2))
  .join('')).split('1').length - 1;
