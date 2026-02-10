import { db } from './firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const TESTIMONIALS_COLLECTION = 'testimonials';

export async function loadTestimonials(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const querySnapshot = await getDocs(collection(db, TESTIMONIALS_COLLECTION));
    const testimonials = [];

    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() });
    });

    if (testimonials.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No testimonials available</p>';
      return;
    }

    container.innerHTML = testimonials.map(test => `
      <div class="testimonial-card">
        <div class="testimonial-avatar">
          <img src="${test.photo || 'https://via.placeholder.com/80'}" alt="${test.name}" onerror="this.src='https://via.placeholder.com/80'">
        </div>
        <div class="testimonial-stars">${'⭐'.repeat(test.rating || 5)}</div>
        <p class="testimonial-text">"${test.review}"</p>
        <p class="testimonial-author">${test.name}</p>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${test.city || 'India'}</p>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading testimonials:', error);
    container.innerHTML = '<p style="color: var(--text-muted);">Unable to load testimonials</p>';
  }
}

export async function addTestimonial(data) {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
      ...data,
      createdAt: new Date(),
      rating: data.rating || 5
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }
}

export async function updateTestimonial(id, data) {
  try {
    const db = getFirestore();
    await updateDoc(doc(db, TESTIMONIALS_COLLECTION, id), data);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonial(id) {
  try {
    const db = getFirestore();
    await deleteDoc(doc(db, TESTIMONIALS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}
