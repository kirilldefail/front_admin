import { useState } from 'react';
import { AdminHeader } from './components/admin-header';
import { ApplicationsList } from './components/applications-list';
import { AddApplicationForm } from './components/add-application-form';

interface Application {
  id: number;
  name: string;
  package: string;
  description: string;
  version: string;
  category: string;
  size: string;
  osVersion: string;
  status: string;
  website?: string;
  license?: string;
  changelog?: string;
  tags?: string[];
  analogs?: string[];
}

export default function App() {
  const [activeView, setActiveView] = useState<'list' | 'add'>('list');
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);

  const handleEdit = (app: Application) => {
    setEditingApplication(app);
    setActiveView('add');
  };

  const handleCancelEdit = () => {
    setEditingApplication(null);
    setActiveView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader activeView={activeView} onViewChange={setActiveView} />
      
      <main>
        {activeView === 'list' ? (
          <ApplicationsList 
            onAddNew={() => {
              setEditingApplication(null);
              setActiveView('add');
            }}
            onEdit={handleEdit}
          />
        ) : (
          <AddApplicationForm 
            onCancel={handleCancelEdit}
            editingApplication={editingApplication}
          />
        )}
      </main>
    </div>
  );
}
