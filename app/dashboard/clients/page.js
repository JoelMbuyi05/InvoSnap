// app/dashboard/clients/page.js - MOBILE RESPONSIVE VERSION
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Mail, Phone, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientsPage() {
  const { user, userData } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  async function fetchClients() {
    try {
      const q = query(
        collection(db, 'clients'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(q);
      
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(clientId, clientName) {
    if (!window.confirm(`Delete ${clientName}? This cannot be undone.`)) return;
    
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      setClients(clients.filter(c => c.id !== clientId));
      toast.success('Client deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete client');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Clients</h1>
          <p className="text-gray-600 mt-1">{clients.length} client(s)</p>
        </div>
        <Link href="/dashboard/clients/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No clients yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first client to start invoicing
          </p>
          <Link href="/dashboard/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map(client => (
            <Card key={client.id} className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-base sm:text-lg truncate pr-2">
                  {client.name}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <Link href={`/dashboard/clients/${client.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(client.id, client.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <p className="text-xs mt-2 line-clamp-2">{client.address}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}