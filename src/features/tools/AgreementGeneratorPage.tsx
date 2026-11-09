import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
  Shield,
  Printer,
  Calendar,
  Clock,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_PROFILES } from '../../data/mockProfiles';
import { Button } from '../../components/ui/Button';

export const AgreementGeneratorPage: React.FC = () => {
  const { currentUser, safePaths, addToast } = useAppStore();

  const [flatmateName, setFlatmateName] = useState('Kabir Mehta');
  const [flatAddress, setFlatAddress] = useState('100ft Road, Indiranagar, Bengaluru, 560038');
  const [rentAmount, setRentAmount] = useState('22000');
  const [depositAmount, setDepositAmount] = useState('60000');
  const [quietHoursStart, setQuietHoursStart] = useState('11:00 PM');
  const [quietHoursEnd, setQuietHoursEnd] = useState('7:30 AM');
  const [noticePeriodDays, setNoticePeriodDays] = useState('30');
  const [guestPolicy, setGuestPolicy] = useState('Weekends welcome with 24h prior WhatsApp notice');
  const [isGenerating, setIsGenerating] = useState(false);

  const matchedProfile = MOCK_PROFILES.find((p) => p.name === flatmateName) || MOCK_PROFILES[0];

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Background styling
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, 210, 297, 'F');

      // Title & Header
      doc.setTextColor(61, 219, 165); // Mint color
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('FLATMATCH HOUSE RULES AGREEMENT', 20, 25);

      doc.setTextColor(138, 143, 140);
      doc.setFontSize(10);
      doc.text('MUTUAL RESPECT & LIVING COMPATIBILITY COMPACT • INDIA', 20, 32);

      // Horizontal Divider
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.line(20, 36, 190, 36);

      // Parties Section
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('1. ROOMMATES & PREMISES', 20, 46);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`Flatmate 1: ${currentUser.name} (${currentUser.occupation})`, 25, 53);
      doc.text(`Flatmate 2: ${flatmateName} (${matchedProfile.occupation})`, 25, 59);
      doc.text(`Apartment Address: ${flatAddress}`, 25, 65);

      // Section 2: Finances & Rent Split
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. RENT & UTILITIES SPLIT', 20, 77);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`• Individual Monthly Rent Share: INR ${Number(rentAmount).toLocaleString('en-IN')} (Due on 1st of each month via UPI)`, 25, 84);
      doc.text(`• Security Deposit Paid: INR ${Number(depositAmount).toLocaleString('en-IN')} each`, 25, 90);
      doc.text(`• Electricity, 300 Mbps Fiber WiFi, and Cook/Maid wages split equally 50:50 within 48h of bill generation.`, 25, 96);

      // Section 3: Quiet Hours & Sleep
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('3. SLEEP SCHEDULE & QUIET HOURS', 20, 108);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`• Mandatory Quiet Hours: ${quietHoursStart} to ${quietHoursEnd}.`, 25, 115);
      doc.text(`• After ${quietHoursStart}, all speakers, television, and gaming will strictly switch to personal headphones.`, 25, 121);
      doc.text(`• No musical instruments or loud phone calls in common living areas during quiet hours.`, 25, 127);

      // Section 4: Cleaning & Hygiene
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('4. CLEANING & CHORES PROTOCOL', 20, 139);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`• Golden Kitchen Rule: Kitchen counters must be wiped down and cooking dishes cleared within 2 hours.`, 25, 146);
      doc.text(`• No sink piles left overnight. Wet and dry waste segregated according to municipal rules.`, 25, 152);
      doc.text(`• Weekly chore rota followed for restocking pantry essentials (dish soap, oil, bin liners).`, 25, 158);

      // Section 5: Guests & Social
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('5. GUEST POLICY & HABITS', 20, 170);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`• ${guestPolicy}`, 25, 177);
      doc.text(`• Smoking: Strictly balcony only / outdoor premises. No indoor cigarettes in common rooms.`, 25, 183);
      doc.text(`• Alcohol: Respectful consumption. No unannounced parties on weekday nights.`, 25, 189);

      // Section 6: Notice Period
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('6. NOTICE PERIOD & EXIT', 20, 201);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`• ${noticePeriodDays} days written notice required in the shared WhatsApp group prior to moving out.`, 25, 208);
      doc.text(`• Departing roommate agrees to help find an aligned replacement flatmate via FlatMatch.`, 25, 214);

      // Signatures Box
      doc.setDrawColor(61, 219, 165);
      doc.setLineWidth(0.4);
      doc.roundedRect(20, 226, 170, 44, 3, 3, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('MUTUALLY ACCEPTED AND SIGNED', 25, 234);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`Signature 1: ${currentUser.name} ____________________`, 25, 246);
      doc.text(`Signature 2: ${flatmateName} ____________________`, 25, 256);
      doc.text(`Date of Compact: ${new Date().toLocaleDateString('en-IN')}`, 25, 264);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(138, 143, 140);
      doc.text('Generated via FlatMatch (https://flatmatch.in) • Zero Brokerage, High Compatibility Living', 20, 285);

      doc.save(`FlatMatch-Agreement-${currentUser.name.split(' ')[0]}-${flatmateName.split(' ')[0]}.pdf`);

      addToast({
        type: 'success',
        title: 'Agreement PDF Downloaded!',
        description: 'Ready to print or digitally sign with your flatmate.',
      });
    } catch (e) {
      addToast({
        type: 'warning',
        title: 'PDF Generation Error',
        description: 'Failed to build PDF. Please check settings.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white flex items-center gap-2">
            <FileText className="text-mint" size={24} />
            <span>House Rules Agreement Generator</span>
          </h1>
          <p className="text-xs text-muted font-mono uppercase tracking-micro mt-0.5">
            Auto-generate a 1-page mutual living compact • Avoid 90% of future roommate conflicts
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          icon={<Download size={18} />}
        >
          {isGenerating ? 'Building PDF...' : 'Download as PDF'}
        </Button>
      </div>

      {/* CUSTOMIZATION CONTROLS */}
      <div className="p-5 rounded-3xl bg-surface border border-white/10 space-y-4">
        <h3 className="text-xs font-mono text-muted uppercase tracking-micro font-bold">
          AGREEMENT PARAMETERS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">Flatmate</label>
            <select
              value={flatmateName}
              onChange={(e) => setFlatmateName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            >
              {MOCK_PROFILES.slice(0, 8).map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name} ({p.locality})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">Rent / Person (₹)</label>
            <input
              type="text"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">Notice Period (Days)</label>
            <input
              type="number"
              value={noticePeriodDays}
              onChange={(e) => setNoticePeriodDays(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">Quiet Hours Start</label>
            <input
              type="text"
              value={quietHoursStart}
              onChange={(e) => setQuietHoursStart(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono text-muted uppercase block mb-1">Guest Policy Clause</label>
            <input
              type="text"
              value={guestPolicy}
              onChange={(e) => setGuestPolicy(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-surface-2 border border-white/15 text-white text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW OF THE COMPACT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border-2 border-mint/40 shadow-mint-glow/30 space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <span className="font-mono text-xs text-mint uppercase font-bold tracking-micro">
              MUTUAL LIVING COMPACT • 2026
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white mt-0.5">
              Flatmate House Rules Agreement
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-mint/15 text-mint border border-mint/30 font-mono text-xs font-bold uppercase">
            READY TO SIGN
          </span>
        </div>

        <div className="space-y-4 text-xs font-sans text-white/90 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-heading font-black text-white mb-1 uppercase tracking-micro text-[11px]">
              1. PREMISES & RESIDENTS
            </h4>
            <p className="text-muted">
              Entered between <strong>{currentUser.name}</strong> and <strong>{flatmateName}</strong> for residence at <strong>{flatAddress}</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-heading font-black text-white mb-1 uppercase tracking-micro text-[11px]">
              2. FINANCIAL OBLIGATIONS
            </h4>
            <p className="text-muted">
              Individual rent of <strong>₹{Number(rentAmount).toLocaleString('en-IN')}/month</strong> paid on or before 1st of each month. Electricity, maid, and high-speed WiFi bills divided 50:50 within 48 hours of billing.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-heading font-black text-white mb-1 uppercase tracking-micro text-[11px]">
              3. QUIET HOURS & SLEEP COMFORT
            </h4>
            <p className="text-muted">
              Quiet hours observed daily from <strong>{quietHoursStart}</strong> to <strong>{quietHoursEnd}</strong>. After {quietHoursStart}, headphones are mandatory for videos, music, and gaming.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-heading font-black text-white mb-1 uppercase tracking-micro text-[11px]">
              4. CLEANING & CHORE ACCOUNTABILITY
            </h4>
            <p className="text-muted">
              Kitchen counters cleaned immediately after cooking. Dishes washed within 2 hours. Full-time maid duties supervised alternately.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <h4 className="font-heading font-black text-white mb-1 uppercase tracking-micro text-[11px]">
              5. NOTICE PERIOD
            </h4>
            <p className="text-muted">
              Either flatmate must provide at least <strong>{noticePeriodDays} days</strong> advance written notice before vacating the property.
            </p>
          </div>
        </div>

        {/* Signature lines */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-line text-xs font-mono">
          <div className="p-3 rounded-xl border border-white/10 bg-surface-2 text-center">
            <p className="text-muted">Flatmate 1</p>
            <p className="font-bold text-white mt-1">{currentUser.name}</p>
            <div className="h-0.5 bg-mint/40 w-24 mx-auto mt-4" />
          </div>
          <div className="p-3 rounded-xl border border-white/10 bg-surface-2 text-center">
            <p className="text-muted">Flatmate 2</p>
            <p className="font-bold text-white mt-1">{flatmateName}</p>
            <div className="h-0.5 bg-mint/40 w-24 mx-auto mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

