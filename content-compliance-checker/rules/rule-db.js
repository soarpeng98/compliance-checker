// ============================================================
// AI内容合规检测 - 违禁词规则数据库
// 数据来源：广告法、各行业监管规范、平台规则
// ============================================================

const RULES = {
  // ==================== 通用广告法违禁词 ====================
  general: {
    name: "通用广告法",
    icon: "⚖️",
    words: [
      // 极限用语
      { word:"最好", severity:"error", suggest:"优质 / 出色", desc:"广告法禁止使用绝对化用语" },
      { word:"最佳", severity:"error", suggest:"优秀 / 出众", desc:"广告法禁止使用绝对化用语" },
      { word:"第一", severity:"error", suggest:"领先", desc:"广告法禁止使用绝对化用语" },
      { word:"唯一", severity:"error", suggest:"独特", desc:"广告法禁止使用绝对化用语" },
      { word:"首个", severity:"error", suggest:"率先", desc:"广告法禁止使用绝对化用语" },
      { word:"首选", severity:"error", suggest:"推荐 / 热门", desc:"广告法禁止使用绝对化用语" },
      { word:"顶级", severity:"error", suggest:"优质 / 高端", desc:"广告法禁止使用绝对化用语" },
      { word:"最高", severity:"error", suggest:"较高", desc:"广告法禁止使用绝对化用语" },
      { word:"最低", severity:"error", suggest:"实惠 / 优惠", desc:"广告法禁止使用绝对化用语" },
      { word:"最具", severity:"error", suggest:"很有", desc:"广告法禁止使用绝对化用语" },
      { word:"绝对", severity:"error", suggest:"非常", desc:"广告法禁止使用绝对化用语" },
      { word:"100%", severity:"error", suggest:"高达99%", desc:"广告法禁止使用绝对化用语" },
      { word:"百分百", severity:"error", suggest:"高比例", desc:"广告法禁止使用绝对化用语" },
      { word:"全网第一", severity:"error", suggest:"深受欢迎", desc:"广告法禁止使用绝对化用语" },
      { word:"销量第一", severity:"error", suggest:"销量领先", desc:"广告法禁止使用绝对化用语" },
      { word:"排名第一", severity:"error", suggest:"排名前列", desc:"广告法禁止使用绝对化用语" },
      { word:"独一无二", severity:"error", suggest:"独具特色", desc:"广告法禁止使用绝对化用语" },
      { word:"绝无仅有", severity:"error", suggest:"少见 / 难得", desc:"广告法禁止使用绝对化用语" },
      { word:"万能", severity:"error", suggest:"多功能 / 实用", desc:"广告法禁止使用绝对化用语" },
      { word:"极致", severity:"error", suggest:"出色 / 优秀", desc:"广告法禁止使用绝对化用语" },
      { word:"巅峰", severity:"error", suggest:"高端", desc:"广告法禁止使用绝对化用语" },
      { word:"至尊", severity:"error", suggest:"尊享", desc:"广告法禁止使用绝对化用语" },
      { word:"之王", severity:"error", suggest:"优选", desc:"广告法禁止使用绝对化用语" },
      { word:"王牌", severity:"error", suggest:"精品", desc:"广告法禁止使用绝对化用语" },
      { word:"冠军", severity:"error", suggest:"优秀", desc:"广告法禁止使用绝对化用语" },
      // 权威性词语
      { word:"国家级", severity:"error", suggest:"优质", desc:"非官方认证不得使用" },
      { word:"世界级", severity:"error", suggest:"国际水准", desc:"避免夸大宣传" },
      { word:"最高级", severity:"error", suggest:"高级", desc:"避免夸大宣传" },
      { word:"政府推荐", severity:"error", suggest:"广受好评", desc:"禁止借政府名义宣传" },
      { word:"国家免检", severity:"error", suggest:"品质保障", desc:"该认证已取消" },
      { word:"央视推荐", severity:"error", suggest:"媒体关注", desc:"非官方背书不得使用" },
      { word:"人民大会堂", severity:"error", suggest:"", desc:"禁止借国家机关宣传" },
      // 欺诈性用语
      { word:"包治百病", severity:"error", suggest:"", desc:"严重违规" },
      { word:"永不复发", severity:"error", suggest:"", desc:"严重违规" },
      { word:"药到病除", severity:"error", suggest:"", desc:"严重违规" },
      { word:"一针见效", severity:"error", suggest:"", desc:"严重违规" },
      { word:"立刻见效", severity:"error", suggest:"快速起效", desc:"夸大宣传" },
      { word:"马上变白", severity:"error", suggest:"提亮肤色", desc:"夸大宣传" },
      { word:"三天瘦", severity:"error", suggest:"科学减重", desc:"夸大宣传" },
      { word:"不反弹", severity:"error", suggest:"效果持久", desc:"夸大宣传" },
      { word:"立竿见影", severity:"error", suggest:"效果明显", desc:"夸大宣传" },
      { word:"一次根治", severity:"error", suggest:"", desc:"严重违规" },
    ]
  },

  // ==================== 美妆/化妆品 ====================
  beauty: {
    name: "美妆护肤",
    icon: "💄",
    words: [
      // 医疗效果宣称（化妆品禁用）
      { word:"消炎", severity:"error", suggest:"舒缓", desc:"化妆品不得宣称医疗效果" },
      { word:"抗敏", severity:"error", suggest:"温和", desc:"化妆品不得宣称医疗效果" },
      { word:"脱敏", severity:"error", suggest:"舒缓", desc:"化妆品不得宣称医疗效果" },
      { word:"修复", severity:"error", suggest:"修护", desc:"化妆品慎用医疗术语" },
      { word:"再生", severity:"error", suggest:"焕活", desc:"化妆品不得宣称医疗效果" },
      { word:"治愈", severity:"error", suggest:"改善", desc:"化妆品不得宣称医疗效果" },
      { word:"治疗", severity:"error", suggest:"改善", desc:"化妆品不得宣称医疗效果" },
      { word:"抗炎", severity:"error", suggest:"舒缓", desc:"化妆品不得宣称医疗效果" },
      { word:"杀菌", severity:"error", suggest:"清洁", desc:"化妆品不得宣称医疗效果" },
      { word:"抑菌", severity:"error", suggest:"清爽", desc:"化妆品不得宣称医疗效果" },
      { word:"排毒", severity:"error", suggest:"净化", desc:"化妆品不得宣称医疗效果" },
      { word:"祛斑", severity:"error", suggest:"淡斑 / 匀净肤色", desc:"特殊用途需备案" },
      { word:"美白", severity:"warning", suggest:"提亮 / 匀亮", desc:"特殊用途化妆品需备案" },
      { word:"防晒", severity:"warning", suggest:"防护紫外线", desc:"特殊用途化妆品需备案" },
      { word:"祛痘", severity:"error", suggest:"控油 / 清痘", desc:"特殊用途需备案" },
      { word:"无添加", severity:"warning", suggest:"成分精简", desc:"需注明具体未添加成分" },
      { word:"纯天然", severity:"warning", suggest:"天然成分", desc:"化妆品不可能100%纯天然" },
      { word:"有机", severity:"warning", suggest:"天然植萃", desc:"需有有机认证" },
      { word:"医美级", severity:"error", suggest:"院线品质", desc:"化妆品不得宣称医疗级别" },
      { word:"药妆", severity:"error", suggest:"功效护肤", desc:"中国禁止药妆宣称" },
      { word:"干细胞", severity:"error", suggest:"", desc:"化妆品禁用干细胞宣称" },
      { word:"基因修复", severity:"error", suggest:"", desc:"化妆品禁用基因相关宣称" },
      { word:"28天换肤", severity:"warning", suggest:"持续使用可改善", desc:"避免绝对承诺" },
      // 淘宝/抖音等平台特殊限制
      { word:"刷酸", severity:"error", suggest:"焕肤", desc:"平台禁用词" },
      { word:"微针", severity:"error", suggest:"", desc:"平台禁用词" },
      { word:"溶脂", severity:"error", suggest:"", desc:"平台禁用词" },
      { word:"水光", severity:"error", suggest:"水润", desc:"平台禁用词" },
      { word:"线雕", severity:"error", suggest:"", desc:"平台禁用词" },
    ]
  },

  // ==================== 食品/保健品 ====================
  food: {
    name: "食品保健",
    icon: "🍎",
    words: [
      // 医疗宣称（食品绝对禁止）
      { word:"治疗", severity:"error", suggest:"", desc:"食品不得宣称治疗功效" },
      { word:"预防疾病", severity:"error", suggest:"", desc:"食品不得宣称预防疾病" },
      { word:"抗癌", severity:"error", suggest:"", desc:"严重违规" },
      { word:"防癌", severity:"error", suggest:"", desc:"严重违规" },
      { word:"抗肿瘤", severity:"error", suggest:"", desc:"严重违规" },
      { word:"降血压", severity:"error", suggest:"", desc:"食品不得宣称医疗功效" },
      { word:"降血糖", severity:"error", suggest:"", desc:"食品不得宣称医疗功效" },
      { word:"降血脂", severity:"error", suggest:"", desc:"食品不得宣称医疗功效" },
      { word:"排毒", severity:"error", suggest:"促进代谢", desc:"食品不得宣称排毒" },
      { word:"清肠", severity:"error", suggest:"促进消化", desc:"食品不得宣称医疗功效" },
      { word:"通便", severity:"warning", suggest:"促进肠道蠕动", desc:"保健食品需有批号" },
      { word:"减肥", severity:"error", suggest:"体重管理", desc:"食品不得宣称减肥功效" },
      { word:"燃脂", severity:"error", suggest:"", desc:"食品不得宣称燃脂" },
      { word:"瘦身", severity:"error", suggest:"体态管理", desc:"食品不得宣称瘦身" },
      { word:"减脂", severity:"error", suggest:"维持健康体态", desc:"食品不得宣称减脂" },
      { word:"补肾", severity:"error", suggest:"", desc:"食品不得宣称医疗功效" },
      { word:"壮阳", severity:"error", suggest:"", desc:"严重违规" },
      { word:"护肝", severity:"warning", suggest:"", desc:"保健食品需有批号" },
      { word:"增强免疫力", severity:"warning", suggest:"", desc:"保健食品需有批号" },
      { word:"延年益寿", severity:"error", suggest:"", desc:"夸大宣传" },
      { word:"抗衰老", severity:"error", suggest:"保持年轻态", desc:"食品不得宣称抗衰老" },
      { word:"老少皆宜", severity:"warning", suggest:"适合多数人群", desc:"食品需注明适用人群" },
      { word:"纯天然无添加", severity:"warning", suggest:"0添加防腐剂", desc:"需具体说明" },
      { word:"0糖0脂0卡", severity:"warning", suggest:"低糖低脂", desc:"需有检测报告支持" },
    ]
  },

  // ==================== 医疗健康 ====================
  medical: {
    name: "医疗健康",
    icon: "🏥",
    words: [
      { word:"保证治愈", severity:"error", suggest:"", desc:"医疗广告禁止保证疗效" },
      { word:"包治", severity:"error", suggest:"", desc:"医疗广告禁止保证疗效" },
      { word:"根治", severity:"error", suggest:"有效治疗", desc:"医疗广告禁止保证根治" },
      { word:"永不复发", severity:"error", suggest:"", desc:"严重违规" },
      { word:"无副作用", severity:"error", suggest:"副作用小", desc:"药物不可能无副作用" },
      { word:"安全无毒", severity:"error", suggest:"安全性高", desc:"避免绝对安全宣称" },
      { word:"最先进", severity:"error", suggest:"先进", desc:"避免绝对化用语" },
      { word:"最高技术", severity:"error", suggest:"成熟技术", desc:"避免绝对化用语" },
      { word:"毫无痛苦", severity:"error", suggest:"微创 / 舒适", desc:"避免绝对化" },
      { word:"立马见效", severity:"error", suggest:"", desc:"夸大宣传" },
      { word:"药到病除", severity:"error", suggest:"", desc:"夸大宣传" },
      { word:"祖传秘方", severity:"error", suggest:"", desc:"禁止以祖传名义宣传" },
      { word:"偏方", severity:"error", suggest:"", desc:"禁止宣传偏方" },
      { word:"神医", severity:"error", suggest:"", desc:"禁止神化医生" },
      { word:"妙手回春", severity:"error", suggest:"医术精湛", desc:"避免夸大宣传" },
      { word:"专家推荐", severity:"warning", suggest:"医生认可", desc:"需有真实背书" },
      { word:"治愈率", severity:"error", suggest:"", desc:"医疗广告禁止提治愈率" },
      { word:"有效率", severity:"error", suggest:"", desc:"医疗广告禁止提有效率" },
    ]
  },

  // ==================== 金融理财 ====================
  finance: {
    name: "金融理财",
    icon: "💰",
    words: [
      { word:"保本", severity:"error", suggest:"", desc:"理财产品不得承诺保本" },
      { word:"保本保息", severity:"error", suggest:"", desc:"严重违规" },
      { word:"无风险", severity:"error", suggest:"低风险", desc:"投资不存在无风险" },
      { word:"零风险", severity:"error", suggest:"风险可控", desc:"投资不存在零风险" },
      { word:"稳赚", severity:"error", suggest:"", desc:"理财产品不得保证收益" },
      { word:"稳赚不赔", severity:"error", suggest:"", desc:"严重违规" },
      { word:"收益翻倍", severity:"error", suggest:"可观收益", desc:"不得承诺收益倍数" },
      { word:"翻番", severity:"error", suggest:"", desc:"不得承诺收益翻倍" },
      { word:"收益率最高", severity:"error", suggest:"收益率较高", desc:"避免绝对化" },
      { word:"年化率100%", severity:"error", suggest:"", desc:"严重违规" },
      { word:"躺着赚钱", severity:"error", suggest:"轻松理财", desc:"误导性宣传" },
      { word:"一夜暴富", severity:"error", suggest:"", desc:"严重违规" },
      { word:"只赚不亏", severity:"error", suggest:"", desc:"严重违规" },
      { word:"内幕消息", severity:"error", suggest:"", desc:"违法" },
      { word:"绝对安全", severity:"error", suggest:"安全可靠", desc:"避免绝对化" },
      { word:"国家认证", severity:"warning", suggest:"合规经营", desc:"需有真实资质" },
      { word:"央行授权", severity:"warning", suggest:"", desc:"需有真实授权" },
    ]
  },

  // ==================== 教育培训 ====================
  education: {
    name: "教育培训",
    icon: "📚",
    words: [
      { word:"保过", severity:"error", suggest:"高通过率", desc:"不得承诺考试结果" },
      { word:"包过", severity:"error", suggest:"高效备考", desc:"不得承诺考试结果" },
      { word:"包拿证", severity:"error", suggest:"助你取证", desc:"不得承诺证书获取" },
      { word:"100%通过", severity:"error", suggest:"通过率高", desc:"不得承诺通过率" },
      { word:"提分百分百", severity:"error", suggest:"显著提分", desc:"不得承诺提分幅度" },
      { word:"名师", severity:"warning", suggest:"资深教师", desc:"需有真实资质" },
      { word:"命题组", severity:"error", suggest:"", desc:"不得借命题组名义宣传" },
      { word:"出题人", severity:"error", suggest:"", desc:"不得借出题人名义宣传" },
      { word:"原题押中", severity:"error", suggest:"考点覆盖", desc:"不得宣称押题" },
      { word:"精准预测", severity:"warning", suggest:"趋势分析", desc:"避免承诺预测准确" },
      { word:"零基础包会", severity:"error", suggest:"零基础可学", desc:"不得承诺学习结果" },
      { word:"速成", severity:"warning", suggest:"高效学习", desc:"避免速成类表述" },
      { word:"几天学会", severity:"warning", suggest:"快速入门", desc:"避免具体天数承诺" },
      { word:"官方合作", severity:"warning", suggest:"", desc:"需有真实合作关系" },
      { word:"教育部认证", severity:"error", suggest:"", desc:"非官方不得宣称教育部认证" },
    ]
  },

  // ==================== 电商通用 ====================
  ecommerce: {
    name: "电商通用",
    icon: "🛒",
    words: [
      { word:"原单", severity:"error", suggest:"品质优选", desc:"平台禁用词" },
      { word:"尾单", severity:"error", suggest:"", desc:"平台禁用词" },
      { word:"外贸原单", severity:"error", suggest:"", desc:"平台禁用词" },
      { word:"高仿", severity:"error", suggest:"", desc:"平台禁用词，侵权" },
      { word:"A货", severity:"error", suggest:"", desc:"平台禁用词，侵权" },
      { word:"1:1", severity:"error", suggest:"", desc:"平台禁用词" },
      { word:"大牌同款", severity:"warning", suggest:"时尚同款", desc:"避免品牌侵权" },
      { word:"明星同款", severity:"warning", suggest:"时尚同款", desc:"避免肖像权风险" },
      { word:"专柜正品", severity:"warning", suggest:"正品保障", desc:"需有授权证明" },
      { word:"假一赔十", severity:"warning", suggest:"正品承诺", desc:"需有赔偿能力" },
      { word:"亏本", severity:"warning", suggest:"实惠", desc:"避免误导" },
      { word:"亏本清仓", severity:"warning", suggest:"限时优惠", desc:"避免误导" },
      { word:"跳楼价", severity:"error", suggest:"优惠价", desc:"平台禁用词" },
      { word:"血亏", severity:"error", suggest:"超值", desc:"平台禁用词" },
      { word:"最后一天", severity:"warning", suggest:"限时活动", desc:"避免虚假紧迫感" },
      { word:"随时涨价", severity:"warning", suggest:"价格可能调整", desc:"避免威胁式营销" },
    ]
  },

  // ==================== 直播用语 ====================
  livestream: {
    name: "直播带货",
    icon: "📱",
    words: [
      { word:"绝对最低价", severity:"error", suggest:"好价入手", desc:"违反广告法+平台规则" },
      { word:"全网最低", severity:"error", suggest:"实惠价", desc:"违反广告法" },
      { word:"史低价", severity:"error", suggest:"超值价", desc:"平台禁用词" },
      { word:"破价", severity:"error", suggest:"惊喜价", desc:"平台禁用词" },
      { word:"厂家直销", severity:"warning", suggest:"源头供货", desc:"需有厂家授权" },
      { word:"不赚钱", severity:"warning", suggest:"薄利多销", desc:"避免误导" },
      { word:"这价格疯了", severity:"warning", suggest:"价格很惊喜", desc:"避免夸张" },
      { word:"抢到就是赚到", severity:"warning", suggest:"机会难得", desc:"避免诱导" },
      { word:"限购", severity:"warning", suggest:"", desc:"需真实限量" },
      { word:"再不买就没了", severity:"warning", suggest:"库存有限", desc:"避免威胁式营销" },
    ]
  }
};

// ==================== 导出 ====================
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RULES };
}
