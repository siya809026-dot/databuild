import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useModelStore } from '../store/modelStore';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { models } = useModelStore();
  const userModels = models.filter((m) => m.userId === user?.id);

  const stats = [
    { label: 'Total Models', value: userModels.length, icon: '🏗️', color: 'bg-blue-50 border-blue-200' },
    { label: 'This Week', value: userModels.filter((m) => {
      const d = new Date(m.createdAt);
      const now = new Date();
      return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
    }).length, icon: '📅', color: 'bg-green-50 border-green-200' },
    { label: 'Avg Floors', value: userModels.length > 0 
      ? (userModels.reduce((sum, m) => sum + m.parameters.floors, 0) / userModels.length).toFixed(1) 
      : '0', icon: '🏢', color: 'bg-purple-50 border-purple-200' },
    { label: 'Roof Types', value: new Set(userModels.map((m) => m.parameters.roofType)).size, icon: '🏠', color: 'bg-orange-50 border-orange-200' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back, <span className="text-blue-600">{user?.name}</span>!
        </h1>
        <p className="text-slate-500 mt-1">Manage your 3D building models</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl border ${stat.color}`}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/create"
          className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Create New Model</h3>
              <p className="text-blue-200 mt-1">Design a new 3D building from scratch</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </Link>

        <Link
          to="/models"
          className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">View My Models</h3>
              <p className="text-purple-200 mt-1">{userModels.length} saved model{userModels.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Models */}
      {userModels.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Models</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {userModels.slice(-3).reverse().map((model) => (
              <Link
                key={model.id}
                to={`/models/${model.id}`}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: model.parameters.color }}>
                    <span className="text-white text-sm font-bold">{model.parameters.floors}F</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 truncate">{model.name}</h4>
                    <p className="text-xs text-slate-500">{model.parameters.floors} floors • {model.parameters.roofType} roof</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
