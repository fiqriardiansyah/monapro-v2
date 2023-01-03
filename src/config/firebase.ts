import { FirebaseApp, initializeApp } from "firebase/app";

class ConfigFirebase {
    firebaseConfig: {
        apiKey: string;
        authDomain: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        // databaseURL: string;
        appId: string;
        measurementId: string;
    };

    app: FirebaseApp;

    constructor() {
        this.firebaseConfig = {
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY as string,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN as string,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID as string,
            // databaseURL: process.env.REACT_APP_DATABASE_URL as string,
            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET as string,
            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID as string,
            appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
            measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID as string,
        };
        this.app = initializeApp(this.firebaseConfig);
    }
}

const configFirebase = new ConfigFirebase();
export default configFirebase;
