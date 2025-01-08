import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ageGroups, genresByAge, moralsByAge } from "@/data/storyOptions";

type CategoryType = "age_group" | "genre" | "moral";

interface StoryCategorySidebarProps {
  selectedCategory: CategoryType;
  selectedValue: string | null;
  onCategoryChange: (category: CategoryType) => void;
  onValueChange: (value: string) => void;
}

export function StoryCategorySidebar({
  selectedCategory,
  selectedValue,
  onCategoryChange,
  onValueChange,
}: StoryCategorySidebarProps) {
  const getCategoryItems = (category: CategoryType) => {
    switch (category) {
      case "age_group":
        return ageGroups;
      case "genre":
        return Object.values(genresByAge).flat();
      case "moral":
        return Object.values(moralsByAge).flat();
      default:
        return [];
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    onCategoryChange("age_group");
                    onValueChange("");
                  }}
                  data-active={selectedCategory === "age_group"}
                >
                  Age Groups
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    onCategoryChange("genre");
                    onValueChange("");
                  }}
                  data-active={selectedCategory === "genre"}
                >
                  Genres
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    onCategoryChange("moral");
                    onValueChange("");
                  }}
                  data-active={selectedCategory === "moral"}
                >
                  Moral Lessons
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            {selectedCategory === "age_group"
              ? "Age Groups"
              : selectedCategory === "genre"
              ? "Genres"
              : "Moral Lessons"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getCategoryItems(selectedCategory).map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onValueChange(item.value)}
                    data-active={selectedValue === item.value}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}