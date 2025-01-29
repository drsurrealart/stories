import { Mail, Facebook, Twitter, Linkedin, Instagram, MessageCircle, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StorySocialShareProps {
  title: string;
  content: string;
  moral: string;
  url: string;
}

export function StorySocialShare({ title, content, moral, url }: StorySocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Get a short snippet of the story (first 100 characters)
  const snippet = content.length > 100 ? content.substring(0, 100) + '...' : content;
  
  // Create sharing text with title, snippet, and moral
  const shareText = `${title}\n\n${snippet}\n\nMoral: ${moral}\n\nRead more at LearnMorals.com`;
  
  const encodedUrl = encodeURIComponent('https://learnmorals.com');
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    instagram: `https://instagram.com/`, // Opens Instagram app/website
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${url}`);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground mb-1">Share this story:</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('facebook')}
          className="text-primary hover:text-primary-hover"
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('twitter')}
          className="text-primary hover:text-primary-hover"
          title="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('linkedin')}
          className="text-primary hover:text-primary-hover"
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('instagram')}
          className="text-primary hover:text-primary-hover"
          title="Share on Instagram"
        >
          <Instagram className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('whatsapp')}
          className="text-primary hover:text-primary-hover"
          title="Share on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleShare('email')}
          className="text-primary hover:text-primary-hover"
          title="Share via Email"
        >
          <Mail className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="text-primary hover:text-primary-hover"
          title="Copy Link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}