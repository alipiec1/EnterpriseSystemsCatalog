import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { insertSystemSchema, InsertSystem, System } from "@shared/schema";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface SystemFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingSystem?: System | null;
}

export default function SystemForm({ isOpen, onClose, editingSystem }: SystemFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertSystem>({
    resolver: zodResolver(insertSystemSchema),
    defaultValues: {
      system_name: "",
      system_description: "",
      business_steward_full_name: "",
      business_steward_email: "",
      security_steward_full_name: "",
      security_steward_email: "",
      technical_steward_full_name: "",
      technical_steward_email: "",
      status: "active",
    },
  });

  // Reset form when editing system changes
  useEffect(() => {
    if (editingSystem) {
      form.reset({
        system_name: editingSystem.system_name,
        system_description: editingSystem.system_description,
        business_steward_full_name: editingSystem.business_steward_full_name,
        business_steward_email: editingSystem.business_steward_email,
        security_steward_full_name: editingSystem.security_steward_full_name,
        security_steward_email: editingSystem.security_steward_email,
        technical_steward_full_name: editingSystem.technical_steward_full_name,
        technical_steward_email: editingSystem.technical_steward_email,
        status: editingSystem.status,
      });
    } else {
      form.reset({
        system_name: "",
        system_description: "",
        business_steward_full_name: "",
        business_steward_email: "",
        security_steward_full_name: "",
        security_steward_email: "",
        technical_steward_full_name: "",
        technical_steward_email: "",
        status: "active",
      });
    }
  }, [editingSystem, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertSystem) => {
      const response = await apiRequest('POST', '/api/systems', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/systems'] });
      toast({
        title: "Success",
        description: "System created successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertSystem) => {
      const response = await apiRequest('PUT', `/api/systems/${editingSystem?.system_id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/systems'] });
      toast({
        title: "Success",
        description: "System updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSystem) => {
    if (editingSystem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSystem ? "Edit System" : "Add New System"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* System Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">System Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="system_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter system name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="system_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the system"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Business Steward Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Business Steward</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="business_steward_full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_steward_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Security Steward Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Security Steward</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="security_steward_full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security_steward_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Technical Steward Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Technical Steward</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="technical_steward_full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="technical_steward_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Saving..."
                ) : editingSystem ? (
                  "Update System"
                ) : (
                  "Create System"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
