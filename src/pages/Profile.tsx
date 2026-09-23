import { useAuthStore } from '../store/authStore';
import { useModelStore } from '../store/modelStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { models } = useModelStore();
  const userModels = models.filter((m) => m.userId === user?.id);

  if (!user) return null;

  const totalFloors = userModels.reduce((sum, m) => sum + m.parameters.floors, 0);
  const avgWidth = userModels.length > 0 
    ? (userModels.reduce((sum, m) => sum + m.parameters.width, 0) / userModels.length).toFixed(1)
    : '0';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-500">{user.email}</p>
            <p className="text-sm text-slate-400 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{userModels.length}</div>
          <div className="text-sm text-slate-500">Total Models</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalFloors}</div>
          <div className="text-sm text-slate-500">Total Floors</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{avgWidth}m</div>
          <div className="text-sm text-slate-500">Avg Width</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {new Set(userModels.map((m) => m.parameters.roofType)).size}
          </div>
          <div className="text-sm text-slate-500">Roof Types</div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Account Information</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Name</span>
            <span className="font-medium text-slate-800">{user.name}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-800">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">User ID</span>
            <span className="font-mono text-sm text-slate-600">{user.id}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500">Member Since</span>
            <span className="font-medium text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a href="/models" className="flex-1 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition">
          View My Models
        </a>
        <button
          onClick={logout}
          className="py-3 px-6 border border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
