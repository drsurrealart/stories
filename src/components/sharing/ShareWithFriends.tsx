import { Share2, Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareWithFriends() {
  const shareText = "Discover LearnMorals.com - Create personalized moral stories for children of all ages! Join me in making learning values fun and engaging.";
  const shareUrl = "https://learnmorals.com";
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent('Check out LearnMorals.com!')}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Share with Friends & Family</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Help spread the joy of moral storytelling! Share LearnMorals.com with your friends and family.
      </p>
      
      <div className="flex flex-wrap gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2"
        >
          <Facebook className="w-5 h-5" />
          Share on Facebook
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2"
        >
          <Twitter className="w-5 h-5" />
          Share on Twitter
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2"
        >
          <Linkedin className="w-5 h-5" />
          Share on LinkedIn
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('email')}
          className="flex items-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Share via Email
        </Button>
      </div>
    </div>
  );
}