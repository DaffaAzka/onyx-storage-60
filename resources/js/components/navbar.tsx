import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    return (
        <nav className="fixed h-16 w-full border-b bg-sidebar text-white z-50">
            <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
                <div>
                    <Link href={'/'} className="font-semibold">
                        Onyx Storage
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <Button className="hidden sm:inline-flex text-black" variant="outline" asChild>
                        <Link href={'/login'}>Sign In</Link>
                    </Button>
                    {/* <Button asChild variant={'secondary'}>
                        <Link href={'/register'}>Get Started</Link>
                    </Button> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
