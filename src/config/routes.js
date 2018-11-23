/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:48:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-22 15:57:49
 * @Description: 路由配置文件
 */
import Loadable from 'react-loadable'
import DelayLoading from '@/components/DelayLoading'

// 业务管理
// 业务管理-变量管理
const Home = Loadable({ loader: () => import('@/routers/business/home'), loading: DelayLoading, delay: 3000 });
const Event = Loadable({ loader: () => import('@/routers/business/variable/event'), loading: DelayLoading, delay: 3000 });
const Batch = Loadable({ loader: () => import('@/routers/business/variable/batch'), loading: DelayLoading, delay: 3000 });
const RealTimeQuery = Loadable({ loader: () => import('@/routers/business/variable/real-time-query'), loading: DelayLoading, delay: 0 });
const RealTimeQuerySave = Loadable({ loader: () => import('@/routers/business/variable/real-time-query/Save'), loading: DelayLoading, delay: 3000 });
const Derivation = Loadable({ loader: () => import('@/routers/business/variable/derivation'), loading: DelayLoading, delay: 3000 });
const DerivationSaveFunc = Loadable({ loader: () => import('@/routers/business/variable/derivation/SaveFunc'), loading: DelayLoading, delay: 3000 });
const DerivationSaveCount = Loadable({ loader: () => import('@/routers/business/variable/derivation/SaveCount'), loading: DelayLoading, delay: 3000 });
const DerivationSaveRegular = Loadable({ loader: () => import('@/routers/business/variable/derivation/SaveRegular'), loading: DelayLoading, delay: 3000 });
// 业务管理
// 业务管理-策略管理
const Definition = Loadable({ loader: () => import('@/routers/business/strategy/definition'), loading: DelayLoading, delay: 3000 });
const DefinitionSave = Loadable({ loader: () => import('@/routers/business/strategy/definition/Save'), loading: DelayLoading, delay: 3000 });
const Rule = Loadable({ loader: () => import('@/routers/business/strategy/rule'), loading: DelayLoading, delay: 3000 });
const RuleSave = Loadable({ loader: () => import('@/routers/business/strategy/rule/Save'), loading: DelayLoading, delay: 3000 });
const RuleSet = Loadable({ loader: () => import('@/routers/business/strategy/rule-set'), loading: DelayLoading, delay: 3000 });
const RuleSetSave = Loadable({ loader: () => import('@/routers/business/strategy/rule-set/Save'), loading: DelayLoading, delay: 3000 });
const OutPut = Loadable({ loader: () => import('@/routers/business/strategy/output'), loading: DelayLoading, delay: 3000 });
const OutPutSave = Loadable({ loader: () => import('@/routers/business/strategy/output/Save'), loading: DelayLoading, delay: 3000 });
// 业务管理-模版管理
const Template = Loadable({ loader: () => import('@/routers/business/template'), loading: DelayLoading, delay: 3000 });
// 业务管理-审核管理
const Examine = Loadable({ loader: () => import('@/routers/business/examine'), loading: DelayLoading, delay: 3000 });
// 业务管理-测试管理
const Testing = Loadable({ loader: () => import('@/routers/business/testing'), loading: DelayLoading, delay: 3000 });

// 数据分析
// 数据分析-事件分析
const EventAnalysis = Loadable({ loader: () => import('@/routers/analysis/event/analysis'), loading: DelayLoading, delay: 3000 });
const EventDetails = Loadable({ loader: () => import('@/routers/analysis/event/details'), loading: DelayLoading, delay: 3000 });
const StrategyMonior = Loadable({ loader: () => import('@/routers/analysis/monitor'), loading: DelayLoading, delay: 3000 });
const StrategySimulation = Loadable({ loader: () => import('@/routers/analysis/simulation'), loading: DelayLoading, delay: 3000 });

const systemManagementTesting = Loadable({ loader: () => import('@/routers/system/testing'), loading: DelayLoading, delay: 3000 });

export default
    [{
        'path': '/business/home',
        'component': Home,
        'meta': {
            'title': '首页',
            'descript': '这里是首页首页首页首页首页',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '首页', 'path': null }]
        }
    }, {
        'path': '/business/variable/event',
        'component': Event,
        'meta': {
            'title': '事件变量',
            'descript': '展示了事件源报文协议字段和变量的关联关系，为系统自动自动生成',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '事件变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/batch',
        'component': Batch,
        'meta': {
            'title': '批次变量',
            'descript': '批次变量是由外部离线平台导入的变量，在业务的变量和规则的定义中会使用到',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '批次变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/derivation',
        'component': Derivation,
        'meta': {
            'title': '衍生变量',
            'descript': '根据已有变量制作新变量',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/real-time-query',
        'component': RealTimeQuery,
        'meta': {
            'title': '实时查询变量',
            'descript': '可引用事件变量和批次变量，也可查询当前事件源以外的其他数据表',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/real-time-query/save',//和下面加参数区别是生命周期的完全访问
        'component': RealTimeQuerySave,
        'meta': {
            'title': '实时查询变量',
            'descript': '正在编辑实时查询变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': '/business/variable/real-time-query' }, { 'name': '新增', 'path': null }],
        }
    },
    {
        'path': '/business/variable/real-time-query/save/:id',
        'component': RealTimeQuerySave,
        'meta': {
            'title': '实时查询变量',
            'descript': '正在编辑实时查询变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': '/business/variable/real-time-query' }, { 'name': '编辑', 'path': null }],
            'btns': [{name: '测试', icon: 'code'}, {name: '总览', icon: 'profile'}]
        }
    },
    {
        'path': '/business/strategy/rule/save',//和下面加参数区别是生命周期的完全访问
        'component': RuleSave,
        'meta': {
            'title': '规则定义',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'rule',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '规则定义', 'path': '/business/strategy/rule' }, { 'name': '新增', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule/save/:id',
        'component': RuleSave,
        'meta': {
            'title': '规则定义',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'rule',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '规则定义', 'path': '/business/strategy/rule' }, { 'name': '编辑', 'path': null }],
            'btns': [{name: '测试', icon: 'code'}, {name: '总览', icon: 'profile'}]
        }
    },
    {
        'path': '/business/variable/derivation/save-func/:id?',
        'component': DerivationSaveFunc,
        'meta': {
            'title': '衍生变量',
            'descript': '正在编辑函数变量',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': '/business/variable/derivation' }, { 'name': '函数变量编辑', 'path': null }]
        }
    },
    {
        'path': '/business/variable/derivation/save-count/:id?',
        'component': DerivationSaveCount,
        'meta': {
            'title': '衍生变量',
            'descript': '正在编辑计算变量',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': '/business/variable/derivation' }, { 'name': '计算变量编辑', 'path': null }]
        }
    },
    {
        'path': '/business/variable/derivation/save-regular/:id?',
        'component': DerivationSaveRegular,
        'meta': {
            'title': '衍生变量',
            'descript': '正在编辑正则变量',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': '/business/variable/derivation' }, { 'name': '正则变量编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/definition',
        'component': Definition,
        'meta': {
            'title': '策略定义',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '策略定义', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/definition/save/:type',
        'component': DefinitionSave,
        'meta': {
            'title': '策略定义',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'saveType': 'definition',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '策略定义', 'path': '/business/strategy/definition/' }, { 'name': '新增', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/definition/save/:type/:id',
        'component': DefinitionSave,
        'meta': {
            'title': '策略定义',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'saveType': 'definition',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '策略定义', 'path': '/business/strategy/definition/' }, { 'name': '编辑', 'path': null }],
            'btns': [{name: '测试', icon: 'code'}, {name: '总览', icon: 'profile'}]
        }
    },
    {
        'path': '/business/strategy/rule',
        'component': Rule,
        'meta': {
            'title': '规则定义',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '规则定义', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule-set',
        'component': RuleSet,
        'meta': {
            'title': '规则集定义',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '规则集定义', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule-set/save/:type/:id?',
        'component': RuleSetSave,
        'meta': {
            'title': '规则集定义',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '规则集定义', 'path': '/business/strategy/rule-set' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/output',
        'component': OutPut,
        'meta': {
            'title': '输出结果',
            'descript': '新建输出结果',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '输出结果', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/output/save/:id?',
        'component': OutPutSave,
        'meta': {
            'title': '输出结果',
            'descript': '新建输出结果',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '策略管理', 'path': null }, { 'name': '输出结果', 'path': '/business/strategy/output' }]
        }
    },
    {
        'path': '/business/template',
        'component': Template,
        'meta': {
            'title': '模版管理',
            'descript': '模版管理模版管理模版管理模版管理模版管理模版管理',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '模版管理', 'path': null }]
        }
    },
    {
        'path': '/business/examine',
        'component': Examine,
        'meta': {
            'title': '审核管理',
            'descript': '审核管理审核管理审核管理审核管理',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '审核管理', 'path': null }]
        }
    },
    {
        'path': '/business/testing',
        'component': Testing,
        'meta': {
            'title': '测试管理',
            'descript': '测试管理测试管理测试管理测试管理测试管理测试管理测试管理',
            'nav': [{ 'name': '业务管理', 'path': '/business/home' }, { 'name': '测试管理', 'path': null }]
        }
    },
    {
        'path': '/analysis/event/home',
        'component': EventAnalysis,
        'meta': {
            'title': '',
            'descript': '',
            'nav': []
        }
    }, 
    {
        'path': '/analysis/event/details',
        'component': EventDetails,
        'meta': {
            'title': '',
            'descript': '',
            'nav': []
        }
    }, 
    {
        'path': '/analysis/monitor',
        'component': StrategyMonior,
        'meta': {
            'title': '策略监控',
            'descript': '',
            'nav': [{ 'name': '数据分析', 'path': null }, { 'name': '策略监控', 'path': null },{ 'name': '详情', 'path': null }]
        }
    }, 
    {
        'path': '/analysis/simulation',
        'component': StrategySimulation,
        'meta': {
            'title': '策略模拟',
            'descript': '数据分析策略模拟',
            'nav': [{ 'name': '数据分析', 'path': null }, { 'name': '策略模拟', 'path': null }]
        }
    },
    {
        'path': '/system/testing',
        'component': systemManagementTesting,
        'meta': {
            'title': '首页',
            'descript': '系统管理首页首页首页首页首页首页首页首页首页首页',
            'nav': [{ 'name': '系统管理', 'path': '/system/testing' }, { 'name': '首页', 'path': null }]
        }
    }]