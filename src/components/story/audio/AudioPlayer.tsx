import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  audioUrl: string;
  isKidsMode?: boolean;
}

export function AudioPlayer({ audioUrl, isKidsMode = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Creating new audio element with URL:', audioUrl);
    const audio = new Audio();
    
    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded:', {
        duration: audio.duration,
        readyState: audio.readyState
      });
      setDuration(audio.duration);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio loading error:', e);
      toast({
        title: "Error",
        description: "Failed to load audio. Please try again.",
        variant: "destructive",
      });
    };

    const handleCanPlay = () => {
      console.log('Audio can play now');
    };

    // Set source after adding event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    
    // Set the source and load the audio
    audio.src = audioUrl;
    audio.load();
    
    setAudioElement(audio);

    return () => {
      console.log('Cleaning up audio element');
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
      setAudioElement(null);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioElement) {
      const updateProgress = () => {
        setCurrentTime(audioElement.currentTime);
        setProgress((audioElement.currentTime / audioElement.duration) * 100);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        audioElement.currentTime = 0;
      };

      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('timeupdate', updateProgress);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioElement]);

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioElement]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioElement || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    const newTime = pos * audioElement.duration;
    
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(pos * 100);
  };

  const togglePlayPause = async () => {
    if (!audioElement) {
      console.error('No audio element available');
      return;
    }

    try {
      console.log('Attempting to toggle playback, current state:', {
        isPlaying,
        readyState: audioElement.readyState,
        currentSrc: audioElement.currentSrc
      });

      if (isPlaying) {
        await audioElement.pause();
      } else {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Playback Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-4">
      {isKidsMode ? (
        <div className="flex justify-center">
          <Button
            size="lg"
            variant={isPlaying ? "outline" : "default"}
            onClick={togglePlayPause}
            className={`w-32 h-32 rounded-full transition-all transform hover:scale-105 ${
              isPlaying ? 'bg-secondary' : 'bg-primary animate-pulse'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-16 w-16" />
            ) : (
              <Play className="h-16 w-16" />
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-sm text-gray-500">{formatTime(duration)}</span>
          </div>
          <div 
            ref={progressBarRef}
            className="relative h-2 bg-secondary rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="absolute h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        {!isKidsMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="hover:bg-secondary/50"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:bg-secondary/50"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            className="w-24"
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
        </div>
      </div>
    </div>
  );
}