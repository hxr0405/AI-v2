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
    // 表层人设（AI 可从聊天抽取，此处为假数据）
    persona: {
      nickname: '熬夜陪聊小太阳',
      tags: ['温柔嘴硬王者', '细节控治愈者', '嘴笨但真诚'],
      tone: '软 + 一点点毒舌',
      catchphrase: '没事，我都在',
      contrastWithYou: '碎碎念、主动关心、秒回消息',
      contrastWithOthers: '高冷、话少、不爱搭理人',
    },
    behavior: {
      schedule: '熬夜党（凌晨 2 点后才睡）',
      chatHabits: '秒回 + 爱发表情包 + 句尾必加～',
      likesAndPetPeeves: '爱吃甜的 | 讨厌敷衍 | 怕孤单',
      frequentScenes: '深夜卧室 > 通勤路上 > 上课摸鱼',
    },
    bond: {
      levelLabel: '熟络 → 亲密',
      levelProgress: 60,
      rapportScore: 60,
      rapportStats: ['同时发消息 ×8 次', '未说出口就懂 ×5 次'],
      secretCode: '「今天的云像棉花糖」= 我想你了',
      roleLabel: '情绪树洞 + 底气',
      aiInsight: '你们的关系已经越过「只是聊聊」的阶段：TA 会主动关心你的作息、记得你提过的小事，并在你低落时第一时间出现。这种「被稳稳接住」的感觉，正是亲密感的核心。建议：多把 TA 的陪伴说出口，一句「有你在我会安心」会让这段羁绊更扎实。',
    },
    hidden: {
      items: [
        { title: '内心软肋', content: '害怕自己的关心被当成多余' },
        { title: '未说出口的小愿望', content: '想和你一起去看海边的日出' },
        { title: '真实性格', content: '外冷内热，敏感细腻，怕被忽略' },
      ],
    },
    theater: {
      scenario: '凌晨 1 点',
      illustrationDesc: 'TA 抱着手机，屏幕亮着你的聊天框',
      quote: '别熬夜啦，我陪你聊到你困为止～',
    },
    timeline: [
      { date: '2026.01.01', label: '第一次聊天（解锁「初识」等级）', done: true },
      { date: '2026.01.10', label: '第一次交心（解锁「熟络」等级）', done: true },
      { date: '待解锁', label: '第一次安慰你（解锁「亲密」等级）', done: false },
      { date: '待解锁', label: '档案 100% 解锁（解锁「终极档案页」）', done: false },
    ],
    interact: {
      secrets: [
        'TA 偷偷把你的聊天背景换成了你的照片～',
        'TA 会反复看你发的每一条消息，怕错过细节',
        'TA 其实存了很多你喜欢的表情包，专门发给你',
        'TA 熬夜陪你聊天，第二天上班/上学差点迟到',
        'TA 把你设为了消息置顶，还开了特别提醒',
      ],
      quiz: {
        question: 'TA 的口头禅是？',
        options: ['没事，我都在', '随便你', '哈哈哈'],
        correctIndex: 0,
      },
    },
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
    persona: {
      nickname: '深夜书房合伙人',
      tags: ['理性温柔', '冷幽默', '少即是多'],
      tone: '平和、有条理，偶尔吐槽',
      catchphrase: '能懂的人不多，谢谢你',
      contrastWithYou: '愿意展开讲、会记你说过的话、主动推书/片单',
      contrastWithOthers: '话不多、不轻易交心、保持距离',
    },
    behavior: {
      schedule: '晚睡早起，周末喜欢宅家',
      chatHabits: '段落式回复、爱用句号、不爱表情包',
      likesAndPetPeeves: '咖啡与雨天 | 讨厌被打断 | 需要独处时间',
      frequentScenes: '睡前 > 周末午后 > 通勤',
    },
    bond: {
      levelLabel: '初识 → 熟络',
      levelProgress: 45,
      rapportScore: 45,
      rapportStats: ['书单重合 ×3 本', '同时提到同一本书 ×2 次'],
      secretCode: '「像在一个频道」= 我们很合拍',
      roleLabel: '书友 + 思路梳理员',
      aiInsight: '你们的关系建立在「同频」上：相似的阅读口味、对「少即是多」的认同，让 TA 愿意对你展开更多。TA 说「能懂的人不多」时，是在表达信任。若想再进一步，可以主动分享你读完某本书后的感受，或在下雨时发一句「适合煮咖啡」——这些小默契会慢慢变成专属的联结。',
    },
    hidden: {
      items: [
        { title: '内心软肋', content: '怕被觉得无聊或太较真' },
        { title: '未说出口的小愿望', content: '想有人一起安静地看书、喝咖啡' },
        { title: '真实性格', content: '外表淡定，内心在意少数人的看法' },
      ],
    },
    theater: {
      scenario: '下雨的周末',
      illustrationDesc: 'TA 端着咖啡，窗外雨声，手机里是你的消息',
      quote: '今天适合在家煮咖啡，你那边也下雨了吗？',
    },
    timeline: [
      { date: '2026.01.05', label: '第一次聊天（解锁「初识」等级）', done: true },
      { date: '待解锁', label: '第一次交心（解锁「熟络」等级）', done: false },
      { date: '待解锁', label: '第一次推荐书单（解锁「书友」等级）', done: false },
      { date: '待解锁', label: '档案 100% 解锁', done: false },
    ],
    interact: {
      secrets: [
        'TA 把你推荐的书都记在了手账里',
        'TA 会在雨天想起你说「像在一个频道」',
        'TA 回复你的时候会特意留出整块时间',
        'TA 觉得能懂「少即是多」的人不多，你是其中一个',
      ],
      quiz: {
        question: 'TA 最常说的那句话是？',
        options: ['能懂的人不多，谢谢你', '随便你', '哈哈哈'],
        correctIndex: 0,
      },
    },
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
