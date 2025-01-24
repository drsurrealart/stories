import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Baby, User2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateStoryStart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Create Your Story</h1>
          <p className="text-xl text-muted-foreground">Choose your story mode</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => navigate('/create/kids')}
          >
            <div className="space-y-4 text-center">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Kids Mode</h2>
              <p className="text-muted-foreground">
                Simple and fun story creation with just a few clicks! Perfect for young storytellers.
              </p>
              <Button className="w-full text-lg py-6" size="lg">
                Create Kids Story
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group"
            onClick={() => navigate('/create/adult')}
          >
            <div className="space-y-4 text-center">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <User2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Adult Mode</h2>
              <p className="text-muted-foreground">
                Advanced story creation with full customization options and detailed controls.
              </p>
              <Button className="w-full text-lg py-6" size="lg">
                Create Adult Story
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryStart;