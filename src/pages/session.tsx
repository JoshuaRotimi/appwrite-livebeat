import Container from '@/components/Container';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { AppwriteException } from 'appwrite';

function Session() {
  const [,navigate] = useLocation();
  const { verifySession } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const secret = params.get('secret');

    if(typeof userId !== 'string' || typeof secret !== 'string') {
      navigate('/login')
      return;
    }

    const run = async () => {
      try {
        await verifySession({userId, secret})
        navigate('/')
      } catch (e) {
        if(e instanceof AppwriteException) {
          navigate(`/login?error=${e.type}`)
        }
      }
      
    };
    run();
  }, [navigate, verifySession]);

  return (
    <Container className="h-screen flex items-center justify-center text-center">
      <p>Logging you in...</p>
    </Container>
  )
}

export default Session;