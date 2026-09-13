import InvertedDome from '../components/InvertedDome';

const BASE = 'https://connectaa-cdn.b-cdn.net/11zon_compressed/';
const FILES = [
  'WhatsApp Image 2026-09-13 at 07.16.30_1_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.31-2_2_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.31-3_3_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.31-4_4_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.31_5_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.32-2_6_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.32-3_7_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.32-4_8_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.32_9_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.33-2_10_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.33-3_11_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.33-4_12_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.33_13_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.34-2_14_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.34-3_15_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.34-4_16_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.34_17_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.35-2_18_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.35-3_19_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.35-4_20_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.35_21_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.36-2_22_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.36-3_23_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.36_24_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.37-2_25_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.37-3_26_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.37-4_27_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.37_28_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.38-2_29_11zon.jpeg',
  'WhatsApp Image 2026-09-13 at 07.16.38_30_11zon.jpeg',
];

const images = FILES.map((f, i) => ({
  src: BASE + encodeURIComponent(f),
  alt: `Feedback de aluno ${i + 1}`,
}));

export default function FeedbacksPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090909', overflow: 'hidden' }}>
      <InvertedDome
        images={images}
        tileWidth={210}
        tileHeight={332}
        gap={20}
        grayscale={0}
        wheelSensitivity={0.55}
        rows={3}
      />
    </div>
  );
}
