
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pageKeys = ["about", "terms", "privacy"];

const getPageInfo = (pageName: string) => {
  switch (pageName) {
    case "about":
      return {
        title: "About Us",
        description: "Page d'information sur le projet et l'équipe"
      };
    case "terms":
      return {
        title: "Terms of Service", 
        description: "Conditions d'utilisation du service"
      };
    case "privacy":
      return {
        title: "Privacy Policy",
        description: "Politique de confidentialité et protection des données"
      };
    default:
      return {
        title: pageName,
        description: ""
      };
  }
};

const ContentEditor = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("page_contents")
        .select("page_name, content")
        .in("page_name", pageKeys);

      if (error) {
        toast({ title: "Error fetching content", description: error.message, variant: "destructive" });
      } else {
        const contentMap = data.reduce((acc, page) => {
          acc[page.page_name] = page.content || "";
          return acc;
        }, {} as Record<string, string>);
        setContent(contentMap);
      }
      setLoading(false);
    };

    fetchContent();
  }, [toast]);

  const handleSave = async (pageName: string) => {
    setSaving(prev => ({ ...prev, [pageName]: true }));
    const { error } = await supabase
      .from("page_contents")
      .update({ content: content[pageName], updated_at: new Date().toISOString() })
      .eq("page_name", pageName);

    if (error) {
      toast({ title: `Error saving ${pageName}`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${pageName} content saved!` });
    }
    setSaving(prev => ({ ...prev, [pageName]: false }));
  };

  const handleContentChange = (pageName: string, value: string) => {
    setContent(prev => ({ ...prev, [pageName]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF7F]"></div>
        <span className="ml-2">Loading content editor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-[#00CC5F]">Content Management</CardTitle>
          <p className="text-gray-600">Gérez le contenu des pages About, Terms et Privacy</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>
            {pageKeys.map(pageName => {
              const pageInfo = getPageInfo(pageName);
              return (
                <TabsContent key={pageName} value={pageName}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{pageInfo.title}</CardTitle>
                      <p className="text-sm text-gray-600">{pageInfo.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded">
                        <strong>Conseil :</strong> Utilisez du HTML pour formater le contenu (ex: &lt;h3&gt;Titre&lt;/h3&gt;, &lt;p&gt;Paragraphe&lt;/p&gt;, &lt;strong&gt;Gras&lt;/strong&gt;)
                      </div>
                      <Textarea
                        value={content[pageName] || ""}
                        onChange={(e) => handleContentChange(pageName, e.target.value)}
                        rows={20}
                        className="font-mono bg-gray-50 text-sm"
                        placeholder="Entrez le contenu HTML pour cette page..."
                      />
                      <Button 
                        onClick={() => handleSave(pageName)} 
                        disabled={saving[pageName]} 
                        className="bg-[#00CC5F] hover:bg-[#00AA4F]"
                      >
                        {saving[pageName] ? "Enregistrement..." : "Enregistrer le contenu"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentEditor;
