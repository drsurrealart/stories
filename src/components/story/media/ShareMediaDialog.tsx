import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareMediaDialogProps {
  title: string;
  url: string;
  type: 'audio' | 'image' | 'video' | 'pdf';
}

export function ShareMediaDialog({ title, url, type }: ShareMediaDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareText = `Check out this ${type} story on LearnMorals.com! 📚✨`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(`Share ${type} story`)}&body=${encodedText}%20${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'email') {
      window.location.href = shareLinks[platform];
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {type}</DialogTitle>
          <DialogDescription>
            Share this {type} with your friends and family through your favorite platform.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShare('email')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}