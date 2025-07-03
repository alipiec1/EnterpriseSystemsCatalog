import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { System } from "@shared/schema";
import { Database, Briefcase, Shield, Settings } from "lucide-react";

interface SystemDetailProps {
  isOpen: boolean;
  onClose: () => void;
  system: System | null;
  onEdit: (system: System) => void;
}

export default function SystemDetail({ isOpen, onClose, system, onEdit }: SystemDetailProps) {
  if (!system) return null;

  const handleEdit = () => {
    onEdit(system);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>System Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          {/* System Overview */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-semibold text-gray-900">{system.system_name}</h4>
              <p className="text-lg text-gray-600">{system.system_id}</p>
              <div className="mt-2">
                <Badge 
                  variant={system.status === 'active' ? 'default' : system.status === 'pending' ? 'secondary' : 'outline'}
                  className={
                    system.status === 'active' ? 'bg-green-100 text-green-800' :
                    system.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* System Description */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h5 className="text-lg font-medium text-gray-900 mb-3">Description</h5>
            <p className="text-gray-700 leading-relaxed">{system.system_description}</p>
          </div>

          {/* Stewards Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Business Steward */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h6 className="ml-3 text-lg font-medium text-gray-900">Business Steward</h6>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{system.business_steward_full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{system.business_steward_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Steward */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h6 className="ml-3 text-lg font-medium text-gray-900">Security Steward</h6>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{system.security_steward_full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{system.security_steward_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Steward */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-green-600" />
                  </div>
                  <h6 className="ml-3 text-lg font-medium text-gray-900">Technical Steward</h6>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{system.technical_steward_full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{system.technical_steward_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Metadata */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h5 className="text-lg font-medium text-gray-900 mb-4">System Metadata</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Created Date</p>
                <p className="font-medium text-gray-900">{formatDate(system.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Modified</p>
                <p className="font-medium text-gray-900">{formatDate(system.updated_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="font-medium text-gray-900">{system.status.charAt(0).toUpperCase() + system.status.slice(1)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">System ID</p>
                <p className="font-medium text-gray-900">{system.system_id}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
            Edit System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
