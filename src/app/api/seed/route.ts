import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { SEED_BOOTHS, SEED_PRODUCTS } from '@/lib/seed-data';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST() {
  try {
    const batch = adminDb.batch();

    // Delete existing booths
    const boothsSnap = await adminDb.collection('booths').get();
    boothsSnap.docs.forEach(d => batch.delete(d.ref));

    // Delete existing products
    const productsSnap = await adminDb.collection('products').get();
    productsSnap.docs.forEach(d => batch.delete(d.ref));

    await batch.commit();

    // Insert booths
    const batch2 = adminDb.batch();
    for (const booth of SEED_BOOTHS) {
      const ref = adminDb.collection('booths').doc(booth.id);
      batch2.set(ref, { ...booth, createdAt: FieldValue.serverTimestamp() });
    }

    // Insert products
    for (const product of SEED_PRODUCTS) {
      const ref = adminDb.collection('products').doc(product.id);
      batch2.set(ref, { ...product, createdAt: FieldValue.serverTimestamp() });
    }

    await batch2.commit();

    return NextResponse.json({ success: true, booths: SEED_BOOTHS.length, products: SEED_PRODUCTS.length });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
