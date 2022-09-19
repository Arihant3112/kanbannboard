import { getAuth, signOut } from "firebase/auth";
import { database } from "./../firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
export default class User {
  static getCurrentUser() {
    let user = getAuth().currentUser;
    if (!user) {
      alert("User not Authenticated");
      return null;
    } else {
      return user;
    }
  }
  static logout() {
    return signOut(getAuth());
  }
  static getUserName(uid) {
    const collectionRef = collection(database, "users");
    let q = query(collectionRef, where("uid", "==", uid));
    return getDocs(q).then((response) => {
      const name = response.docs.map((taskData) => {
        return taskData.data().name;
      });
      return name;
    });
  }
  static getAllUsers() {
    const collectionRef = collection(database, "users");
    return getDocs(collectionRef).then((response) => {
      const allUsers = response.docs.map((userData) => {
        return userData.data();
      });
      return allUsers;
    });
  }
  static addUser(uid, name) {
    const collectionRef = collection(database, "users");
    return addDoc(collectionRef, {
      name: name,
      uid: uid,
    });
  }
}
