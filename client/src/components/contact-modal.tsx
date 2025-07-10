import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, User as UserIcon } from "lucide-react";
import type { User } from "@/types/user";

interface ContactModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ user, isOpen, onClose }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Informações de Contato
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-[var(--angola-yellow)] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-8 w-8 text-[var(--angola-black)]" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">{user.name}</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-[var(--angola-red)] mr-3" />
              <div>
                <p className="font-medium text-gray-900">Telefone</p>
                <p className="text-sm text-gray-600">{user.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-[var(--angola-red)] mr-3" />
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-[var(--angola-red)] hover:bg-[var(--angola-red)]/90">
                <a href={`tel:${user.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={`mailto:${user.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
