import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AnalyticsSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    ga4_measurement_id: "",
    ga4_enabled: false,
    site_title: "",
    site_description: ""
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["ga4_measurement_id", "ga4_enabled", "site_title", "site_description"]);

      if (error) throw error;

      console.log("Loaded settings from DB:", data);

      const settingsObject = data.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_key === "ga4_enabled" 
          ? item.setting_value === "true" 
          : item.setting_value || "";
        return acc;
      }, {} as any);

      console.log("Parsed settings object:", settingsObject);
      setSettings(settingsObject);
    } catch (error: any) {
      console.error("Error loading settings:", error);
      toast({
        title: "Erreur de chargement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateGA4Id = (id: string) => {
    const ga4Pattern = /^G-[A-Z0-9]{10}$/;
    return !id || ga4Pattern.test(id);
  };

  const handleSave = async () => {
    if (settings.ga4_measurement_id && !validateGA4Id(settings.ga4_measurement_id)) {
      toast({
        title: "Format invalide",
        description: "Le Measurement ID doit avoir le format G-XXXXXXXXXX",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const updates = [
        { setting_key: "ga4_measurement_id", setting_value: settings.ga4_measurement_id },
        { setting_key: "ga4_enabled", setting_value: settings.ga4_enabled.toString() },
        { setting_key: "site_title", setting_value: settings.site_title },
        { setting_key: "site_description", setting_value: settings.site_description }
      ];

      console.log("Saving updates:", updates);

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: update.setting_value, updated_at: new Date().toISOString() })
          .eq("setting_key", update.setting_key);

        if (error) throw error;
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres analytics ont été mis à jour avec succès.",
      });

      // Recharger la page pour appliquer les nouveaux paramètres GA4
      if (settings.ga4_enabled && settings.ga4_measurement_id) {
        toast({
          title: "Rechargement en cours",
          description: "La page va se recharger pour appliquer les paramètres GA4...",
        });
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testGA4Connection = () => {
    console.log("Testing GA4 connection...");
    console.log("Current settings:", settings);
    console.log("window.gtag exists:", !!window.gtag);
    console.log("window.ga4MeasurementId:", window.ga4MeasurementId);

    if (!settings.ga4_measurement_id || !validateGA4Id(settings.ga4_measurement_id)) {
      toast({
        title: "Configuration invalide",
        description: "Veuillez configurer un Measurement ID valide avant de tester.",
        variant: "destructive",
      });
      return;
    }

    if (!settings.ga4_enabled) {
      toast({
        title: "GA4 désactivé",
        description: "Veuillez d'abord activer GA4 et sauvegarder avant de tester.",
        variant: "destructive",
      });
      return;
    }

    // Tenter d'envoyer un événement de test même si GA4 n'est pas encore chargé
    if (window.gtag) {
      window.gtag('event', 'admin_test', {
        event_category: 'admin',
        event_label: 'GA4 connection test',
        measurement_id: settings.ga4_measurement_id
      });
      toast({
        title: "Événement de test envoyé",
        description: "Vérifiez dans GA4 Realtime si l'événement 'admin_test' apparaît.",
      });
    } else {
      toast({
        title: "GA4 en cours de chargement",
        description: "Sauvegardez d'abord les paramètres, puis rechargez la page pour charger GA4.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics 4</CardTitle>
          <CardDescription>
            Configurez le tracking GA4 pour analyser les visites et comportements utilisateurs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="ga4-enabled"
              checked={settings.ga4_enabled}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, ga4_enabled: checked })
              }
            />
            <Label htmlFor="ga4-enabled">Activer le tracking GA4</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ga4-id">Measurement ID</Label>
            <Input
              id="ga4-id"
              placeholder="G-XXXXXXXXXX"
              value={settings.ga4_measurement_id}
              onChange={(e) =>
                setSettings({ ...settings, ga4_measurement_id: e.target.value })
              }
              className={
                settings.ga4_measurement_id && !validateGA4Id(settings.ga4_measurement_id)
                  ? "border-red-500"
                  : ""
              }
            />
            {settings.ga4_measurement_id && !validateGA4Id(settings.ga4_measurement_id) && (
              <p className="text-sm text-red-500">
                Format invalide. Utilisez le format G-XXXXXXXXXX
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            <Button variant="outline" onClick={testGA4Connection}>
              Tester la connexion
            </Button>
          </div>

          {/* Debug info */}
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
            <strong>Debug Info:</strong>
            <div>GA4 activé: {settings.ga4_enabled ? "Oui" : "Non"}</div>
            <div>Measurement ID: {settings.ga4_measurement_id || "Non configuré"}</div>
            <div>window.gtag disponible: {typeof window !== 'undefined' && window.gtag ? "Oui" : "Non"}</div>
            <div>window.ga4MeasurementId: {typeof window !== 'undefined' && window.ga4MeasurementId ? window.ga4MeasurementId : "Non défini"}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres du site</CardTitle>
          <CardDescription>
            Configuration générale du site pour SEO et branding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-title">Titre du site</Label>
            <Input
              id="site-title"
              value={settings.site_title}
              onChange={(e) =>
                setSettings({ ...settings, site_title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-description">Description du site</Label>
            <Input
              id="site-description"
              value={settings.site_description}
              onChange={(e) =>
                setSettings({ ...settings, site_description: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSettings;
