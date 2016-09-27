self.addEventListener('message', function(e) {
  var data, header, xhr;
  data = e.data;
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        postMessage(xhr.responseText);
      } else {
        postMessage('ERROR');
      }
      return self.close();
    }
  };
  xhr.onerror = function() {
    postMessage('ERROR');
    return self.close();
  };
  xhr.open(data.method, data.url);
  if (data.headers) {
    for (header in data.headers) {
      if (data.headers[header]) {
        xhr.setRequestHeader(header, data.headers[header]);
      }
    }
  }
  return xhr.send();
});
