import { Mail, Facebook, Twitter, WhatsApp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StorySocialShareProps {
  title: string;
  content: string;
  moral: string;
  url: string;
}

export function StorySocialShare({ title, content, moral, url }: StorySocialShareProps) {
  // Get a short snippet of the story (first 100 characters)
  const snippet = content.length > 100 ? content.substring(0, 100) + '...' : content;
  
  // Create sharing text with title, snippet, and moral
  const shareText = `${title}\n\n${snippet}\n\nMoral: ${moral}\n\nRead more at LearnMorals.com`;
  
  const encodedUrl = encodeURIComponent('https://learnmorals.com');
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('facebook')}
        className="text-primary hover:text-primary-hover"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('twitter')}
        className="text-primary hover:text-primary-hover"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('whatsapp')}
        className="text-primary hover:text-primary-hover"
      >
        <WhatsApp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('email')}
        className="text-primary hover:text-primary-hover"
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );
}