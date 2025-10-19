# 🏥 The Clinics Chatbot App

**The Clinics** is a multilingual medical chatbot application built with **React Native** and **Expo**. The app provides users with predefined medical questions and answers, real-time suggestions, and a smooth chat experience. It supports both **English** and **Arabic**, with **RTL (Right-to-Left)** layout support for Arabic.

---

## 📖 Table of Contents

- [✨ Features](#features)  
- [🎬 App Demo](#app-demo)   
- [⚙️ Installation & Setup](#installation--setup)
- [📦 Dependencies](#dependencies)   

---

## ✨ Features

- 🌐 Multilingual support: English & Arabic (RTL compatible)  
- ❓ Predefined medical Q&A with **autocomplete suggestions**  
- 📝 Real-time input suggestions and auto-fill  
- 💾 Persistent language selection using AsyncStorage  
- 🎨 Animated typing indicator with `react-native-reanimated`  
- 🎉 Splash screen with **Lottie animation**  
- 💬 Multi-chat support with **recent chats, new chat creation, and chat deletion**  
- 🧩 Modular UI with **SideDrawer** for navigation  
- ✅ Fully compatible with Expo 53 

---

## App Demo

🎥 Here’s a short preview of **The Clinics Chatbot App** 👇  

https://github.com/user-attachments/assets/e7d2713d-8a3a-4c6a-8381-f728d1fd4612

---

## Installation & Setup

### 1. Prerequisites
Before installing, ensure you have:
- Node.js >= 18
- npm >= 9 or yarn
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS) or Android Studio (for Android) if building locally

---

### 2. Clone the Repository
```bash
git clone https://github.com/MohiAssaf/The-Clinics-chatbot.git
cd The-Clinics-chatbot
```

---

### 3. Install dependencies

```bash
npm install
```

---

### 4. **Local Development Build**

#### 4.1 Prebuild Native Modules

```bash
npx expo prebuild
```

#### 4.2 Run on iOS

```bash
npx expo run:ios
```

#### 4.3 Run on Android

```bash
npx expo run:android
```

#### 4.4 Start Development Server

```bash
npx expo start
```

---

### 5. **EAS Cloud Development Build**

#### 5.1 Build for iOS

```bash
eas build --profile development --platform ios
```

#### 5.2 Build for Android

```bash
eas build --profile development --platform android
```

#### 5.3 Start Development Server

```bash
npx expo start
```

---

## Dependencies

Key dependencies used in this project:

- react-native-gifted-chat – Chat UI
- react-native-reanimated – Animations
- react-i18next & i18next – Localization
- lottie-react-native – Splash animations
- @react-native-async-storage/async-storage – Persistent storage
- nativewind & tailwindcss – Styling
- expo & related packages (expo-font, expo-asset, expo-updates) – Expo SDK
