'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SignInButtonProps {
    className?: string;
}

export default function SignInButton({ className }:
    SignInButtonProps) {
    return (
        <Button asChild variant="default" className={className}>
            <Link href="/login">Sign In</Link>
        </Button>
    );
}