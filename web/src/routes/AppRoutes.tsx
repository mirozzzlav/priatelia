import { Navigate, Route, Routes } from "react-router-dom";

import { useDiscoverySettings } from "src/hooks/useDiscoverySettings";
import { usePersonPreview } from "src/hooks/usePersonPreview";
import { useProfileState } from "src/hooks/useProfileState";
import { AppLayout } from "src/layouts/AppLayout";
import { ActivationCompleteRoute } from "src/routes/ActivationCompleteRoute";
import { ActivationSentRoute } from "src/routes/ActivationSentRoute";
import { ChatThreadRoute } from "src/routes/ChatThreadRoute";
import { CriteriaRoute } from "src/routes/CriteriaRoute";
import { DiscoveryRoute } from "src/routes/DiscoveryRoute";
import { LoginRoute } from "src/routes/LoginRoute";
import { MessagesRoute } from "src/routes/MessagesRoute";
import { PasswordRoute } from "src/routes/PasswordRoute";
import { ProfileRoute } from "src/routes/ProfileRoute";
import { ProtectedRoute } from "src/routes/ProtectedRoute";
import { PublicOnlyRoute } from "src/routes/PublicOnlyRoute";
import { RegistrationRoute } from "src/routes/RegistrationRoute";

export function AppRoutes() {
  const {
    profileData,
    savePassword,
    saveProfile,
    syncLoginProfile,
    syncRegisteredProfile,
  } = useProfileState();
  const {
    activeAction,
    clearActiveAction,
    error,
    isLoadingPersonPreview,
    isSubmittingPersonPreviewAction,
    loadPersonPreview,
    personPreview,
    resetDiscovery,
    startPersonPreviewAction,
  } = usePersonPreview();
  const { discoverySettings, saveDiscoverySettings } = useDiscoverySettings();

  return (
    <Routes>
      <Route element={<AppLayout onLogout={resetDiscovery} />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginRoute
                onLoginProfileSync={syncLoginProfile}
                onPersonPreviewLoad={loadPersonPreview}
              />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegistrationRoute
                onRegisteredProfileSync={syncRegisteredProfile}
              />
            </PublicOnlyRoute>
          }
        />
        <Route path="/activation-sent" element={<ActivationSentRoute />} />
        <Route path="/activate" element={<ActivationCompleteRoute />} />
        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <DiscoveryRoute
                activeAction={activeAction}
                error={error}
                isLoadingPersonPreview={isLoadingPersonPreview}
                isSubmittingPersonPreviewAction={
                  isSubmittingPersonPreviewAction
                }
                onActionEnd={clearActiveAction}
                onActionStart={startPersonPreviewAction}
                onPersonPreviewLoad={loadPersonPreview}
                personPreview={personPreview}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileRoute initialProfile={profileData} onSave={saveProfile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:matchId"
          element={
            <ProtectedRoute>
              <ChatThreadRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/password"
          element={
            <ProtectedRoute>
              <PasswordRoute onSave={savePassword} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/criteria"
          element={
            <ProtectedRoute>
              <CriteriaRoute
                initialSettings={discoverySettings}
                onSave={saveDiscoverySettings}
              />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
