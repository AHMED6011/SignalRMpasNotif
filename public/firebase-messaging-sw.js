// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: "AIzaSyC0aNDiJN3mWIJ7-cSY8uL55HJLLRAteMg",
  authDomain: "vue-notifications-a7522.firebaseapp.com",
  projectId: "vue-notifications-a7522",
  storageBucket: "vue-notifications-a7522.appspot.com",
  messagingSenderId: "746400036064",
  appId: "1:746400036064:web:70860aebb654de2c2c8c85",
  measurementId: "G-F61WNGZWRP",
});

// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
