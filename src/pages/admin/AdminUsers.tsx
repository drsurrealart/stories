import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { NavigationBar } from "@/components/NavigationBar";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { format } from "date-fns";

const USERS_PER_PAGE = 25;

const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get user details from the secure view
      const { data: userDetails, error: userError } = await supabase
        .from('user_details_secure')
        .select('*');
      if (userError) throw userError;

      // Get stories for each user
      const { data: stories, error: storyError } = await supabase
        .from('stories')
        .select('author_id, title, content');
      if (storyError) throw storyError;

      // Get monthly credit usage for each user
      const { data: creditUsage, error: creditError } = await supabase
        .from('user_story_counts')
        .select('user_id, credits_used, month_year');
      if (creditError) throw creditError;

      // Combine and process the data
      return userDetails.map(user => {
        // Count total stories created (from user_story_counts)
        const totalStoriesCreated = creditUsage
          .filter(usage => usage.user_id === user.id)
          .reduce((sum, usage) => sum + (usage.credits_used || 0), 0);

        // Count saved stories (with both title and content)
        const savedStories = stories.filter(story => 
          story.author_id === user.id && 
          story.title && 
          story.content
        ).length;

        // Calculate total credits used across all months
        const totalCredits = creditUsage
          .filter(usage => usage.user_id === user.id)
          .reduce((sum, usage) => sum + (usage.credits_used || 0), 0);

        // Calculate credits remaining
        const creditsRemaining = (user.credits_purchased || 0) - totalCredits;

        return {
          ...user,
          savedStories,
          totalCredits,
          creditsRemaining,
          totalStoriesCreated
        };
      });
    },
  });

  if (isLoading) {
    return (
      <>
        <NavigationBar onLogout={handleLogout} />
        <div className="container mx-auto p-6">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationBar onLogout={handleLogout} />
        <Alert variant="destructive" className="m-6">
          <AlertDescription>
            Error loading users. Please try again later.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  // Calculate pagination values
  const totalPages = Math.ceil((users?.length || 0) / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = users?.slice(startIndex, endIndex) || [];

  return (
    <>
      <NavigationBar onLogout={handleLogout} />
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <AdminNav />
          </div>
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Member Level</TableHead>
                  <TableHead>Total Credits Used</TableHead>
                  <TableHead>Stories Created</TableHead>
                  <TableHead>Saved Stories</TableHead>
                  <TableHead>Credits Remaining</TableHead>
                  <TableHead>Credits Purchased</TableHead>
                  <TableHead>Member Since</TableHead>
                  <TableHead>Last Upgrade</TableHead>
                  <TableHead>Renewal Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {user.subscription_level}
                    </TableCell>
                    <TableCell>{user.totalCredits}</TableCell>
                    <TableCell>{user.totalStoriesCreated}</TableCell>
                    <TableCell>{user.savedStories}</TableCell>
                    <TableCell>{user.creditsRemaining}</TableCell>
                    <TableCell>{user.credits_purchased}</TableCell>
                    <TableCell>
                      {user.created_at 
                        ? format(new Date(user.created_at), 'MM/dd/yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {user.upgrade_date 
                        ? format(new Date(user.upgrade_date), 'MM/dd/yyyy')
                        : 'Never'}
                    </TableCell>
                    <TableCell>
                      {user.renewal_date 
                        ? format(new Date(user.renewal_date), 'MM/dd/yyyy')
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;