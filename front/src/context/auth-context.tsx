'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client';

export type UserRole = 'OWNER' | 'RECEPTIONIST' | 'VET' | 'ADMIN';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  can: (permission: Permission) => boolean;
  signOut: () => Promise<void>;
}

export type Permission =
  | 'manage_pets'
  | 'manage_appointments'
  | 'view_appointments'
  | 'manage_vaccinations'
  | 'manage_users'
  | 'view_audit'
  | 'view_owner_portal';

const permissions: Record<UserRole, Permission[]> = {
  OWNER: ['view_owner_portal', 'view_appointments'],
  RECEPTIONIST: ['manage_pets', 'manage_appointments', 'view_appointments'],
  VET: ['manage_appointments', 'manage_vaccinations', 'view_appointments'],
  ADMIN: [
    'manage_pets',
    'manage_appointments',
    'view_appointments',
    'manage_vaccinations',
    'manage_users',
    'view_audit',
  ],
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;
    const client = getSupabaseClient();
    const loadProfile = async () => {
      const { data } = await client.auth.getUser();
      if (!data.user) {
        if (active) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const { data: profileData, error } = await client
        .from('profiles')
        .select('id, email, full_name, role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (active) {
        if (error) console.error('No se pudo cargar el perfil:', error.message);
        setProfile(
          profileData
            ? {
                id: profileData.id,
                email: profileData.email,
                fullName: profileData.full_name,
                role: profileData.role as UserRole,
              }
            : {
                id: data.user.id,
                email: data.user.email ?? '',
                fullName: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'Usuario',
                role: 'OWNER',
              },
        );
        setLoading(false);
      }
    };

    void loadProfile();
    const { data: subscription } = client.auth.onAuthStateChange(() => void loadProfile());
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      loading,
      isAuthenticated: Boolean(profile),
      can: (permission) => Boolean(profile && permissions[profile.role].includes(permission)),
      signOut: async () => {
        if (isSupabaseConfigured) await getSupabaseClient().auth.signOut();
        setProfile(null);
      },
    }),
    [loading, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

export function RoleView({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can, loading } = useAuth();
  if (loading) return null;
  return can(permission) ? children : fallback;
}
