'use client';

import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem';
import Viewer from '../viewer/Viewer';
import { S3Client, GetObjectCommand, NoSuchKey, S3ServiceException } from "@aws-sdk/client-s3";
import { useRouter } from 'next/navigation';

interface VideoItem {
  src: string;
  splatSrc: string;
}

const MasonryGrid: React.FC = () => {
  const [videoItems, setVideoItems] = useState<VideoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSplat, setSelectedSplat] = useState<string | null>(null);
  const router = useRouter();

  const streamToBlob = async (stream: ReadableStream<Uint8Array>, mimeType: string): Promise<Blob> => {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      done = doneReading;
    }

    return new Blob(chunks, { type: mimeType });
  };

  useEffect(() => {
    // Initialize S3 client
    const s3Client = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Fetch video items from the JSON file and get S3 objects
    const fetchVideoItems = async () => {
      try {
        const response = await fetch('/videoItems.json');
        const data: VideoItem[] = await response.json();

        const signedUrls = await Promise.all(data.map(async (item) => {
          const getObjectUrl = async (s3Url: string) => {
            const [bucketName, ...keyParts] = s3Url.replace("s3://", "").split("/");
            const key = keyParts.join("/");

            try {
              const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
              const response = await s3Client.send(command);
              const blob = await streamToBlob(response.Body as ReadableStream<Uint8Array>, response.ContentType || 'application/octet-stream');
              const url = URL.createObjectURL(blob);
              return url;
            } catch (caught) {
              if (caught instanceof NoSuchKey) {
                console.error(`Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`);
              } else if (caught instanceof S3ServiceException) {
                console.error(`Error from S3 while getting object from ${bucketName}. ${caught.name}: ${caught.message}`);
              } else {
                throw caught;
              }
            }
          };

          const videoUrl = await getObjectUrl(item.src);
          const splatUrl = await getObjectUrl(item.splatSrc);

          return {
            src: videoUrl ?? '',
            splatSrc: splatUrl ?? '',
          };
        }));

        setVideoItems(signedUrls as VideoItem[]);
      } catch (error) {
        console.error("Error fetching video items:", error);
      }
    };

    fetchVideoItems();
  }, []);

  const handleVideoClick = (splatSrc: string) => {
    setSelectedSplat(splatSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSplat(null);
    router.push('/portfolio'); // Navigate back to the portfolio page
  };

  return (
    <div className='relative'>
      <div className='columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4'>
        {videoItems.map((item, index) => (
          <VideoItem
            key={index}
            item={item}
            onClick={handleVideoClick}
          />
        ))}
      </div>

      {isModalOpen && selectedSplat && (
        <Viewer splatSrc={selectedSplat} onClose={closeModal} />
      )}
    </div>
  );
};

export default MasonryGrid;