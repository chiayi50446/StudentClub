import { signout } from './api-auth.js'

let authStateListeners = [];
const auth = {
  isAuthenticated() {
    if (typeof window == "undefined")
      return false
    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'))
    else
      return false
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
  },
  clearJWT(cb) {
    if (typeof window !== "undefined")
      sessionStorage.removeItem('jwt')
    cb()
    authStateListeners.forEach((listener) => listener()); // 通知所有監聽者
    //optional
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
  },
  subscribeAuthStateChange(listener) {
    authStateListeners.push(listener);
    return () => {
      authStateListeners = authStateListeners.filter((l) => l !== listener);
    };
  },
}

export default auth
