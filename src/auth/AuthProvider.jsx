import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
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
      role: fallback.role,
    })
    setProfile(data.data)
    return data.data
  }, [])

  const updateAuthProfile = useCallback((nextProfile) => {
    setProfile(nextProfile)
  }, [])

  useEffect(() => {
    getRedirectResult(auth)
      .then((credential) => {
        if (!credential?.user) return

        const role = localStorage.getItem('pendingGoogleRole') || 'user'
        localStorage.removeItem('pendingGoogleRole')
        return syncSession(credential.user, { role })
      })
      .catch((error) => {
        console.error('Google redirect login failed', error)
      })

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

  const registerWithEmail = useCallback(async ({ name, email, password, photoURL, role }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name, photoURL })
    setUser(auth.currentUser)
    return syncSession(credential.user, { name, photoURL, role })
  }, [syncSession])

  const loginWithEmail = useCallback(async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return syncSession(credential.user)
  }, [syncSession])

  const loginWithGoogle = useCallback(async (role = 'user') => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    try {
      const credential = await signInWithPopup(auth, provider)
      return syncSession(credential.user, { role })
    } catch (error) {
      console.error('Google popup login failed', error)

      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        localStorage.setItem('pendingGoogleRole', role)
        await signInWithRedirect(auth, provider)
        return null
      }

      throw error
    }
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
      updateAuthProfile,
      role: profile?.role || 'user',
    }),
    [user, profile, loading, registerWithEmail, loginWithEmail, loginWithGoogle, updateAuthProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
