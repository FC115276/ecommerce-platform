const API_URL = "http://localhost:8080";

const loginForm = document.getElementById("loginForm");
if(loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })
        .then(res => {
            if(!res.ok) throw new Error("Login failed");
            if(res.status === 204) return null; // Spring might return No Content if null
            return res.json();
        })
        .then(user => {
            if(user) {
                localStorage.setItem("user", JSON.stringify(user));
                if(user.role === "SELLER") {
                    window.location.href = "seller.html";
                } else {
                    window.location.href = "buyer.html";
                }
            } else {
                alert("Invalid username or password");
            }
        })
        .catch(err => alert(err.message));
    });
}

const signupForm = document.getElementById("signupForm");
if(signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("regUsername").value;
        const password = document.getElementById("regPassword").value;
        const role = document.getElementById("regRole").value;

        fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password, role})
        })
        .then(res => res.json())
        .then(user => {
            alert("Registration successful! You are now logged in.");
            localStorage.setItem("user", JSON.stringify(user));
            if(user.role === "SELLER") {
                window.location.href = "seller.html";
            } else {
                window.location.href = "buyer.html";
            }
        })
        .catch(err => alert("Error registering user"));
    });
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// Security Check
function requireAuth(role) {
    const userStr = localStorage.getItem("user");
    if(!userStr) {
        window.location.href = "index.html";
        return null;
    }
    const user = JSON.parse(userStr);
    if(role && user.role !== role) {
        alert("Unauthorized access");
        window.location.href = "index.html";
        return null;
    }
    document.getElementById("userNameDisplay").textContent = user.username;
    return user;
}
