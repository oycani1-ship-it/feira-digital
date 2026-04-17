import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { SEED_BOOTHS, SEED_PRODUCTS } from '@/lib/seed-data';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST() {
  try {
    // 1. Limpeza em lote (Batch Delete)
    const batch1 = adminDb.batch();

    const boothsSnap = await adminDb.collection('booths').get();
    boothsSnap.docs.forEach(d => batch1.delete(d.ref));

    const productsSnap = await adminDb.collection('products').get();
    productsSnap.docs.forEach(d => batch1.delete(d.ref));

    const ratingsSnap = await adminDb.collection('ratings').get();
    ratingsSnap.docs.forEach(d => batch1.delete(d.ref));

    await batch1.commit();

    // 2. Inserção das Barracas
    const batch2 = adminDb.batch();
    for (const booth of SEED_BOOTHS) {
      const ref = adminDb.collection('booths').doc(booth.id);
      batch2.set(ref, { 
        ...booth, 
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }
    await batch2.commit();

    // 3. Inserção dos Produtos (em um novo lote para evitar limites de tamanho)
    const batch3 = adminDb.batch();
    for (const product of SEED_PRODUCTS) {
      const ref = adminDb.collection('products').doc(); // Gera ID automático
      batch3.set(ref, { 
        ...product, 
        createdAt: FieldValue.serverTimestamp() 
      });
    }
    await batch3.commit();

    return NextResponse.json({ 
      success: true, 
      message: "Seed finalizado com sucesso!",
      booths: SEED_BOOTHS.length, 
      products: SEED_PRODUCTS.length 
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error) 
    }, { status: 500 });
  }
}