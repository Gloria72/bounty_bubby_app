import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { tasksApi, Task } from '../api/client';
import { colors, spacing, borderRadius, fontSize } from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await tasksApi.list();
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: '学习', icon: '📚', value: 'study' },
    { name: '健身', icon: '💪', value: 'fitness' },
    { name: '旅行', icon: '✈️', value: 'travel' },
    { name: '美食', icon: '🍜', value: 'food' },
    { name: '生活', icon: '🏠', value: 'life' },
    { name: '技能', icon: '🎯', value: 'skill' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>💰 赏金驱动 · 智能匹配</Text>
        </View>
        <Text style={styles.heroTitle}>找到你的{'\n'}完美搭子</Text>
        <Text style={styles.heroSubtitle}>
          用赏金激励行动,用匹配找到伙伴,用托管建立信任
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{tasks.length}</Text>
          <Text style={styles.statLabel}>活跃任务</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>¥128K</Text>
          <Text style={styles.statLabel}>赏金总额</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>94%</Text>
          <Text style={styles.statLabel}>完成率</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>热门分类</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Tasks', { category: category.value })}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最新任务</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
            <Text style={styles.seeAll}>查看全部 →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : tasks.length > 0 ? (
          <View style={styles.tasksContainer}>
            {tasks.slice(0, 6).map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => navigation.navigate('TaskDetail', { id: task.id })}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.taskCategory}>
                    <Text style={styles.taskCategoryText}>
                      {getCategoryName(task.category)}
                    </Text>
                  </View>
                  <Text style={styles.taskLocation}>
                    {task.isOnline ? '🌐 线上' : `📍 ${task.location || '待定'}`}
                  </Text>
                </View>
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {task.title}
                </Text>
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {task.description}
                </Text>
                <View style={styles.taskFooter}>
                  <View style={styles.bountyContainer}>
                    <Text style={styles.bountyIcon}>💰</Text>
                    <Text style={styles.bountyAmount}>¥{task.bountyAmount}</Text>
                  </View>
                  <Text style={styles.taskType}>
                    {task.taskType === 'oneTime' ? '单次' : task.taskType === 'recurring' ? '持续' : '小组'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>暂无任务</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function getCategoryName(category: string) {
  const map: Record<string, string> = {
    study: '学习',
    fitness: '健身',
    travel: '旅行',
    food: '美食',
    life: '生活',
    skill: '技能',
    other: '其他',
  };
  return map[category] || category;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  badgeText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: fontSize.xxxl + 8,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.md,
    lineHeight: 48,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.foregroundMuted,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.foregroundMuted,
  },
  section: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.sm,
    color: colors.foreground,
    fontWeight: '600',
  },
  tasksContainer: {
    gap: spacing.md,
  },
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskCategory: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  taskCategoryText: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  taskLocation: {
    fontSize: fontSize.xs,
    color: colors.foregroundMuted,
  },
  taskTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  taskDescription: {
    fontSize: fontSize.sm,
    color: colors.foregroundMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  bountyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bountyIcon: {
    fontSize: fontSize.md,
  },
  bountyAmount: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  taskType: {
    fontSize: fontSize.xs,
    color: colors.foregroundMuted,
  },
  loader: {
    marginVertical: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.foregroundMuted,
  },
});

