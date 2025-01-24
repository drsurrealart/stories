import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Baby, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateStoryStart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background py-12">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12 animate-fade-in">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Create Your Story</h1>
          <p className="text-lg text-gray-600">Choose who you're creating for today!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card 
            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate("/create-kids-story")}
          >
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Baby className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Kids Story</h2>
              <p className="text-gray-600">
                Create a fun and simple story perfect for young readers!
                Just a few clicks to make story magic happen.
              </p>
              <Button 
                className="w-full text-lg py-6"
                size="lg"
              >
                Create Kids Story
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate("/create")}
          >
            <div className="text-center space-y-4">
              <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto group-hover:scale-110 transition-transform duration-300">
                <User className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Adult Story</h2>
              <p className="text-gray-600">
                Create a detailed story with advanced options and
                full creative control over your narrative.
              </p>
              <Button 
                className="w-full text-lg py-6"
                size="lg"
              >
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