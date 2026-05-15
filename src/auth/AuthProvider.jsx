import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { api } from '../api/axiosInstance'
import { AuthContext } from './AuthContext'
import { auth } from '../firebase/firebase.config'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const syncSession = useCallback(async (currentUser, fallback = {}) => {
    const { data } = await api.post('/auth/jwt', {
      name: currentUser.displayName || fallback.name,
      email: currentUser.email,
      photoURL: currentUser.photoURL || fallback.photoURL,
    })
    setProfile(data.data)
    return data.data
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (!currentUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        await syncSession(currentUser)
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [syncSession])

  const registerWithEmail = useCallback(async ({ name, email, password, photoURL }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name, photoURL })
    setUser(auth.currentUser)
    return syncSession(credential.user, { name, photoURL })
  }, [syncSession])

  const loginWithEmail = useCallback(async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return syncSession(credential.user)
  }, [syncSession])

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    return syncSession(credential.user)
  }, [syncSession])

  const logout = async () => {
    await signOut(auth)
    await api.post('/auth/logout')
    setProfile(null)
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle,
      logout,
      role: profile?.role || 'user',
    }),
    [user, profile, loading, registerWithEmail, loginWithEmail, loginWithGoogle],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
