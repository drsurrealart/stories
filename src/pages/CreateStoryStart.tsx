import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Baby, User2, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";

const CreateStoryStart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={() => {}} />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Create Your Story</h1>
          <p className="text-xl text-muted-foreground">Choose your story mode</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-[#F2FCE2] to-[#E2D1C3]"
            onClick={() => navigate('/create/kids')}
          >
            <div className="space-y-4 text-center relative z-10">
              <div className="w-24 h-24 mx-auto bg-[#FEF7CD]/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Baby className="w-12 h-12 text-[#97C21E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#4A5B22]">Kids Mode</h2>
              <p className="text-[#5C6F2B]">
                Simple and fun story creation with just a few clicks! Perfect for young storytellers.
              </p>
              <Button 
                className="w-full text-lg py-6 bg-[#97C21E] hover:bg-[#7A9B18] text-white"
                size="lg"
              >
                Create Kids Story
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB]"
            onClick={() => navigate('/create/parents')}
          >
            <div className="space-y-4 text-center relative z-10">
              <div className="w-24 h-24 mx-auto bg-pink-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-12 h-12 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A1F2C]">Parents Mode</h2>
              <p className="text-[#1A1F2C]/80">
                Create educational stories with family values and customized learning experiences.
              </p>
              <Button 
                className="w-full text-lg py-6 bg-pink-500 hover:bg-pink-600 text-white"
                size="lg"
              >
                Create Family Story
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-[#F1F0FB] to-[#D6BCFA]"
            onClick={() => navigate('/create/adult')}
          >
            <div className="space-y-4 text-center relative z-10">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <User2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A1F2C]">Adult Mode</h2>
              <p className="text-[#1A1F2C]/80">
                Advanced story creation with full customization options and detailed controls.
              </p>
              <Button 
                className="w-full text-lg py-6 bg-primary hover:bg-primary-hover text-white"
                size="lg"
              >
                Create Adult Story
              </Button>
            </div>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-[#E5DEFF] to-[#8B5CF6]"
            onClick={() => navigate('/create/teacher')}
          >
            <div className="space-y-4 text-center relative z-10">
              <div className="w-24 h-24 mx-auto bg-[#8B5CF6]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-12 h-12 text-[#8B5CF6]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Teacher Mode</h2>
              <p className="text-white/90">
                Educational story creation with lesson plans, discussion questions, and printable materials.
              </p>
              <Button 
                className="w-full text-lg py-6 bg-white hover:bg-white/90 text-[#8B5CF6]"
                size="lg"
              >
                Create Teacher Story
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryStart;