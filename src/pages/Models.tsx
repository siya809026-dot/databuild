import { useAuthStore } from '../store/authStore';
import { useModelStore } from '../store/modelStore';
import ModelCard from '../components/ModelCard';

export default function Models() {
  const { user } = useAuthStore();
  const { models, deleteModel, duplicateModel } = useModelStore();
  const userModels = models.filter((m) => m.userId === user?.id);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      deleteModel(id);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateModel(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Models</h1>
          <p className="text-slate-500 mt-1">{userModels.length} saved model{userModels.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {userModels.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🏗️</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No models yet</h3>
          <p className="text-slate-500 mb-6">Create your first 3D building model to get started!</p>
          <a
            href="/create"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
          >
            Create Your First Model
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
