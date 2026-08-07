import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Globe,
  Bell,
  KeyRound,
  User,
  Building2,
  Moon,
  Sun,
  Check,
  Copy,
  Plus,
  Trash2,
  Shield,
} from 'lucide-react';
import { PageContainer, PageHeader } from '@/components/common/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

const languages = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'fr', label: 'Français', flag: 'FR' },
  { code: 'de', label: 'Deutsch', flag: 'DE' },
  { code: 'ja', label: '日本語', flag: 'JA' },
];

export default function Settings() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    notifications,
    setNotifications,
    apiKeys,
    generateApiKey,
    deleteApiKey,
    profile,
    updateProfile,
    organization,
    updateOrganization,
  } = useApp();

  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState(profile);
  const [orgForm, setOrgForm] = useState(organization);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const handleCreateApiKey = () => {
    const createdKey = generateApiKey(newKeyName || 'New API Key');
    setNewKeyName('');
    setShowKeyModal(false);
    toast({
      title: 'API Key Created',
      description: `Generated key: ${createdKey.key}`,
    });
  };

  const handleCopyKey = (keyString: string) => {
    navigator.clipboard.writeText(keyString);
    toast({
      title: 'Copied to Clipboard',
      description: 'API key string copied.',
    });
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    toast({
      title: 'Profile Updated',
      description: 'Your profile changes have been saved.',
    });
  };

  const handleSaveOrg = () => {
    updateOrganization(orgForm);
    toast({
      title: 'Organization Updated',
      description: 'Organization settings updated successfully.',
    });
  };

  return (
    <PageContainer>
      <PageHeader title="Settings" subtitle="Manage your workspace preferences and configuration" />

      <Tabs defaultValue="theme" className="mt-8">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 overflow-x-auto bg-card p-1 sm:w-auto">
          <TabsTrigger value="theme" className="gap-1.5">
            <Palette className="h-4 w-4" /> Theme
          </TabsTrigger>
          <TabsTrigger value="language" className="gap-1.5">
            <Globe className="h-4 w-4" /> Language
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-1.5">
            <KeyRound className="h-4 w-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="org" className="gap-1.5">
            <Building2 className="h-4 w-4" /> Organization
          </TabsTrigger>
        </TabsList>

        {/* Theme */}
        <TabsContent value="theme">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">Appearance</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choose how Orbit AI looks to you.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {([
                { id: 'dark', label: 'Dark', icon: Moon, desc: 'Default — easy on the eyes' },
                { id: 'light', label: 'Light', icon: Sun, desc: 'Bright and clean' },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'relative flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-colors',
                    theme === t.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background/50 hover:border-primary/40',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      theme === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <t.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  {theme === t.id && (
                    <Check className="absolute right-4 top-4 h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Language */}
        <TabsContent value="language">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">Language & Region</h3>
            <p className="mt-1 text-sm text-muted-foreground">Set your preferred interface language.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-4 transition-colors',
                    language === l.code
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-background/50 hover:border-primary/40',
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                    {l.flag}
                  </span>
                  <span className="text-sm font-medium">{l.label}</span>
                  {language === l.code && <Check className="ml-auto h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">Notifications</h3>
            <p className="mt-1 text-sm text-muted-foreground">Control how and when Orbit AI reaches you.</p>
            <div className="mt-6 space-y-1">
              {[
                { key: 'email' as const, label: 'Email notifications', desc: `Receive updates at ${profile.email}` },
                { key: 'push' as const, label: 'Push notifications', desc: 'Real-time alerts in your browser' },
                { key: 'agentAlerts' as const, label: 'Agent alerts', desc: 'Notify when an agent flags a risk' },
                { key: 'weeklyReport' as const, label: 'Weekly summary report', desc: 'A digest of activity every Monday' },
              ].map((n) => (
                <div
                  key={n.key}
                  className="flex items-center justify-between border-b border-border py-4 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[n.key]}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({ ...prev, [n.key]: v }))
                    }
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value="api">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold">API Keys</h3>
                <p className="mt-1 text-sm text-muted-foreground">Manage keys for programmatic access.</p>
              </div>
              <Button className="gap-2" onClick={() => setShowKeyModal(true)}>
                <Plus className="h-4 w-4" /> Generate Key
              </Button>
            </div>

            {showKeyModal && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-primary/40 bg-primary/5 p-4">
                <p className="text-sm font-medium">Create New API Key</p>
                <Input
                  placeholder="Key description (e.g., Production Integration)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowKeyModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreateApiKey}>
                    Generate
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
              <Shield className="h-5 w-5 shrink-0 text-warning" />
              <p className="text-xs text-muted-foreground">
                Keys grant full access to the Orbit AI API. Store them securely and rotate regularly.
                Never share keys in client-side code.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/50 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{k.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{k.key}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-muted-foreground">Created {k.created}</p>
                    <p className="text-xs text-muted-foreground">Last used {k.lastUsed}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyKey(k.key)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteApiKey(k.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">Profile</h3>
            <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>
            <div className="mt-6 flex items-center gap-4">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
                  {profileForm.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Role</label>
                <Input
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <Input
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Phone</label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
              <Button variant="outline" onClick={() => setProfileForm(profile)}>Cancel</Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Organization */}
        <TabsContent value="org">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <h3 className="font-display text-lg font-semibold">Organization</h3>
            <p className="mt-1 text-sm text-muted-foreground">Manage your organization details.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Organization Name</label>
                <Input
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Industry</label>
                <Input
                  value={orgForm.industry}
                  onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Plan</label>
                <div className="mt-1.5 flex h-9 items-center rounded-md border border-primary/30 bg-primary/10 px-3 text-sm font-medium text-primary">
                  {orgForm.plan}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Team Members</label>
                <Input
                  type="number"
                  value={orgForm.teamMembers}
                  onChange={(e) => setOrgForm({ ...orgForm, teamMembers: parseInt(e.target.value) || 0 })}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button onClick={handleSaveOrg}>Save Changes</Button>
              <Button variant="outline" onClick={() => setOrgForm(organization)}>Cancel</Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

