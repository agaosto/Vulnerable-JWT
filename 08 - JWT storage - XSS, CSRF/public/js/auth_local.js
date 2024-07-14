function auth_local() {
  fetch('/session/jwt/storage')
    .then(response => response.json())
    .then(responseJson => {
      window.localStorage.setItem('token', responseJson.token)
  })
  return true;
}