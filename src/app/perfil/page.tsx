import { Suspense } from 'react';
import { ProfileContent } from '@/src/context/profileContext';

function ProfileLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="box_border">
          <h1 className="main_title_text mb-6">Mi Cuenta</h1>
          <div className="flex items-center justify-center py-12">
            <p className="normal_text">Cargando perfil...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoadingFallback />}>
      <ProfileContent />
    </Suspense>
  );
}
