import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

const VendorProfile: React.FC = () => {
  const { vendor } = useAuth();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: vendor?.displayName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address: vendor?.address || '',
    legalName: vendor?.legalName || '',
    gstin: vendor?.gstin || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: vendor?.displayName || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      address: vendor?.address || '',
      legalName: vendor?.legalName || '',
      gstin: vendor?.gstin || '',
    });
    setIsEditing(false);
  };

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.profile')}</h1>
          <p className="text-gray-600 mt-1">Manage your vendor profile and business information</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              {t('vendor_profile.edit_profile')}
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100">
                  <AvatarImage src={undefined} alt={vendor.displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold">
                    {vendor.displayName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {isEditing ? (
                    <Input
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="text-center font-semibold"
                    />
                  ) : (
                    vendor.displayName
                  )}
                </h2>
                <Badge variant="secondary" className="mb-4">
                  {t('navbar.vendor')}
                </Badge>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {new Date(vendor.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{vendor.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{vendor.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Legal Business Name</Label>
                    {isEditing ? (
                      <Input
                        id="legalName"
                        value={formData.legalName}
                        onChange={(e) => handleInputChange('legalName', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{vendor.legalName || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    {isEditing ? (
                      <Input
                        id="gstin"
                        value={formData.gstin}
                        onChange={(e) => handleInputChange('gstin', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{vendor.gstin || 'Not provided'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{vendor.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {t('common.save')}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {t('common.cancel')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
