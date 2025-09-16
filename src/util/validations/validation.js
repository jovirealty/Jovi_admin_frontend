export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

export function validateFields({ email, name, password }) {
    const errors = { email: "", name: "", password: "" };

    if(!EMAIL_RE.test(email)) { errors.email = "Enter a valid email address."; }
    if(!NAME_RE.test(name)) { errors.name = "Use letters and single spaces only."; }
    if(password.length < 8) { errors.password = "Password must be at least 8 characters."; }

    const isValid = !errors.email && !errors.name && !errors.password;
    return { isValid, errors };
}