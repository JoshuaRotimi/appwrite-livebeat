import Layout from '@/components/Layout';
import Container from '@/components/Container';
import FormRow from '@/components/FormRow';
import FormLabel from '@/components/FormLabel';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import { useAuth  } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Redirect } from 'wouter';

function LogIn() {
  const { session, logIn } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if(error === 'user_invalid_token') {
      setError('Login session expired. Please try again')
    }
  
  }, [])
  async function handleLogIn(e : React.SyntheticEvent) {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: {value: string},
    };
    await logIn(target.email.value);
    setSent(true);
  }

  if ( session ) {
    return <Redirect to={'/'} />
  }

  return (
    <Layout>
      <Container>
        <h1 className="text-3xl font-bold text-center mb-6">
          Log In
        </h1>
        {error && (
            <p className="max-w-xs mx-auto mb-6 bg-black p-4 mt-6 rounded">{ error }</p>
        )}

        {!sent && (
           <form onSubmit={handleLogIn} className="max-w-xs border border-slate-200 dark:border-slate-500 rounded p-6 mx-auto">
           <FormRow className="mb-5">
             <FormLabel htmlFor="email">Email</FormLabel>
             <InputText id="email" name="email" type="email" />
           </FormRow>
 
           <Button>Submit</Button>
         </form>
        )}
        {sent && (
          <p className='text-center'>Check your email for a magic link!</p>
        )}
       
      </Container>
    </Layout>
  )
}

export default LogIn;