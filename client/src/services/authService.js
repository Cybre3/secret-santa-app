import { jwtDecode } from 'jwt-decode';

const tokenKey = 'token';

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    } catch (ex) {
        return null;
    }
}