import { db } from './firebase.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js';

export async function submitRailEnquiry(data) {
  try {
    const docRef = await addDoc(collection(db, 'rail_enquiries'), {
      ...data,
      timestamp: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting rail enquiry:', error);
    throw error;
  }
}

export async function submitFlightEnquiry(data) {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, 'flight_enquiries'), {
      ...data,
      timestamp: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting flight enquiry:', error);
    throw error;
  }
}

export async function submitContactMessage(data) {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, 'contact_messages'), {
      ...data,
      timestamp: new Date(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
}
