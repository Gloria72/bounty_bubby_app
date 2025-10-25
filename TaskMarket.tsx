import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

export default function TaskMarket() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: tasks, isLoading } = trpc.tasks.list.useQuery();

  const categories = [
    { name: t('category.all'), value: null, color: "neon-border" },
    { name: t('category.study'), value: "study", color: "neon-border-cyan" },
    { name: t('category.fitness'), value: "fitness", color: "neon-border" },
    { name: t('category.travel'), value: "travel", color: "neon-border-green" },
    { name: t('category.food'), value: "food", color: "neon-border" },
    { name: t('category.life'), value: "life", color: "neon-border-cyan" },
    { name: t('category.skill'), value: "skill", color: "neon-border-green" },
  ];

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <section className="py-16 border-b border-border/50 glass">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-6xl font-black mb-4">
              <span className="text-primary neon-glow-pink">{t('market.title1')}</span>
              <span className="text-foreground"> {t('market.title2')}</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('market.subtitle')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative glass neon-border rounded-lg">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
              <Input
                placeholder={t('market.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-transparent border-0 text-lg h-16 focus-visible:ring-0"
              />
            </div>
          </motion.div>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.value || "all"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={`${
                    selectedCategory === category.value
                      ? "neon-border pulse-glow"
                      : category.color
                  } font-bold uppercase tracking-wider`}
                >
                  {category.name}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Task List */}
      <section className="py-16">
        <div className="container">
          <div className="mb-10 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm"
            >
              <span className="text-muted-foreground">{t('market.found')} </span>
              <span className="text-3xl font-black text-primary neon-glow-pink">
                {filteredTasks?.length || 0}
              </span>
              <span className="text-muted-foreground"> {t('market.tasks')}</span>
            </motion.div>
            <Link href="/create">
              <Button className="neon-border pulse-glow font-bold">
                🏆 {t('market.create')}
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-72 glass neon-border animate-pulse" />
              ))}
            </div>
          ) : filteredTasks && filteredTasks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Link href={`/tasks/${task.id}`}>
                    <Card className="glass neon-border p-6 cursor-pointer group h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="inline-flex px-3 py-1 rounded-full glass neon-border-cyan text-xs font-bold text-secondary uppercase">
                          {getCategoryName(task.category, t)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          {task.isOnline ? (
                            <span className="text-secondary neon-glow-green">🌐 {t('task.online')}</span>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" />
                              <span>{task.location || "TBD"}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {task.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">🏆</span>
                          <span className="text-2xl font-black text-primary neon-glow-pink">
                            {task.bountyAmount}
                          </span>
                          <span className="text-xs text-muted-foreground">{t('task.cups')}</span>
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">
                          {task.taskType === "oneTime" ? t('task.oneTime') : task.taskType === "recurring" ? t('task.recurring') : t('task.group')}
                        </div>
                      </div>

                      {task.startTime && (
                        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                          <span>⏰</span>
                          <span>{new Date(task.startTime).toLocaleDateString()}</span>
                        </div>
                      )}
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="glass neon-border-green p-20 text-center">
                <div className="text-9xl mb-8">🔍</div>
                <h3 className="text-4xl font-black mb-4 text-accent neon-glow-cyan">
                  {t('market.empty.title')}
                </h3>
                <p className="text-muted-foreground mb-10 text-lg">
                  {searchQuery || selectedCategory
                    ? t('market.empty.subtitle')
                    : "No tasks available yet"}
                </p>
                <Link href="/create">
                  <Button size="lg" className="neon-border pulse-glow font-bold px-10 h-16">
                    🏆 {t('market.empty.button')}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Footer */}
      <section className="py-16 border-t border-border/50 glass">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: tasks?.length || 0, label: t('home.stats.tasks'), icon: "🎯" },
              { value: "128K", label: t('home.stats.bounty'), icon: "🏆" },
              { value: "2.3K", label: t('home.stats.users'), icon: "👥" },
              { value: "94%", label: t('home.stats.rate'), icon: "✅" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-primary neon-glow-pink mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryName(category: string, t: (key: string) => string) {
  const map: Record<string, string> = {
    study: t('category.study'),
    fitness: t('category.fitness'),
    travel: t('category.travel'),
    food: t('category.food'),
    life: t('category.life'),
    skill: t('category.skill'),
    other: t('category.other'),
  };
  return map[category] || category;
}

