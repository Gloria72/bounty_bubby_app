import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { tasksApi, Task } from '../api/client';
import { colors, spacing, borderRadius, fontSize } from '../theme/colors';

export default function TasksScreen({ navigation, route }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    route.params?.category || null
  );

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
    { name: '全部', value: null },
    { name: '学习', value: 'study' },
    { name: '健身', value: 'fitness' },
    { name: '旅行', value: 'travel' },
    { name: '美食', value: 'food' },
    { name: '生活', value: 'life' },
    { name: '技能', value: 'skill' },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>任务广场</Text>
        <Text style={styles.headerSubtitle}>发现适合你的赏金任务</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索任务..."
          placeholderTextColor={colors.foregroundMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value || 'all'}
            style={[
              styles.categoryChip,
              selectedCategory === category.value && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.value && styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          找到 <Text style={styles.resultsNumber}>{filteredTasks.length}</Text> 个任务
        </Text>
      </View>

      {/* Task List */}
      <ScrollView style={styles.tasksList} contentContainerStyle={styles.tasksContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
              <Text style={styles.taskDescription} numberOfLines={3}>
                {task.description}
              </Text>
              <View style={styles.taskFooter}>
                <View style={styles.bountyContainer}>
                  <Text style={styles.bountyIcon}>💰</Text>
                  <Text style={styles.bountyAmount}>¥{task.bountyAmount}</Text>
                </View>
                <Text style={styles.taskType}>
                  {task.taskType === 'oneTime'
                    ? '单次'
                    : task.taskType === 'recurring'
                    ? '持续'
                    : '小组'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>未找到任务</Text>
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory
                ? '试试调整搜索条件或筛选器'
                : '暂时没有可用的任务'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.card + '80',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.foregroundMuted,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  searchIcon: {
    fontSize: fontSize.lg,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.foreground,
    paddingVertical: spacing.md,
  },
  categoriesScroll: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.foreground,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: colors.backgroundDark,
  },
  resultsHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  resultsCount: {
    fontSize: fontSize.sm,
    color: colors.foregroundMuted,
  },
  resultsNumber: {
    color: colors.foreground,
    fontWeight: '600',
  },
  tasksList: {
    flex: 1,
  },
  tasksContent: {
    padding: spacing.md,
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
    marginTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.foregroundMuted,
    textAlign: 'center',
  },
});

