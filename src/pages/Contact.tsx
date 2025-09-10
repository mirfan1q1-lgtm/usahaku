import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { Showcase } from '../types';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FormData {
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  showcase_id?: string;
  message: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    email: '',
    phone: '',
    service_type: '',
    showcase_id: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [showcasesLoading, setShowcasesLoading] = useState(false);

  useEffect(() => {
    fetchShowcases();
  }, []);

  const fetchShowcases = async () => {
    try {
      setShowcasesLoading(true);
      const { data, error } = await supabase
        .from('showcases')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setShowcases(data || []);
    } catch (error) {
      console.error('Error fetching showcases:', error);
    } finally {
      setShowcasesLoading(false);
    }
  };

  const serviceOptions = [
    { value: 'showcase', label: 'Template dari Etalase (Lihat /showcase)' },
    { value: 'custom', label: 'Custom Website (Konsultasi Gratis)' }
  ];

  const contactInfo = [
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: 'Telepon',
      info: '+62 812-3456-7890'
    },
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: 'Email',
      info: 'hello@orbwebstudio.com'
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: 'Alamat',
      info: 'Jakarta, Indonesia'
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: 'Jam Kerja',
      info: 'Senin-Jumat, 09:00-17:00'
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }

    if (!formData.service_type) {
      newErrors.service_type = 'Pilih jenis layanan';
    }

    if (formData.service_type === 'showcase' && !formData.showcase_id) {
      newErrors.showcase_id = 'Pilih template etalase';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Pesan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData: any = {
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        service_type: formData.service_type,
        message: formData.message,
        status: 'pending'
      };

      // Only include showcase_id if it's selected
      if (formData.showcase_id) {
        orderData.showcase_id = formData.showcase_id;
      }

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      setFormData({
        customer_name: '',
        email: '',
        phone: '',
        service_type: '',
        showcase_id: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Pesan Berhasil Dikirim!
              </h2>
              <p className="text-gray-600 mb-6">
                Terima kasih atas kepercayaan Anda. Tim kami akan menghubungi Anda dalam 24 jam.
              </p>
              <Button onClick={() => setSuccess(false)}>
                Kirim Pesan Lain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Siap membantu mewujudkan website impian untuk bisnis Anda.
            Konsultasi gratis untuk menentukan solusi yang tepat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/showcase"
              className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Lihat Etalase Template
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  Informasi Kontak
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-blue-600">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-gray-600">
                        {item.info}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="mt-8">
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  Mengapa Pilih Kami?
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Pengalaman 5+ tahun</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">100+ klien puas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Support selamanya</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span className="text-gray-600">Harga terjangkau</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  Form Pemesanan
                </h3>
                <p className="text-gray-600">
                  Isi form di bawah ini dan kami akan menghubungi Anda dalam 24 jam
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Lengkap"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      error={errors.customer_name}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="contoh@email.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nomor Telepon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="+62 812-3456-7890"
                      required
                    />
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Pilih Layanan
                      </label>
                      <select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.service_type ? 'border-red-500' : ''
                        }`}
                        required
                      >
                        <option value="">Pilih jenis layanan</option>
                        {serviceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.service_type && (
                        <p className="text-sm text-red-600">{errors.service_type}</p>
                      )}
                    </div>

                    {/* Showcase Selection - Only show when showcase service is selected */}
                    {formData.service_type === 'showcase' && (
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Pilih Template Etalase
                        </label>
                        <select
                          name="showcase_id"
                          value={formData.showcase_id}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.showcase_id ? 'border-red-500' : ''
                          }`}
                          required={formData.service_type === 'showcase'}
                        >
                          <option value="">Pilih template etalase</option>
                          {showcasesLoading ? (
                            <option disabled>Loading...</option>
                          ) : (
                            showcases.map((showcase) => (
                              <option key={showcase.id} value={showcase.id}>
                                {showcase.title} - {showcase.price} ({showcase.category})
                              </option>
                            ))
                          )}
                        </select>
                        {errors.showcase_id && (
                          <p className="text-sm text-red-600">{errors.showcase_id}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Jika belum menemukan template yang sesuai, pilih "Custom/Konsultasi" di jenis layanan
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Pesan
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.message ? 'border-red-500' : ''
                      }`}
                      rows={4}
                      placeholder="Ceritakan tentang bisnis Anda dan kebutuhan website..."
                      required
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};