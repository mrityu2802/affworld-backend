import serviceAccount from "./firebaseSA.json" assert { type: "json" };
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
