
import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Registration elements
const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");
const registerButton = document.getElementById("register-button");

// Only run registration logic on the registration page
if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get registration details
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const termsAccepted = document.getElementById("terms").checked;

        registerMessage.textContent = "";

        // Validate form
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            registerMessage.textContent = "Please complete all fields.";
            return;
        }

        if (password !== confirmPassword) {
            registerMessage.textContent = "Your passwords do not match.";
            return;
        }

        if (password.length < 8) {
            registerMessage.textContent = "Password must contain at least 8 characters.";
            return;
        }

        if (!termsAccepted) {
            registerMessage.textContent = "Please accept the Terms and Conditions.";
            return;
        }

        registerButton.disabled = true;
        registerButton.textContent = "Creating account...";

        try {

            // Create Firebase Authentication account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Update Firebase user profile
            await updateProfile(user, {
                displayName: fullName
            });

            // Save user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: fullName,
                email: email,
                phone: phone,
                createdAt: serverTimestamp(),
                accountStatus: "active"
            });

            registerMessage.textContent = "Account created successfully! Redirecting...";

            // Firebase automatically signs the user in after registration.
            // Send them directly to their dashboard.
            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Registration error:", error);

            const errorMessages = {
                "auth/email-already-in-use":
                    "An account with this email already exists.",

                "auth/invalid-email":
                    "Please enter a valid email address.",

                "auth/weak-password":
                    "Your password is too weak. Use at least 8 characters.",

                "auth/network-request-failed":
                    "Network error. Please check your connection.",

                "permission-denied":
                    "Unable to save your profile. Please check your Firebase permissions."
            };

            registerMessage.textContent =
                errorMessages[error.code] ||
                "Unable to create your account. Please try again.";

            registerButton.disabled = false;
            registerButton.textContent = "Create Account";
        }
    });

}
