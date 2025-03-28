import { useState, useRef, useEffect } from 'react';
import { Button, NumberInput, Stack, Paper } from '@mantine/core';
import { Rnd } from 'react-rnd';

export default function Home() {
  const [file, setFile] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= endTime) {
            clearInterval(interval);
            setPlaying(false);
            return endTime;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', padding: 20 }}>
      <Stack spacing="md" style={{ width: 250 }}>
        <input type="file" accept="image/*,video/*" onChange={handleFileUpload} />
        <NumberInput label="Width" value={dimensions.width} onChange={(val) => setDimensions({ ...dimensions, width: val })} />
        <NumberInput label="Height" value={dimensions.height} onChange={(val) => setDimensions({ ...dimensions, height: val })} />
        <NumberInput label="Start Time (s)" value={startTime} onChange={setStartTime} />
        <NumberInput label="End Time (s)" value={endTime} onChange={setEndTime} />
        <Button onClick={() => { setTimer(startTime); setPlaying(true); }}>Play</Button>
        <Paper p="md">Timer: {timer}s</Paper>
      </Stack>

      <div style={{ flex: 1, position: 'relative', background: '#eee' }}>
        {file && timer >= startTime && timer <= endTime && (
          <Rnd
            size={{ width: dimensions.width, height: dimensions.height }}
            position={position}
            onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref) =>
              setDimensions({ width: parseInt(ref.style.width), height: parseInt(ref.style.height) })
            }
          >
            {file.includes('video') ? (
              <video ref={videoRef} src={file} width="100%" height="100%" controls />
            ) : (
              <img src={file} width="100%" height="100%" alt="Uploaded content" />
            )}
          </Rnd>
        )}
      </div>
    </div>
  );
}

