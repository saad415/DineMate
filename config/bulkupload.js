// config/bulkupload.js
import { collection, doc, setDoc } from "firebase/firestore";
import { restaurants } from "../store/restaurants";
import { db } from "./firebaseConfig";

// ✅ export as a named function
export async function uploadData() {
  try {
    for (let i = 0; i < restaurants.length; i++) {
      const slot = restaurants[i];
      const docRef = doc(collection(db, "restaurants"), `restaurants_${i + 1}`);
      await setDoc(docRef, slot);
    }
    console.log("Data uploaded");
  } catch (e) {
    console.error("Error uploading data", e);
  }
}
