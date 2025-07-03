import { useState } from "react";
import Layout from "@/components/Layout";
import SystemList from "@/components/SystemList";
import SystemForm from "@/components/SystemForm";
import SystemDetail from "@/components/SystemDetail";
import { System } from "@shared/schema";

export default function Dashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);

  const handleCreateSystem = () => {
    setEditingSystem(null);
    setIsFormOpen(true);
  };

  const handleEditSystem = (system: System) => {
    setEditingSystem(system);
    setIsFormOpen(true);
  };

  const handleViewSystem = (system: System) => {
    setSelectedSystem(system);
    setIsDetailOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSystem(null);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedSystem(null);
  };

  return (
    <Layout onCreateSystem={handleCreateSystem}>
      <SystemList 
        onEditSystem={handleEditSystem}
        onViewSystem={handleViewSystem}
      />
      
      <SystemForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingSystem={editingSystem}
      />
      
      <SystemDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        system={selectedSystem}
        onEdit={handleEditSystem}
      />
    </Layout>
  );
}
