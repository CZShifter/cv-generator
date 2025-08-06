// components/ImageCropModal.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop';
import styles from '@/scss/preview.module.scss';
import { PhotoConfig } from '@/utils/cvTemplatesConfig';

interface ImageCropModalProps {
  imageSrc: string; // URL obrázku k ořezání
  photoConfig: PhotoConfig; // Konfigurace z cvTemplatesConfig
  onClose: () => void; // Funkce pro zavření modalu
  onSave: (croppedImageBase64: string) => void; // Funkce pro uložení ořezaného obrázku (base64)
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  photoConfig,
  onClose,
  onSave,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  
  // Nový stav pro kontrolu, zda je Cropper připraven k vykreslení
  const [isCropperVisible, setIsCropperVisible] = useState(false);
  // Nový stav pro vynucení remountu Cropperu, pokud imageSrc zůstává stejný
  const [cropperKey, setCropperKey] = useState(0); 

  const cropperContainerRef = useRef<HTMLDivElement>(null);

  // useEffect se spustí při prvním renderu a pokaždé, když se imageSrc změní
  useEffect(() => {
    if (imageSrc) {
      // Nejprve skryjeme Cropper, abychom zajistili, že se po změně obrázku remountuje
      setIsCropperVisible(false); 
      // Inkrementujeme klíč pro vynucení remountu Cropperu
      setCropperKey(prev => prev + 1);

      // Použijeme setTimeout k odložení zobrazení Cropperu
      // 100ms je dobrý výchozí bod, můžete experimentovat (např. 50ms, 200ms)
      const timer = setTimeout(() => {
        if (cropperContainerRef.current) {
          // Volání offsetHeight může pomoci vynutit reflow, 
          // i když s odloženým zobrazením už by to nemuselo být nezbytné
          cropperContainerRef.current.offsetHeight; 
        }
        setIsCropperVisible(true); // Zobrazíme Cropper
      }, 100); 

      // Cleanup funkce pro zrušení timeoutu, pokud se komponenta odmountuje nebo imageSrc změní
      return () => clearTimeout(timer);
    }
  }, [imageSrc]); // Závislost na imageSrc zajišťuje spuštění při otevření modalu/změně obrázku


  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = useCallback(
  async (imageSrc: string, pixelCrop: Area, targetWidth = 260) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Výchozí ořezaná velikost
    const { width, height } = pixelCrop;

    // Výška podle poměru
    const aspect = width / height;
    const targetHeight = Math.round(targetWidth / aspect);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      width * scaleX,
      height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    return canvas.toDataURL('image/jpeg');
  }, []);

  const handleSaveCrop = useCallback(async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        onSave(croppedImage);
        onClose();
      }
    }
  }, [croppedAreaPixels, getCroppedImg, imageSrc, onSave, onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Oříznout a vycentrovat fotku</h2>
        <div 
          className={styles.modalContentIMG} 
          ref={cropperContainerRef}
        >
          {/* Cropper se vykreslí pouze, když jsou data a je povolen isCropperVisible */}
          {imageSrc && photoConfig && isCropperVisible && (
            <Cropper
              key={`${imageSrc}-${cropperKey}`} // Klíč pro vynucení remountu
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={photoConfig.aspect}
              cropShape={photoConfig.shape}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={true}
            />
          )}
        </div>
        <div className={styles.sliderContainer}>
          <label htmlFor="zoom-range">Přiblížení:</label>
          <input
            id="zoom-range"
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Přiblížení"
            onChange={(e) => {
              setZoom(parseFloat(e.target.value));
            }}
            className={styles.slider}
          />
        </div>
        <div className={styles.formButtons} style={{ marginTop: '16px' }}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Zrušit
          </button>
          <button type="button" className={styles.save} onClick={handleSaveCrop}>
            Uložit fotku
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;