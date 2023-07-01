
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useUser from '@/hooks/useUser';

const withAuth = WrappedComponent => {
    return (props) => {
        const Router = useRouter();
        const { user, isLoading } = useUser();

        useEffect(() => {
            if (!isLoading && !user) {
                Router.replace('/login');
            }
        }, [user, Router, isLoading]);

        return (isLoading || !user) ? null : <WrappedComponent {...props} />;
    }
}

export default withAuth;