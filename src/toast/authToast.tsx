'use client';

import { useAuth } from '@/src/context/authContext';
import { CheckCircle, User } from 'lucide-react';
import LoadingLink from '../components/navigation/LoadingLink';

export default function AuthToast() {
  const { successMessage, isAuthenticated } = useAuth();

  if (!successMessage) return null;

  return (
    <div className="dialog_bubble dialog_bubble_user">
      <div className="flex items-center gap-4">
        <User className="w-5 h-5 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="normal_text">{successMessage}</span>
          {isAuthenticated && (
            <LoadingLink href="/perfil" className="small_text link_text_color text_clickable">
              Ver perfil
            </LoadingLink>
          )}
        </div>
      </div>
    </div>
  );
}
