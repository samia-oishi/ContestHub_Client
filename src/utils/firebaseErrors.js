const messages = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/popup-closed-by-user': 'Google sign-in was closed before it finished.',
  'auth/unauthorized-domain': 'This local domain is not authorized in Firebase.',
  'auth/weak-password': 'Password should be at least 6 characters.',
}

export function getFirebaseErrorMessage(error, fallback = 'Authentication failed') {
  const message = messages[error?.code] || error?.message || fallback
  return error?.code ? `${message} (${error.code})` : message
}
