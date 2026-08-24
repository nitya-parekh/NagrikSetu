import React, { useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconPlay, IconCamera, IconVideo } from '../utils/svgIcons';

export default function MediaCarousel({ media = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const currentItem = media[currentIndex];
  const total = media.length;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-panel-sub border-2 border-border-heavy p-2.5 space-y-2">
      {/* Carousel Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-border-hard pb-1.5 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {currentItem.type === 'video' ? (
            <span className="bg-border-heavy text-panel px-1.5 py-0.2 text-[9px] font-bold flex items-center gap-1">
              <IconVideo className="w-3 h-3 text-panel" />
              <span>VIDEO EVIDENCE</span>
            </span>
          ) : (
            <span className="bg-panel-recessed text-ink-primary border border-border-hard px-1.5 py-0.2 text-[9px] font-bold flex items-center gap-1">
              <IconCamera className="w-3 h-3 text-ink-secondary" />
              <span>PHOTO ATTACHMENT</span>
            </span>
          )}
          <span className="text-[10px] text-ink-muted uppercase">
            [MEDIA {currentIndex + 1} OF {total}]
          </span>
        </div>

        {total > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="bg-panel border border-border-hard hover:bg-panel-recessed text-ink-primary px-2 py-0.5 text-xs font-bold font-mono cursor-pointer"
              title="Previous media item"
            >
              [←]
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="bg-panel border border-border-hard hover:bg-panel-recessed text-ink-primary px-2 py-0.5 text-xs font-bold font-mono cursor-pointer"
              title="Next media item"
            >
              [→]
            </button>
          </div>
        )}
      </div>

      {/* Media Display Viewport */}
      <div className="bg-[#cbd2db] border border-border-hard min-h-[140px] flex flex-col justify-center items-center relative overflow-hidden p-3 select-none">
        {currentItem.type === 'video' ? (
          <div className="w-full space-y-2 text-center">
            {currentItem.previewUrl ? (
              <video
                src={currentItem.previewUrl}
                controls
                className="w-full max-h-[220px] bg-border-heavy border border-border-heavy"
              />
            ) : (
              <div className="bg-border-heavy text-panel p-4 border border-border-hard space-y-2">
                <div className="flex justify-center items-center gap-2 text-stark-yellow-bright font-mono text-xs font-bold">
                  <IconPlay className="w-4 h-4 fill-current text-stark-yellow-bright" />
                  <span>PLAY RECORDED FOOTAGE</span>
                </div>
                <div className="text-[10px] text-panel-sub font-mono">
                  {currentItem.title || "Field Video Evidence Feed"}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full space-y-1.5 text-left">
            {currentItem.previewUrl ? (
              <img
                src={currentItem.previewUrl}
                alt={currentItem.title || "Citizen Evidence"}
                className="w-full max-h-[220px] object-cover border border-border-heavy"
              />
            ) : (
              <div className="bg-panel p-3 border border-border-hard space-y-1 font-mono">
                <div className="text-xs font-bold text-ink-primary">
                  {currentItem.title || "Photographic Evidence Item"}
                </div>
                <div className="text-[11px] text-ink-secondary leading-snug">
                  {currentItem.caption}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption Line */}
      {currentItem.caption && (
        <div className="text-[10px] font-mono text-ink-secondary border-t border-border-hard pt-1 flex justify-between">
          <span className="truncate">{currentItem.caption}</span>
          <span className="text-ink-muted shrink-0 ml-2 font-bold">[VERIFIED]</span>
        </div>
      )}
    </div>
  );
}
