import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";

import type { RegistrationPhoto } from "src/features/registration";
import {
  maxProfilePhotoCount,
  maxProfilePhotoError,
} from "src/constants/profilePhotos";
import { createId } from "src/utils/createId";

type PhotoGalleryFormData = {
  photos: RegistrationPhoto[];
};

type UsePhotoGalleryStateOptions<TFormData extends PhotoGalleryFormData> = {
  onValidationError?: (message: string) => void;
  photoCount: number;
  resetFeedback: () => void;
  setFormData: Dispatch<SetStateAction<TFormData>>;
};

function createPhoto(file: File, shouldBePrimary: boolean): RegistrationPhoto {
  return {
    id: `${file.name}-${file.lastModified}-${createId("photo")}`,
    file,
    isPrimary: shouldBePrimary,
    name: file.name,
    url: URL.createObjectURL(file),
  };
}

export function usePhotoGalleryState<TFormData extends PhotoGalleryFormData>({
  onValidationError,
  photoCount,
  resetFeedback,
  setFormData,
}: UsePhotoGalleryStateOptions<TFormData>) {
  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    resetFeedback();
    const availableSlots = maxProfilePhotoCount - photoCount;

    if (availableSlots <= 0) {
      onValidationError?.(maxProfilePhotoError);
      event.target.value = "";
      return;
    }

    if (files.length > availableSlots) {
      onValidationError?.(maxProfilePhotoError);
    }

    setFormData((current) => {
      const newPhotos = files.slice(0, availableSlots).map((file, index) =>
        createPhoto(file, current.photos.length === 0 && index === 0),
      );

      return {
        ...current,
        photos: [...current.photos, ...newPhotos],
      };
    });

    event.target.value = "";
  };

  const setPrimaryPhoto = (photoId: string) => {
    resetFeedback();
    setFormData((current) => ({
      ...current,
      photos: current.photos.map((photo) => ({
        ...photo,
        isPrimary: photo.id === photoId,
      })),
    }));
  };

  const removePhoto = (photoId: string) => {
    resetFeedback();
    setFormData((current) => {
      const removedPhoto = current.photos.find((photo) => photo.id === photoId);
      const remainingPhotos = current.photos.filter(
        (photo) => photo.id !== photoId,
      );
      const needsPrimary =
        removedPhoto?.isPrimary && remainingPhotos.length > 0;

      if (removedPhoto?.url.startsWith("blob:")) {
        URL.revokeObjectURL(removedPhoto.url);
      }

      return {
        ...current,
        photos: remainingPhotos.map((photo, index) => ({
          ...photo,
          isPrimary: needsPrimary ? index === 0 : photo.isPrimary,
        })),
      };
    });
  };

  return {
    handlePhotoUpload,
    removePhoto,
    setPrimaryPhoto,
  };
}
