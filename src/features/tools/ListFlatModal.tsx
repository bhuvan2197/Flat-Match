import React, { useState } from 'react';
import {
  Building,
  Upload,
  Sparkles,
  Check,
  DollarSign,
  MapPin,
  Calendar,
  Shield,
  Wifi,
  Wind,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/useAppStore';
import { sound } from '../../lib/audio';

interface ListFlatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
];

const AVAILABLE_AMENITIES = [
  'Attached Private Washroom',
  'Air Conditioner (AC)',
  'Private Balcony',
  'High-Speed 300 Mbps WiFi',
  'Daily Maid Service Included',
  'Full-time Cook',
  'Power Backup / Inverter',
  'Covered Two/Four Wheeler Parking',
  'Gated Society & 24/7 Security',
  'Washing Machine & Dryer',
];

export const ListFlatModal: React.FC<ListFlatModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser, addToast } = useAppStore();

  const [bhk, setBhk] = useState('3 BHK Luxury Flat');
  const [rent, setRent] = useState('22000');
  const [deposit, setDepositAmount] = useState('50000');
  const [furnishing, setFurnishing] = useState<'fully' | 'semi' | 'unfurnished'>('fully');
  const [availableFrom, setAvailableFrom] = useState('Immediate');
  const [address, setAddress] = useState('100ft Road, Indiranagar, Bengaluru');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Attached Private Washroom',
    'Air Conditioner (AC)',
    'High-Speed 300 Mbps WiFi',
    'Daily Maid Service Included',
  ]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([
    PRESET_PHOTOS[0],
    PRESET_PHOTOS[1],
  ]);

  const toggleAmenity = (item: string) => {
    sound.playTap();
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const togglePhoto = (url: string) => {
    sound.playTap();
    if (selectedPhotos.includes(url)) {
      if (selectedPhotos.length > 1) {
        setSelectedPhotos(selectedPhotos.filter((p) => p !== url));
      }
    } else {
      setSelectedPhotos([...selectedPhotos, url]);
    }
  };

  const handleSubmit = () => {
    if (!rent || isNaN(Number(rent))) {
      addToast({
        type: 'warning',
        title: 'Valid Rent Required',
        description: 'Please input a numeric monthly rent amount.',
      });
      return;
    }

    updateCurrentUser({
      hasFlat: true,
      lookingFor: 'flatmate',
      flatDetails: {
        bhk,
        rent: Number(rent),
        deposit: Number(deposit) || Number(rent) * 2,
        furnishing,
        availableFrom,
        photos: selectedPhotos,
        address,
      },
    });

    sound.playChime();
    addToast({
      type: 'success',
      title: 'Flat Listing Published!',
      description: 'Your room in ' + address + ' is now live for flatmates.',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List a Room in Your Flat 🏢"
      subtitle="Publish your room details to match with people looking for accommodation."
      maxWidth="xl"
    >
      <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
        {/* Apartment Type & Rent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">
              Flat Configuration
            </label>
            <select
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            >
              <option value="2 BHK Apartment">2 BHK Apartment</option>
              <option value="3 BHK Luxury Flat">3 BHK Luxury Flat</option>
              <option value="4 BHK Penthouse">4 BHK Penthouse</option>
              <option value="Independent 3 BHK Villa">Independent 3 BHK Villa</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">
              Monthly Rent / Room (₹)
            </label>
            <input
              type="number"
              placeholder="22000"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
            />
          </div>
        </div>

        {/* Deposit & Furnishing */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">
              Security Deposit (₹)
            </label>
            <input
              type="number"
              placeholder="50000"
              value={deposit}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">
              Furnishing
            </label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            >
              <option value="fully">Fully Furnished</option>
              <option value="semi">Semi Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">
              Available From
            </label>
            <input
              type="text"
              placeholder="Immediate / Dec 1"
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
            />
          </div>
        </div>

        {/* Locality & Address */}
        <div>
          <label className="text-[11px] font-mono text-muted uppercase block mb-1">
            Society / Street Address
          </label>
          <input
            type="text"
            placeholder="E.g. 100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
          />
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="text-[11px] font-mono text-muted uppercase block mb-2 font-bold">
            Key Amenities Included
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_AMENITIES.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 rounded-xl border text-left text-[11px] transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-mint/50 bg-mint/10 text-white font-medium'
                      : 'border-white/10 bg-surface-2 text-muted hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-[9px] ${
                      isSelected ? 'bg-mint text-bg font-bold' : 'border border-white/20'
                    }`}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </div>
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room Photos Selector */}
        <div>
          <label className="text-[11px] font-mono text-muted uppercase block mb-2 font-bold">
            Select Room Photos
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_PHOTOS.map((photo, i) => {
              const isSelected = selectedPhotos.includes(photo);
              return (
                <div
                  key={i}
                  onClick={() => togglePhoto(photo)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all h-20 ${
                    isSelected ? 'border-mint shadow-mint-glow' : 'border-white/10 opacity-60'
                  }`}
                >
                  <img src={photo} alt="Room" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-mint text-bg flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            icon={<Building size={16} />}
          >
            Publish Flat Listing
          </Button>
        </div>
      </div>
    </Modal>
  );
};
