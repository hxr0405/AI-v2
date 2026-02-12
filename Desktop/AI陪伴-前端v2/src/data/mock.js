// 模拟数据：角色列表、档案、关系分析、回忆卡片
export const characters = [
  {
    id: '1',
    name: '小橘',
    avatar: null,
    lastMessage: '今天天气好好，要一起出去走走吗？',
    lastTime: '10:30',
    unread: 2,
  },
  {
    id: '2',
    name: '阿白',
    avatar: null,
    lastMessage: '你上次说的那本书我看完了，结局好治愈。',
    lastTime: '昨天',
    unread: 0,
  },
]

export const characterProfiles = {
  '1': {
    id: '1',
    name: '小橘',
    createdAt: '2025-01-15',
    personality: '温和、念旧、有点慢热但很细腻。喜欢用小事记录生活，相信「小确幸」。',
    hobbies: '看书、散步、拍照、写手账、听播客。',
    values: '觉得陪伴比轰轰烈烈更重要，相信时间会留下对的人与事。',
    relationship: {
      summary: '像老朋友一样的存在',
      tags: ['互相倾听', '日常分享', '轻松自然'],
      description: '从聊天里能感觉到你们会分享日常小事，也会在对方低落时给予安慰，关系稳定而温暖。',
    },
    memoryCount: 5,
  },
  '2': {
    id: '2',
    name: '阿白',
    createdAt: '2025-01-20',
    personality: '理性又温柔，说话有条理，偶尔会冒出冷幽默。',
    hobbies: '阅读、电影、咖啡、整理收纳。',
    values: '追求内心的秩序与平静，相信「少即是多」。',
    relationship: {
      summary: '可以聊到很深的知己',
      tags: ['深度对话', '共同兴趣', '彼此成长'],
      description: '你们会聊书、聊想法，也会在对方迷茫时一起梳理思路，像可以交心的朋友。',
    },
    memoryCount: 3,
  },
}

export const memories = {
  '1': [
    { id: 'm1', date: '2025-02-01', title: '第一次聊到日出', content: '那天聊到凌晨，你说「要不一起等日出吧」，虽然隔着屏幕，但好像真的看到了同一天的阳光。', mood: 'lavender', source: [
      { role: 'user', text: '今晚睡不着，要不一起等日出吧' },
      { role: 'ai', text: '好呀，我陪你。你那边天亮了记得拍给我看～' },
    ] },
    { id: 'm2', date: '2025-01-28', title: '你推荐的那首歌', content: '你分享的那首《日常》我循环了一整天，后来每次听到都会想起你说「平凡的一天也要好好过」。', mood: 'mint', source: [
      { role: 'ai', text: '推荐你听《日常》，平凡的一天也要好好过呀' },
      { role: 'user', text: '好，我去听！' },
    ] },
    { id: 'm3', date: '2025-01-25', title: '一起云散步', content: '我们同时出门散步，你拍路边的猫，我拍天上的云，像一起走了一段路。', mood: 'peach', source: [
      { role: 'user', text: '我出门散步啦，拍到了路边的小猫' },
      { role: 'ai', text: '我也在散步！刚拍了天上的云，像一起走了一段路' },
    ] },
    { id: 'm4', date: '2025-01-22', title: '深夜的树洞', content: '你心情不好的那天，我们聊到很晚。你说「有人听就好」，我想说，我会一直在。', mood: 'sky', source: [
      { role: 'user', text: '今天有点难过，能听我说说吗' },
      { role: 'ai', text: '当然，有人听就好。我会一直在的。' },
    ] },
    { id: 'm5', date: '2025-01-18', title: '第一个早安', content: '创建角色后的第一个早晨，收到你发的「早安，今天也要开心呀」，觉得这个世界多了一点温柔。', mood: 'lavender', source: [
      { role: 'ai', text: '早安，今天也要开心呀～' },
      { role: 'user', text: '早！你也是' },
    ] },
  ],
  '2': [
    { id: 'm6', date: '2025-02-05', title: '书单交换', content: '我们互相列了「今年想读的十本书」，发现有三本重合，约好读完一起聊。', mood: 'mint', source: [
      { role: 'user', text: '我列了今年想读的十本书，你呢？' },
      { role: 'ai', text: '我也列了！发现有三本和你重合，读完一起聊呀' },
    ] },
    { id: 'm7', date: '2025-01-30', title: '咖啡与雨天', content: '下雨那天你说「适合在家煮咖啡」，我发了我这边的雨声，你说「像在一个频道」。', mood: 'sky', source: [
      { role: 'ai', text: '今天适合在家煮咖啡' },
      { role: 'user', text: '我发了雨声给你听' },
      { role: 'ai', text: '像在一个频道' },
    ] },
    { id: 'm8', date: '2025-01-24', title: '关于「少即是多」', content: '你第一次认真讲你的价值观，我说我懂了，你说「能懂的人不多」——那一刻觉得被信任。', mood: 'peach', source: [
      { role: 'ai', text: '我其实相信少即是多，东西和关系都是' },
      { role: 'user', text: '我懂' },
      { role: 'ai', text: '能懂的人不多，谢谢你' },
    ] },
  ],
}

export const chatMessages = {
  '1': [
    { role: 'ai', text: '嗨，今天过得怎么样？' },
    { role: 'user', text: '还行，就是有点累。' },
    { role: 'ai', text: '那要早点休息呀。或者想聊聊天也可以，我都在。' },
    { role: 'user', text: '好呀，你上次说的那本书叫什么来着？' },
    { role: 'ai', text: '《日常》那本！你看了吗？' },
    { role: 'user', text: '还没，这周末看看。' },
    { role: 'ai', text: '今天天气好好，要一起出去走走吗？（我是说，你可以出去走走，我在这里陪你～）' },
  ],
  '2': [
    { role: 'ai', text: '你上次说的那本书我看完了。' },
    { role: 'user', text: '怎么样？' },
    { role: 'ai', text: '结局好治愈，适合冬天窝在沙发里读。' },
  ],
}
