# Firebase Security Rules (Firestore Only)

## Setup Instructions

Karena kita menggunakan **Cloudinary** untuk storage (gambar/video), Firebase Storage **TIDAK PERLU** dibuat.

Security rules ini hanya untuk **Firestore Database** saja.

---

## Firestore Rules

Paste these rules in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Config - only admin can write
    match /config/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Flashback - only admin can write
    match /flashback/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Gallery - only admin can write
    match /gallery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Guests - everyone can read and create (for guest messages)
    match /guests/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
  }
}
```

## How to Apply

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Go to**: Firestore Database → Rules tab
4. **Replace** the existing rules with the rules above
5. **Click "Publish"**

---

## Security Notes

### Public Read Access
- ✅ All users can read `config`, `flashback`, `gallery` collections (for viewing invitation)
- ✅ All users can read `guests` collection (to see messages)

### Write Access
- 🔒 Only authenticated users (admin) can write to `config`, `flashback`, `gallery`
- ✅ Any user can create guest messages (for visitors to leave messages)
- 🔒 Only authenticated users (admin) can update/delete guest messages

### Why No Firebase Storage?

We use **Cloudinary** for file storage because:
- ✅ **25GB free storage** (vs Firebase 5GB)
- ✅ **25GB/month bandwidth** (vs Firebase 1GB/day)
- ✅ **Auto image optimization**
- ✅ **Global CDN**
- ✅ **Free image transformations**
- ✅ **No credit card required**

See `CLOUDINARY_SETUP.md` for setup instructions.

---

## Collection Structure

### `config`
Single document (`undanganSettings`) containing wedding configuration.

### `flashback`
Array of flashback moments (admin-managed).

### `gallery`
Array of gallery images (admin-managed).

### `guests`
Array of guest messages (public can create, admin can delete).

---

## Testing Rules

### Test as Visitor (not logged in):
- ✅ Can view invitation (read config, flashback, gallery)
- ✅ Can submit guest message (create in guests)
- ❌ Cannot modify config, flashback, gallery
- ❌ Cannot delete guest messages

### Test as Admin (logged in):
- ✅ Can do everything visitors can do
- ✅ Can update config, flashback, gallery
- ✅ Can delete guest messages

---

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause:** Rules not applied correctly or user not authenticated.

**Solution:**
1. Make sure rules are published in Firebase Console
2. For admin operations, ensure you're logged in
3. Check Firebase Authentication is enabled

### Error: "unavailable"

**Cause:** Firestore not enabled or wrong project ID.

**Solution:**
1. Enable Firestore Database in Firebase Console
2. Check `.env.local` has correct `FIREBASE_PROJECT_ID`

---

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Cloudinary Setup Guide](./CLOUDINARY_SETUP.md)
