import secureLocalStorage from "react-secure-storage";

export function logout(router) {
    secureLocalStorage.clear();
    window.location.href = "/auth/login";
}

export function roleIdToRoleName(roleId) {
    switch (roleId) {
        case 1:
            return "Admin";
        case 2:
            return "Department Head";
        case 3:
            return "Office Staff";
        case 4:
            return "Professor";
        default:
            return "Unknown";
    }
}