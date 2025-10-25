import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { MapPin, Plus, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function CreateTask() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "study" as const,
    bountyAmount: "",
    location: "",
    isOnline: false,
    startTime: "",
    endTime: "",
    tags: "",
  });

  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("✅ Task created successfully!");
      utils.tasks.list.invalidate();
      setLocation("/tasks");
    },
    onError: (error) => {
      toast.error("❌ Failed: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.bountyAmount) {
      toast.error("Please fill required fields");
      return;
    }

    createTaskMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      bountyAmount: parseInt(formData.bountyAmount),
      location: formData.location || undefined,
      isOnline: formData.isOnline,
      startTime: formData.startTime ? new Date(formData.startTime) : undefined,
      endTime: formData.endTime ? new Date(formData.endTime) : undefined,
      tags: formData.tags || undefined,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-20">
        {/* Language Switcher */}
        <div className="fixed top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="mx-auto max-w-md glass neon-border-green p-20 text-center">
            <div className="text-9xl mb-8">🔒</div>
            <h2 className="text-4xl font-black mb-4 text-accent neon-glow-cyan">
              {t('create.login.title')}
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              {t('create.login.subtitle')}
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="neon-border pulse-glow font-bold px-10 h-16">
                {t('create.login.button')}
              </Button>
            </a>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="container max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-6xl font-black mb-4">
            <span className="text-primary neon-glow-pink">{t('create.title1')}</span>
            <span className="text-foreground"> {t('create.title2')}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('create.subtitle')}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass neon-border p-8 mb-6">
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider">
                    {t('create.form.title')} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder={t('create.form.titlePlaceholder')}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass neon-border-cyan h-12 text-lg"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider">
                    {t('create.form.description')} <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={t('create.form.descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="glass neon-border-cyan resize-none"
                    required
                  />
                </div>

                {/* Category & Bounty */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-bold uppercase tracking-wider">
                      {t('create.form.category')}
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category" className="glass neon-border h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass neon-border">
                        <SelectItem value="study">📚 {t('category.study')}</SelectItem>
                        <SelectItem value="fitness">💪 {t('category.fitness')}</SelectItem>
                        <SelectItem value="travel">✈️ {t('category.travel')}</SelectItem>
                        <SelectItem value="food">🍜 {t('category.food')}</SelectItem>
                        <SelectItem value="life">🏠 {t('category.life')}</SelectItem>
                        <SelectItem value="skill">🎯 {t('category.skill')}</SelectItem>
                        <SelectItem value="other">🔧 {t('category.other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bounty" className="text-sm font-bold uppercase tracking-wider">
                      {t('create.form.bounty')} (🏆) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 text-3xl -translate-y-1/2">🏆</span>
                      <Input
                        id="bounty"
                        type="number"
                        placeholder={t('create.form.bountyPlaceholder')}
                        value={formData.bountyAmount}
                        onChange={(e) => setFormData({ ...formData, bountyAmount: e.target.value })}
                        className="glass neon-border pl-12 h-12 text-lg font-bold text-primary"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wider">
                    {t('create.form.type')}
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={!formData.isOnline ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, isOnline: false })}
                      className={`h-14 ${!formData.isOnline ? "neon-border pulse-glow" : "neon-border-cyan"} font-bold`}
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      {t('create.form.typeOffline')}
                    </Button>
                    <Button
                      type="button"
                      variant={formData.isOnline ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, isOnline: true })}
                      className={`h-14 ${formData.isOnline ? "neon-border pulse-glow" : "neon-border-cyan"} font-bold`}
                    >
                      🌐 {t('create.form.typeOnline')}
                    </Button>
                  </div>
                </div>

                {/* Location */}
                {!formData.isOnline && (
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-bold uppercase tracking-wider">
                      {t('create.form.location')}
                    </Label>
                    <Input
                      id="location"
                      placeholder={t('create.form.locationPlaceholder')}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="glass neon-border-cyan h-12"
                    />
                  </div>
                )}

                {/* Time Range */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="text-sm font-bold uppercase tracking-wider">
                      {t('create.form.startTime')}
                    </Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="glass neon-border h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-sm font-bold uppercase tracking-wider">
                      {t('create.form.endTime')}
                    </Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="glass neon-border h-12"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-bold uppercase tracking-wider">
                    {t('create.form.tags')}
                  </Label>
                  <Input
                    id="tags"
                    placeholder={t('create.form.tagsPlaceholder')}
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="glass neon-border-cyan h-12"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex gap-4">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 neon-border pulse-glow h-16 text-lg font-black uppercase"
                  disabled={createTaskMutation.isPending}
                >
                  <Plus className="mr-2 h-6 w-6" />
                  {createTaskMutation.isPending ? t('create.form.submitting') : t('create.form.submit')}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/tasks")}
                  className="neon-border-green h-16 text-lg font-bold uppercase"
                >
                  {t('create.form.cancel')}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass neon-border-green p-6">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-accent neon-glow-cyan mb-3 uppercase tracking-wider">
                    {t('create.tips.title')}
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('create.tips.1')}</li>
                    <li>• {t('create.tips.2')}</li>
                    <li>• {t('create.tips.3')}</li>
                    <li>• {t('create.tips.4')}</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

