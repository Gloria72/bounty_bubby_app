import { drizzle } from "drizzle-orm/mysql2";
import { tasks } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database...");

  const sampleTasks = [
    {
      publisherId: 1,
      title: "周末一起去香山爬山",
      description: "想找个伙伴一起去香山爬山,呼吸新鲜空气,锻炼身体。计划早上8点出发,下午4点返回。",
      category: "fitness" as const,
      bountyAmount: 200,
      location: "北京市海淀区香山公园",
      latitude: "39.9926",
      longitude: "116.1886",
      isOnline: 0,
      startTime: new Date("2025-11-01T08:00:00"),
      endTime: new Date("2025-11-01T16:00:00"),
      tags: "户外,运动,周末",
      status: "open" as const,
    },
    {
      publisherId: 1,
      title: "一起学习React Native开发",
      description: "想找个小伙伴一起学习React Native,互相监督打卡,每周至少3次线上讨论。",
      category: "study" as const,
      bountyAmount: 500,
      isOnline: 1,
      taskType: "recurring" as const,
      tags: "编程,学习,技术",
      status: "open" as const,
    },
    {
      publisherId: 1,
      title: "寻找摄影搭子拍秋景",
      description: "秋天到了,想找个摄影爱好者一起去拍秋景。可以互相当模特,互相学习摄影技巧。",
      category: "travel" as const,
      bountyAmount: 300,
      location: "北京市朝阳区奥林匹克森林公园",
      latitude: "40.0031",
      longitude: "116.3897",
      isOnline: 0,
      tags: "摄影,户外,艺术",
      status: "open" as const,
    },
    {
      publisherId: 1,
      title: "组队打羽毛球",
      description: "羽毛球爱好者,想找2-3个小伙伴一起定期打球。每周两次,晚上7-9点。",
      category: "fitness" as const,
      bountyAmount: 150,
      participantCount: 3,
      location: "北京市朝阳区",
      isOnline: 0,
      taskType: "recurring" as const,
      tags: "运动,羽毛球,团队",
      status: "open" as const,
    },
    {
      publisherId: 1,
      title: "一起探店品尝网红美食",
      description: "喜欢美食的朋友,一起去探索北京的网红餐厅,分享美食体验。",
      category: "food" as const,
      bountyAmount: 250,
      location: "北京市三里屯",
      latitude: "39.9357",
      longitude: "116.4472",
      isOnline: 0,
      tags: "美食,探店,社交",
      status: "open" as const,
    },
    {
      publisherId: 1,
      title: "英语口语练习搭子",
      description: "每天晚上8点,线上英语口语练习30分钟,互相纠正发音,提高口语水平。",
      category: "skill" as const,
      bountyAmount: 400,
      isOnline: 1,
      taskType: "recurring" as const,
      tags: "英语,学习,口语",
      status: "open" as const,
    },
  ];

  for (const task of sampleTasks) {
    await db.insert(tasks).values(task);
  }

  console.log("✅ Seed data created successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});

