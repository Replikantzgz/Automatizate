-- Crear la tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('NEW_MESSAGE', 'NEW_PROPOSAL', 'PROPOSAL_ACCEPTED', 'PAYMENT_REQUIRED', 'REVIEW_REQUEST')),
  payload JSONB NOT NULL DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para notifications
-- Usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Usuarios solo pueden actualizar sus propias notificaciones (marcar como leídas)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Solo el sistema puede insertar notificaciones (via API routes)
CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Función para limpiar notificaciones antiguas (opcional)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '90 days' 
  AND read = true;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en profiles (si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para notifications si se añade updated_at en el futuro
-- CREATE TRIGGER update_notifications_updated_at 
--   BEFORE UPDATE ON notifications 
--   FOR EACH ROW 
--   EXECUTE FUNCTION update_updated_at_column();

