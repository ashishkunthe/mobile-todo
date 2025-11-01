# 📱 Task Manager Frontend (React Native + Expo)

This is the **frontend** for the Task Manager app built with **React Native + Expo**.
It connects to a Node.js/Express + MongoDB backend to manage user authentication and tasks.

---

## 🚀 Features

- 🔐 User authentication (login/register)
- ✅ Create, edit, delete, and mark tasks complete
- 🚪 Logout functionality
- 🦯 Navigation with React Navigation
- 🧠 Context-based auth handling
- 🧩 Simple and clean UI with vector icons

---

## 📂 Project Structure

```
src/
  api/
    api.ts
  contexts/
    AuthContext.tsx
  screens/
    LoginScreen.tsx
    RegisterScreen.tsx
    TaskListScreen.tsx
    TaskFormScreen.tsx
  components/
    TaskItem.tsx
AppNavigator.tsx
App.tsx
```

---

## ⚙️ Setup & Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Expo development server

```bash
npx expo start
```

You’ll get a QR code in your terminal or browser.

---

## 📱 Running on a Physical Device

To use your **real phone** instead of an emulator:

1. **Install Expo Go app** from the Play Store / App Store
2. Make sure **your phone and laptop are connected to the same Wi-Fi network**
3. Start the Expo server:

   ```bash
   npx expo start
   ```

4. Scan the QR code with the **Expo Go app** — the project will open automatically

---

## 🌐 Connecting to Backend (from Physical Device)

By default, your backend runs on `http://localhost:4000`,
but your **phone can’t access localhost** from your laptop.

🔗 Replace the backend URL in `src/api/api.ts` with your **local IP address**:

```ts
// src/api/api.ts
import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.5:4000", // replace with your laptop's local IP
  withCredentials: true,
});
```

### 🦯 To find your local IP:

- On Windows: run `ipconfig`
- On macOS/Linux: run `ifconfig`

Look for something like `192.168.x.x` under your Wi-Fi adapter.

Now your physical device can communicate with the backend successfully ✅

---

## 🗬️ Useful Commands

| Command                   | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npx expo start`          | Start development server                      |
| `npx expo start --tunnel` | Use tunnel mode (works even if Wi-Fi differs) |
| `npm run android`         | Run on Android emulator                       |
| `npm run ios`             | Run on iOS simulator (Mac only)               |

---

## 🧠 Notes

- Make sure your **backend server** is running before testing
- Tokens and authentication are handled via context
- Tasks and user data are fetched via protected routes
- If using physical device, always check IP and Wi-Fi connection

---

## 🛠️ Tech Stack

- ⚛️ **React Native + Expo**
- 🔗 **Axios**
- 🦯 **React Navigation**
- 🧠 **Context API**
- 💬 **TypeScript**
- 🎨 **@expo/vector-icons**

---

## 🧑‍💻 Author

**Ashish Kunthe**
💼 [LinkedIn](https://www.linkedin.com/in/ashish-kunthe-030b04225/)
🖙 [GitHub](https://github.com/ashishkunthe)
🖊️ [Twitter](https://x.com/AshishKnthe)
