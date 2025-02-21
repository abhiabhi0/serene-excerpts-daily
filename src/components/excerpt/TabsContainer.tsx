
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsContainerProps {
  activeTab: string;
}

export const TabsContainer = ({ activeTab }: TabsContainerProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 h-10">
      <TabsTrigger value="random" className="flex-1 h-full">Today's Wisdom</TabsTrigger>
      <TabsTrigger value="local" className="flex-1 h-full">My Collection</TabsTrigger>
    </TabsList>
  );
};
