"use client";
import React, { forwardRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
  ({ title, description, children, className }, ref) => {
    return (
      <Card className={className} ref={ref}>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </Card>
    );
  }
);

ChartCard.displayName = 'ChartCard';