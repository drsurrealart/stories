import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle, Instagram, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ShareWithFriends() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareText = "Discover LearnMorals.com - Create personalized moral stories for children of all ages! Join me in making learning values fun and engaging. 📚✨ #Education #KidsLearning";
  const shareUrl = "https://learnmorals.com";
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    instagram: `https://instagram.com/`, // Opens Instagram app/website
    email: `mailto:?subject=${encodeURIComponent('Check out LearnMorals.com!')}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('facebook')}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#E5DEFF] to-white hover:from-[#D3E4FD] hover:to-white"
        >
          <Facebook className="w-5 h-5" />
          Share on Facebook
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('twitter')}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#D3E4FD] to-white hover:from-[#FFDEE2] hover:to-white"
        >
          <Twitter className="w-5 h-5" />
          Share on Twitter
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('linkedin')}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#FFDEE2] to-white hover:from-[#FDE1D3] hover:to-white"
        >
          <Linkedin className="w-5 h-5" />
          Share on LinkedIn
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('whatsapp')}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#FDE1D3] to-white hover:from-[#E5DEFF] hover:to-white"
        >
          <MessageCircle className="w-5 h-5" />
          Share on WhatsApp
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('instagram')}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#E5DEFF] to-white hover:from-[#D3E4FD] hover:to-white"
        >
          <Instagram className="w-5 h-5" />
          Share on Instagram
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleShare('email')}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#D3E4FD] to-white hover:from-[#FFDEE2] hover:to-white"
        >
          <Mail className="w-5 h-5" />
          Share via Email
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={copyToClipboard}
          className="flex items-center gap-2 w-full bg-gradient-to-r from-[#FFDEE2] to-white hover:from-[#FDE1D3] hover:to-white"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          Copy Link
        </Button>
      </div>
    </div>
  );
}