-- Crear la tabla de propuestas
CREATE TABLE IF NOT EXISTS proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  estimated_days INTEGER NOT NULL CHECK (estimated_days > 0),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_expert_id ON proposals(expert_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);

-- Crear índice único para evitar propuestas duplicadas del mismo experto al mismo proyecto
CREATE UNIQUE INDEX IF NOT EXISTS idx_proposals_expert_project_unique 
ON proposals(expert_id, project_id) 
WHERE status != 'rejected';

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_proposals_updated_at 
  BEFORE UPDATE ON proposals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_proposals_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Política para que los expertos vean solo sus propuestas
CREATE POLICY "Experts can view their own proposals" ON proposals
  FOR SELECT USING (auth.uid() = expert_id);

-- Política para que los clientes vean propuestas de sus proyectos
CREATE POLICY "Clients can view proposals for their projects" ON proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

-- Política para que los expertos puedan crear propuestas
CREATE POLICY "Experts can create proposals" ON proposals
  FOR INSERT WITH CHECK (
    auth.uid() = expert_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'experto'
    ) AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND status = 'abierto'
    )
  );

-- Política para que los expertos puedan actualizar sus propuestas (solo si están en 'sent')
CREATE POLICY "Experts can update their sent proposals" ON proposals
  FOR UPDATE USING (
    auth.uid() = expert_id AND
    status = 'sent'
  );

-- Política para que los clientes puedan actualizar propuestas de sus proyectos (aceptar/rechazar)
CREATE POLICY "Clients can update proposals for their projects" ON proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

-- Crear la tabla de contratos
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  agreed_price DECIMAL(10,2) NOT NULL CHECK (agreed_price > 0),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disputed')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para contratos
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_expert_id ON contracts(expert_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- Crear trigger para actualizar updated_at en contratos
CREATE TRIGGER update_contracts_updated_at 
  BEFORE UPDATE ON contracts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_proposals_updated_at();

-- Habilitar RLS para contratos
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Políticas para contratos
CREATE POLICY "Users can view contracts they are part of" ON contracts
  FOR SELECT USING (auth.uid() IN (client_id, expert_id));

CREATE POLICY "Clients can create contracts" ON contracts
  FOR INSERT WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update contracts for their projects" ON contracts
  FOR UPDATE USING (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_id AND user_id = auth.uid()
    )
  );

-- Comentarios sobre la estructura
COMMENT ON TABLE proposals IS 'Tabla para gestionar propuestas de expertos a proyectos de clientes';
COMMENT ON COLUMN proposals.price IS 'Precio propuesto por el experto en EUR';
COMMENT ON COLUMN proposals.estimated_days IS 'Días estimados para completar el proyecto';
COMMENT ON COLUMN proposals.message IS 'Mensaje explicativo de la propuesta';
COMMENT ON COLUMN proposals.status IS 'Estado de la propuesta: sent, accepted, rejected';

COMMENT ON TABLE contracts IS 'Tabla para gestionar contratos entre clientes y expertos';
COMMENT ON COLUMN contracts.agreed_price IS 'Precio acordado del contrato';
COMMENT ON COLUMN contracts.start_date IS 'Fecha de inicio del contrato';
COMMENT ON COLUMN contracts.status IS 'Estado del contrato: active, completed, disputed';
COMMENT ON COLUMN contracts.completed_at IS 'Fecha de finalización del contrato';

