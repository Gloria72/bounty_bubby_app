import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WorldMap from "@/components/WorldMap";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { MapPin, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();
  const { data: tasks } = trpc.tasks.list.useQuery();

  const stats = [
    { label: t('home.stats.tasks'), value: tasks?.length || 0, icon: "🎯", color: "text-primary" },
    { label: t('home.stats.bounty'), value: "128K", icon: "🏆", color: "text-secondary" },
    { label: t('home.stats.users'), value: "2.3K", icon: Users, color: "text-accent" },
  ];

  const categories = [
    { name: t('category.study'), icon: "📚", value: "study" },
    { name: t('category.fitness'), icon: "💪", value: "fitness" },
    { name: t('category.travel'), icon: "✈️", value: "travel" },
    { name: t('category.food'), icon: "🍜", value: "food" },
    { name: t('category.life'), icon: "🏠", value: "life" },
    { name: t('category.skill'), icon: "🎯", value: "skill" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Language Switcher - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section with Floating Elements */}
      <section className="py-20 relative overflow-hidden min-h-screen flex items-center">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full neon-border opacity-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-32 h-32 rounded-full neon-border-green opacity-20"
          animate={{
            y: [0, 40, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass neon-border mb-8"
            >
              <span className="text-xs font-bold text-primary neon-glow-pink uppercase tracking-wider">
                {t('home.hero.badge')}
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-8xl font-black mb-6 leading-tight"
            >
              <span className="text-primary neon-glow-pink">{t('home.hero.title1')}</span>
              <br />
              <span className="text-foreground">{t('home.hero.title2')}</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('home.hero.subtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/tasks">
                <Button size="lg" className="neon-border pulse-glow text-base font-bold px-8 h-14">
                  🎯 {t('home.hero.browse')}
                </Button>
              </Link>
              <Link href="/create">
                <Button size="lg" variant="outline" className="neon-border-green text-base font-bold px-8 h-14">
                  {t('home.hero.create')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats with Hover Effects */}
      <section className="py-16 border-y border-border/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="glass neon-border p-8 text-center group cursor-pointer">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {typeof stat.icon === 'string' ? stat.icon : <stat.icon className="h-12 w-12 mx-auto text-primary" />}
                  </div>
                  <div className={`text-4xl font-black mb-2 ${stat.color} neon-glow-pink`}>
                    {typeof stat.value === 'number' ? stat.value : stat.value}
                    {stat.label === t('home.stats.bounty') && <span className="text-2xl ml-1">🏆</span>}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* World Map */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4 text-primary neon-glow-pink">
              {t('home.map.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('home.map.subtitle')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <WorldMap />
          </motion.div>
        </div>
      </section>

      {/* Categories with Stagger Animation */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black mb-4 text-secondary neon-glow-green">
              {t('home.categories.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('home.categories.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Link href={`/tasks?category=${category.value}`}>
                  <Card className="glass neon-border-cyan p-8 text-center cursor-pointer group">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">
                      {category.icon}
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      {category.name}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Tasks */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black mb-2 text-accent neon-glow-cyan">
                {t('home.tasks.title')}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t('home.tasks.subtitle')}
              </p>
            </motion.div>
            <Link href="/tasks">
              <Button variant="outline" className="neon-border-cyan font-bold">
                {t('home.tasks.viewAll')} →
              </Button>
            </Link>
          </div>

          {tasks && tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.slice(0, 6).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Link href={`/tasks/${task.id}`}>
                    <Card className="glass neon-border p-6 cursor-pointer group h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="inline-flex px-3 py-1 rounded-full glass neon-border text-xs font-bold text-primary">
                          {getCategoryName(task.category, t)}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          {task.isOnline ? (
                            <span className="text-secondary">🌐 {t('task.online')}</span>
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
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="glass neon-border p-16 text-center">
              <div className="text-8xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">No tasks yet</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Be the first bounty hunter to create a task
              </p>
              <Link href="/create">
                <Button className="neon-border pulse-glow font-bold px-8 h-14">
                  🏆 {t('home.hero.create')}
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container relative z-10 text-center"
        >
          <h2 className="text-5xl font-black mb-6">
            <span className="text-primary neon-glow-pink">{t('home.cta.title1')} </span>
            <span className="text-foreground">{t('home.cta.title2')}</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link href="/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="neon-border pulse-glow text-lg font-bold px-10 h-16">
                🏆 {t('home.cta.button')}
              </Button>
            </motion.div>
          </Link>
        </motion.div>
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

