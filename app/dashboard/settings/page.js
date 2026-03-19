// app/dashboard/settings/page.js - MOBILE RESPONSIVE VERSION
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    invoicePrefix: 'INV',
    currency: 'USD',
    taxRate: 0,
    defaultNotes: 'Thank you for your business!'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            businessName: data.businessName || '',
            businessEmail: data.businessEmail || user.email,
            businessPhone: data.businessPhone || '',
            businessAddress: data.businessAddress || '',
            invoicePrefix: data.invoicePrefix || 'INV',
            currency: data.currency || 'USD',
            taxRate: data.taxRate || 0,
            defaultNotes: data.defaultNotes || 'Thank you for your business!'
          });
          setLogoUrl(data.logoUrl || '');
        } else {
          setFormData({
            businessName: userData?.businessName || '',
            businessEmail: user.email,
            businessPhone: '',
            businessAddress: '',
            invoicePrefix: 'INV',
            currency: 'USD',
            taxRate: 0,
            defaultNotes: 'Thank you for your business!'
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    
    if (user) {
      loadSettings();
    }
  }, [user, userData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG, JPG, JPEG)');
        return;
      }
      
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoUrl(previewUrl);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setSaving(true);
      let newLogoUrl = logoUrl;

      if (logoFile) {
        const timestamp = Date.now();
        const filename = `${timestamp}_${logoFile.name}`;
        const logoRef = ref(storage, `logos/${user.uid}/${filename}`);
        
        await uploadBytes(logoRef, logoFile);
        newLogoUrl = await getDownloadURL(logoRef);
        setLogoUrl(newLogoUrl);
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      if (newLogoUrl) {
        dataToSave.logoUrl = newLogoUrl;
      }
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, dataToSave);
      } else {
        await setDoc(userDocRef, {
          ...dataToSave,
          email: user.email,
          plan: 'free',
          invoicesThisMonth: 0,
          clientsCount: 0,
          nextInvoiceNumber: 1,
          createdAt: new Date().toISOString()
        });
      }

      toast.success('Settings saved successfully!');
      setLogoFile(null);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessEmail">Business Email *</Label>
              <Input
                id="businessEmail"
                name="businessEmail"
                type="email"
                value={formData.businessEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessPhone">Phone</Label>
              <Input
                id="businessPhone"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Address</Label>
              <Textarea
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {logoUrl && (
                  <div className="relative h-16 w-16 border rounded overflow-hidden flex-shrink-0">
                    <img
                      src={logoUrl} 
                      alt="Logo" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                    disabled={saving}
                  />
                  <Label htmlFor="logo-upload">
                    <Button 
                      type="button" 
                      variant="outline" 
                      asChild
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      <span>
                        {saving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        {logoUrl ? 'Change Logo' : 'Upload Logo'}
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG or JPG, max 2MB
                  </p>
                  {logoFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {logoFile.name} selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Invoice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                <Input
                  id="invoicePrefix"
                  name="invoicePrefix"
                  value={formData.invoicePrefix}
                  onChange={handleChange}
                  placeholder="INV"
                />
                <p className="text-xs text-gray-500">
                  Example: {formData.invoicePrefix}-0001
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  disabled={saving}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="ZAR">ZAR (R)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultNotes">Default Invoice Notes</Label>
              <Textarea
                id="defaultNotes"
                name="defaultNotes"
                value={formData.defaultNotes}
                onChange={handleChange}
                rows={3}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.location.reload()}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}