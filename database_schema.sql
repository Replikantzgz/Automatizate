-- Tabla de facturas
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) DEFAULT 0,
  vat DECIMAL(10,2) DEFAULT 0,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para invoices
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver sus propias facturas (como comprador o vendedor)
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id
  );

-- Solo el sistema puede crear facturas
CREATE POLICY "Only system can create invoices" ON invoices
  FOR INSERT WITH CHECK (false);

-- Solo el sistema puede actualizar facturas
CREATE POLICY "Only system can update invoices" ON invoices
  FOR UPDATE USING (false);

-- Solo el sistema puede eliminar facturas
CREATE POLICY "Only system can delete invoices" ON invoices
  FOR DELETE USING (false);

-- Índices para mejorar rendimiento
CREATE INDEX idx_invoices_transaction_id ON invoices(transaction_id);
CREATE INDEX idx_invoices_buyer_id ON invoices(buyer_id);
CREATE INDEX idx_invoices_seller_id ON invoices(seller_id);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);

-- Tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  skills TEXT[],
  portfolio_url TEXT,
  phone TEXT,
  location TEXT,
  company TEXT,
  website TEXT,
  role TEXT NOT NULL CHECK (role IN ('cliente', 'experto', 'admin')),
  is_active BOOLEAN DEFAULT true,
  privacy_consent BOOLEAN DEFAULT false,
  privacy_consent_date TIMESTAMP WITH TIME ZONE,
  deletion_requested BOOLEAN DEFAULT false,
  deletion_requested_at TIMESTAMP WITH TIME ZONE,
  deletion_reason TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de solicitudes de eliminación para GDPR
CREATE TABLE deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES profiles(id),
  notes TEXT
);

-- Políticas RLS para deletion_requests
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

-- Solo el usuario puede ver sus propias solicitudes
CREATE POLICY "Users can view their own deletion requests" ON deletion_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Solo el usuario puede crear sus propias solicitudes
CREATE POLICY "Users can create their own deletion requests" ON deletion_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Solo admins pueden actualizar solicitudes
CREATE POLICY "Only admins can update deletion requests" ON deletion_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Índices para deletion_requests
CREATE INDEX idx_deletion_requests_user_id ON deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX idx_deletion_requests_requested_at ON deletion_requests(requested_at);
