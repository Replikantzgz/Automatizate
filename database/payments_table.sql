-- Crear la tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  commission DECIMAL(10,2) NOT NULL CHECK (commission >= 0),
  expert_amount DECIMAL(10,2) NOT NULL CHECK (expert_amount >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'released', 'refunded', 'disputed')),
  stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_transfer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  released_at TIMESTAMP WITH TIME ZONE
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_expert_id ON payments(expert_id);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política para que los clientes vean solo sus pagos
CREATE POLICY "Clients can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = client_id);

-- Política para que los expertos vean solo los pagos que les corresponden
CREATE POLICY "Experts can view payments for their projects" ON payments
  FOR SELECT USING (auth.uid() = expert_id);

-- Política para que los clientes puedan crear pagos
CREATE POLICY "Clients can create payments" ON payments
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'cliente'
    )
  );

-- Política para que los clientes puedan actualizar sus pagos
CREATE POLICY "Clients can update their own payments" ON payments
  FOR UPDATE USING (auth.uid() = client_id);

-- Política para que solo los clientes puedan liberar pagos
CREATE POLICY "Only clients can release payments" ON payments
  FOR UPDATE USING (
    auth.uid() = client_id AND
    status = 'paid'
  );

-- Agregar columna stripe_account_id a la tabla profiles para expertos
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255);

-- Crear índice para stripe_account_id
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON profiles(stripe_account_id);

-- Política para que los expertos puedan actualizar su stripe_account_id
CREATE POLICY "Experts can update their stripe account" ON profiles
  FOR UPDATE USING (
    auth.uid() = id AND 
    role = 'experto'
  );

-- Comentarios sobre la estructura
COMMENT ON TABLE payments IS 'Tabla para gestionar pagos entre clientes y expertos con retención de fondos';
COMMENT ON COLUMN payments.amount IS 'Monto total del proyecto';
COMMENT ON COLUMN payments.commission IS 'Comisión de la plataforma (5%)';
COMMENT ON COLUMN payments.expert_amount IS 'Monto que recibe el experto (amount - commission)';
COMMENT ON COLUMN payments.status IS 'Estado del pago: pending, paid, released, refunded, disputed';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'ID del Payment Intent de Stripe';
COMMENT ON COLUMN payments.stripe_transfer_id IS 'ID de la transferencia de Stripe al experto';
COMMENT ON COLUMN payments.released_at IS 'Fecha cuando se liberó el pago al experto';

