import { useState } from "react";
import { NavigationBar } from "@/components/NavigationBar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { AudioStory } from "@/components/story/AudioStory";
import { StoryContent } from "@/components/story/StoryContent";

const MyAudio = () => {
  const { data: audioStories, isLoading } = useQuery({
    queryKey: ['audio-stories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { data: audioData, error: audioError } = await supabase
        .from('audio_stories')
        .select(`
          *,
          stories:story_id (
            id,
            title,
            content,
            moral,
            age_group,
            genre,
            language,
            tone,
            reading_level,
            length_preference
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (audioError) throw audioError;
      return audioData;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <NavigationBar onLogout={async () => {}} />
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Audio Stories</h1>

        {isLoading ? (
          <Loading text="Loading your audio stories..." />
        ) : !audioStories?.length ? (
          <div className="text-center text-gray-500">
            You haven't created any audio stories yet.
          </div>
        ) : (
          <div className="space-y-6">
            {audioStories.map((audio) => (
              <Card key={audio.id} className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{audio.stories.title}</h2>
                <StoryContent 
                  title={audio.stories.title}
                  content={audio.stories.content}
                  moral={audio.stories.moral}
                  ageGroup={audio.stories.age_group}
                  genre={audio.stories.genre}
                  language={audio.stories.language}
                  tone={audio.stories.tone}
                  readingLevel={audio.stories.reading_level}
                  lengthPreference={audio.stories.length_preference}
                />
                <div className="mt-4">
                  <AudioStory 
                    storyId={audio.stories.id} 
                    storyContent={audio.stories.content}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAudio;