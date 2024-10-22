import React, { useRef } from 'react';

interface VideoItemProps {
  item: {
    src: string;
    splatSrc: string;
  };
  onClick: (splatSrc: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ item, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoHover = (isHovering: boolean) => {
    const video = videoRef.current;
    if (video) {
      if (isHovering) {
        video.play();
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  return (
    <div className='mb-4 break-inside-avoid'>
      <video
        ref={videoRef}
        src={item.src}
        className='w-full object-cover rounded-lg cursor-pointer'
        onMouseEnter={() => handleVideoHover(true)}
        onMouseLeave={() => handleVideoHover(false)}
        onClick={() => onClick(item.splatSrc)}
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoItem;