// import { useEffect, useState } from 'react';
// import { getAuth } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/firebase';

// export const useAuth = () => {
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           localStorage.setItem('role', userData.role);
//           setRole(userData.role);
//         }
//       });
//     }
//   }, []);

//   return { role };
// };
