import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/utils/date';

interface AudioPlayerProps {
  audioUrl: string;
  isKidsMode?: boolean;
}

export function AudioPlayer({ audioUrl, isKidsMode = false }: AudioPlayerProps) {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressInterval = useRef<number>();

  useEffect(() => {
    const audio = new Audio();
    
    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded');
      setDuration(audio.duration);
      setError(null);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setError('Failed to load audio');
    };

    const handleCanPlay = () => {
      console.log('Audio can play now');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    
    // Ensure we're using the full URL for the audio file
    const fullUrl = audioUrl.startsWith('http') 
      ? audioUrl 
      : `https://uhxpzeyklqbkeibvreqv.supabase.co/storage/v1/object/public/audio-stories/${audioUrl}`;
    
    console.log('Setting audio source:', fullUrl);
    audio.src = fullUrl;
    audio.load();
    
    setAudioElement(audio);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.play().catch(error => {
        console.error('Playback error:', error);
        setError('Failed to play audio');
        setIsPlaying(false);
      });
      progressInterval.current = window.setInterval(() => {
        setCurrentTime(audioElement.currentTime);
      }, 100);
    } else {
      audioElement.pause();
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, audioElement]);

  const togglePlayPause = () => {
    if (error) {
      // If there was an error, try to reload the audio
      if (audioElement) {
        audioElement.load();
        setError(null);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (newTime: number[]) => {
    if (audioElement) {
      audioElement.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (audioElement) {
      const volumeValue = newVolume[0];
      audioElement.volume = volumeValue;
      setVolume(volumeValue);
      setIsMuted(volumeValue === 0);
    }
  };

  const toggleMute = () => {
    if (audioElement) {
      const newMutedState = !isMuted;
      audioElement.volume = newMutedState ? 0 : volume;
      setIsMuted(newMutedState);
    }
  };

  if (isKidsMode) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          size="lg"
          variant={isPlaying ? "outline" : "default"}
          onClick={togglePlayPause}
          className={`w-32 h-32 rounded-full transition-all transform hover:scale-105 ${
            isPlaying ? 'bg-secondary' : 'bg-violet-500'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-16 h-16 text-violet-500" />
          ) : (
            <Play className="w-16 h-16 text-white" />
          )}
        </Button>
        {error && (
          <p className="text-red-500 text-center mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayPause}
          className="h-10 w-10"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <div className="flex-1">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleTimeChange}
          />
        </div>
        <span className="text-sm tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-10 w-10"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <div className="w-32">
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
}