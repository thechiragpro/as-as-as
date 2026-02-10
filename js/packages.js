import { db } from './firebase.js';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const PACKAGES_COLLECTION = 'packages';

export async function loadFeaturedTours(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    // 1. Try to get Featured Packages first
    let q = query(
      collection(db, PACKAGES_COLLECTION),
      where('featured', '==', true)
    );
    let querySnapshot = await getDocs(q);
    let packages = [];

    querySnapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() });
    });

    // 2. If no featured packages found (or very few), fallback to fetching latest packages
    if (packages.length === 0) {
      // Fetch latest 4 packages
      const qAll = query(collection(db, PACKAGES_COLLECTION)); // Ideally ordering by createdAt desc, but let's keep it simple for now as we might not have composite indexes
      const allSnap = await getDocs(qAll);
      allSnap.forEach((doc) => {
        if (packages.length < 4) {
          packages.push({ id: doc.id, ...doc.data() });
        }
      });
    }

    // If still no packages
    if (packages.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No packages available at the moment.</p>';
      return;
    }

    container.innerHTML = packages.map(pkg => `
      <div class="card" style="overflow: hidden; display: flex; flex-direction: column; position: relative;">
        ${pkg.badgeText ? `<div class="badge-offer">${pkg.badgeText}</div>` : ''}
        <img src="${pkg.image || 'https://via.placeholder.com/400x300'}" alt="${pkg.title}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 1rem;">
        
        ${pkg.isPopular ? `<div class="badge-popular">🔥 Popular Choice</div>` : ''}
        <h3 style="flex-grow: 1; margin-bottom: 0.5rem;">${pkg.title}</h3>
        <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem;">${pkg.duration} days | ${pkg.destination}</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <div>
            ${pkg.oldPrice ? `<span class="price-old">₹${pkg.oldPrice.toLocaleString()}</span>` : ''}
            <span style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">₹${pkg.price.toLocaleString()}</span>
          </div>
          <button onclick="window.enquirePackage('${pkg.id}', '${pkg.title ? pkg.title.replace(/'/g, "\\'") : 'Tour'}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Enquire</button>
        </div>

        ${pkg.seatsRemaining ? `
          <div class="urgency-text">
            <span>⚠️ Only ${pkg.seatsRemaining} seats left at this price!</span>
          </div>
        ` : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading featured tours:', error);
    container.innerHTML = '<p style="color: var(--text-muted);">Unable to load packages</p>';
  }
}

export async function loadAllPackages(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  try {
    const querySnapshot = await getDocs(collection(db, PACKAGES_COLLECTION));
    const packages = [];

    querySnapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() });
    });

    if (packages.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No packages available at the moment</p>';
      return;
    }

    container.innerHTML = packages.map(pkg => `
      <div class="card" style="overflow: hidden; display: flex; flex-direction: column; position: relative;">
        ${pkg.badgeText ? `<div class="badge-offer">${pkg.badgeText}</div>` : ''}
        <img src="${pkg.image || 'https://via.placeholder.com/400x300'}" alt="${pkg.title}" style="width: 100%; height: 200px; object-fit: cover; margin-bottom: 1rem;">
        
        ${pkg.isPopular ? `<div class="badge-popular">🔥 Popular Choice</div>` : ''}
        <h3 style="flex-grow: 1; margin-bottom: 0.5rem;">${pkg.title}</h3>
        <p style="color: var(--text-muted); margin-bottom: 1rem; font-size: 0.9rem;">${pkg.duration} days | ${pkg.destination}</p>
        
        <div style="margin-bottom: 1rem;">
          ${pkg.highlights ? `<p style="color: var(--text-muted); font-size: 0.85rem;">${pkg.highlights.slice(0, 2).join(', ')}</p>` : ''}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
          <div>
            ${pkg.oldPrice ? `<span class="price-old">₹${pkg.oldPrice.toLocaleString()}</span>` : ''}
            <span style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">₹${pkg.price.toLocaleString()}</span>
          </div>
          <button onclick="window.enquirePackage('${pkg.id}', '${pkg.title ? pkg.title.replace(/'/g, "\\'") : 'Tour'}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Enquire</button>
        </div>

        ${pkg.seatsRemaining ? `
          <div class="urgency-text">
            <span>⚠️ Only ${pkg.seatsRemaining} seats left at this price!</span>
          </div>
        ` : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading packages:', error);
    container.innerHTML = '<p style="color: var(--text-muted);">Unable to load packages</p>';
  }
}

export async function addPackage(data) {
  try {
    const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), {
      ...data,
      createdAt: new Date(),
      featured: data.featured || false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding package:', error);
    throw error;
  }
}

export async function updatePackage(id, data) {
  try {
    await updateDoc(doc(db, PACKAGES_COLLECTION, id), data);
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
}

export async function deletePackage(id) {
  try {
    const db = getFirestore();
    await deleteDoc(doc(db, PACKAGES_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
}

window.enquirePackage = function (packageId, title) {
  alert(`Opening enquiry for package: ${title || packageId}`);
};
