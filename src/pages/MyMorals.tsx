import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, ChevronRight, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loading } from "@/components/ui/loading";
import { NavigationBar } from "@/components/NavigationBar";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const ITEMS_PER_PAGE = 12;

const MyMorals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: morals, isLoading } = useQuery({
    queryKey: ['all-morals'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      
      const { data, error } = await supabase
        .from('stories')
        .select('title, moral, created_at, action_steps')
        .eq('author_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const filteredMorals = morals?.filter(story => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      story.title.toLowerCase().includes(searchTerm) ||
      story.moral.toLowerCase().includes(searchTerm) ||
      (Array.isArray(story.action_steps) && 
        story.action_steps.some((step: string) => 
          step.toLowerCase().includes(searchTerm)
        ))
    );
  });

  if (isLoading) {
    return (
      <>
        <NavigationBar onLogout={handleLogout} />
        <div className="container py-8">
          <Loading />
        </div>
      </>
    );
  }

  const getRandomColor = () => {
    const colors = [
      'bg-pink-100', 'bg-purple-100', 'bg-indigo-100', 
      'bg-blue-100', 'bg-green-100', 'bg-yellow-100',
      'bg-orange-100', 'bg-red-100', 'bg-teal-100'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Pagination calculations
  const totalPages = filteredMorals ? Math.ceil(filteredMorals.length / ITEMS_PER_PAGE) : 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMorals = filteredMorals?.slice(startIndex, endIndex);

  const PaginationControls = () => (
    <Pagination className="my-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          // Show first page, current page, last page, and pages around current page
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => setCurrentPage(pageNumber)}
                  isActive={currentPage === pageNumber}
                  className="cursor-pointer"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (
            pageNumber === currentPage - 2 ||
            pageNumber === currentPage + 2
          ) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <>
      <NavigationBar onLogout={handleLogout} />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">My Moral Lessons</h1>
        </div>
        
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search by title, moral, or action steps..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>

        {filteredMorals?.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            {searchQuery ? "No morals found matching your search." : "You haven't saved any morals yet."}
          </div>
        ) : (
          <>
            {totalPages > 1 && <PaginationControls />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMorals?.map((story, index) => (
                <Card key={index} className={`${getRandomColor()} border-none shadow-md transition-transform hover:scale-105`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">{story.title}</h3>
                    <p className="text-gray-700 mb-4">{story.moral}</p>
                    
                    {Array.isArray(story.action_steps) && story.action_steps.length > 0 && (
                      <Accordion type="single" collapsible className="bg-white/50 rounded-lg">
                        <AccordionItem value="action-steps" className="border-none">
                          <AccordionTrigger className="px-4 py-2 hover:no-underline">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <ChevronRight className="w-4 h-4" />
                              Action Steps
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <ul className="space-y-2 text-sm">
                              {story.action_steps.map((step: string, stepIndex: number) => (
                                <li key={stepIndex} className="flex items-start gap-2">
                                  <span className="font-medium min-w-[20px]">{stepIndex + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && <PaginationControls />}
          </>
        )}
      </div>
    </>
  );
};

export default MyMorals;