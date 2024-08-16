// Cookie handling

/**
 * Get value of a specific cookie.
 * Code copied from https://www.w3schools.com/js/js_cookies.asp
 * @param cname Cookie name (key)
 * @returns {string} Value of the cookie or null if cookie not found
 */
export function getCookie(cname: string): string | null {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

/**
 * Get value of a specific cookie, or a default value if cookie is not found
 * @param cname Cookie name (key)
 * @param defaultValue Default value to return if cookie is not found
 */
export function getCookieOrDefault(
  cname: string,
  defaultValue: string
): string {
  const cookieValue = getCookie(cname);
  return cookieValue !== null ? cookieValue : defaultValue;
}

/**
 * Store a local cookie
 * Code copied from https://www.w3schools.com/js/js_cookies.asp
 * @param cname Name of the cookie (key)
 * @param cvalue Value of the cookie
 * @param exdays expiry time in days
 */
export function setCookie(
  cname: string,
  cvalue: string,
  exdays?: number
): void {
  const d = new Date();
  if (!exdays) {
    exdays = 1;
  }
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Delete a cookie
 * @param cookieName Name of the cookie to delete
 */
export function deleteCookie(cookieName: string): void {
  setCookie(cookieName, "", -1);
}
