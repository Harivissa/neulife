import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Globe, Thermometer, Scale, Bell, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useHealthStorage } from '@/hooks/useHealthStorage';

interface AppSettings {
  temperatureUnit: 'fahrenheit' | 'celsius';
  weightUnit: 'kg' | 'lbs';
  language: string;
  notifications: boolean;
  darkMode: boolean;
}

const SETTINGS_KEY = 'neulife_settings';

const defaultSettings: AppSettings = {
  temperatureUnit: 'fahrenheit',
  weightUnit: 'kg',
  language: 'en',
  notifications: true,
  darkMode: true,
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
];

const SettingsPage = () => {
  const { clearAll } = useHealthStorage();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setHasChanges(false);
    toast.success('Settings saved');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all health data? This cannot be undone.')) {
      clearAll();
      toast.success('All health data cleared');
    }
  };

  const handleResetSettings = () => {
    if (confirm('Reset all settings to defaults?')) {
      setSettings(defaultSettings);
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      toast.success('Settings reset to defaults');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your NEULIFE experience</p>
        </div>
      </div>

      {/* Language */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Language & Region</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Display Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Units */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Thermometer className="h-5 w-5 text-orange-400" />
          <h2 className="font-semibold">Measurement Units</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tempUnit">Temperature Unit</Label>
            <Select
              value={settings.temperatureUnit}
              onValueChange={(value: 'fahrenheit' | 'celsius') => updateSetting('temperatureUnit', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="weightUnit">Weight Unit</Label>
            <Select
              value={settings.weightUnit}
              onValueChange={(value: 'kg' | 'lbs') => updateSetting('weightUnit', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-5 w-5 text-amber-400" />
          <h2 className="font-semibold">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive health reminders</p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => updateSetting('notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme</p>
            </div>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-5 w-5 text-destructive" />
          <h2 className="font-semibold">Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Clear Health Data</p>
              <p className="text-sm text-muted-foreground">Remove all vitals and symptoms</p>
            </div>
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleClearData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reset Settings</p>
              <p className="text-sm text-muted-foreground">Restore default settings</p>
            </div>
            <Button variant="outline" onClick={handleResetSettings}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6">
          <Button size="lg" onClick={saveSettings} className="shadow-lg">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      {/* App Info */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>NEULIFE Healthcare Triage System</p>
        <p>Version 1.0.0</p>
        <p className="mt-2">All data stored locally on your device</p>
      </div>
    </div>
  );
};

export default SettingsPage;
