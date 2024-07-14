function auth_session() {
  fetch('/session/jwt/storage')
    .then(response => response.json())
    .then(responseJson => {
      window.sessionStorage.setItem('token', responseJson.token)
  })
  return true;
}