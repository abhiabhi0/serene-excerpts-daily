import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsContainerProps {
  activeTab: string;
}

export const TabsContainer = ({ activeTab }: TabsContainerProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="random">Today's Wisdom</TabsTrigger>
      <TabsTrigger value="local">My Collection</TabsTrigger>
    </TabsList>
  );
};