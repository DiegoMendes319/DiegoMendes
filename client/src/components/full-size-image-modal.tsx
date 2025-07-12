import { useEffect } from "react";
import { X } from "lucide-react";

interface FullSizeImageModalProps {
  imageUrl: string;
  userName: string;
  onClose: () => void;
}

export default function FullSizeImageModal({ imageUrl, userName, onClose }: FullSizeImageModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 cursor-pointer"
      onClick={onClose}
    >
      <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-51 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <img
          src={imageUrl}
          alt={`Foto de perfil de ${userName}`}
          className="max-w-full max-h-full object-contain cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <p className="text-sm">{userName}</p>
        </div>
      </div>
    </div>
  );
}