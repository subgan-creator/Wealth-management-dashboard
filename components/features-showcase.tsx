'use client';

import { Zap, Target, Settings, Users, Bell, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Target,
    title: 'Smart Request Routing',
    description: 'Automatically direct requests to the right teams based on type and priority',
    color: 'text-blue-600',
  },
  {
    icon: Bell,
    title: 'SLA Tracking',
    description: 'Real-time alerts when deadlines approach or are at risk',
    color: 'text-orange-600',
  },
  {
    icon: Settings,
    title: 'Flexible Configuration',
    description: 'Customize business events, sub-events, and routing rules without technical expertise',
    color: 'text-purple-600',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Assign team members and manage permissions with ease',
    color: 'text-green-600',
  },
  {
    icon: Bell,
    title: 'User Preferences',
    description: "Each team member controls what they see and how they're notified",
    color: 'text-red-600',
  },
  {
    icon: FileText,
    title: 'Rich Request Details',
    description: 'Comments, attachments, activity history all in one place',
    color: 'text-cyan-600',
  },
];

export function FeaturesShowcase() {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">Powerful Features</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage wealth management requests efficiently and keep your team aligned
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex flex-col h-full">
                  {/* Icon */}
                  <div className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground flex-1">
                    {feature.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-4 h-1 w-0 group-hover:w-8 bg-primary transition-all duration-300" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
