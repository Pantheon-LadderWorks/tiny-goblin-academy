import React from 'react';
import sheetUrl from '../../../assets/academy/hub/derived/tga-hub-game-icons-cleaned-v0.1.png';

export interface SourceRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SpriteFrameProps {
  sourceRect: SourceRect;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SpriteFrame({ sourceRect, alt, className = '', style = {} }: SpriteFrameProps) {
  const { x, y, w, h } = sourceRect;

  // The wrapper sets the aspect ratio of the specific cropped region.
  // The inner image is scaled up so that its full native width (768) 
  // is proportional to the crop width (w).
  // Then we translate the inner image by (x/768) and (y/1376) of its OWN scaled size.
  return (
    <div 
      className={`sprite-frame ${className}`} 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        aspectRatio: `${w} / ${h}`,
        ...style 
      }}
      title={alt}
    >
      <img 
        src={sheetUrl} 
        alt={alt}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          maxWidth: 'none', // Override any global max-width: 100%
          width: `${(768 / w) * 100}%`,
          height: `${(1376 / h) * 100}%`,
          transform: `translate(-${(x / 768) * 100}%, -${(y / 1376) * 100}%)`,
          transformOrigin: '0 0'
        }}
      />
    </div>
  );
}
