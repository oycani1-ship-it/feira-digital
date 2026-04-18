import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { SEED_BOOTHS, SEED_PRODUCTS } from '@/lib/seed-data';
import { collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function POST() {
  try {
    // 1. Limpeza - deletar todos os documentos existentes
    const boothsSnap = await getDocs(collection(db, 'booths'));
    for (const d of boothsSnap.docs) {
      await deleteDoc(doc(db, 'booths', d.id));
    }

    const productsSnap = await getDocs(collection(db, 'products'));
    for (const d of productsSnap.docs) {
      await deleteDoc(doc(db, 'products', d.id));
    }

    const ratingsSnap = await getDocs(collection(db, 'ratings'));
    for (const d of ratingsSnap.docs) {
      await deleteDoc(doc(db, 'ratings', d.id));
    }

    // 2. Inserção das Barracas
    for (const booth of SEED_BOOTHS) {
      const ref = doc(db, 'booths', booth.id);
      await setDoc(ref, {
        ...booth,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // 3. Inserção dos Produtos
    for (const product of SEED_PRODUCTS) {
      const ref = doc(collection(db, 'products'));
      await setDoc(ref, {
        ...product,
        createdAt: serverTimestamp()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Seed finalizado com sucesso!',
      booths: SEED_BOOTHS.length,
      products: SEED_PRODUCTS.length
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}