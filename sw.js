self.addEventListener('install', function(event) {
  console.log('inside sw: installed, skipping waiting', event);
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('inside sw: activated', event);
});

let sendToAllClients = data => {
  clients.matchAll({includeUncontrolled: true}).then(clients => {
    console.log(`sending message to ${clients.length} clients`);
    for (let client of clients) {
      client.postMessage(data);
    }
  });
};
let connect = ws_url => {
  let handler = event => {
    const summary = (({type, data, code}) => ({type, data, code}))(event);
    sendToAllClients(summary);
  };
  let a = new WebSocket(ws_url);
  a.onerror = handler;
  a.onopen = handler;
  a.onmessage = handler;
  a.onclose = handler;
  return a;
};

const wsUrl =
  'wss://ws-test1.staging.pusher.com:443/app/9f35c4ed36479d45cbea?protocol=7&client=js&version=4.4.0&flash=false';
setInterval(() => {
  let c = connect(wsUrl);
  setTimeout(() => c.close(), 2000)
}, 4000);
