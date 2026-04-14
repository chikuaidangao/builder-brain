import React, { useState, useEffect } from 'react';

// 生成学习计划的逻辑函数
const generateStudyPlan = (goal, level, timePerDay, duration, style) => {
  // 解析学习目标关键词
  const goalLower = goal.toLowerCase();
  let subject = 'General';
  if (goalLower.includes('react')) subject = 'React';
  else if (goalLower.includes('javascript')) subject = 'JavaScript';
  else if (goalLower.includes('ielts')) subject = 'IELTS';
  else if (goalLower.includes('english')) subject = 'English';
  else if (goalLower.includes('design')) subject = 'Design';
  
  // 计算天数
  let days = 3;
  if (duration === '7 days') days = 7;
  else if (duration === '14 days') days = 14;
  
  // 计算每天任务数
  let tasksPerDay = 2;
  if (timePerDay === '1 hour') tasksPerDay = 3;
  else if (timePerDay === '2 hours') tasksPerDay = 4;
  
  // 生成每日计划
  const dailyPlans = [];
  for (let i = 1; i <= days; i++) {
    // 根据级别和天数调整内容
    let dayTheme = '';
    let tasks = [];
    
    if (subject === 'JavaScript') {
      if (i === 1) {
        dayTheme = 'Introduction to JavaScript';
        tasks = ['Learn basic syntax', 'Understand variables and data types'];
      } else if (i === 2) {
        dayTheme = 'Control Flow and Functions';
        tasks = ['Learn if statements and loops', 'Understand functions and scope'];
      } else if (i === 3) {
        dayTheme = 'Objects and Arrays';
        tasks = ['Learn object syntax', 'Understand array methods'];
      } else if (i === 4) {
        dayTheme = 'DOM Manipulation';
        tasks = ['Learn to select elements', 'Understand event handling'];
      } else if (i === 5) {
        dayTheme = 'Asynchronous JavaScript';
        tasks = ['Learn callbacks', 'Understand promises'];
      } else if (i === 6) {
        dayTheme = 'ES6+ Features';
        tasks = ['Learn arrow functions', 'Understand template literals'];
      } else {
        dayTheme = 'Project Practice';
        tasks = ['Build a small application', 'Review key concepts'];
      }
    } else if (subject === 'React') {
      if (i === 1) {
        dayTheme = 'React Fundamentals';
        tasks = ['Learn JSX syntax', 'Understand components'];
      } else if (i === 2) {
        dayTheme = 'Props and State';
        tasks = ['Learn to pass props', 'Understand state management'];
      } else if (i === 3) {
        dayTheme = 'Lifecycle Methods';
        tasks = ['Learn component lifecycle', 'Understand hooks basics'];
      } else if (i === 4) {
        dayTheme = 'Hooks in Depth';
        tasks = ['Learn useState', 'Understand useEffect'];
      } else if (i === 5) {
        dayTheme = 'Routing and Navigation';
        tasks = ['Learn React Router', 'Understand navigation flow'];
      } else if (i === 6) {
        dayTheme = 'State Management';
        tasks = ['Learn Context API', 'Understand useReducer'];
      } else {
        dayTheme = 'Project Development';
        tasks = ['Build a React application', 'Optimize performance'];
      }
    } else if (subject === 'IELTS') {
      if (i === 1) {
        dayTheme = 'Speaking Basics';
        tasks = ['Practice common topics', 'Learn pronunciation tips'];
      } else if (i === 2) {
        dayTheme = 'Speaking Strategies';
        tasks = ['Learn to structure answers', 'Practice fluency'];
      } else if (i === 3) {
        dayTheme = 'Vocabulary Building';
        tasks = ['Learn common IELTS words', 'Practice word usage'];
      } else if (i === 4) {
        dayTheme = 'Grammar Review';
        tasks = ['Practice complex sentences', 'Learn grammatical structures'];
      } else if (i === 5) {
        dayTheme = 'Mock Interviews';
        tasks = ['Practice full speaking test', 'Get feedback'];
      } else if (i === 6) {
        dayTheme = 'Topic Preparation';
        tasks = ['Research common topics', 'Prepare sample answers'];
      } else {
        dayTheme = 'Final Review';
        tasks = ['Practice under timed conditions', 'Review key strategies'];
      }
    } else {
      // 通用学习计划
      if (i === 1) {
        dayTheme = 'Foundation Building';
        tasks = ['Understand basic concepts', 'Set up learning environment'];
      } else if (i === 2) {
        dayTheme = 'Core Principles';
        tasks = ['Learn key fundamentals', 'Practice basic exercises'];
      } else if (i === 3) {
        dayTheme = 'Application Skills';
        tasks = ['Apply concepts to practice', 'Solve problems'];
      } else if (i === 4) {
        dayTheme = 'Advanced Topics';
        tasks = ['Explore advanced concepts', 'Deepen understanding'];
      } else if (i === 5) {
        dayTheme = 'Practice and Refinement';
        tasks = ['Practice with real-world examples', 'Refine skills'];
      } else if (i === 6) {
        dayTheme = 'Review and Consolidation';
        tasks = ['Review key points', 'Identify weak areas'];
      } else {
        dayTheme = 'Final Assessment';
        tasks = ['Test knowledge', 'Plan future learning'];
      }
    }
    
    // 根据学习风格调整任务
    if (style === 'Intensive') {
      tasks.push('Additional practice exercises');
      if (tasksPerDay > 2) tasks.push('Review previous material');
    } else if (style === 'Relaxed') {
      tasks = tasks.slice(0, Math.max(1, tasksPerDay - 1));
      tasks.push('Take breaks and reflect');
    }
    
    // 确保任务数量符合要求
    tasks = tasks.slice(0, tasksPerDay);
    
    dailyPlans.push({
      day: i,
      theme: dayTheme,
      tasks: tasks,
      focus: level === 'Beginner' ? 'Understanding' : level === 'Intermediate' ? 'Application' : 'Mastery',
      duration: timePerDay
    });
  }
  
  // 生成 AI 总结
  const intensity = style === 'Intensive' ? 'High' : style === 'Relaxed' ? 'Low' : 'Medium';
  const successRate = Math.floor(Math.random() * 10) + 85; // 85-94%
  const bestTime = '7:00 PM - 9:00 PM';
  
  // 生成 AI 提示
  const tips = [
    'Start with the hardest task first',
    'Spend 10 minutes reviewing yesterday\'s content',
    'Keep notes concise and practical'
  ];
  
  return {
    summary: {
      intensity,
      successRate,
      bestTime
    },
    dailyPlans,
    tips,
    progress: {
      completionRate: 0,
      difficultyLevel: level === 'Beginner' ? 'Easy' : level === 'Intermediate' ? 'Medium' : 'Hard',
      consistency: 'Maintain daily practice for best results'
    }
  };
};

const AIDailyStudyPlanner = () => {
  // 状态管理
  const [goal, setGoal] = useState('Learn JavaScript basics in 7 days');
  const [level, setLevel] = useState('Beginner');
  const [timePerDay, setTimePerDay] = useState('1 hour');
  const [duration, setDuration] = useState('7 days');
  const [style, setStyle] = useState('Efficient');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [expandedDays, setExpandedDays] = useState({});
  
  // 初始加载默认计划
  useEffect(() => {
    const defaultPlan = generateStudyPlan(
      'Learn JavaScript basics in 7 days',
      'Beginner',
      '1 hour',
      '7 days',
      'Efficient'
    );
    setPlan(defaultPlan);
  }, []);
  
  // 生成计划
  const handleGenerate = () => {
    setIsLoading(true);
    // 模拟加载延迟
    setTimeout(() => {
      const newPlan = generateStudyPlan(goal, level, timePerDay, duration, style);
      setPlan(newPlan);
      setIsLoading(false);
    }, 1000);
  };
  
  // 填充示例
  const handleFillExample = () => {
    setGoal('Learn JavaScript basics in 7 days');
    setLevel('Beginner');
    setTimePerDay('1 hour');
    setDuration('7 days');
    setStyle('Efficient');
  };
  
  // 切换每日计划展开/收起
  const toggleDay = (day) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 顶部标题 */}
      <header className="py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text mb-2">
            AI Daily Study Planner
          </h1>
          <p className="text-slate-600 text-lg">
            Your personalized AI-powered learning companion
          </p>
        </div>
      </header>
      
      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧输入面板 */}
          <div className="card glass-effect">
            <h2 className="text-2xl font-bold mb-6">Create Your Plan</h2>
            
            <div className="space-y-5">
              {/* 学习目标 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Learning Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Learn React in 7 days"
                />
              </div>
              
              {/* 当前水平 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="select-field"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Intermediate">Intermediate</option>
                </select>
              </div>
              
              {/* 每天可用时间 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Time per Day
                </label>
                <select
                  value={timePerDay}
                  onChange={(e) => setTimePerDay(e.target.value)}
                  className="select-field"
                >
                  <option value="30 mins">30 mins</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                </select>
              </div>
              
              {/* 学习周期 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="select-field"
                >
                  <option value="3 days">3 days</option>
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                </select>
              </div>
              
              {/* 学习风格 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Learning Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="select-field"
                >
                  <option value="Relaxed">Relaxed</option>
                  <option value="Efficient">Efficient</option>
                  <option value="Intensive">Intensive</option>
                </select>
              </div>
              
              {/* 按钮组 */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary w-full flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate Plan'
                  )}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFillExample}
                    className="btn btn-secondary"
                  >
                    Fill Example
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="btn btn-secondary"
                    disabled={isLoading}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧结果展示面板 */}
          <div className="space-y-6">
            {plan && (
              <>
                {/* AI 总结卡片 */}
                <div className="card bg-gradient-to-br from-indigo-500/5 to-purple-600/5 border border-indigo-500/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-3">AI Summary</h3>
                      <p className="text-slate-700 mb-4">
                        Your personalized study plan is ready. Based on your goal, current level, and time available, here is your optimized daily learning path.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Recommended intensity</p>
                          <p className="font-medium">{plan.summary.intensity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Estimated success rate</p>
                          <p className="font-medium">{plan.summary.successRate}%</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-slate-500">Best study time</p>
                          <p className="font-medium">{plan.summary.bestTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 每日计划卡片 */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Daily Plan</h3>
                  <div className="space-y-4">
                    {plan.dailyPlans.map((dayPlan) => (
                      <div 
                        key={dayPlan.day} 
                        className="card border border-slate-100 hover:border-primary/30"
                      >
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleDay(dayPlan.day)}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold mr-3">
                              {dayPlan.day}
                            </div>
                            <div>
                              <h4 className="font-bold">Day {dayPlan.day}</h4>
                              <p className="text-slate-600">{dayPlan.theme}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="badge bg-indigo-100 text-indigo-700">
                              {dayPlan.focus}
                            </span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-5 w-5 text-slate-500 transition-transform ${expandedDays[dayPlan.day] ? 'transform rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {expandedDays[dayPlan.day] && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="mb-3">
                              <p className="text-sm text-slate-500">Estimated duration</p>
                              <p className="font-medium">{dayPlan.duration}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 mb-2">Tasks:</p>
                              <ul className="space-y-2">
                                {dayPlan.tasks.map((task, index) => (
                                  <li key={index} className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-slate-700">{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 进度模块 */}
                <div className="card">
                  <h3 className="text-xl font-bold mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium text-slate-700">Plan completion rate</p>
                        <p className="text-sm font-medium text-indigo-500">{plan.progress.completionRate}%</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                          style={{ width: `${plan.progress.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Difficulty level</p>
                      <p className="font-medium">{plan.progress.difficultyLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Weekly consistency suggestion</p>
                      <p className="font-medium">{plan.progress.consistency}</p>
                    </div>
                  </div>
                </div>
                
                {/* AI 提示模块 */}
                <div className="card bg-gradient-to-br from-slate-50 to-slate-100">
                  <h3 className="text-xl font-bold mb-4">AI Tips</h3>
                  <ul className="space-y-3">
                    {plan.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-slate-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      {/* 页脚 */}
      <footer className="py-6 px-6 md:px-12 bg-white/50 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center text-slate-600 text-sm">
          <p>AI Daily Study Planner - Your personalized learning companion</p>
        </div>
      </footer>
    </div>
  );
};

export default AIDailyStudyPlanner;