import { View } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui';

// Estatísticas chegam na etapa 9
export default function PainelScreen() {
  const { signOut } = useAuth();
  return (
    <View style={{ padding: 16 }}>
      <Button title="Sair" variant="danger" onPress={signOut} />
    </View>
  );
}
