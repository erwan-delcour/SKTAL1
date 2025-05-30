"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            {/* Back button skeleton */}
            <Skeleton className="absolute left-4 top-4 md:left-8 md:top-8 h-9 w-16 rounded-lg" />
            
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {/* Header section skeleton */}
                <div className="flex flex-col space-y-2 text-center">
                    {/* Car icon skeleton */}
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Skeleton className="h-6 w-6" />
                    </div>
                    {/* Title skeleton */}
                    <Skeleton className="h-8 w-40 mx-auto" />
                    {/* Description skeleton */}
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>

                {/* Login card skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-16" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Username field skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        
                        {/* Password field skeleton */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        {/* Login button skeleton */}
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>

                {/* Demo instructions skeleton */}
                <div className="px-8 text-center space-y-2">
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <Skeleton className="h-3 w-40 mx-auto" />
                    <Skeleton className="h-3 w-44 mx-auto" />
                    <Skeleton className="h-3 w-36 mx-auto" />
                </div>
            </div>
        </div>
    );
}
