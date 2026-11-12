
import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Login form elements
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const loginButton = document.getElementById("login-button");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        loginMessage.textContent = "";

        if (!email || !password) {
            loginMessage.textContent = "Please enter your email and password.";
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";

        try {

            // Authenticate the existing user with Firebase
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            console.log("User successfully signed in:", user.uid);

            loginMessage.textContent = "Login successful! Redirecting...";

            // Redirect authenticated user to the dashboard
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);

            const errorMessages = {
                "auth/invalid-email":
                    "Please enter a valid email address.",

                "auth/user-not-found":
                    "No account was found with this email address.",

                "auth/wrong-password":
                    "Incorrect email or password.",

                "auth/invalid-credential":
                    "Incorrect email or password.",

                "auth/user-disabled":
                    "This account has been disabled.",

                "auth/too-many-requests":
                    "Too many attempts. Please try again later.",

                "auth/network-request-failed":
                    "Network error. Please check your connection."
            };

            loginMessage.textContent =
                errorMessages[error.code] ||
                "Unable to sign in. Please try again.";

            loginButton.disabled = false;
            loginButton.textContent = "Sign In";
        }
    });

}
