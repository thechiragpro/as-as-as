import { db } from './firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const CABS_COLLECTION = 'cabs';

export async function loadAllCabs(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const querySnapshot = await getDocs(collection(db, CABS_COLLECTION));
    const cabs = [];

    querySnapshot.forEach((doc) => {
      cabs.push({ id: doc.id, ...doc.data() });
    });

    if (cabs.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No cabs available</p>';
      return;
    }

    container.innerHTML = cabs.map(cab => `
      <div class="card" style="overflow: hidden;">
        <img src="${cab.image || 'https://via.placeholder.com/400x300'}" alt="${cab.name}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 1.5rem; border-radius: 0.5rem;">
        <h3>${cab.name}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: var(--primary); padding: 0.75rem; border-radius: 0.5rem; text-align: center;">
            <p style="color: var(--text-muted); font-size: 0.85rem;">Seats</p>
            <p style="font-size: 1.25rem; font-weight: 700; color: var(--accent);">${cab.seats}</p>
          </div>
          <div style="background: var(--primary); padding: 0.75rem; border-radius: 0.5rem; text-align: center;">
            <p style="color: var(--text-muted); font-size: 0.85rem;">Price/km</p>
            <p style="font-size: 1.25rem; font-weight: 700; color: var(--accent);">₹${cab.price_per_km}</p>
          </div>
        </div>
        <div style="margin-bottom: 1.5rem;">
          ${cab.ac ? '<span style="display: inline-block; background: var(--primary); color: var(--accent); padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.85rem; margin-right: 0.5rem;">🌬️ AC</span>' : ''}
          <span style="display: inline-block; background: var(--primary); color: var(--accent); padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.85rem;">📍 GPS</span>
        </div>
        <button onclick="bookCab('${cab.id}')" class="btn btn-primary" style="width: 100%;">Book Now</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading cabs:', error);
    container.innerHTML = '<p style="color: var(--text-muted);">Unable to load cabs</p>';
  }
}

export async function addCab(data) {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, CABS_COLLECTION), {
      ...data,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding cab:', error);
    throw error;
  }
}

export async function updateCab(id, data) {
  try {
    const db = getFirestore();
    await updateDoc(doc(db, CABS_COLLECTION, id), data);
  } catch (error) {
    console.error('Error updating cab:', error);
    throw error;
  }
}

export async function deleteCab(id) {
  try {
    const db = getFirestore();
    await deleteDoc(doc(db, CABS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting cab:', error);
    throw error;
  }
}

window.bookCab = function (cabId) {
  alert(`Booking cab: ${cabId}`);
};
