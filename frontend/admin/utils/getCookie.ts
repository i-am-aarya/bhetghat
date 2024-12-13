export function getCookie(name: string) {
  const cookieArr = document.cookie.split(';')
  for(let i=0; i<cookieArr.length; i++) {
    let cookie = cookieArr[i].trim()
    if(cookie.startsWith(name+"=")) {
      return cookie.substring(name.length+1)
    }
  }
  return null
}