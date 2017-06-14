function formFetch(url, data) {
  let header = new Headers();
  header.append('Content-Type', 'application/json');
  return fetch(url, {
    method: 'POST',
    headers: header,
    body: JSON.stringify(data)
  });
}

function userFetch(url, token, method = 'GET') {
  let header = new Headers();
  header.append('x-access-token', token);
  return fetch(url, { headers: header, method: method });
}

export { formFetch, userFetch };