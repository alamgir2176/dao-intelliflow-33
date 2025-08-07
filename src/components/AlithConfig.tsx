import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, Brain, Shield, Zap } from 'lucide-react';
import { alithService, AlithConfig, getAlithConfig } from '@/services/alith';
import { useToast } from '@/hooks/use-toast';

export const AlithConfigPanel = () => {
  const [config, setConfig] = useState<AlithConfig>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedConfig = getAlithConfig();
    setConfig(savedConfig);
    setIsConfigured(alithService.isConfigured());
  }, []);

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    alithService.updateConfig(config);
    setIsConfigured(alithService.isConfigured());
    toast({
      title: "Configuration Saved",
      description: "Alith AI configuration has been updated successfully.",
    });
  };

  const handleClear = () => {
    setConfig({});
    alithService.updateConfig({});
    setIsConfigured(false);
    toast({
      title: "Configuration Cleared",
      description: "All API keys have been removed.",
    });
  };

  const renderKeyInput = (
    key: keyof AlithConfig,
    label: string,
    placeholder: string,
    description: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key} className="flex items-center gap-2">
        <Key className="h-4 w-4" />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={key}
          type={showKeys[key] ? "text" : "password"}
          value={config[key] || ''}
          onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.value }))}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={() => toggleKeyVisibility(key)}
        >
          {showKeys[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Alith AI Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Configure AI models for enhanced DAO governance insights
            </p>
          </div>
        </div>
        <Badge variant={isConfigured ? "default" : "secondary"}>
          {isConfigured ? "Configured" : "Not Configured"}
        </Badge>
      </div>

      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> API keys are stored locally in your browser.
          For production use, we recommend using Supabase integration for secure key management.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="openai" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          <TabsTrigger value="lazai">LazAI</TabsTrigger>
        </TabsList>

        <TabsContent value="openai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                OpenAI Configuration
              </CardTitle>
              <CardDescription>
                Configure OpenAI GPT models for advanced governance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderKeyInput(
                'openaiApiKey',
                'OpenAI API Key',
                'sk-...',
                'Get your API key from https://platform.openai.com/api-keys'
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anthropic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Anthropic Configuration
              </CardTitle>
              <CardDescription>
                Configure Claude models for nuanced governance insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderKeyInput(
                'anthropicApiKey',
                'Anthropic API Key',
                'sk-ant-...',
                'Get your API key from https://console.anthropic.com/'
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lazai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                LazAI Configuration
              </CardTitle>
              <CardDescription>
                Configure LazAI decentralized AI models for Web3-native governance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderKeyInput(
                'lazaiApiKey',
                'LazAI API Key',
                'laz-...',
                'Get your API key from LazAI platform'
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          Save Configuration
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear All
        </Button>
      </div>

      {isConfigured && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">AI Features Enabled:</span>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Proposal risk analysis and sentiment detection</li>
              <li>• Automated governance health insights</li>
              <li>• Smart proposal improvement suggestions</li>
              <li>• Predictive voting outcome analysis</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};