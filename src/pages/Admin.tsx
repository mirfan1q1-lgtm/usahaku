import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Portfolio, Order, Showcase, Service, ContactInformation } from '../types';
import { supabase } from '../lib/supabase';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface PortfolioFormData {
  title: string;
  description: string;
  image_url: string;
  demo_url: string;
  category: 'landing' | 'profile' | 'portfolio';
}

interface ShowcaseFormData {
  title: string;
  description: string;
  image_url: string;
  demo_url: string;
  price: string;
  features: string[];
  category: 'basic' | 'premium' | 'enterprise';
  is_featured: boolean;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
}

interface ContactFormData {
  type: ContactInformation['type'];
  label: string;
  value: string;
  icon: string;
  is_primary: boolean;
  is_active: boolean;
  order_index: number;
}

export const Admin: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'portfolios' | 'orders' | 'showcases' | 'services' | 'contacts'>('portfolios');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [contacts, setContacts] = useState<ContactInformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<PortfolioFormData>({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    category: 'landing'
  });
  const [showShowcaseForm, setShowShowcaseForm] = useState(false);
  const [editingShowcase, setEditingShowcase] = useState<Showcase | null>(null);
  const [showcaseForm, setShowcaseForm] = useState<ShowcaseFormData>({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    price: '',
    features: [],
    category: 'basic',
    is_featured: false
  });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: '',
    features: [],
    icon: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInformation | null>(null);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    type: 'email',
    label: '',
    value: '',
    icon: '',
    is_primary: false,
    is_active: true,
    order_index: 0
  });

  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');

      // Test portfolios table (count)
      const { count: portfoliosCount, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('*', { count: 'exact', head: true });

      console.log('Portfolios test:', { portfoliosCount, portfoliosError });

      // Test showcases table (count)
      const { count: showcasesCount, error: showcasesError } = await supabase
        .from('showcases')
        .select('*', { count: 'exact', head: true });

      console.log('Showcases test:', { showcasesCount, showcasesError });

      // Test services table (count)
      const { count: servicesCount, error: servicesError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true });

      console.log('Services test:', { servicesCount, servicesError });

      // Test orders table (count via GET to avoid HEAD 403 behind RLS)
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .limit(0);

      console.log('Orders test:', { ordersCount, ordersError });

      // Test contact_information table (count)
      const { count: contactsCount, error: contactsError } = await supabase
        .from('contact_information')
        .select('*', { count: 'exact', head: true });

      console.log('Contacts test:', { contactsCount, contactsError });

      // Test authentication
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log('Auth test:', { authData, authError });

      alert('Database connection test completed. Check console for details.');
    } catch (error) {
      console.error('Database connection test failed:', error);
      alert('Database connection test failed. Check console for details.');
    }
  };

  useEffect(() => {
    console.log('Admin component mounted/updated');
    console.log('Current user:', user);
    console.log('User loading state:', loading);

    if (user) {
      console.log('User authenticated, fetching data...');
      fetchPortfolios();
      fetchOrders();
      fetchShowcases();
      fetchServices();
      fetchContacts();
    } else {
      console.log('No authenticated user found');
      // Clear orders when user logs out
      setOrders([]);
    }
  }, [user]);

  // Add session refresh function
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh error:', error);
        return false;
      }
      console.log('Session refreshed successfully');
      return true;
    } catch (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
  };

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      console.log('Fetching portfolios from database...');
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch portfolios result:', { data, error, count: data?.length });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Check authentication status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication session error');
      }

      if (!session) {
        console.warn('No active session found, attempting to refresh...');
        const refreshed = await refreshSession();
        if (!refreshed) {
          throw new Error('No active authentication session and refresh failed');
        }
        // Get the refreshed session
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (!newSession) {
          throw new Error('Failed to get refreshed session');
        }
        console.log('Using refreshed session');
      }

      console.log('Fetching orders with session:', {
        userId: session?.user?.id,
        expiresAt: session?.expires_at
      });

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          showcases (
            id,
            title,
            price,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error fetching orders:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Orders fetched successfully:', data?.length || 0, 'orders');
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });

      // Show user-friendly error message
      if (error?.code === '42501') {
        alert('Permission denied. Please try logging out and logging back in.');
      } else if (error?.message?.includes('authentication') || error?.message?.includes('session')) {
        alert('Authentication error. Please refresh the page and log in again.');
      } else {
        alert('Failed to load orders. Please check the console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchShowcases = async () => {
    try {
      setLoading(true);
      console.log('Fetching showcases from database...');
      const { data, error } = await supabase
        .from('showcases')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch showcases result:', { data, error, count: data?.length });

      if (error) throw error;
      setShowcases(data || []);
    } catch (error) {
      console.error('Error fetching showcases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services from database...');
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Fetch services result:', { data, error, count: data?.length });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      console.log('Fetching contacts from database...');
      const { data, error } = await supabase
        .from('contact_information')
        .select('*')
        .order('order_index', { ascending: true });

      console.log('Fetch contacts result:', { data, error, count: data?.length });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting portfolio save operation...');
      console.log('Current user:', user);
      console.log('Portfolio form data:', portfolioForm);

      if (editingPortfolio) {
        console.log('Updating existing portfolio:', editingPortfolio.id);
        const { data, error } = await supabase
          .from('portfolios')
          .update(portfolioForm)
          .eq('id', editingPortfolio.id);

        console.log('Update result:', { data, error });
        if (error) throw error;
      } else {
        console.log('Inserting new portfolio...');
        const { data, error } = await supabase
          .from('portfolios')
          .insert([portfolioForm]);

        console.log('Insert result:', { data, error });
        if (error) throw error;
      }

      setPortfolioForm({
        title: '',
        description: '',
        image_url: '',
        demo_url: '',
        category: 'landing'
      });
      setShowPortfolioForm(false);
      setEditingPortfolio(null);
      await fetchPortfolios();
      alert(editingPortfolio ? 'Portfolio berhasil diupdate' : 'Portfolio berhasil ditambahkan');
    } catch (error: any) {
      console.error('Error saving portfolio:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });

      let errorMessage = 'Terjadi kesalahan saat menyimpan portfolio';
      if (error?.message) {
        errorMessage += `\nDetail: ${error.message}`;
      }
      if (error?.code) {
        errorMessage += `\nKode error: ${error.code}`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleShowcaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!showcaseForm.title.trim()) {
      alert('Judul etalase harus diisi');
      return;
    }
    if (!showcaseForm.description.trim()) {
      alert('Deskripsi etalase harus diisi');
      return;
    }
    if (!showcaseForm.image_url.trim()) {
      alert('URL gambar harus diisi');
      return;
    }
    if (!showcaseForm.price.trim()) {
      alert('Harga harus diisi');
      return;
    }

    // URL validation
    try {
      new URL(showcaseForm.image_url);
    } catch {
      alert('URL gambar tidak valid');
      return;
    }

    if (showcaseForm.demo_url && showcaseForm.demo_url.trim()) {
      try {
        new URL(showcaseForm.demo_url);
      } catch {
        alert('URL demo tidak valid');
        return;
      }
    }

    setLoading(true);

    try {
      console.log('Starting showcase save operation...');
      console.log('Current user:', user);
      console.log('Showcase form data:', showcaseForm);

      if (editingShowcase) {
        console.log('Updating existing showcase:', editingShowcase.id);
        const { data, error } = await supabase
          .from('showcases')
          .update(showcaseForm)
          .eq('id', editingShowcase.id);

        console.log('Update result:', { data, error });
        if (error) throw error;
      } else {
        console.log('Inserting new showcase...');
        const { data, error } = await supabase
          .from('showcases')
          .insert([showcaseForm]);

        console.log('Insert result:', { data, error });
        if (error) throw error;
      }

      setShowcaseForm({
        title: '',
        description: '',
        image_url: '',
        demo_url: '',
        price: '',
        features: [],
        category: 'basic',
        is_featured: false
      });
      setShowShowcaseForm(false);
      setEditingShowcase(null);
      await fetchShowcases();
      alert(editingShowcase ? 'Etalase berhasil diupdate' : 'Etalase berhasil ditambahkan');
    } catch (error: any) {
      console.error('Error saving showcase:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });

      // Show more specific error message
      let errorMessage = 'Terjadi kesalahan saat menyimpan etalase';

      if (error?.message) {
        errorMessage += `\nDetail: ${error.message}`;
      }

      if (error?.code) {
        errorMessage += `\nKode error: ${error.code}`;
      }

      if (error?.details) {
        errorMessage += `\nDetail teknis: ${error.details}`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPortfolio = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setPortfolioForm({
      title: portfolio.title,
      description: portfolio.description,
      image_url: portfolio.image_url,
      demo_url: portfolio.demo_url || '',
      category: portfolio.category
    });
    setShowPortfolioForm(true);
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus portfolio ini?')) return;

    try {
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Terjadi kesalahan saat menghapus portfolio');
    }
  };

  const handleEditShowcase = (showcase: Showcase) => {
    setEditingShowcase(showcase);
    setShowcaseForm({
      title: showcase.title,
      description: showcase.description,
      image_url: showcase.image_url,
      demo_url: showcase.demo_url || '',
      price: showcase.price,
      features: showcase.features,
      category: showcase.category,
      is_featured: showcase.is_featured
    });
    setShowShowcaseForm(true);
  };

  const handleDeleteShowcase = async (id: string) => {
    const showcase = showcases.find(s => s.id === id);
    const confirmMessage = showcase
      ? `Apakah Anda yakin ingin menghapus etalase "${showcase.title}"?`
      : 'Apakah Anda yakin ingin menghapus etalase ini?';

    if (!confirm(confirmMessage)) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('showcases')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchShowcases();
      alert('Etalase berhasil dihapus');
    } catch (error) {
      console.error('Error deleting showcase:', error);
      alert('Terjadi kesalahan saat menghapus etalase');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Terjadi kesalahan saat mengupdate status');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!serviceForm.name.trim()) {
      alert('Nama layanan harus diisi');
      return;
    }
    if (!serviceForm.description.trim()) {
      alert('Deskripsi layanan harus diisi');
      return;
    }
    if (!serviceForm.price.trim()) {
      alert('Harga harus diisi');
      return;
    }
    if (!serviceForm.icon.trim()) {
      alert('Icon harus diisi');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting service save operation...');
      console.log('Current user:', user);
      console.log('Service form data:', serviceForm);

      if (editingService) {
        console.log('Updating existing service:', editingService.id);
        const { data, error } = await supabase
          .from('services')
          .update(serviceForm)
          .eq('id', editingService.id);

        console.log('Update result:', { data, error });
        if (error) throw error;
      } else {
        console.log('Inserting new service...');
        const { data, error } = await supabase
          .from('services')
          .insert([serviceForm]);

        console.log('Insert result:', { data, error });
        if (error) throw error;
      }

      setServiceForm({
        name: '',
        description: '',
        price: '',
        features: [],
        icon: ''
      });
      setShowServiceForm(false);
      setEditingService(null);
      await fetchServices();
      alert(editingService ? 'Layanan berhasil diupdate' : 'Layanan berhasil ditambahkan');
    } catch (error: any) {
      console.error('Error saving service:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });

      let errorMessage = 'Terjadi kesalahan saat menyimpan layanan';
      if (error?.message) {
        errorMessage += `\nDetail: ${error.message}`;
      }
      if (error?.code) {
        errorMessage += `\nKode error: ${error.code}`;
      }
      if (error?.details) {
        errorMessage += `\nDetail teknis: ${error.details}`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price,
      features: service.features,
      icon: service.icon
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id: string) => {
    const service = services.find(s => s.id === id);
    const confirmMessage = service
      ? `Apakah Anda yakin ingin menghapus layanan "${service.name}"?`
      : 'Apakah Anda yakin ingin menghapus layanan ini?';

    if (!confirm(confirmMessage)) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchServices();
      alert('Layanan berhasil dihapus');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Terjadi kesalahan saat menghapus layanan');
    } finally {
      setLoading(false);
    }
  };

  // Contact Information CRUD functions
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!contactForm.label.trim()) {
      alert('Label kontak harus diisi');
      return;
    }
    if (!contactForm.value.trim()) {
      alert('Nilai kontak harus diisi');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting contact save operation...');
      console.log('Current user:', user);
      console.log('Contact form data:', contactForm);

      if (editingContact) {
        console.log('Updating existing contact:', editingContact.id);
        const { data, error } = await supabase
          .from('contact_information')
          .update(contactForm)
          .eq('id', editingContact.id);

        console.log('Update result:', { data, error });
        if (error) throw error;
      } else {
        console.log('Inserting new contact...');
        const { data, error } = await supabase
          .from('contact_information')
          .insert([contactForm]);

        console.log('Insert result:', { data, error });
        if (error) throw error;
      }

      setContactForm({
        type: 'email',
        label: '',
        value: '',
        icon: '',
        is_primary: false,
        is_active: true,
        order_index: 0
      });
      setShowContactForm(false);
      setEditingContact(null);
      await fetchContacts();
      alert(editingContact ? 'Kontak berhasil diupdate' : 'Kontak berhasil ditambahkan');
    } catch (error: any) {
      console.error('Error saving contact:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      });

      let errorMessage = 'Terjadi kesalahan saat menyimpan kontak';
      if (error?.message) {
        errorMessage += `\nDetail: ${error.message}`;
      }
      if (error?.code) {
        errorMessage += `\nKode error: ${error.code}`;
      }
      if (error?.details) {
        errorMessage += `\nDetail teknis: ${error.details}`;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = (contact: ContactInformation) => {
    setEditingContact(contact);
    setContactForm({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      icon: contact.icon || '',
      is_primary: contact.is_primary,
      is_active: contact.is_active,
      order_index: contact.order_index
    });
    setShowContactForm(true);
  };

  const handleDeleteContact = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    const confirmMessage = contact
      ? `Apakah Anda yakin ingin menghapus kontak "${contact.label}"?`
      : 'Apakah Anda yakin ingin menghapus kontak ini?';

    if (!confirm(confirmMessage)) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('contact_information')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchContacts();
      alert('Kontak berhasil dihapus');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Terjadi kesalahan saat menghapus kontak');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Silakan login untuk mengakses admin panel OrbWeb Studio
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={testDatabaseConnection}>
              Test DB Connection
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('portfolios')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'portfolios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Portfolio ({portfolios.length})
            </button>
            <button
              onClick={() => setActiveTab('showcases')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'showcases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Etalase ({showcases.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Layanan ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kontak ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders ({orders.length})
            </button>
          </nav>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolios' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Portfolio</h2>
              <Button 
                onClick={() => setShowPortfolioForm(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Tambah Portfolio</span>
              </Button>
            </div>

            {/* Portfolio Form */}
            {showPortfolioForm && (
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingPortfolio ? 'Edit Portfolio' : 'Tambah Portfolio'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPortfolioForm(false);
                      setEditingPortfolio(null);
                      setPortfolioForm({
                        title: '',
                        description: '',
                        image_url: '',
                        demo_url: '',
                        category: 'landing'
                      });
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePortfolioSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Judul"
                        value={portfolioForm.title}
                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Kategori
                        </label>
                        <select
                          value={portfolioForm.category}
                          onChange={(e) => setPortfolioForm(prev => ({ 
                            ...prev, 
                            category: e.target.value as 'landing' | 'profile' | 'portfolio' 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="landing">Landing Page</option>
                          <option value="profile">Profil Usaha</option>
                          <option value="portfolio">Portfolio</option>
                        </select>
                      </div>
                    </div>
                    <Input
                      label="URL Gambar"
                      value={portfolioForm.image_url}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <Input
                      label="URL Demo (Opsional)"
                      value={portfolioForm.demo_url}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, demo_url: e.target.value }))}
                      placeholder="https://example.com"
                    />
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Deskripsi
                      </label>
                      <textarea
                        value={portfolioForm.description}
                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Menyimpan...' : editingPortfolio ? 'Update' : 'Simpan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Portfolio List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id}>
                  <div className="relative">
                    <img
                      src={portfolio.image_url}
                      alt={portfolio.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEditPortfolio(portfolio)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        portfolio.category === 'landing' 
                          ? 'bg-blue-100 text-blue-800'
                          : portfolio.category === 'profile'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {portfolio.category === 'landing' 
                          ? 'Landing Page' 
                          : portfolio.category === 'profile'
                          ? 'Profil Usaha'
                          : 'Portfolio'
                        }
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{portfolio.description}</p>
                    {portfolio.demo_url && (
                      <a
                        href={portfolio.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Lihat Demo
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Showcases Tab */}
        {activeTab === 'showcases' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Etalase</h2>
              <Button
                onClick={() => setShowShowcaseForm(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Tambah Etalase</span>
              </Button>
            </div>

            {/* Showcase Form */}
            {showShowcaseForm && (
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingShowcase ? 'Edit Etalase' : 'Tambah Etalase'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowShowcaseForm(false);
                      setEditingShowcase(null);
                      setShowcaseForm({
                        title: '',
                        description: '',
                        image_url: '',
                        demo_url: '',
                        price: '',
                        features: [],
                        category: 'basic',
                        is_featured: false
                      });
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleShowcaseSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Judul"
                        value={showcaseForm.title}
                        onChange={(e) => setShowcaseForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                      <Input
                        label="Harga"
                        value={showcaseForm.price}
                        onChange={(e) => setShowcaseForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Rp 1.500.000"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Kategori
                        </label>
                        <select
                          value={showcaseForm.category}
                          onChange={(e) => setShowcaseForm(prev => ({
                            ...prev,
                            category: e.target.value as 'basic' | 'premium' | 'enterprise'
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_featured"
                          checked={showcaseForm.is_featured}
                          onChange={(e) => setShowcaseForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                          Featured Template
                        </label>
                      </div>
                    </div>
                    <Input
                      label="URL Gambar"
                      value={showcaseForm.image_url}
                      onChange={(e) => setShowcaseForm(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <Input
                      label="URL Demo (Opsional)"
                      value={showcaseForm.demo_url}
                      onChange={(e) => setShowcaseForm(prev => ({ ...prev, demo_url: e.target.value }))}
                      placeholder="https://example.com"
                    />
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Deskripsi
                      </label>
                      <textarea
                        value={showcaseForm.description}
                        onChange={(e) => setShowcaseForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Fitur Template
                      </label>
                      
                      {/* Features List */}
                      <div className="space-y-2">
                        {showcaseForm.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...showcaseForm.features];
                                newFeatures[index] = e.target.value;
                                setShowcaseForm(prev => ({ ...prev, features: newFeatures }));
                              }}
                              placeholder={`Fitur ${index + 1}`}
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = showcaseForm.features.filter((_, i) => i !== index);
                                setShowcaseForm(prev => ({ ...prev, features: newFeatures }));
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus fitur"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Feature Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowcaseForm(prev => ({ 
                            ...prev, 
                            features: [...prev.features, ''] 
                          }));
                        }}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Tambah Fitur</span>
                      </button>
                      
                      {/* Alternative: Bulk Input */}
                      <div className="border-t pt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Atau masukkan semua fitur sekaligus (pisahkan dengan koma atau baris baru):
                        </label>
                        <textarea
                          value={showcaseForm.features.join(', ')}
                          onChange={(e) => {
                            // Support both comma and newline separation
                            const input = e.target.value;
                            const features = input
                              .split(/[,\n]/)
                              .map(f => f.trim())
                              .filter(f => f);
                            setShowcaseForm(prev => ({ ...prev, features }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Responsive Design, SEO Optimized, Fast Loading"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Pisahkan fitur dengan koma (,) atau baris baru. Klik "Tambah Fitur" untuk input individual.
                        </p>
                      </div>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Menyimpan...' : editingShowcase ? 'Update' : 'Simpan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcases.map((showcase) => (
                <Card key={showcase.id}>
                  <div className="relative">
                    <img
                      src={showcase.image_url}
                      alt={showcase.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEditShowcase(showcase)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteShowcase(showcase.id)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                    {showcase.is_featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        showcase.category === 'basic' ? 'bg-green-100 text-green-800' :
                        showcase.category === 'premium' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {showcase.category === 'basic' ? 'Basic' :
                         showcase.category === 'premium' ? 'Premium' : 'Enterprise'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{showcase.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{showcase.description}</p>
                    <div className="text-lg font-bold text-blue-600">{showcase.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {showcases.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600">Belum ada etalase. Tambahkan etalase pertama Anda.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Layanan</h2>
              <Button
                onClick={() => setShowServiceForm(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Tambah Layanan</span>
              </Button>
            </div>

            {/* Service Form */}
            {showServiceForm && (
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingService ? 'Edit Layanan' : 'Tambah Layanan'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowServiceForm(false);
                      setEditingService(null);
                      setServiceForm({
                        name: '',
                        description: '',
                        price: '',
                        features: [],
                        icon: ''
                      });
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleServiceSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nama Layanan"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      <Input
                        label="Harga"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Rp 1.500.000"
                        required
                      />
                    </div>
                    <Input
                      label="Icon (Emoji atau Unicode)"
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="🚀 atau 🌐"
                      required
                    />
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Deskripsi
                      </label>
                      <textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Fitur Layanan
                      </label>
                      
                      {/* Features List */}
                      <div className="space-y-2">
                        {serviceForm.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={feature}
                              onChange={(e) => {
                                const newFeatures = [...serviceForm.features];
                                newFeatures[index] = e.target.value;
                                setServiceForm(prev => ({ ...prev, features: newFeatures }));
                              }}
                              placeholder={`Fitur ${index + 1}`}
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = serviceForm.features.filter((_, i) => i !== index);
                                setServiceForm(prev => ({ ...prev, features: newFeatures }));
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus fitur"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Feature Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setServiceForm(prev => ({ 
                            ...prev, 
                            features: [...prev.features, ''] 
                          }));
                        }}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span>Tambah Fitur</span>
                      </button>
                      
                      {/* Alternative: Bulk Input */}
                      <div className="border-t pt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Atau masukkan semua fitur sekaligus (pisahkan dengan koma atau baris baru):
                        </label>
                        <textarea
                          value={serviceForm.features.join(', ')}
                          onChange={(e) => {
                            // Support both comma and newline separation
                            const input = e.target.value;
                            const features = input
                              .split(/[,\n]/)
                              .map(f => f.trim())
                              .filter(f => f);
                            setServiceForm(prev => ({ ...prev, features }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Responsive Design, SEO Optimized, Fast Loading, Contact Form"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Pisahkan fitur dengan koma (,) atau baris baru. Klik "Tambah Fitur" untuk input individual.
                        </p>
                      </div>
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Menyimpan...' : editingService ? 'Update' : 'Simpan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{service.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <div className="text-lg font-bold text-blue-600">{service.price}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 rounded-full hover:bg-gray-100"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 rounded-full hover:bg-gray-100"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fitur:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {services.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600">Belum ada layanan. Tambahkan layanan pertama Anda.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Manage Informasi Kontak</h2>
              <Button
                onClick={() => setShowContactForm(true)}
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Tambah Kontak</span>
              </Button>
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {editingContact ? 'Edit Kontak' : 'Tambah Kontak'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowContactForm(false);
                      setEditingContact(null);
                      setContactForm({
                        type: 'email',
                        label: '',
                        value: '',
                        icon: '',
                        is_primary: false,
                        is_active: true,
                        order_index: 0
                      });
                    }}
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Tipe Kontak
                        </label>
                        <select
                          value={contactForm.type}
                          onChange={(e) => setContactForm(prev => ({ 
                            ...prev, 
                            type: e.target.value as ContactInformation['type'] 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="website">Website</option>
                          <option value="address">Alamat</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>
                      <Input
                        label="Label"
                        value={contactForm.label}
                        onChange={(e) => setContactForm(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Email Utama"
                        required
                      />
                    </div>
                    <Input
                      label="Nilai/Nomor/URL"
                      value={contactForm.value}
                      onChange={(e) => setContactForm(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="info@orbwebstudio.com atau +62 812-3456-7890"
                      required
                    />
                    <Input
                      label="Icon (Emoji atau Unicode)"
                      value={contactForm.icon}
                      onChange={(e) => setContactForm(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="📧 atau 🌐"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_primary"
                          checked={contactForm.is_primary}
                          onChange={(e) => setContactForm(prev => ({ ...prev, is_primary: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_primary" className="text-sm font-medium text-gray-700">
                          Primary Contact
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={contactForm.is_active}
                          onChange={(e) => setContactForm(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                          Aktif
                        </label>
                      </div>
                      <Input
                        label="Urutan"
                        type="number"
                        value={contactForm.order_index}
                        onChange={(e) => setContactForm(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                      />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Menyimpan...' : editingContact ? 'Update' : 'Simpan'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Contacts List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{contact.icon || '📞'}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{contact.label}</h3>
                          <div className="text-sm text-gray-600">{contact.value}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              contact.type === 'email' ? 'bg-blue-100 text-blue-800' :
                              contact.type === 'phone' || contact.type === 'whatsapp' ? 'bg-green-100 text-green-800' :
                              contact.type === 'instagram' ? 'bg-pink-100 text-pink-800' :
                              contact.type === 'facebook' ? 'bg-blue-100 text-blue-800' :
                              contact.type === 'website' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {contact.type}
                            </span>
                            {contact.is_primary && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Primary
                              </span>
                            )}
                            {!contact.is_active && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditContact(contact)}
                          className="p-2 rounded-full hover:bg-gray-100"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-2 rounded-full hover:bg-gray-100"
                        >
                          <TrashIcon className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {contacts.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-gray-600">Belum ada informasi kontak. Tambahkan kontak pertama Anda.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Orders</h2>
            
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.customer_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' ? 'Pending' :
                             order.status === 'in-progress' ? 'In Progress' :
                             order.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Email:</strong> {order.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Phone:</strong> {order.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Service:</strong> {
                                order.service_type === 'showcase' ? 'Template Etalase' :
                                order.service_type === 'custom' ? 'Custom Website' : order.service_type
                              }
                            </p>
                            {order.showcases && (
                              <p className="text-sm text-gray-600">
                                <strong>Template:</strong> {order.showcases.title} ({order.showcases.price})
                              </p>
                            )}
                            <p className="text-sm text-gray-600">
                              <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>Message:</strong>
                          </p>
                          <p className="text-sm text-gray-800 mt-1">
                            {order.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                        {order.status !== 'in-progress' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => updateOrderStatus(order.id, 'in-progress')}
                          >
                            In Progress
                          </Button>
                        )}
                        {order.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                        {order.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {orders.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-600">Belum ada order masuk</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};