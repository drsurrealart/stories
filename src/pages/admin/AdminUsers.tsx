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

const USERS_PER_PAGE = 25;

const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Get user details
      const { data: userDetails, error: userError } = await supabase
        .from('user_details_secure')
        .select('*');
      if (userError) throw userError;

      // Get story counts for each user
      const { data: storyCounts, error: countError } = await supabase
        .from('user_story_counts')
        .select('user_id, credits_used');
      if (countError) throw countError;

      // Get saved stories count for each user
      const { data: savedStories, error: storyError } = await supabase
        .from('stories')
        .select('author_id, title, content');
      if (storyError) throw storyError;

      // Combine the data
      return userDetails.map(user => {
        // Sum up all credits_used for this user
        const totalCreated = storyCounts
          .filter(count => count.user_id === user.id)
          .reduce((sum, count) => sum + (count.credits_used || 0), 0);

        // Count saved stories (those with both title and content)
        const totalSaved = savedStories
          .filter(story => 
            story.author_id === user.id && 
            story.title && 
            story.content
          ).length;

        return {
          ...user,
          storiesCreated: totalCreated,
          storiesSaved: totalSaved,
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
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

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
                  <TableHead>Subscription Level</TableHead>
                  <TableHead>AI Credits Used</TableHead>
                  <TableHead>Stories Created</TableHead>
                  <TableHead>Stories Saved</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Upgrade</TableHead>
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
                    <TableCell>{user.credits_used}</TableCell>
                    <TableCell>{user.storiesCreated}</TableCell>
                    <TableCell>{user.storiesSaved}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.upgrade_date 
                        ? new Date(user.upgrade_date).toLocaleDateString()
                        : 'Never'}
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
                    
                    {getPageNumbers().map((page) => (
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