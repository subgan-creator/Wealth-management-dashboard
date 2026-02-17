'use client';

import { FeaturesShowcase } from '@/components/features-showcase';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Advanced Request Management for Wealth Management Teams
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 text-balance">
            Streamline your workflow, reduce delays, and keep your team coordinated with intelligent request routing and real-time tracking.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/overview">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Schedule Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesShowcase />

        {/* CTA Section */}
        <section className="py-16 px-6 bg-muted/30 rounded-lg text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to transform your request management?</h2>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join teams that are already using our dashboard to manage requests more efficiently.
          </p>
          <Link href="/overview">
            <Button size="lg">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </DashboardLayout>
  );
}
