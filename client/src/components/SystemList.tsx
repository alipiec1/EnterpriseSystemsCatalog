import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Database, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { System } from "@shared/schema";

interface SystemListProps {
  onEditSystem: (system: System) => void;
  onViewSystem: (system: System) => void;
}

export default function SystemList({ onEditSystem, onViewSystem }: SystemListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: systems = [], isLoading, error } = useQuery<System[]>({
    queryKey: ['/api/systems'],
  });

  const filteredSystems = systems.filter(system => {
    const matchesSearch = system.system_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.system_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.business_steward_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.security_steward_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.technical_steward_full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || system.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: systems.length,
    active: systems.filter(s => s.status === 'active').length,
    pending: systems.filter(s => s.status === 'pending').length,
    stewards: new Set([
      ...systems.map(s => s.business_steward_email),
      ...systems.map(s => s.security_steward_email),
      ...systems.map(s => s.technical_steward_email)
    ]).size
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading systems</h3>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Systems Overview</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage and view all enterprise systems in your organization
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search systems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="active">Active Systems</SelectItem>
              <SelectItem value="inactive">Inactive Systems</SelectItem>
              <SelectItem value="pending">Pending Systems</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Systems</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-600">Active Systems</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.stewards}</p>
              <p className="text-sm text-gray-600">Total Stewards</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Systems Table */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Systems Catalog</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Steward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Security Steward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technical Steward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSystems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== "all" ? "No systems match your search criteria." : "No systems found. Create your first system to get started."}
                  </td>
                </tr>
              ) : (
                filteredSystems.map((system) => (
                  <tr key={system.system_id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{system.system_name}</div>
                          <div className="text-sm text-gray-500">{system.system_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.business_steward_full_name}</div>
                      <div className="text-sm text-gray-500">{system.business_steward_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.security_steward_full_name}</div>
                      <div className="text-sm text-gray-500">{system.security_steward_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.technical_steward_full_name}</div>
                      <div className="text-sm text-gray-500">{system.technical_steward_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        onClick={() => onViewSystem(system)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onEditSystem(system)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
