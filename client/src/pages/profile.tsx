import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import LocationSelector from "@/components/location-selector";
import { Edit, Save, Camera, Trash2, User as UserIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { User, UpdateUser } from "@shared/schema";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateUser>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // TODO: Get current user ID from auth context
  const currentUserId = "mock-user-id";

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users', currentUserId],
    enabled: !!currentUserId,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      const response = await apiRequest('PUT', `/api/users/${currentUserId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/users/${currentUserId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      });
      // TODO: Redirect to home and clear auth state
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await apiRequest('POST', '/api/upload-photo', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, profile_url: data.url }));
      toast({
        title: "Foto enviada",
        description: "Sua foto de perfil foi atualizada.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadPhotoMutation.mutate(file);
    }
  };

  const handleLocationChange = (location: { province?: string; municipality?: string; neighborhood?: string }) => {
    setFormData(prev => ({ ...prev, ...location }));
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Perfil não encontrado
                </h3>
                <p className="text-gray-600">
                  Você precisa estar logado para ver seu perfil.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              disabled={updateMutation.isPending}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Conta
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.profile_url || user.profile_url} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="bg-[var(--angola-red)] text-white p-2 rounded-full hover:bg-[var(--angola-red)]/90">
                        <Camera className="h-4 w-4" />
                      </div>
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <LocationSelector 
                  onLocationChange={handleLocationChange}
                  defaultValues={{
                    province: user.province,
                    municipality: user.municipality,
                    neighborhood: user.neighborhood,
                  }}
                />
              )}

              {!isEditing && (
                <div>
                  <Label>Localização</Label>
                  <p className="text-sm text-gray-600">
                    {user.province}, {user.municipality}, {user.neighborhood}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="contract_type">Tipo de Contrato</Label>
                <Input
                  id="contract_type"
                  value={formData.contract_type || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, contract_type: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label>Serviços Oferecidos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.services.map((service) => (
                    <span key={service} className="service-tag px-3 py-1 text-sm font-medium rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Disponibilidade</Label>
                <Textarea
                  id="availability"
                  value={formData.availability || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90"
                    disabled={updateMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
