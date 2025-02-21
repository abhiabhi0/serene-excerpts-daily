
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsContainerProps {
  activeTab: string;
}

export const TabsContainer = ({ activeTab }: TabsContainerProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="random" className="h-10">Today's Wisdom</TabsTrigger>
      <TabsTrigger value="local" className="h-10">My Collection</TabsTrigger>
    </TabsList>
  );
};
