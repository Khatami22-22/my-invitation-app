/**
 * API Route for Guest Messages
 * POST /api/guests - Add a new guest message
 * GET /api/guests - Get all guest messages
 * DELETE /api/guests/:id - Delete a guest message (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
function initAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

// POST - Add new guest message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, hadir, alamat, ucapan } = body;

    // Validation
    if (!nama || !ucapan) {
      return NextResponse.json(
        { success: false, error: 'Nama dan ucapan wajib diisi' },
        { status: 400 }
      );
    }

    const db = initAdmin();
    const guestRef = await db.collection('guests').add({
      nama,
      hadir: Boolean(hadir),
      alamat: alamat || '',
      ucapan,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      id: guestRef.id,
    });
  } catch (error) {
    console.error('Error adding guest message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add message' },
      { status: 500 }
    );
  }
}

// GET - Get all guest messages
export async function GET() {
  try {
    const db = initAdmin();
    const snapshot = await db
      .collection('guests')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error getting guest messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a guest message (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID required' },
        { status: 400 }
      );
    }

    // TODO: Add admin authentication check here

    const db = initAdmin();
    await db.collection('guests').doc(id).delete();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting guest message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
