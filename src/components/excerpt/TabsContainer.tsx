import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsContainerProps {
  activeTab: string;
}

export const TabsContainer = ({ activeTab }: TabsContainerProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="random">Random Excerpts</TabsTrigger>
      <TabsTrigger value="local">My Excerpts</TabsTrigger>
    </TabsList>
  );
};