export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authToken") || "{}")
  if (obj && obj.token && obj.tokenType) {
    return { Authorization: `${obj.tokenType} ${obj.token}` }
  } else {
    return {}
  }
}
