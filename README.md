
# Internship Activity Tracker

This is an open-source web application designed for interns to track their daily activities during an internship. The application allows users to define their internship span, log daily activities, and generate weekly and overall reports in PDF and Excel formats.

This version is architected to use **Firebase** for authentication and data storage, providing a secure, scalable, and cloud-based solution.

## Features

- **Secure Authentication:** User accounts with email and password.
- **Cloud Data Storage:** All internship data is stored securely in Firestore.
- **Daily Activity Logging:** A simple and intuitive interface to log daily tasks.
- **AI-Powered Summaries:** Uses the Gemini API to automatically generate weekly summaries.
- **Light & Dark Modes:** A comfortable viewing experience in any lighting condition.
- **Report Generation:** Export weekly or overall internship reports in PDF and Excel formats.
- **Fully Responsive:** Works beautifully on desktop and mobile devices.

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- A code editor (e.g., VS Code)
- A modern web browser
- A Google account to create a Firebase project

---

### 1. Firebase Project Setup

Before running the application, you need to create a Firebase project and configure its services.

**Step 1: Create a Firebase Project**
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the on-screen instructions to create a new project. Give it a name like `internship-tracker`.

**Step 2: Create a Web App**
1. In your new project's dashboard, click the Web icon (`</>`) to add a new web app.
2. Register your app with a nickname (e.g., "Internship Tracker Web").
3. After registering, Firebase will provide you with a configuration object. **Copy these credentials.** We'll use them in the next section.

**Step 3: Enable Authentication**
1. In the Firebase Console, go to **Build > Authentication**.
2. Click **Get started**.
3. Under the **Sign-in method** tab, select **Email/Password** from the list of providers.
4. Enable it and click **Save**.

**Step 4: Set up Firestore Database**
1. Go to **Build > Firestore Database**.
2. Click **Create database**.
3. Start in **production mode**.
4. Choose a Cloud Firestore location closest to your users.
5. In the **Rules** tab, paste the following rules to ensure users can only access their own data. Click **Publish**.

```json
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write to their own user profile document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Users can only read and write to their own internship document
    match /internships/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### 2. Application Configuration

Now you need to add your Firebase credentials and other API keys to the application.

**Step 1: Configure Firebase Credentials**
1.  In the project root, open the `firebase-config.ts` file.
2.  Replace the placeholder values with the Firebase configuration object you copied earlier.

```typescript
// firebase-config.ts

// IMPORTANT: Replace with your app's Firebase project configuration
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

**Step 2: Configure Environment Variables**
The application uses environment variables for sensitive keys. While you won't be using a `.env` file in this live-editing environment, the code is set up to read from `process.env`. In a local setup, you would create a `.env` file. For this environment, the platform injects these variables.

- **`API_KEY`**: Your Groq API key for generating weekly summaries.
  - Get one from [Groq Console](https://console.groq.com/keys).
- **`ENCRYPTION_KEY`**: A secret key for data encryption (optional but recommended for local storage fallbacks).

---

```typescript
// rename example.env.local TO .env.local

// IMPORTANT: Replace with actual app's API and encryption key (a suggested-familiar key)
GROQ_API_KEY=PLACEHOLDER_GROQ_KEY
ENCRYPTION_KEY=PLACEHOLDER_ENCRYPTION_KEY

```

### 3. Running the Application

Once configured, the application is ready to run. In a typical local development environment, you would run commands like `npm install` and `npm run dev`. In this live-coding environment, the app should reload automatically after you've made the configuration changes.

1. **Open the app in your browser.**
2. **Sign up** for a new account.
3. **Log in** with your new credentials.
4. You will be prompted to complete the initial **setup** for your internship.
5. Start tracking your activities!

Enjoy using the Internship Activity Tracker!
All the best!
