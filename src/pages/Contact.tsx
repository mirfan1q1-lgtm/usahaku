import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { Showcase, ContactInformation } from '../types';
import { SEO, seoConfig } from '../components/SEO';
import { getBreadcrumbStructuredData, getFAQStructuredData } from '../lib/structuredData';
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
  const [contacts, setContacts] = useState<ContactInformation[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  useEffect(() => {
    fetchShowcases();
    fetchContacts();
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

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const { data, error } = await supabase
        .from('contact_information')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setContactsLoading(false);
    }
  };

  const serviceOptions = [
    { value: 'showcase', label: 'Template dari Etalase (Lihat /showcase)' },
    { value: 'custom', label: 'Custom Website (Konsultasi Gratis)' }
  ];

  // Helper function to get icon component based on contact type
  const getContactIcon = (type: ContactInformation['type']) => {
    switch (type) {
      case 'email':
        return <EnvelopeIcon className="h-6 w-6" />;
      case 'phone':
      case 'whatsapp':
        return <PhoneIcon className="h-6 w-6" />;
      case 'address':
        return <MapPinIcon className="h-6 w-6" />;
      default:
        return <ClockIcon className="h-6 w-6" />;
    }
  };

  // Helper function to format contact value for display
  const formatContactValue = (contact: ContactInformation) => {
    if (contact.type === 'email' && !contact.value.startsWith('mailto:')) {
      return `mailto:${contact.value}`;
    }
    if ((contact.type === 'phone' || contact.type === 'whatsapp') && !contact.value.startsWith('tel:')) {
      return `tel:${contact.value}`;
    }
    if (contact.type === 'whatsapp' && !contact.value.startsWith('https://wa.me/')) {
      const cleanNumber = contact.value.replace(/[^\d]/g, '');
      return `https://wa.me/${cleanNumber}`;
    }
    return contact.value;
  };

  // Fallback contact info if database is empty
  const fallbackContactInfo = [
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

  const faqData = [
    {
      question: "Berapa lama waktu pengerjaan website?",
      answer: "Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Website company profile biasanya 1-2 minggu, e-commerce 2-4 minggu, dan custom development 4-8 minggu."
    },
    {
      question: "Apakah website sudah termasuk hosting dan domain?",
      answer: "Ya, paket website kami sudah termasuk hosting dan domain untuk 1 tahun pertama. Setelah itu, Anda bisa memperpanjang sendiri atau menggunakan layanan kami."
    },
    {
      question: "Bisakah website diubah setelah selesai?",
      answer: "Tentu saja! Kami memberikan training singkat untuk mengelola konten website. Untuk perubahan desain besar, tersedia layanan maintenance dengan harga khusus."
    }
  ];

  return (
    <>
      <SEO
        {...seoConfig.contact}
        structuredData={[
          getBreadcrumbStructuredData([
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' }
          ]),
          getFAQStructuredData(faqData)
        ]}
      />
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
                {contactsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading contact info...</p>
                  </div>
                ) : contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div key={contact.id} className="flex items-start space-x-4">
                      <div className="text-blue-600">
                        {contact.icon ? (
                          <span className="text-2xl">{contact.icon}</span>
                        ) : (
                          getContactIcon(contact.type)
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {contact.label}
                        </div>
                        <div className="text-gray-600">
                          {contact.type === 'email' || contact.type === 'phone' || contact.type === 'whatsapp' ? (
                            <a 
                              href={formatContactValue(contact)}
                              className="hover:text-blue-600 transition-colors"
                              target={contact.type === 'whatsapp' ? '_blank' : undefined}
                              rel={contact.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
                            >
                              {contact.value}
                            </a>
                          ) : contact.type === 'website' || contact.type === 'instagram' || contact.type === 'facebook' || contact.type === 'twitter' || contact.type === 'linkedin' || contact.type === 'youtube' ? (
                            <a 
                              href={contact.value.startsWith('http') ? contact.value : `https://${contact.value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                            >
                              {contact.value}
                            </a>
                          ) : (
                            contact.value
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to hardcoded data if no contacts from database
                  fallbackContactInfo.map((item, index) => (
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
                  ))
                )}
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
    </>
  );
};