import { useRef, useEffect, useCallback } from 'react';

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

interface DomeImage { src: string; alt?: string; }
interface Props {
  images: DomeImage[];
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  grayscale?: number;
  wheelSensitivity?: number;
  rows?: number;
}

export default function InvertedDome({
  images,
  tileWidth = 210,
  tileHeight = 332,
  gap = 20,
  grayscale = 0,
  wheelSensitivity = 0.55,
  rows = 3,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startOffset: 0, lastX: 0, lastT: 0 });
  const rafRef = useRef(0);
  const tilesRef = useRef<HTMLDivElement[][]>([]);
  const rowsRef = useRef<HTMLDivElement[]>([]);

  const stride = tileWidth + gap;

  const getImg = useCallback((col: number, row: number) => {
    if (!images.length) return { src: '', alt: '' };
    const idx = (((col * rows + row) % images.length) + images.length) % images.length;
    return images[idx];
  }, [images, rows]);

  const applyTransforms = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const W = root.clientWidth;
    const H = root.clientHeight;
    const off = offsetRef.current;
    const centerRow = (rows - 1) / 2;
    const perspective = Math.max(W, 600);

    rowsRef.current.forEach((rowEl, row) => {
      if (!rowEl) return;
      const nY = rows > 1 ? (row - centerRow) / centerRow : 0;
      const rowRotX = nY * 28;
      const rowY = (row - centerRow) * (tileHeight + gap);
      rowEl.style.transform = `translateX(${off}px) translateY(calc(-50% + ${rowY}px))`;

      const colEls = tilesRef.current[row] || [];
      colEls.forEach((el, ci) => {
        if (!el) return;
        const startCol = Math.floor(-off / stride) - 2;
        const col = startCol + ci;
        const tileCenterX = col * stride + off + tileWidth / 2;
        const nX = clamp((tileCenterX - W / 2) / (W / 2), -2, 2);
        const rotY = -nX * 32;
        el.style.transform = `perspective(${perspective}px) rotateX(${rowRotX}deg) rotateY(${rotY}deg)`;

        // Update image src for infinite loop
        const img = getImg(col, row);
        const imgEl = el.querySelector('img') as HTMLImageElement;
        if (imgEl && imgEl.dataset.src !== img.src) {
          imgEl.src = img.src;
          imgEl.dataset.src = img.src;
          imgEl.alt = img.alt || '';
        }
        el.dataset.col = String(col);
        el.style.display = 'block';
      });
    });
  }, [rows, tileHeight, gap, stride, tileWidth, getImg]);

  const tick = useCallback(() => {
    rafRef.current = 0;
    if (Math.abs(velRef.current) > 0.05) {
      velRef.current *= 0.94;
      offsetRef.current += velRef.current;
    } else {
      velRef.current = 0;
    }
    applyTransforms();
    if (Math.abs(velRef.current) > 0.05) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [applyTransforms]);

  const schedule = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Build DOM
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !images.length) return;
    root.innerHTML = '';

    const W = root.clientWidth || window.innerWidth;
    const colsNeeded = Math.ceil(W / stride) + 6;
    tilesRef.current = [];
    rowsRef.current = [];

    for (let r = 0; r < rows; r++) {
      const rowEl = document.createElement('div');
      rowEl.style.cssText = `position:absolute;top:50%;left:0;display:flex;gap:${gap}px;will-change:transform;`;
      root.appendChild(rowEl);
      rowsRef.current[r] = rowEl;
      tilesRef.current[r] = [];

      const startCol = Math.floor(-offsetRef.current / stride) - 2;
      for (let ci = 0; ci < colsNeeded; ci++) {
        const col = startCol + ci;
        const img = getImg(col, r);

        const tile = document.createElement('div');
        tile.dataset.col = String(col);
        tile.style.cssText = `flex-shrink:0;width:${tileWidth}px;height:${tileHeight}px;border-radius:14px;overflow:hidden;will-change:transform;`;

        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.dataset.src = img.src;
        imgEl.alt = img.alt || '';
        imgEl.draggable = false;
        imgEl.style.cssText = `width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;${grayscale ? `filter:grayscale(${grayscale})` : ''}`;
        tile.appendChild(imgEl);
        rowEl.appendChild(tile);
        tilesRef.current[r][ci] = tile;
      }
    }
    applyTransforms();

    const ro = new ResizeObserver(() => applyTransforms());
    ro.observe(root);
    return () => { ro.disconnect(); root.innerHTML = ''; };
  }, [images, rows, tileWidth, tileHeight, gap, stride, grayscale, getImg, applyTransforms]);

  // Pointer events
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const down = (e: PointerEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      velRef.current = 0;
      dragRef.current = { active: true, startX: e.clientX, startOffset: offsetRef.current, lastX: e.clientX, lastT: performance.now() };
      root.setPointerCapture(e.pointerId);
      root.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!dragRef.current.active) return;
      const now = performance.now();
      const dt = now - dragRef.current.lastT;
      if (dt > 0) velRef.current = (e.clientX - dragRef.current.lastX) / dt * 14;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastT = now;
      offsetRef.current = dragRef.current.startOffset + (e.clientX - dragRef.current.startX);
      applyTransforms();
    };
    const up = () => {
      dragRef.current.active = false;
      root.style.cursor = 'grab';
      schedule();
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      velRef.current = 0;
      offsetRef.current -= e.deltaX * wheelSensitivity + e.deltaY * wheelSensitivity * 0.3;
      applyTransforms();
    };

    root.addEventListener('pointerdown', down);
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerup', up);
    root.addEventListener('pointercancel', up);
    root.addEventListener('wheel', wheel, { passive: false });
    return () => {
      root.removeEventListener('pointerdown', down);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerup', up);
      root.removeEventListener('pointercancel', up);
      root.removeEventListener('wheel', wheel);
    };
  }, [applyTransforms, schedule, wheelSensitivity]);

  return (
    <div
      ref={rootRef}
      style={{ width: '100%', height: '100%', background: '#090909', overflow: 'hidden', cursor: 'grab', userSelect: 'none', position: 'relative' }}
    />
  );
}
EOSX
echo "✓ InvertedDome.tsx criado"