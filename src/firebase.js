

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDINGID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

console.log(firebaseConfig, 'firebase config')

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };







// // firebase.js
// import { initializeApp } from 'firebase/app';
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
//   doc,
//   updateDoc,
//   deleteDoc,
//   orderBy,
//   Timestamp,
// } from 'firebase/firestore';


// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDINGID,
//   appId: import.meta.env.VITE_FIREBASE_APPID,
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);


// export const loginWithPin = async (pin) => {
//   const usersRef = collection(db, 'users');
//   const q = query(usersRef, where('pin', '==', pin));
//   const snapshot = await getDocs(q);
//   if (snapshot.empty) return null;
//   const user = snapshot.docs[0];
//   return { id: user.id, ...user.data() };
// };


// export const addUser = async ({ pin, role, notes }) => {
//   const usersRef = collection(db, 'users');
//   return await addDoc(usersRef, {
//     pin,
//     role,
//     notes: notes || '',
//     createdAt: Timestamp.now(),
//   });
// };


// export const updateUser = async (userId, updates) => {
//   const userRef = doc(db, 'users', userId);
//   await updateDoc(userRef, updates);
// };


// export const deleteUser = async (userId) => {
//   const userRef = doc(db, 'users', userId);
//   await deleteDoc(userRef);
// };


// export const addActivity = async ({ userPin, date, activities }) => {
//   const activitiesRef = collection(db, 'daily_activities');
//   return await addDoc(activitiesRef, {
//     userPin,
//     date,
//     activities,
//     timestamp: Timestamp.now(),
//   });
// };


// export const getActivities = async ({ startDate, endDate, userPin = null }) => {
//   const activitiesRef = collection(db, 'daily_activities');

//   let filters = [
//     where('date', '>=', startDate),
//     where('date', '<=', endDate),
//   ];

//   if (userPin) {
//     filters.push(where('userPin', '==', userPin));
//   }

//   const q = query(activitiesRef, ...filters, orderBy('date'));
//   const snapshot = await getDocs(q);

//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };


// export const updateActivity = async (userRole, activityId, updates) => {
//   if (userRole !== 'admin') {
//     throw new Error('Permission denied: Only admin can update activity.');
//   }
//   const ref = doc(db, 'daily_activities', activityId);
//   await updateDoc(ref, updates);
// };


// export const deleteActivity = async (userRole, activityId) => {
//   if (userRole !== 'admin') {
//     throw new Error('Permission denied: Only admin can delete activity.');
//   }
//   const ref = doc(db, 'daily_activities', activityId);
//   await deleteDoc(ref);
// };

// export default db;
