
import { useRouter } from 'next/router';

export default function Error() {
    const router = useRouter();
    const { message } = router.query;

    return (
        <div className="error-container">
            <h1 className="error-title">Oops!</h1>
            {message ? (
                <p className="error-description">
                  Something went wrong. Here&apos;s what we know: <br />
                  <span className="error-detail">{decodeURIComponent(message)}</span>
                </p>
            ) : (
                <p className="error-description">Something went wrong. Please try again later.</p>
            )}
        </div>
    )
}