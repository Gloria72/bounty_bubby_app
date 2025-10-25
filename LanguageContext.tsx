import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.tasks': '任务',
    'nav.create': '发布',
    'nav.profile': '我的',
    
    // Home
    'home.hero.badge': '💰 赏金驱动 · 智能匹配 · 托管保障',
    'home.hero.title1': 'BOUNTY',
    'home.hero.title2': 'BUDDY',
    'home.hero.subtitle': '用任务赏金激励行动,用智能匹配找到搭子,用托管机制建立信任。让每个目标都有完美伙伴。',
    'home.hero.browse': '浏览任务',
    'home.hero.create': '发布任务',
    'home.stats.tasks': '活跃任务',
    'home.stats.bounty': '赏金总额',
    'home.stats.users': '活跃用户',
    'home.stats.rate': '完成率',
    'home.map.title': '🌍 全球任务热区',
    'home.map.subtitle': '实时追踪任务分布,发现你身边的机会',
    'home.categories.title': '热门分类',
    'home.categories.subtitle': '从学习到健身,从旅行到美食,总有一个适合你',
    'home.tasks.title': '最新任务',
    'home.tasks.subtitle': '实时更新的高赏金任务',
    'home.tasks.viewAll': '查看全部',
    'home.cta.title1': '准备好',
    'home.cta.title2': '开始你的第一个任务了吗?',
    'home.cta.subtitle': '加入数千名用户,一起完成目标,赚取赏金',
    'home.cta.button': '立即发布任务',
    
    // Categories
    'category.study': '学习',
    'category.fitness': '健身',
    'category.travel': '旅行',
    'category.food': '美食',
    'category.life': '生活',
    'category.skill': '技能',
    'category.other': '其他',
    'category.all': '全部',
    
    // Task
    'task.online': '线上',
    'task.offline': '线下',
    'task.oneTime': '单次',
    'task.recurring': '持续',
    'task.group': '小组',
    'task.cups': '杯币',
    
    // Task Market
    'market.title1': 'TASK',
    'market.title2': 'MARKET',
    'market.subtitle': '发现适合你的赏金任务,开启搭子之旅',
    'market.search': '搜索任务标题或描述...',
    'market.found': '找到',
    'market.tasks': '个任务',
    'market.create': '发布任务',
    'market.empty.title': '未找到任务',
    'market.empty.subtitle': '试试调整搜索条件或筛选器',
    'market.empty.button': '发布第一个任务',
    
    // Create Task
    'create.title1': 'CREATE',
    'create.title2': 'TASK',
    'create.subtitle': '设置赏金,找到完美搭子,一起完成目标',
    'create.form.title': '任务标题',
    'create.form.titlePlaceholder': '例如: 周末一起去爬山',
    'create.form.description': '任务描述',
    'create.form.descriptionPlaceholder': '详细描述任务内容、要求、注意事项等...',
    'create.form.category': '任务分类',
    'create.form.bounty': '赏金金额',
    'create.form.bountyPlaceholder': '100',
    'create.form.type': '任务类型',
    'create.form.typeOffline': '线下任务',
    'create.form.typeOnline': '线上任务',
    'create.form.location': '地点',
    'create.form.locationPlaceholder': '例如: 北京市朝阳区',
    'create.form.startTime': '开始时间',
    'create.form.endTime': '结束时间',
    'create.form.tags': '标签',
    'create.form.tagsPlaceholder': '用逗号分隔,例如: 户外,运动,周末',
    'create.form.submit': '发布任务',
    'create.form.submitting': '发布中...',
    'create.form.cancel': '取消',
    'create.tips.title': '💡 发布提示',
    'create.tips.1': '清晰描述任务内容和要求,提高匹配成功率',
    'create.tips.2': '合理设置赏金金额,吸引更多优质搭子',
    'create.tips.3': '任务发布后将进入托管流程,完成后自动释放赏金',
    'create.tips.4': '首次线下见面建议选择公共场所,注意安全',
    'create.login.title': '需要登录',
    'create.login.subtitle': '请先登录才能发布任务',
    'create.login.button': '登录账号',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.tasks': 'Tasks',
    'nav.create': 'Create',
    'nav.profile': 'Profile',
    
    // Home
    'home.hero.badge': '💰 Bounty Driven · Smart Matching · Escrow Protected',
    'home.hero.title1': 'BOUNTY',
    'home.hero.title2': 'BUDDY',
    'home.hero.subtitle': 'Incentivize action with task bounties, find companions through smart matching, build trust with escrow. Every goal deserves a perfect partner.',
    'home.hero.browse': 'Browse Tasks',
    'home.hero.create': 'Create Task',
    'home.stats.tasks': 'Active Tasks',
    'home.stats.bounty': 'Total Bounty',
    'home.stats.users': 'Active Users',
    'home.stats.rate': 'Completion Rate',
    'home.map.title': '🌍 Global Task Heatmap',
    'home.map.subtitle': 'Track task distribution in real-time, discover opportunities near you',
    'home.categories.title': 'Popular Categories',
    'home.categories.subtitle': 'From study to fitness, travel to food, there\'s something for everyone',
    'home.tasks.title': 'Latest Tasks',
    'home.tasks.subtitle': 'Real-time high-bounty tasks',
    'home.tasks.viewAll': 'View All',
    'home.cta.title1': 'Ready to',
    'home.cta.title2': 'start your first task?',
    'home.cta.subtitle': 'Join thousands of users, achieve goals together, earn bounties',
    'home.cta.button': 'Create Task Now',
    
    // Categories
    'category.study': 'Study',
    'category.fitness': 'Fitness',
    'category.travel': 'Travel',
    'category.food': 'Food',
    'category.life': 'Life',
    'category.skill': 'Skill',
    'category.other': 'Other',
    'category.all': 'All',
    
    // Task
    'task.online': 'Online',
    'task.offline': 'Offline',
    'task.oneTime': 'One-time',
    'task.recurring': 'Recurring',
    'task.group': 'Group',
    'task.cups': 'Cups',
    
    // Task Market
    'market.title1': 'TASK',
    'market.title2': 'MARKET',
    'market.subtitle': 'Discover bounty tasks that suit you, start your buddy journey',
    'market.search': 'Search task title or description...',
    'market.found': 'Found',
    'market.tasks': 'tasks',
    'market.create': 'Create Task',
    'market.empty.title': 'No Tasks Found',
    'market.empty.subtitle': 'Try adjusting search criteria or filters',
    'market.empty.button': 'Create First Task',
    
    // Create Task
    'create.title1': 'CREATE',
    'create.title2': 'TASK',
    'create.subtitle': 'Set bounty, find perfect buddy, achieve goals together',
    'create.form.title': 'Task Title',
    'create.form.titlePlaceholder': 'e.g., Weekend Hiking Together',
    'create.form.description': 'Task Description',
    'create.form.descriptionPlaceholder': 'Describe task details, requirements, notes...',
    'create.form.category': 'Category',
    'create.form.bounty': 'Bounty Amount',
    'create.form.bountyPlaceholder': '100',
    'create.form.type': 'Task Type',
    'create.form.typeOffline': 'Offline Task',
    'create.form.typeOnline': 'Online Task',
    'create.form.location': 'Location',
    'create.form.locationPlaceholder': 'e.g., Beijing Chaoyang District',
    'create.form.startTime': 'Start Time',
    'create.form.endTime': 'End Time',
    'create.form.tags': 'Tags',
    'create.form.tagsPlaceholder': 'Comma separated, e.g., outdoor, sports, weekend',
    'create.form.submit': 'Create Task',
    'create.form.submitting': 'Creating...',
    'create.form.cancel': 'Cancel',
    'create.tips.title': '💡 Tips',
    'create.tips.1': 'Clear description improves matching success rate',
    'create.tips.2': 'Reasonable bounty attracts quality buddies',
    'create.tips.3': 'Tasks enter escrow process, bounty released upon completion',
    'create.tips.4': 'First offline meeting in public places recommended',
    'create.login.title': 'Login Required',
    'create.login.subtitle': 'Please login to create tasks',
    'create.login.button': 'Login',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    // Update document lang attribute
    document.documentElement.lang = language;
    // Save to localStorage
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'zh' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.zh] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

